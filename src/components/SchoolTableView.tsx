import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  ExternalLink, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Phone,
  Trash2
} from 'lucide-react';
import { School } from '../types';
import { useSchools } from '../context/SchoolContext';

interface SchoolTableViewProps {
  schools: School[];
}

export const SchoolTableView: React.FC<SchoolTableViewProps> = ({ schools }) => {
  const { setSelectedSchool, setEditingSchool, deleteSchool } = useSchools();

  const getStatusBadge = (status: School['inspectionStatus']) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Compliant
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            Audit Due
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            Action Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPtrBadge = (ptr: number) => {
    if (ptr <= 25) {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
          {ptr}:1
        </span>
      );
    } else if (ptr <= 30) {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
          {ptr}:1
        </span>
      );
    } else {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
          {ptr}:1
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4 min-w-[240px]">School Name</th>
              <th className="py-3 px-3">Cluster</th>
              <th className="py-3 px-3">Level & Category</th>
              <th className="py-3 px-3">Principal</th>
              <th className="py-3 px-3 text-right">Students</th>
              <th className="py-3 px-3 text-right">Teachers</th>
              <th className="py-3 px-3 text-center">PTR</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map(school => (
              <tr 
                key={school.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                  {school.code}
                </td>
                <td className="py-3 px-4">
                  <div 
                    onClick={() => setSelectedSchool(school)}
                    className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {school.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">
                    {school.address}
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                    {school.cluster}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="text-slate-800 font-medium">{school.level.split(' ')[0]}</div>
                  <div className="text-[11px] text-slate-400">{school.category}</div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-medium text-slate-800">{school.principalName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    {school.principalPhone}
                  </div>
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <div className="font-bold text-slate-900">{school.totalStudents.toLocaleString()}</div>
                  {school.enrollment && (
                    <div className="text-[10px] text-slate-500 font-mono" title={`Pre-Primary: ${school.enrollment.prePrimary.total}, Primary: ${school.enrollment.primary.total}, Upper-Primary: ${school.enrollment.upperPrimary.total}`}>
                      {school.enrollment.prePrimary.total} / {school.enrollment.primary.total} / {school.enrollment.upperPrimary.total}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                  {school.totalTeachers}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {getPtrBadge(school.pupilTeacherRatio)}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {getStatusBadge(school.inspectionStatus)}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditingSchool(school)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit School Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedSchool(school)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
