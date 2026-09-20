import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { School, FilterState, ZoneSummaryStats, ZoneNotice, ZoneCluster, HoiProblem, SchoolNotification } from '../types';
import { INITIAL_88_SCHOOLS, INITIAL_NOTICES } from '../data/initialSchools';
import { parseSchoolNamesList } from '../utils/csvHelper';

interface SchoolContextType {
  schools: School[];
  filteredSchools: School[];
  summaryStats: ZoneSummaryStats;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
  editingSchool: School | null;
  setEditingSchool: (school: School | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isBulkImportOpen: boolean;
  setIsBulkImportOpen: (open: boolean) => void;
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  isCircularsOpen: boolean;
  setIsCircularsOpen: (open: boolean) => void;
  isHoiProblemsLogOpen: boolean;
  setIsHoiProblemsLogOpen: (open: boolean) => void;
  isExcelGuideOpen: boolean;
  setIsExcelGuideOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  notifications: SchoolNotification[];
  unreadNotificationsCount: number;
  addSchoolNotification: (notif: Omit<SchoolNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  viewMode: 'grid' | 'table' | 'cluster';
  setViewMode: (mode: 'grid' | 'table' | 'cluster') => void;
  updateSchool: (updatedSchool: School) => void;
  addSchool: (newSchool: School) => void;
  deleteSchool: (id: string) => void;
  bulkUpdateNames: (rawText: string) => number;
  replaceWithImportedSchools: (newSchools: School[]) => void;
  resetToDefault88: () => void;
  addHoiProblem: (schoolId: string, problem: Omit<HoiProblem, 'id' | 'problemNumber'>) => boolean;
  updateHoiProblem: (schoolId: string, problemId: string, updates: Partial<HoiProblem>) => void;
  deleteHoiProblem: (schoolId: string, problemId: string) => void;
  notices: ZoneNotice[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'zeo_gurez_schools_v4';
const NOTIFICATIONS_STORAGE_KEY = 'zeo_gurez_school_notifications_v1';

const INITIAL_NOTIFICATIONS: SchoolNotification[] = [
  {
    id: 'NOTIF-INIT-1',
    schoolId: 'SCH-01',
    schoolName: 'Govt. Higher Secondary School Dawar',
    schoolCode: 'ZN-001',
    changeType: 'profile_update',
    title: 'Student Enrolment & Faculty Roll Update',
    details: 'Enrolment updated to 485 students; 22 faculty members reported on duty; winter heating fuel stock verified.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    authorName: 'Mohammad Iqbal Lone',
    authorRole: 'Principal'
  },
  {
    id: 'NOTIF-INIT-2',
    schoolId: 'SCH-02',
    schoolName: 'Govt. High School Bagtore',
    schoolCode: 'ZN-002',
    changeType: 'problem_logged',
    title: 'Institutional Problem Reported (Priority 1)',
    details: 'Classroom heating Bukhari stoves and winter firewood supply required before winter snowfall blockades.',
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    read: false,
    authorName: 'Farooq Ahmad Khan',
    authorRole: 'Headmaster'
  },
  {
    id: 'NOTIF-INIT-3',
    schoolId: 'SCH-04',
    schoolName: 'Govt. Middle School Wanpora',
    schoolCode: 'ZN-004',
    changeType: 'facility_update',
    title: 'Infrastructure & Amenities Updated',
    details: 'Verified functional tap water connection and disabled accessibility ramp in block A.',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    read: true,
    authorName: 'Shabir Ahmad Mir',
    authorRole: 'Headmaster'
  }
];

const defaultFilters: FilterState = {
  search: '',
  cluster: 'All',
  category: 'All',
  level: 'All',
  inspectionStatus: 'All',
  hoiProblemFilter: 'All',
  sortBy: 'name-asc'
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If already has new HOI fields, use it; otherwise reset to full v4 benchmark
          if (parsed[0].hoiName && parsed[0].hoiProblems) {
            return parsed;
          }
        }
      }
    } catch {
      // Fallback on error
    }
    return INITIAL_88_SCHOOLS;
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isCircularsOpen, setIsCircularsOpen] = useState(false);
  const [isHoiProblemsLogOpen, setIsHoiProblemsLogOpen] = useState(false);
  const [isExcelGuideOpen, setIsExcelGuideOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'cluster'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notices] = useState<ZoneNotice[]>(INITIAL_NOTICES);

