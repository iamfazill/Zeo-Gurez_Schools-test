import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  BarChart3, 
  Bell, 
  Download, 
  RotateCcw, 
  ChevronDown, 
  FileSpreadsheet, 
  FileCode,
  School as SchoolIcon,
  AlertTriangle,
  FileText,
  BookOpen,
  Lock,
  Unlock,
  ShieldCheck,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { 
  exportZEOComprehensiveExcel, 
  exportSchoolsToJSON, 
  downloadEmptyZEOExcelTemplate, 
  exportHoiProblemsLogToCSV 
} from '../utils/csvHelper';

export const Header: React.FC = () => {
  const { 
    schools, 
    summaryStats,
    setIsAddModalOpen, 
    setIsAnalyticsOpen, 
    setIsCircularsOpen,
    setIsHoiProblemsLogOpen,
    setIsExcelGuideOpen,
    setIsNotificationCenterOpen,
    notifications,
    unreadNotificationsCount,
    resetToDefault88,
    notices,
    setSelectedSchool
  } = useSchools();

  const {
    currentUser,
    isAdmin,
    isSchool,
    setIsLoginModalOpen,
    setIsAdminSettingsOpen,
    logout,
    adminAccount
  } = useAuth();

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSchoolClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleOpenMySchool = () => {
    if (currentUser?.schoolId) {
      const mySchool = schools.find(s => s.id === currentUser.schoolId);
      if (mySchool) {
        setSelectedSchool(mySchool);
      }
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Zone Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <SchoolIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  Zonal Education Office, Gurez
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {schools.length} Institutions
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Bandipora (J&K)
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Department of School Education • UT of Jammu & Kashmir
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auth Session Status & Login / Admin Controls */}
            {currentUser?.role === 'super_admin' ? (
              <div className="flex items-center gap-1.5 bg-indigo-50/80 px-2 sm:px-2.5 py-1.5 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-1.5 text-xs text-indigo-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="hidden md:inline max-w-[150px] truncate">{adminAccount.email}</span>
                  <span className="md:hidden">Admin</span>
                </div>
                <button
                  onClick={() => setIsAdminSettingsOpen(true)}
                  className="p-1 text-indigo-700 hover:text-indigo-950 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Administrator Settings (Change Email via OTP, Manage Options & Passwords)"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout Administrator"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : currentUser?.role === 'school' ? (
              <div className="flex items-center gap-2 bg-emerald-50 px-2 sm:px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-semibold">
                  <SchoolIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="hidden md:inline max-w-[140px] truncate">{currentUser.schoolName}</span>
                  <span className="md:hidden">SNO</span>
                </div>
                <button
                  onClick={logout}
                  className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                  title="Log out and return to general website"
                >
                  <LogOut className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">Exit Portal</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs"
                title="Login as Administrator (fazilshehri@gmail.com) or School Nodal Officer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Excel Master & Guide Button (Administrator Only) */}
            {isAdmin && (
              <button
                id="header-excel-guide-btn"
                onClick={() => setIsExcelGuideOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-2xs"
                title="View required Excel information and download sheets"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden xl:inline">Excel</span>
                <span>Data File</span>
              </button>
            )}

            {/* HOI Problems Logbook Button (Administrator Only) */}
            {isAdmin && (
              <button
                id="header-hoi-problems-btn"
                onClick={() => setIsHoiProblemsLogOpen(true)}
                className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
                title="Administrator Only: View Institutional Problems Logged by HOIs (Max 3 per school)"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="hidden xl:inline">HOI</span>
                <span>Problems Log</span>
                {summaryStats.totalHoiProblems > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                    {summaryStats.totalHoiProblems}
                  </span>
                )}
              </button>
            )}

            {/* Add Individual School (Admin Only, hidden from SNO) */}
            {!isSchool && (
              <button
                id="header-add-school-btn"
                onClick={handleAddSchoolClick}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                title={isAdmin ? "Add New School" : "Admin Login required to Add School"}
              >
                <Plus className="w-4 h-4" />
                <span>Add School</span>
                {!isAdmin && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
              </button>
            )}

            {/* Zone Analytics */}
            <button
              id="header-analytics-btn"
              onClick={() => setIsAnalyticsOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zone Analytics & PTR Ratios"
              aria-label="Zone Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* Notification Area (School Changes & Circulars) */}
            <button
              id="header-notifications-btn"
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              title={`Notification Area: ${unreadNotificationsCount} unread school updates & directives`}
              aria-label="Notification Area"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 ? (
                <span className="absolute -top-0.5 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-xs animate-pulse">
                  {unreadNotificationsCount}
                </span>
              ) : (notifications.length > 0 || notices.length > 0) ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              ) : null}
            </button>

            {/* Export Menu */}
            <div className="relative" ref={exportRef}>
              <button
                id="header-export-menu-btn"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Export Zone Registry"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span className="hidden lg:inline">Export</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-40 text-xs sm:text-sm">
                  <div className="px-3 py-1 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                    Office of ZEO Gurez Exports
                  </div>
                  
                  <button
                    onClick={() => {
                      exportZEOComprehensiveExcel(schools);
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Master 88-School Excel (.csv)</div>
                      <div className="text-[11px] text-slate-400">Establishment, Planning & HOI Log</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      downloadEmptyZEOExcelTemplate();
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Blank Data Collection Sheet</div>
                      <div className="text-[11px] text-slate-400">Excel format for sending to HOIs</div>
                    </div>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        exportHoiProblemsLogToCSV(schools);
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">HOI Problems Register (.csv)</div>
                        <div className="text-[11px] text-slate-400">Institutional problems log (Admin Only)</div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      exportSchoolsToJSON(schools);
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Full JSON Database Backup</div>
                      <div className="text-[11px] text-slate-400">Raw system restore file</div>
                    </div>
                  </button>

                  <div className="my-1.5 border-t border-slate-100" />
                  
                  <button
                    onClick={() => {
                      setResetConfirmOpen(true);
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default 88 Gurez Schools
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Reset Zone Directory?
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              This will reload the official benchmark registry of 88 schools across Bagtore, Dawar, Kilshay, and Tulail valleys with complete HOI contacts, establishment, planning, and 3-problem logs.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefault88();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700"
              >
                Yes, Reset to Default 88
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

