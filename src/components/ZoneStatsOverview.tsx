import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Compass,
  MapPin,
  FileSpreadsheet,
  Unlock,
  Download
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { exportZEOAllDetailsToExcel } from '../utils/excelExporter';
import { ZoneCluster } from '../types';
import schoolChildrenBannerImg from '../assets/images/school_children_banner_1789919369078.jpg';

export const ZoneStatsOverview: React.FC = () => {
  const { summaryStats, filters, setFilters, schools, notices, setIsExcelGuideOpen } = useSchools();
  const { isAdmin } = useAuth();

  const handleClusterClick = (clusterName: string) => {
    setFilters(prev => ({
      ...prev,
      cluster: prev.cluster === clusterName ? 'All' : clusterName
    }));
  };

  return (
    <div className="space-y-4">
      {/* Professional Banner with School Children Photograph Background */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-md bg-slate-950 min-h-[220px] sm:min-h-[240px] flex items-center">
        {/* Authentic School Children Photograph Background */}
        <img
          src={schoolChildrenBannerImg}
          alt="School children in Zone Gurez"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Refined Directional Gradient Overlay for Maximum Legibility & Professional Elegance */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/45 sm:to-slate-900/35" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Banner Content */}
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Educational Registry • Zone Gurez
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Zone Gurez Educational Institutions
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            Official administration directory managing all {summaryStats.totalSchools} educational institutions across the 8 administrative cluster complexes of Gurez & Tulail. Tracking institutional establishment, official class-wise student enrollment, faculty staffing, and infrastructure.
          </p>

          {/* Key Summary Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-100 font-medium">
              <Building2 className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span>{summaryStats.totalSchools} Schools</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-100 font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>{Object.keys(summaryStats.clusterCounts).filter(k => summaryStats.clusterCounts[k as ZoneCluster] > 0).length || 8} Clusters</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-100 font-medium">
              <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>{summaryStats.totalStudents.toLocaleString()} Students</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-100 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{summaryStats.totalTeachers.toLocaleString()} Teachers</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span>Bandipora (J&K)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid gap-3 sm:gap-4 ${isAdmin ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {/* Total Schools */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Schools
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summaryStats.totalSchools}
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              {Object.keys(summaryStats.clusterCounts).filter(k => summaryStats.clusterCounts[k as ZoneCluster] > 0).length || 8} Clusters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Fully indexed regional jurisdiction
          </p>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Enrollment
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summaryStats.totalStudents.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Avg ~{Math.round(summaryStats.totalStudents / (summaryStats.totalSchools || 1))} students / school
          </p>
        </div>

        {/* Total Faculty & PTR */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Teachers & PTR
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summaryStats.totalTeachers.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
              {summaryStats.averagePTR}:1 PTR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Within target staffing ratio (20-25:1)
          </p>
        </div>

        {/* Master Excel Database Section - Administrator Login Only */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-emerald-300 shadow-xs flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Master Excel Database
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Unlock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  All Details Saved
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                All 92 institutions, class rolls (KG-10), HOI register, and planning stored in master file.
              </p>
            </div>
            
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => exportZEOAllDetailsToExcel(schools, notices, summaryStats)}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                title="Download comprehensive multi-sheet Excel spreadsheet with all app details"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Master Excel (.xlsx)</span>
              </button>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span>92 Schools • 5 Tabs</span>
                <button
                  onClick={() => setIsExcelGuideOpen(true)}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline"
                >
                  View Sheet Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cluster Fast-Filter Badges */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Zone Clusters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.entries(summaryStats.clusterCounts) as [ZoneCluster, number][])
            .filter(([_, count]) => count > 0)
            .map(([clusterName, count]) => {
              const isSelected = filters.cluster === clusterName;
              return (
                <button
                  key={clusterName}
                  onClick={() => handleClusterClick(clusterName)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{clusterName}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                      isSelected ? 'bg-slate-700 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

          {filters.cluster !== 'All' && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, cluster: 'All' }))}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline ml-1"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