  // Notifications state
  const [notifications, setNotifications] = useState<SchoolNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications:', e);
    }
  }, [notifications]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const addSchoolNotification = useCallback((notif: Omit<SchoolNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SchoolNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
    } catch (e) {
      console.error('Failed to persist schools:', e);
    }
  }, [schools]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateSchool = (updatedSchool: School) => {
    // Recalculate PTR
    const ptr = updatedSchool.totalTeachers > 0 
      ? Math.round(updatedSchool.totalStudents / updatedSchool.totalTeachers) 
      : updatedSchool.totalStudents;
    const finalSchool = { 
      ...updatedSchool, 
      pupilTeacherRatio: ptr,
      principalName: updatedSchool.hoiName ? `${updatedSchool.hoiName} (${updatedSchool.hoiDesignation || 'HOI'})` : updatedSchool.principalName,
      principalPhone: updatedSchool.hoiPhone || updatedSchool.principalPhone
    };

    // Calculate differences to notify in Notification Area
    const existing = schools.find(s => s.id === finalSchool.id);
    if (existing) {
      const diffs: string[] = [];
      if (existing.totalStudents !== finalSchool.totalStudents) {
        diffs.push(`Students: ${existing.totalStudents} ➔ ${finalSchool.totalStudents}`);
      }
      if (existing.totalTeachers !== finalSchool.totalTeachers) {
        diffs.push(`Teachers: ${existing.totalTeachers} ➔ ${finalSchool.totalTeachers}`);
      }
      if (existing.classroomsCount !== finalSchool.classroomsCount) {
        diffs.push(`Classrooms: ${existing.classroomsCount} ➔ ${finalSchool.classroomsCount}`);
      }
      if (existing.hoiName !== finalSchool.hoiName && finalSchool.hoiName) {
        diffs.push(`HOI: ${finalSchool.hoiName}`);
      }
      if (existing.hoiPhone !== finalSchool.hoiPhone && finalSchool.hoiPhone) {
        diffs.push(`Contact: ${finalSchool.hoiPhone}`);
      }
      if (JSON.stringify(existing.facilities) !== JSON.stringify(finalSchool.facilities)) {
        diffs.push(`Facilities modified (${finalSchool.facilities.length} active)`);
      }
      if (existing.notes !== finalSchool.notes && finalSchool.notes) {
        diffs.push(`Remarks: "${finalSchool.notes.slice(0, 45)}${finalSchool.notes.length > 45 ? '...' : ''}"`);
      }

      // If changes occurred, add notification
      if (diffs.length > 0) {
        addSchoolNotification({
          schoolId: finalSchool.id,
          schoolName: finalSchool.name,
          schoolCode: finalSchool.code,
          changeType: diffs.some(d => d.includes('Facilities')) ? 'facility_update' : 'profile_update',
          title: `${finalSchool.name} updated basic profile details`,
          details: diffs.join(' • '),
          authorName: finalSchool.hoiName || finalSchool.principalName,
          authorRole: finalSchool.hoiDesignation || 'HOI'
        });
      }
    }

    setSchools(prev => prev.map(s => s.id === finalSchool.id ? finalSchool : s));
    if (selectedSchool?.id === finalSchool.id) {
      setSelectedSchool(finalSchool);
    }
    showToast(`Updated details for "${finalSchool.name}"`);
  };

  const addSchool = (newSchool: School) => {
    const ptr = newSchool.totalTeachers > 0 
      ? Math.round(newSchool.totalStudents / newSchool.totalTeachers) 
      : newSchool.totalStudents;
    const finalSchool = { 
      ...newSchool, 
      pupilTeacherRatio: ptr,
      hoiProblems: newSchool.hoiProblems || []
    };

    setSchools(prev => [finalSchool, ...prev]);
    addSchoolNotification({
      schoolId: finalSchool.id,
      schoolName: finalSchool.name,
      schoolCode: finalSchool.code,
      changeType: 'profile_update',
      title: `New School Registered: ${finalSchool.name}`,
      details: `Code: ${finalSchool.code} • Cluster: ${finalSchool.cluster} • Level: ${finalSchool.level}`,
      authorName: 'ZEO Administrator',
      authorRole: 'Admin'
    });
    showToast(`Successfully registered "${finalSchool.name}" to ZEO Gurez`);
  };

  const deleteSchool = (id: string) => {
    const target = schools.find(s => s.id === id);
    setSchools(prev => prev.filter(s => s.id !== id));
    if (selectedSchool?.id === id) {
      setSelectedSchool(null);
    }
    if (target) {
      addSchoolNotification({
        schoolId: target.id,
        schoolName: target.name,
        schoolCode: target.code,
        changeType: 'profile_update',
        title: `School Removed from Registry: ${target.name}`,
        details: `Institution (${target.code}) was removed by the Administrator.`,
        authorName: 'ZEO Administrator',
        authorRole: 'Admin'
      });
    }
    showToast(`Removed "${target?.name || 'School'}" from zone directory`);
  };

  const addHoiProblem = (schoolId: string, problemData: Omit<HoiProblem, 'id' | 'problemNumber'>): boolean => {
    const target = schools.find(s => s.id === schoolId);
    if (!target) return false;

    const currentProblems = target.hoiProblems || [];
    if (currentProblems.length >= 3) {
      showToast(`Cannot add problem: Maximum 3 priority problems allowed per institution.`);
      return false;
    }

    const nextProblemNum = (currentProblems.length + 1) as 1 | 2 | 3;
    const newProblem: HoiProblem = {
      ...problemData,
      id: `PRB-${schoolId}-${Date.now().toString().slice(-4)}`,
      problemNumber: nextProblemNum,
      reportedDate: problemData.reportedDate || new Date().toISOString().slice(0, 10),
      status: problemData.status || 'Pending ZEO Action'
    };

    const updatedSchool = {
      ...target,
      hoiProblems: [...currentProblems, newProblem]
    };

    updateSchool(updatedSchool);
    addSchoolNotification({
      schoolId: target.id,
      schoolName: target.name,
      schoolCode: target.code,
      changeType: 'problem_logged',
      title: `Problem #${nextProblemNum} Logged: ${target.name}`,
      details: `[${problemData.priority}] ${problemData.title} — ${problemData.description.slice(0, 85)}${problemData.description.length > 85 ? '...' : ''}`,
      authorName: target.hoiName || target.principalName,
      authorRole: 'Head of Institution'
    });
    showToast(`Logged Problem #${nextProblemNum} for ${target.name}`);
    return true;
  };

  const updateHoiProblem = (schoolId: string, problemId: string, updates: Partial<HoiProblem>) => {
    const target = schools.find(s => s.id === schoolId);
    if (!target) return;

    let targetProblemTitle = 'Problem';
    const updatedProblems = (target.hoiProblems || []).map(p => {
      if (p.id === problemId) {
        targetProblemTitle = p.title;
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
      return p;
    });

    const updatedSchool = {
      ...target,
      hoiProblems: updatedProblems
    };

    updateSchool(updatedSchool);
    addSchoolNotification({
      schoolId: target.id,
      schoolName: target.name,
      schoolCode: target.code,
      changeType: 'problem_updated',
      title: `Problem Updated: ${target.name}`,
      details: updates.status 
        ? `Status updated to: ${updates.status} for "${targetProblemTitle}"` 
        : `Details modified for "${targetProblemTitle}"`,
      authorName: target.hoiName || target.principalName,
      authorRole: 'Head of Institution'
    });
    showToast(`Updated problem status for ${target.name}`);
  };

  const deleteHoiProblem = (schoolId: string, problemId: string) => {
    const target = schools.find(s => s.id === schoolId);
    if (!target) return;

    const removedProblem = (target.hoiProblems || []).find(p => p.id === problemId);
    const filtered = (target.hoiProblems || []).filter(p => p.id !== problemId);
    // Re-index remaining problem numbers
    const reindexed = filtered.map((p, idx) => ({
      ...p,
      problemNumber: (idx + 1) as 1 | 2 | 3
    }));

    const updatedSchool = {
      ...target,
      hoiProblems: reindexed
    };

    updateSchool(updatedSchool);
    addSchoolNotification({
      schoolId: target.id,
      schoolName: target.name,
      schoolCode: target.code,
      changeType: 'problem_removed',
      title: `Problem Resolved / Cleared: ${target.name}`,
      details: `Issue "${removedProblem?.title || 'Institutional problem'}" was removed or resolved.`,
      authorName: target.hoiName || target.principalName,
      authorRole: 'Head of Institution'
    });
    showToast(`Removed problem entry from ${target.name}`);
  };

  const bulkUpdateNames = (rawText: string): number => {
    const updated = parseSchoolNamesList(rawText, schools);
    setSchools(updated);
    showToast(`Applied custom school names across ${updated.length} zone schools`);
    return updated.length;
  };

  const replaceWithImportedSchools = (newSchools: School[]) => {
    setSchools(newSchools);
    showToast(`Loaded ${newSchools.length} schools into ZEO Gurez registry`);
  };

  const resetToDefault88 = () => {
    setSchools(INITIAL_88_SCHOOLS);
    setFilters(defaultFilters);
    showToast('Reset database to official ZEO Gurez 88-school benchmark');
  };

  // Filter and sort logic
  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      // Search term
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCode = s.code.toLowerCase().includes(query);
        const matchesHoi = (s.hoiName || s.principalName).toLowerCase().includes(query);
        const matchesPhone = (s.hoiPhone || s.principalPhone).includes(query);
        const matchesAddress = s.address.toLowerCase().includes(query);
        const matchesProblem = (s.hoiProblems || []).some(p => 
          p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesCode && !matchesHoi && !matchesPhone && !matchesAddress && !matchesProblem) {
          return false;
        }
      }

      // Cluster filter
      if (filters.cluster !== 'All' && s.cluster !== filters.cluster) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All' && s.category !== filters.category) {
        return false;
      }

      // Level filter
      if (filters.level !== 'All' && s.level !== filters.level) {
        return false;
      }

      // Inspection Status filter
      if (filters.inspectionStatus !== 'All' && s.inspectionStatus !== filters.inspectionStatus) {
        return false;
      }

      // HOI Problem filter
      if (filters.hoiProblemFilter && filters.hoiProblemFilter !== 'All') {
        const pCount = (s.hoiProblems || []).length;
        if (filters.hoiProblemFilter === 'Has Problems' && pCount === 0) return false;
        if (filters.hoiProblemFilter === 'No Problems' && pCount > 0) return false;
        if (filters.hoiProblemFilter === 'Critical Issues') {
          const hasCritical = (s.hoiProblems || []).some(p => p.priority === 'Critical / Immediate');
          if (!hasCritical) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'students-desc':
          return b.totalStudents - a.totalStudents;
        case 'students-asc':
          return a.totalStudents - b.totalStudents;
        case 'ptr-desc':
          return b.pupilTeacherRatio - a.pupilTeacherRatio;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'problems-desc':
          return (b.hoiProblems?.length || 0) - (a.hoiProblems?.length || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [schools, filters]);

  // Summary statistics
  const summaryStats: ZoneSummaryStats = useMemo(() => {
    const totalSchools = schools.length;
    let totalStudents = 0;
    let totalTeachers = 0;
    let compliantCount = 0;
    let actionRequiredCount = 0;
    let totalHoiProblems = 0;
    let criticalHoiProblems = 0;
    let resolvedHoiProblems = 0;

    const clusterCounts: Record<ZoneCluster, number> = {
      'Bagtore & Kanzalwan Cluster': 0,
      'Dawar Central Cluster': 0,
      'Kilshay & Chorwan Cluster': 0,
      'Tulail Valley Cluster': 0,
      'North Cluster': 0,
      'South Cluster': 0,
      'East Cluster': 0,
      'West Cluster': 0
    };

    schools.forEach(s => {
      totalStudents += s.totalStudents || 0;
      totalTeachers += s.totalTeachers || 0;
      if (s.inspectionStatus === 'Compliant') compliantCount++;
      if (s.inspectionStatus === 'Action Required') actionRequiredCount++;
      if (clusterCounts[s.cluster] !== undefined) {
        clusterCounts[s.cluster]++;
      }
      (s.hoiProblems || []).forEach(p => {
        totalHoiProblems++;
        if (p.priority === 'Critical / Immediate') criticalHoiProblems++;
        if (p.status === 'Resolved') resolvedHoiProblems++;
      });
    });

    const averagePTR = totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0;

    return {
      totalSchools,
      totalStudents,
      totalTeachers,
      averagePTR,
      compliantCount,
      actionRequiredCount,
      clusterCounts,
      totalHoiProblems,
      criticalHoiProblems,
      resolvedHoiProblems
    };
  }, [schools]);

  return (
    <SchoolContext.Provider
      value={{
        schools,
        filteredSchools,
        summaryStats,
        filters,
        setFilters,
        selectedSchool,
        setSelectedSchool,
        editingSchool,
        setEditingSchool,
        isAddModalOpen,
        setIsAddModalOpen,
        isBulkImportOpen,
        setIsBulkImportOpen,
        isAnalyticsOpen,
        setIsAnalyticsOpen,
        isCircularsOpen,
        setIsCircularsOpen,
        isHoiProblemsLogOpen,
        setIsHoiProblemsLogOpen,
        isExcelGuideOpen,
        setIsExcelGuideOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        notifications,
        unreadNotificationsCount,
        addSchoolNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        viewMode,
        setViewMode,
        updateSchool,
        addSchool,
        deleteSchool,
        bulkUpdateNames,
        replaceWithImportedSchools,
        resetToDefault88,
        addHoiProblem,
        updateHoiProblem,
        deleteHoiProblem,
        notices,
        toastMessage,
        showToast
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchools = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchools must be used within a SchoolProvider');
  }
  return context;
};

