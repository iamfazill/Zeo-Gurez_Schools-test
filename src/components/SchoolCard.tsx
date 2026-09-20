import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Star,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { School } from '../types';
import { useSchools } from '../context/SchoolContext';

interface SchoolCardProps {
  school: School;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const { setSelectedSchool, setEditingSchool } = useSchools();

  const getStatusBadge = (status: School['inspectionStatus']) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Compliant
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            Audit Due
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getPtrBadge = (ptr: number) => {
    if (ptr <= 25) {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60" title="Healthy Pupil-Teacher Ratio">
          {ptr}:1 PTR
        </span>
      );
    } else if (ptr <= 30) {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60" title="Moderate Staffing Pressure">
          {ptr}:1 PTR
        </span>
      );
    } else {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60" title="Needs Faculty Augmentation">
          {ptr}:1 PTR
        </span>
      );
    }
  };

  const getClusterColor = (cluster: School['cluster']) => {
    switch (cluster) {
      case 'Bagtore & Kanzalwan Cluster': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Dawar Central Cluster': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Kilshay & Chorwan Cluster': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tulail Valley Cluster': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'North Cluster': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'South Cluster': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'East Cluster': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'West Cluster': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      id={`school-card-${school.id}`}
      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Code, Cluster, Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {school.code}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getClusterColor(school.cluster)}`}>
              {school.cluster}
            </span>
          </div>
          {getStatusBadge(school.inspectionStatus)}
        </div>

        {/* School Title & Level */}
        <h3 
          onClick={() => setSelectedSchool(school)}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-1"
        >
          {school.name}
        </h3>

        <div className="text-xs text-slate-500 font-medium mb-3.5 flex items-center gap-1.5 flex-wrap">
          <span>{school.level}</span>
          <span>•</span>
          <span className="text-slate-600 font-semibold">{school.category}</span>
          {school.gender !== 'Co-educational' && (
            <>
              <span>•</span>
              <span className="text-indigo-600">{school.gender}</span>
            </>
          )}
        </div>

        {/* Key Metrics: Students, Teachers, PTR */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2.5 text-center">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Students</div>
            <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              {school.totalStudents.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Teachers</div>
            <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              {school.totalTeachers}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">PTR</div>
            <div className="mt-0.5 flex justify-center">
              {getPtrBadge(school.pupilTeacherRatio)}
            </div>
          </div>
        </div>

        {/* Grade Breakdown Roll */}
        {school.enrollment && (
          <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60 mb-3 text-slate-600">
            <span title={`Boys: ${school.enrollment.prePrimary.boys}, Girls: ${school.enrollment.prePrimary.girls}`}>
              Pre: <strong className="text-slate-900 font-semibold">{school.enrollment.prePrimary.total}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span title={`Boys: ${school.enrollment.primary.boys}, Girls: ${school.enrollment.primary.girls}`}>
              Pri: <strong className="text-slate-900 font-semibold">{school.enrollment.primary.total}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span title={`Boys: ${school.enrollment.upperPrimary.boys}, Girls: ${school.enrollment.upperPrimary.girls}`}>
              Upper: <strong className="text-slate-900 font-semibold">{school.enrollment.upperPrimary.total}</strong>
            </span>
          </div>
        )}

        {/* Principal & Address info */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-slate-400 font-medium">Principal:</span>
            <span className="font-semibold text-slate-800 truncate">{school.principalName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{school.address}</span>
          </div>
        </div>

        {/* Facilities Preview */}
        {school.facilities && school.facilities.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-slate-100">
            {school.facilities.slice(0, 3).map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                {f}
              </span>
            ))}
            {school.facilities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{school.facilities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-slate-700">{school.rating}</span>
          <span className="text-slate-400 font-normal">/ 5</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingSchool(school)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors"
            title="Edit School"
            aria-label="Edit School"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSelectedSchool(school)}
            className="inline-flex items-center gap-1 px-2.5 py-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
