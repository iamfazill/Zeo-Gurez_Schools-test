import React from 'react';
import { 
  Building2, 
  Plus, 
  BarChart3, 
  Bell, 
  FileSpreadsheet, 
  School as SchoolIcon,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Settings,
  LogOut
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { 
    schools, 
    summaryStats,
    setIsAddModalOpen, 
    setIsAnalyticsOpen, 
    setIsHoiProblemsLogOpen,
    setIsExcelGuideOpen,
    setIsNotificationCenterOpen,
    notifications,
    unreadNotificationsCount,
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

            {/* Notification Area (School Changes & Circulars - Administrator Only) */}
            {isAdmin && (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

