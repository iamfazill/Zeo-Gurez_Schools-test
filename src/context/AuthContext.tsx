import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AdminAccount, SchoolAccount, SystemOptions, School } from '../types';

interface OtpNotice {
  code: string;
  sentToEmail: string;
  newEmail: string;
  timestamp: number;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  isSchool: boolean;
  adminAccount: AdminAccount;
  systemOptions: SystemOptions;
  schoolAccounts: Record<string, SchoolAccount>;
  isLoginModalOpen: boolean;
  isAdminSettingsOpen: boolean;
  otpNotice: OtpNotice | null;
  loginInitialTab: 'admin' | 'school';
  setIsLoginModalOpen: (open: boolean) => void;
  setLoginInitialTab: (tab: 'admin' | 'school') => void;
  openLoginModal: (tab?: 'admin' | 'school') => void;
  setIsAdminSettingsOpen: (open: boolean) => void;
  setOtpNotice: (notice: OtpNotice | null) => void;
  loginAsAdmin: (password: string) => { success: boolean; message: string };
  loginAsSchool: (identifier: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  requestAdminEmailChange: (currentPassword: string, newEmail: string) => { success: boolean; message: string; otp?: string };
  verifyAdminEmailChangeOtp: (otpInput: string) => { success: boolean; message: string };
  updateAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  addFacilityOption: (facility: string) => boolean;
  removeFacilityOption: (facility: string) => boolean;
  resetSchoolPassword: (schoolId: string, newPass: string) => void;
  canEditSchool: (schoolId: string) => boolean;
  canDeleteSchool: () => boolean;
  canAddSchool: () => boolean;
  canManageOptions: () => boolean;
  syncSchoolAccounts: (schools: School[]) => void;
}

const DEFAULT_ADMIN_EMAIL = 'fazilshehri@gmail.com';
const DEFAULT_ADMIN_PASS = 'Admin@Gurez2026';

const DEFAULT_FACILITIES = [
  'Playground',
  'Functional Tap Water',
  'Separate Girls Toilet',
  'CWSN Accessible Toilet',
  'Solar Power Unit',
  'Grid Electricity',
  'PM POSHAN Kitchen Shed',
  'ICT & Computer Lab',
  'Smart Classrooms',
  'Library & Reading Corner',
  'Winter Bukhari Heating'
];

const ADMIN_STORAGE_KEY = 'zeo_gurez_admin_v1';
const USER_SESSION_KEY = 'zeo_gurez_auth_user_v1';
const SCHOOL_ACCOUNTS_KEY = 'zeo_gurez_school_accounts_v1';
const SYSTEM_OPTIONS_KEY = 'zeo_gurez_system_options_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Admin Account State
  const [adminAccount, setAdminAccount] = useState<AdminAccount>(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing admin account:', e);
      }
    }
    return {
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASS
    };
  });

  // 2. Logged In User Session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user session:', e);
      }
    }
    return null; // default unauthenticated / guest
  });

  // 3. School Accounts
  const [schoolAccounts, setSchoolAccounts] = useState<Record<string, SchoolAccount>>(() => {
    const saved = localStorage.getItem(SCHOOL_ACCOUNTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing school accounts:', e);
      }
    }
    return {};
  });

  // 4. System Options (Facilities curated by admin)
  const [systemOptions, setSystemOptions] = useState<SystemOptions>(() => {
    const saved = localStorage.getItem(SYSTEM_OPTIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing system options:', e);
      }
    }
    return {
      availableFacilities: DEFAULT_FACILITIES
    };
  });

  // 5. UI Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginInitialTab, setLoginInitialTab] = useState<'admin' | 'school'>('admin');
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [otpNotice, setOtpNotice] = useState<OtpNotice | null>(null);

  const openLoginModal = (tab: 'admin' | 'school' = 'admin') => {
    setLoginInitialTab(tab);
    setIsLoginModalOpen(true);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminAccount));
  }, [adminAccount]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(SCHOOL_ACCOUNTS_KEY, JSON.stringify(schoolAccounts));
  }, [schoolAccounts]);

  useEffect(() => {
    localStorage.setItem(SYSTEM_OPTIONS_KEY, JSON.stringify(systemOptions));
  }, [systemOptions]);

  // Sync school accounts when schools are loaded
  const syncSchoolAccounts = (schools: School[]) => {
    setSchoolAccounts(prev => {
      const updated = { ...prev };
      let changed = false;
      schools.forEach(school => {
        if (!updated[school.id]) {
          const defaultEmail = school.email || `school.${school.code.toLowerCase().replace(/[^a-z0-9]/g, '')}@zeogurez.in`;
          const defaultPassword = `School@${school.code.replace(/[^a-zA-Z0-9]/g, '') || '2026'}`;
          updated[school.id] = {
            schoolId: school.id,
            schoolCode: school.code,
            schoolName: school.name,
            email: defaultEmail,
            password: defaultPassword
          };
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  };

  // Role Checks
  const isAdmin = currentUser?.role === 'super_admin';
  const isSchool = currentUser?.role === 'school';

  // Permission Checks
  const canAddSchool = () => isAdmin;
  const canDeleteSchool = () => isAdmin;
  const canManageOptions = () => isAdmin;
  const canEditSchool = (schoolId: string) => {
    if (isAdmin) return true;
    if (isSchool && currentUser?.schoolId === schoolId) return true;
    return false;
  };

  // Admin Login
  const loginAsAdmin = (password: string): { success: boolean; message: string } => {
    if (password === adminAccount.password) {
      const adminUser: AuthUser = {
        role: 'super_admin',
        email: adminAccount.email,
        name: 'Chief Administrator (ZEO Gurez)'
      };
      setCurrentUser(adminUser);
      setIsLoginModalOpen(false);
      return { success: true, message: `Welcome Administrator (${adminAccount.email})!` };
    }
    return { success: false, message: 'Invalid administrator password. Please try again.' };
  };

  // School Login
  const loginAsSchool = (identifier: string, password: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Find matching school account by email, code, or schoolId
    const foundAcc = Object.values(schoolAccounts).find(acc => 
      acc.email.toLowerCase() === cleanId || 
      acc.schoolCode.toLowerCase() === cleanId ||
      acc.schoolId.toLowerCase() === cleanId ||
      acc.schoolName.toLowerCase().includes(cleanId)
    );

    if (!foundAcc) {
      return { success: false, message: 'No registered school found with this Email or School Code.' };
    }

    if (foundAcc.password !== password) {
      return { success: false, message: `Incorrect password for ${foundAcc.schoolName}.` };
    }

    const schoolUser: AuthUser = {
      role: 'school',
      email: foundAcc.email,
      name: `HOI - ${foundAcc.schoolName}`,
      schoolId: foundAcc.schoolId,
      schoolCode: foundAcc.schoolCode,
      schoolName: foundAcc.schoolName
    };

    setCurrentUser(schoolUser);
    setIsLoginModalOpen(false);
    return { success: true, message: `Logged in successfully as ${foundAcc.schoolName}!` };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  // Request Admin Email Change via OTP
  const requestAdminEmailChange = (currentPassword: string, newEmail: string): { success: boolean; message: string; otp?: string } => {
    if (currentPassword !== adminAccount.password) {
      return { success: false, message: 'Incorrect administrator password.' };
    }

    const cleanNewEmail = newEmail.trim().toLowerCase();
    if (!cleanNewEmail.includes('@') || !cleanNewEmail.includes('.')) {
      return { success: false, message: 'Please enter a valid new email address.' };
    }

    if (cleanNewEmail === adminAccount.email.toLowerCase()) {
      return { success: false, message: 'New email must be different from current registered email.' };
    }

    // Generate 6-digit OTP
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setAdminAccount(prev => ({
      ...prev,
      pendingOtp: {
        code: generatedOtp,
        newEmail: cleanNewEmail,
        expiresAt
      }
    }));

    // Dispatch OTP notice to current registered email
    setOtpNotice({
      code: generatedOtp,
      sentToEmail: adminAccount.email,
      newEmail: cleanNewEmail,
      timestamp: Date.now()
    });

    return { 
      success: true, 
      message: `A 6-digit OTP has been dispatched to ${adminAccount.email}. Please verify to confirm email change.`,
      otp: generatedOtp 
    };
  };

  // Verify OTP & finalize email change
  const verifyAdminEmailChangeOtp = (otpInput: string): { success: boolean; message: string } => {
    if (!adminAccount.pendingOtp) {
      return { success: false, message: 'No email change request is currently pending.' };
    }

    if (Date.now() > adminAccount.pendingOtp.expiresAt) {
      setAdminAccount(prev => ({ ...prev, pendingOtp: undefined }));
      return { success: false, message: 'OTP has expired. Please request a new verification code.' };
    }

    if (otpInput.trim() !== adminAccount.pendingOtp.code) {
      return { success: false, message: 'Invalid OTP code. Please enter the 6-digit code received.' };
    }

    const updatedEmail = adminAccount.pendingOtp.newEmail;

    setAdminAccount(prev => ({
      ...prev,
      email: updatedEmail,
      pendingOtp: undefined
    }));

    // Update active user session if currently logged in as admin
    if (currentUser?.role === 'super_admin') {
      setCurrentUser(prev => prev ? ({ ...prev, email: updatedEmail }) : null);
    }

    setOtpNotice(null);

    return { 
      success: true, 
      message: `Administrator email has been successfully updated to ${updatedEmail}!` 
    };
  };

  // Update Admin Password
  const updateAdminPassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (oldPass !== adminAccount.password) {
      return { success: false, message: 'Current administrator password is incorrect.' };
    }

    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    setAdminAccount(prev => ({
      ...prev,
      password: newPass
    }));

    return { success: true, message: 'Administrator password updated successfully!' };
  };

  // Facilities management by Admin
  const addFacilityOption = (facility: string): boolean => {
    if (!isAdmin) return false;
    const trimmed = facility.trim();
    if (!trimmed || systemOptions.availableFacilities.includes(trimmed)) return false;

    setSystemOptions(prev => ({
      ...prev,
      availableFacilities: [...prev.availableFacilities, trimmed]
    }));
    return true;
  };

  const removeFacilityOption = (facility: string): boolean => {
    if (!isAdmin) return false;
    setSystemOptions(prev => ({
      ...prev,
      availableFacilities: prev.availableFacilities.filter(f => f !== facility)
    }));
    return true;
  };

  // Reset School Password
  const resetSchoolPassword = (schoolId: string, newPass: string) => {
    if (!isAdmin) return;
    setSchoolAccounts(prev => {
      if (!prev[schoolId]) return prev;
      return {
        ...prev,
        [schoolId]: {
          ...prev[schoolId],
          password: newPass
        }
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isSchool,
        adminAccount,
        systemOptions,
        schoolAccounts,
        isLoginModalOpen,
        isAdminSettingsOpen,
        otpNotice,
        loginInitialTab,
        setIsLoginModalOpen,
        setLoginInitialTab,
        openLoginModal,
        setIsAdminSettingsOpen,
        setOtpNotice,
        loginAsAdmin,
        loginAsSchool,
        logout,
        requestAdminEmailChange,
        verifyAdminEmailChangeOtp,
        updateAdminPassword,
        addFacilityOption,
        removeFacilityOption,
        resetSchoolPassword,
        canEditSchool,
        canDeleteSchool,
        canAddSchool,
        canManageOptions,
        syncSchoolAccounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
