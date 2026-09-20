import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  MapPin 
} from 'lucide-react';
import { School, ZoneCluster } from '../types';
import { SchoolCard } from './SchoolCard';

interface ClusterGroupViewProps {
  schools: School[];
}

export const ClusterGroupView: React.FC<ClusterGroupViewProps> = ({ schools }) => {
  const clusters = Array.from(new Set(schools.map(s => s.cluster)));
  const [collapsedClusters, setCollapsedClusters] = useState<Record<string, boolean>>({});

  const toggleCluster = (clusterName: string) => {
    setCollapsedClusters(prev => ({
      ...prev,
      [clusterName]: !prev[clusterName]
    }));
  };

  return (
    <div className="space-y-6">
      {clusters.map(clusterName => {
        const clusterSchools = schools.filter(s => s.cluster === clusterName);
        if (clusterSchools.length === 0) return null;

        const isCollapsed = !!collapsedClusters[clusterName];
        const totalStudents = clusterSchools.reduce((acc, s) => acc + s.totalStudents, 0);
        const totalTeachers = clusterSchools.reduce((acc, s) => acc + s.totalTeachers, 0);
        const avgPtr = totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0;
        const compliantCount = clusterSchools.filter(s => s.inspectionStatus === 'Compliant').length;

        return (
          <div key={clusterName} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Cluster Header Bar */}
            <div 
              onClick={() => toggleCluster(clusterName)}
              className="bg-slate-50/90 hover:bg-slate-100/80 px-5 py-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button className="p-1 rounded text-slate-500 hover:text-slate-800">
                  {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{clusterName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {clusterSchools.length} Schools
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Regional Administrative Zone Jurisdiction
                  </p>
                </div>
              </div>

              {/* Cluster Sub-metrics */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pl-8 md:pl-0 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{totalTeachers} Teachers ({avgPtr}:1 PTR)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{compliantCount}/{clusterSchools.length} Compliant</span>
                </div>
              </div>
            </div>

            {/* Cluster Cards Grid */}
            {!isCollapsed && (
              <div className="p-4 sm:p-6 bg-slate-50/40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusterSchools.map(school => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
