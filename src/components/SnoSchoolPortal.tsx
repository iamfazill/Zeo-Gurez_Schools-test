import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  ShieldCheck, 
  Calendar,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { School } from '../types';

interface SnoSchoolPortalProps {
  schoolId: string;
}

export const SnoSchoolPortal: React.FC<SnoSchoolPortalProps> = ({ schoolId }) => {
  const { schools, setEditingSchool } = useSchools();
  const { currentUser, logout } = useAuth();

  const school = schools.find(s => s.id === schoolId);

  if (!school) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-xs my-8">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 mb-1">
          School Record Not Found
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          The school assigned to this School Nodal Officer account could not be found.
        </p>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out to General Website</span>
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: School['inspectionStatus']) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliant
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Audit Due
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* SNO Portal Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                School Nodal Officer (SNO) Active Session
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                {school.code}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {school.cluster}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {school.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome, <strong className="text-white">{currentUser?.name || 'School Nodal Officer'}</strong>. You are viewing your designated institution. You have authority to review and update your school's student rolls, faculty, HOI contact, and facilities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setEditingSchool(school)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              title="Edit details for this school"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit School Details</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
              title="Log out and return to general 88-school directory"
            >
              <LogOut className="w-4 h-4 text-slate-300" />
              <span>Log Out to General Website</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {school.totalStudents.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {school.enrollment ? `${school.enrollment.totalBoys} Boys • ${school.enrollment.totalGirls} Girls` : 'Total Active Roll'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Faculty & Staff
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {school.totalTeachers}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            PTR: <strong className="text-slate-800 font-semibold">{school.pupilTeacherRatio}:1</strong> • {school.supportStaff || 0} Support Staff
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Campus Classrooms
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {school.classroomsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Shift: {school.shift || 'Standard Day'} • Est. {school.establishedYear}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Audit Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            {getStatusBadge(school.inspectionStatus)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Last Inspected: {school.lastInspectionDate || 'Current Academic Year'}
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Leadership, Enrolment, and Facilities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leadership & Campus Contacts */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Head of Institution & Campus Contact
                </h3>
              </div>
              <button
                onClick={() => setEditingSchool(school)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Contact</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Head of Institution (HOI)
                </div>
                <div className="text-base font-bold text-slate-900">
                  {school.principalName || school.hoiName || 'Head of Institution'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {school.hoiDesignation || 'Headmaster / Principal'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 pt-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-mono font-bold">{school.principalPhone || school.hoiPhone || 'Not specified'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Campus Address & Official Email
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{school.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 pt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{school.email || 'No email registered'}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Cluster: <strong className="text-slate-700">{school.cluster}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Breakdown Roll */}
          {school.enrollment && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Student Enrollment Roll Breakdown
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Academic Year 2025-2026
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-bold text-slate-500">Pre-Primary (Balvatika)</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    {school.enrollment.prePrimary.total}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {school.enrollment.prePrimary.boys} Boys • {school.enrollment.prePrimary.girls} Girls
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-bold text-slate-500">Primary (Grades 1-5)</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    {school.enrollment.primary.total}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {school.enrollment.primary.boys} Boys • {school.enrollment.primary.girls} Girls
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-bold text-slate-500">Upper Primary (Grades 6-8)</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    {school.enrollment.upperPrimary.total}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {school.enrollment.upperPrimary.boys} Boys • {school.enrollment.upperPrimary.girls} Girls
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facilities & Amenities */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Infrastructure & Available Amenities
                </h3>
              </div>
              <button
                onClick={() => setEditingSchool(school)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Amenities</span>
              </button>
            </div>

            {school.facilities && school.facilities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {school.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific facilities logged yet.</p>
            )}
          </div>

        </div>

        {/* Right Column: Institutional Profile & SNO Guidelines */}
        <div className="space-y-6">
          
          {/* Institutional Classification */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Institutional Profile
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">School Code / U-DISE:</span>
                <span className="font-mono font-bold text-slate-900">{school.code}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Academic Level:</span>
                <span className="font-semibold text-slate-800">{school.level}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Management Category:</span>
                <span className="font-semibold text-slate-800">{school.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gender Composition:</span>
                <span className="font-semibold text-slate-800">{school.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Established Year:</span>
                <span className="font-semibold text-slate-800">{school.establishedYear}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">School Shift:</span>
                <span className="font-semibold text-slate-800">{school.shift || 'Standard Day'}</span>
              </div>
            </div>

            {school.notes && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Administrative Remarks
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                  {school.notes}
                </p>
              </div>
            )}
          </div>

          {/* SNO Access Notice */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>School Nodal Officer Instructions</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              You are logged in as the designated Nodal Officer for <strong className="text-amber-950">{school.name}</strong>. In accordance with ZEO directives, you can review and edit only your school's institutional profile.
            </p>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              Institutional grievance logs and cross-zone inspection problems are reserved strictly for the ZEO Administrator.
            </p>
            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out to General Website</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating / Sticky Bottom Quick Bar for SNO */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>
            Authorized SNO Session: <strong className="text-slate-900">{school.name} ({school.code})</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEditingSchool(school)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit School Details</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
