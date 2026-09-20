import React from 'react';
import { 
  X, 
  BarChart3, 
  Users, 
  GraduationCap, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart, 
  Layers 
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { ZoneCluster } from '../types';

export const ZoneAnalyticsModal: React.FC = () => {
  const { isAnalyticsOpen, setIsAnalyticsOpen, schools, summaryStats, setSelectedSchool } = useSchools();

  if (!isAnalyticsOpen) return null;

  const clusters: ZoneCluster[] = ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster'];

  // Cluster breakdown data
  const clusterData = clusters.map(cluster => {
    const clusterSchools = schools.filter(s => s.cluster === cluster);
    const students = clusterSchools.reduce((acc, s) => acc + s.totalStudents, 0);
    const teachers = clusterSchools.reduce((acc, s) => acc + s.totalTeachers, 0);
    const ptr = teachers > 0 ? Math.round(students / teachers) : 0;
    const compliant = clusterSchools.filter(s => s.inspectionStatus === 'Compliant').length;
    return {
      cluster,
      count: clusterSchools.length,
      students,
      teachers,
      ptr,
      compliant
    };
  });

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  schools.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  // Level breakdown
  const levelCounts: Record<string, number> = {};
  schools.forEach(s => {
    levelCounts[s.level] = (levelCounts[s.level] || 0) + 1;
  });

  // Action required schools
  const flaggedSchools = schools.filter(
    s => s.inspectionStatus === 'Action Required' || s.pupilTeacherRatio > 28
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAnalyticsOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Zone Executive Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Regional Educational Analytics ({schools.length} Schools)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparative performance, staffing equilibrium, and infrastructure compliance.
          </p>
        </div>

        {/* 4 Clusters Comparison Table */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Cluster Jurisdictions Comparison</span>
          </h3>

          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Cluster</th>
                  <th className="py-2.5 px-3 text-center">Schools</th>
                  <th className="py-2.5 px-3 text-right">Students</th>
                  <th className="py-2.5 px-3 text-right">Faculty</th>
                  <th className="py-2.5 px-3 text-center">PTR</th>
                  <th className="py-2.5 px-4 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {clusterData.map(c => (
                  <tr key={c.cluster} className="hover:bg-white transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{c.cluster}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{c.count}</td>
                    <td className="py-3 px-3 text-right text-slate-800 font-medium">{c.students.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-slate-800 font-medium">{c.teachers}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {c.ptr}:1
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {Math.round((c.compliant / (c.count || 1)) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Level and Category Breakdown Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Categories */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Institutional Category Split
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percent = Math.round((count / schools.length) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span>{cat}</span>
                      <span className="font-bold text-slate-900">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Levels */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              School Grade Levels
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(levelCounts).map(([lvl, count]) => {
                const percent = Math.round((count / schools.length) * 100);
                return (
                  <div key={lvl}>
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span>{lvl.split('(')[0].trim()}</span>
                      <span className="font-bold text-slate-900">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Flagged / Staffing Action Items */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>High-Priority Administrative Attention Items</span>
          </h3>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {flaggedSchools.map(school => (
              <div 
                key={school.id}
                onClick={() => {
                  setSelectedSchool(school);
                  setIsAnalyticsOpen(false);
                }}
                className="bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{school.name}</span>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {school.cluster} • Principal: {school.principalName}
                  </div>
                </div>
                <div className="text-right">
                  {school.pupilTeacherRatio > 28 && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 mr-1.5">
                      PTR {school.pupilTeacherRatio}:1 (High)
                    </span>
                  )}
                  {school.inspectionStatus === 'Action Required' && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-200 text-amber-900">
                      Audit Rectification Due
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
