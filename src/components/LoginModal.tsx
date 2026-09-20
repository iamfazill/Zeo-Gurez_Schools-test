import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  School as SchoolIcon, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchools } from '../context/SchoolContext';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    loginAsAdmin, 
    loginAsSchool,
    adminAccount,
    schoolAccounts,
    loginInitialTab
  } = useAuth();
  const { schools } = useSchools();

  const [activeTab, setActiveTab] = useState<'admin' | 'school'>('admin');

  // Sync active tab when modal opens or initialTab changes
  React.useEffect(() => {
    if (isLoginModalOpen && loginInitialTab) {
      setActiveTab(loginInitialTab);
      setAdminError('');
      setSchoolError('');
    }
  }, [isLoginModalOpen, loginInitialTab]);
  
  // Admin form
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState('');

  // School form
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [schoolIdentifier, setSchoolIdentifier] = useState('');
  const [schoolPassword, setSchoolPassword] = useState('');
  const [showSchoolPass, setShowSchoolPass] = useState(false);
  const [schoolError, setSchoolError] = useState('');
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const res = loginAsAdmin(adminPassword);
    if (!res.success) {
      setAdminError(res.message);
    } else {
      setAdminPassword('');
    }
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolError('');

    // If a school was picked from the selector, use its ID or email
    const idToUse = selectedSchoolId 
      ? schoolAccounts[selectedSchoolId]?.email || selectedSchoolId 
      : schoolIdentifier;

    if (!idToUse) {
      setSchoolError('Please select your school or enter registered email / code.');
      return;
    }

    const res = loginAsSchool(idToUse, schoolPassword);
    if (!res.success) {
      setSchoolError(res.message);
    } else {
      setSchoolPassword('');
      setSchoolIdentifier('');
      setSelectedSchoolId('');
    }
  };

  // When a school is selected from dropdown, autofill password placeholder
  const handleSelectSchoolDropdown = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    if (schoolId && schoolAccounts[schoolId]) {
      setSchoolIdentifier(schoolAccounts[schoolId].email);
      // Auto-suggest default password in state for easy preview
      setSchoolPassword(schoolAccounts[schoolId].password);
    } else {
      setSchoolPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Office of ZEO Gurez Portal Login
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access authorized administrative or school editing tools
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('admin');
              setAdminError('');
              setSchoolError('');
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Administrator</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('school');
              setAdminError('');
              setSchoolError('');
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'school'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SchoolIcon className="w-4 h-4 text-emerald-600" />
            <span>School Nodal Officer (SNO)</span>
          </button>
        </div>

        {/* TAB 1: ADMINISTRATOR LOGIN */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Main Administrator Email:</span>
                <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                  {adminAccount.email}
                </div>
                <div className="text-[11px] text-indigo-800 mt-1">
                  Full authority to add/remove schools, modify system options, and manage master records.
                </div>
              </div>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password..."
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-3.5 pr-10 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login as Administrator</span>
            </button>

            {/* Default Password Notice Helper */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Initial Default Password:</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-900">
                  Admin@Gurez2026
                </code>
              </div>
              <p className="mt-1 text-slate-400">
                You can change this password or your registered email address anytime after logging in via the Admin Settings modal.
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: SCHOOL PORTAL LOGIN */}
        {activeTab === 'school' && (
          <form onSubmit={handleSchoolSubmit} className="space-y-4">
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                As a designated School Nodal Officer (SNO), log in to view and edit your institution's profile (enrolment roll, faculty counts, HOI contact, classrooms, and facilities). Institutional problems and cross-zone logs are restricted to Administrator access only.
              </div>
            </div>

            {schoolError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{schoolError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Your School (Quick Pick)
              </label>
              <select
                value={selectedSchoolId}
                onChange={e => handleSelectSchoolDropdown(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              >
                <option value="">-- Choose from 88 Gurez Schools --</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} • {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Or Enter Registered School Email / U-DISE Code
              </label>
              <input
                type="text"
                placeholder="e.g. school.zn001@zeogurez.in or ZN-001"
                value={schoolIdentifier}
                onChange={e => setSchoolIdentifier(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                School Nodal Officer Password
              </label>
              <div className="relative">
                <input
                  type={showSchoolPass ? 'text' : 'password'}
                  required
                  placeholder="Enter school password..."
                  value={schoolPassword}
                  onChange={e => setSchoolPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-3.5 pr-10 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowSchoolPass(!showSchoolPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSchoolPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <SchoolIcon className="w-4 h-4" />
              <span>Login as School Nodal Officer</span>
            </button>

            {/* Toggle demo credentials */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCredentialsHelper(!showCredentialsHelper)}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <span>How are school passwords formatted?</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCredentialsHelper ? 'rotate-180' : ''}`} />
              </button>

              {showCredentialsHelper && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p>
                    Default school password format: <code className="font-mono font-bold text-slate-800">School@[U-DISE Code]</code>
                  </p>
                  <p className="text-slate-500">
                    Example: For <strong>ZN-001</strong>, password is <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">School@ZN001</code>.
                  </p>
                  <p className="text-indigo-600 font-medium pt-1">
                    Tip: Selecting a school from the dropdown above auto-fills its default credentials!
                  </p>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
