import React, { useEffect } from 'react';
import { SchoolProvider, useSchools } from './context/SchoolContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ZoneStatsOverview } from './components/ZoneStatsOverview';
import { SchoolFilters } from './components/SchoolFilters';
import { SchoolCard } from './components/SchoolCard';
import { SchoolTableView } from './components/SchoolTableView';
import { ClusterGroupView } from './components/ClusterGroupView';
import { BulkImportModal } from './components/BulkImportModal';
import { SchoolDetailModal } from './components/SchoolDetailModal';
import { AddEditSchoolModal } from './components/AddEditSchoolModal';
import { ZoneAnalyticsModal } from './components/ZoneAnalyticsModal';
import { CircularsModal } from './components/CircularsModal';
import { HoiGrievanceLogModal } from './components/HoiGrievanceLogModal';
import { ExcelDataGuideModal } from './components/ExcelDataGuideModal';
import { LoginModal } from './components/LoginModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { SnoSchoolPortal } from './components/SnoSchoolPortal';
import { BottomLoginBar } from './components/BottomLoginBar';
import { 
  Building2, 
  Upload, 
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Lock
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    filteredSchools, 
    viewMode, 
    toastMessage, 
    setIsBulkImportOpen, 
    setIsAddModalOpen,
    setIsExcelGuideOpen,
    setIsHoiProblemsLogOpen,
    schools,
    summaryStats 
  } = useSchools();

  const {
    currentUser,
    isAdmin,
    isSchool,
    setIsLoginModalOpen,
    syncSchoolAccounts
  } = useAuth();

  // Sync registered school accounts whenever the school directory updates
  useEffect(() => {
    if (schools.length > 0) {
      syncSchoolAccounts(schools);
    }
  }, [schools, syncSchoolAccounts]);

  const handleAddSchoolClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {isSchool && currentUser?.schoolId ? (
          <SnoSchoolPortal schoolId={currentUser.schoolId} />
        ) : (
          <>
            {/* Executive Stats & Action Callout */}
            <ZoneStatsOverview />

            {/* Filters & View Switcher */}
            <SchoolFilters />

            {/* Main Schools View */}
            {filteredSchools.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  No matching schools found
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try adjusting your search criteria, level filter, or cluster selection.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredSchools.map(school => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : viewMode === 'table' ? (
              <SchoolTableView schools={filteredSchools} />
            ) : (
              <ClusterGroupView schools={filteredSchools} />
            )}

            {/* Quick Helper Floating / Bottom Bar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  Office of ZEO Gurez: <strong className="text-slate-900">{schools.length} Institutions Registered</strong>
                </span>
                {isAdmin && (
                  <>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-rose-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {summaryStats.totalHoiProblems} HOI Problems Logged ({summaryStats.criticalHoiProblems} Critical)
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {isAdmin && (
                  <button
                    onClick={() => setIsExcelGuideOpen(true)}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Excel Format & Guide</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setIsHoiProblemsLogOpen(true)}
                    className="font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>HOI Problems Logbook (Max 3)</span>
                  </button>
                )}
                <button
                  onClick={handleAddSchoolClick}
                  className="font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
                  title={isAdmin ? "Add New School" : "Admin Login required to Add School"}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add School</span>
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Role-Based Bottom Login Bar */}
      <BottomLoginBar />

      {/* Footer with Developer Attribution */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800">Office of the Zonal Education Officer Gurez</span> • Directorate of School Education Kashmir • <span className="text-slate-900 font-bold">Developed by @Fazel</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-200">
              Developer: <strong className="text-slate-950 font-bold">@Fazel</strong>
            </span>
            <span>•</span>
            <span>Valleys: Bagtore, Dawar, Kilshay, Tulail</span>
            <span>•</span>
            <span>Offline Local Storage</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BulkImportModal />
      <SchoolDetailModal />
      <AddEditSchoolModal />
      <ZoneAnalyticsModal />
      <CircularsModal />
      <HoiGrievanceLogModal />
      <ExcelDataGuideModal />
      <LoginModal />
      <AdminSettingsModal />
      <NotificationCenterModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </SchoolProvider>
  );
}

