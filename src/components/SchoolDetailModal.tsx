import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Star, 
  Edit2, 
  Printer, 
  Check, 
  Trash2,
  Flame,
  Droplets,
  Layers,
  BookOpen,
  PlusCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { School, HoiProblem, HoiProblemCategory, HoiProblemPriority } from '../types';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export const SchoolDetailModal: React.FC = () => {
  const { 
    selectedSchool, 
    setSelectedSchool, 
    setEditingSchool, 
    deleteSchool,
    summaryStats,
    addHoiProblem,
    updateHoiProblem,
    deleteHoiProblem
  } = useSchools();

  const {
    currentUser,
    isAdmin,
    isSchool,
    canEditSchool,
    canDeleteSchool,
    setIsLoginModalOpen
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'establishment' | 'planning' | 'problems'>('overview');
  
  // Ensure non-admins cannot stay on problems tab
  useEffect(() => {
    if (!isAdmin && activeTab === 'problems') {
      setActiveTab('overview');
    }
  }, [isAdmin, activeTab]);

  // Add problem form state
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [newProbCategory, setNewProbCategory] = useState<HoiProblemCategory>('Infrastructure & Snow Damage');
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbDesc, setNewProbDesc] = useState('');
  const [newProbPriority, setNewProbPriority] = useState<HoiProblemPriority>('High');

  if (!selectedSchool) return null;

  const currentProblems = selectedSchool.hoiProblems || [];
  const est = selectedSchool.establishment;
  const plan = selectedSchool.planning;
  const hoiName = selectedSchool.hoiName || selectedSchool.principalName;
  const hoiPhone = selectedSchool.hoiPhone || selectedSchool.principalPhone;
  const hoiDesig = selectedSchool.hoiDesignation || 'Headmaster';

  const getStatusBadge = (status: School['inspectionStatus']) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Inspection Compliant
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Inspection Scheduled
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Action Required by Zone
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle.trim() || !newProbDesc.trim()) return;

    const success = addHoiProblem(selectedSchool.id, {
      category: newProbCategory,
      title: newProbTitle.trim(),
      description: newProbDesc.trim(),
      priority: newProbPriority,
      reportedDate: new Date().toISOString().slice(0, 10),
      status: 'Pending ZEO Action'
    });

    if (success) {
      setShowAddProblem(false);
      setNewProbTitle('');
      setNewProbDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedSchool(null)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Identity */}
        <div className="shrink-0 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              U-DISE: {selectedSchool.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {selectedSchool.cluster}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              Est. {est?.yearOfEstablishment || selectedSchool.establishedYear}
            </span>
            {getStatusBadge(selectedSchool.inspectionStatus)}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {selectedSchool.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap font-medium">
                <span>{selectedSchool.level}</span>
                <span>•</span>
                <span className="text-slate-700 font-semibold">{selectedSchool.category}</span>
                <span>•</span>
                <span>{selectedSchool.gender}</span>
              </div>
            </div>

            {/* HOI Direct Cell Badge */}
            <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-3">
              <div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                  HOI: {hoiName}
                </div>
                <div className="text-xs font-mono text-emerald-950 font-bold">{hoiPhone}</div>
              </div>
              <a
                href={`tel:${hoiPhone.replace(/\s+/g, '')}`}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
                title={`Call ${hoiName}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100 rounded-xl text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'overview' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Roll
            </button>
            <button
              onClick={() => setActiveTab('establishment')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'establishment' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Establishment & Assets
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'planning' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Planning & Winter Logistics
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('problems')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'problems' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>HOI Problems Log ({currentProblems.length}/3)</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-800 text-white">Admin Only</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs sm:text-sm">
          
          {/* TAB 1: OVERVIEW & LEADERSHIP */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Leadership & Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Head of Institution (HOI)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {hoiName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{hoiName}</div>
                      <div className="text-xs text-slate-500">{hoiDesig}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 pt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${hoiPhone.replace(/\s+/g, '')}`} className="hover:underline text-indigo-600 font-medium font-mono">
                      {hoiPhone}
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Campus Address & Contact
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedSchool.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${selectedSchool.email}`} className="hover:underline text-indigo-600 truncate">
                      {selectedSchool.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Core KPI Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Total Students</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedSchool.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {selectedSchool.enrollment ? `${selectedSchool.enrollment.totalBoys} Boys • ${selectedSchool.enrollment.totalGirls} Girls` : 'Enrolled'}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Teaching Faculty</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedSchool.totalTeachers}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Sanctioned: {plan?.sanctionedTeachingPosts || selectedSchool.totalTeachers}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Pupil-Teacher Ratio</div>
                  <div className="text-xl font-extrabold text-indigo-600 mt-0.5">
                    {selectedSchool.pupilTeacherRatio}:1
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Zone Avg: {summaryStats.averagePTR}:1
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Classrooms</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {est?.totalClassrooms || selectedSchool.classroomsCount}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {selectedSchool.supportStaff} support staff
                  </div>
                </div>
              </div>

              {/* Grade-wise Roll Table */}
              {selectedSchool.enrollment && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Official Grade-wise Roll Breakdown
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Session 2026-27
                    </span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                        <th className="py-2.5 px-4">Grade Level</th>
                        <th className="py-2.5 px-3 text-center">Boys</th>
                        <th className="py-2.5 px-3 text-center">Girls</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-slate-800">Pre-Primary (Balvatika)</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.prePrimary.boys}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.prePrimary.girls}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">{selectedSchool.enrollment.prePrimary.total}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-slate-800">Primary (Classes 1 - 5)</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.primary.boys}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.primary.girls}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">{selectedSchool.enrollment.primary.total}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-slate-800">Upper Primary (Classes 6 - 8)</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.upperPrimary.boys}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{selectedSchool.enrollment.upperPrimary.girls}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">{selectedSchool.enrollment.upperPrimary.total}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50/80 border-t border-slate-200 font-bold text-slate-900">
                        <td className="py-2.5 px-4">Aggregate Students</td>
                        <td className="py-2.5 px-3 text-center text-indigo-700 font-mono">{selectedSchool.enrollment.totalBoys}</td>
                        <td className="py-2.5 px-3 text-center text-indigo-700 font-mono">{selectedSchool.enrollment.totalGirls}</td>
                        <td className="py-2.5 px-4 text-right text-indigo-700 font-mono text-sm">{selectedSchool.totalStudents}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ESTABLISHMENT & ASSETS */}
          {activeTab === 'establishment' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Building, Land & Physical Assets
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Building Status</span>
                    <span className="text-xs font-bold text-slate-900">{est?.buildingStatus || 'Government Owned (Pucca)'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Land Area</span>
                    <span className="text-xs font-bold text-slate-900">{est?.landAreaKanals ?? 2.0} Kanals</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Classrooms Count</span>
                    <span className="text-xs font-bold text-slate-900">{est?.totalClassrooms ?? selectedSchool.classroomsCount} Rooms</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Headmaster Room</span>
                    <span className="text-xs font-bold text-slate-900">{est?.separateHeadmasterRoom ? 'Dedicated Office Available' : 'No Separate Room'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Staff Common Room</span>
                    <span className="text-xs font-bold text-slate-900">{est?.staffRoom ? 'Available' : 'Not Available'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Boundary Wall</span>
                    <span className={`text-xs font-bold ${est?.boundaryWall.includes('Damaged') ? 'text-amber-800' : 'text-slate-900'}`}>
                      {est?.boundaryWall || 'Intact'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Water, Power, Sanitation */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Utilities, Sanitation & MDM Infrastructure
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Drinking Water</span>
                    <span className="text-xs font-bold text-slate-900">{est?.drinkingWaterSource || 'Functional Tap Water'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Electricity Supply</span>
                    <span className="text-xs font-bold text-slate-900">{est?.electricityStatus || 'Solar Powered + Grid'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Functional Girls Toilet</span>
                    <span className={`text-xs font-bold ${est?.girlsToiletFunctional ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {est?.girlsToiletFunctional ? 'Yes (Separate & Functional)' : 'No (Urgent Need)'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">CWSN Accessible Toilet</span>
                    <span className="text-xs font-bold text-slate-900">{est?.cwsnToiletAvailable ? 'Available' : 'Not Available'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">PM POSHAN MDM Kitchen</span>
                    <span className="text-xs font-bold text-slate-900">{est?.mdmKitchenShed || 'Functional Dedicated Shed'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Playground Facility</span>
                    <span className="text-xs font-bold text-slate-900">{est?.playgroundAvailable ? 'Available' : 'Terraced / No Playground'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLANNING & WINTER LOGISTICS */}
          {activeTab === 'planning' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Winter Preparedness & Gurez Valley Logistics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-amber-800 font-bold block mb-1">
                      Bukhari & Winter Heating Fuel
                    </span>
                    <div className="text-xs font-extrabold text-amber-950">
                      {plan?.winterHeatingQuota || 'Bukhari & Fuel Allotted'}
                    </div>
                    <p className="text-[11px] text-amber-800/80 mt-1">
                      Stocked prior to Razdan Pass winter closure for sub-zero winter temperatures.
                    </p>
                  </div>

                  <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200">
                    <span className="text-[11px] text-indigo-800 font-bold block mb-1">
                      Free Textbook Distribution
                    </span>
                    <div className="text-xs font-extrabold text-indigo-950">
                      {plan?.textbookDistributionStatus || '100% Distributed'}
                    </div>
                    <p className="text-[11px] text-indigo-800/80 mt-1">
                      Directorate syllabus materials received and supplied to enrolled students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Samagra Grants & Faculty Posts */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Samagra Composite Grant & Staff Sanctions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Composite School Grant</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      ₹{plan?.samagraCompositeGrant?.allotted.toLocaleString() || '25,000'} Allotted
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      ₹{plan?.samagraCompositeGrant?.utilized.toLocaleString() || '25,000'} Utilized
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Teaching Posts</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {selectedSchool.totalTeachers} Posted / {plan?.sanctionedTeachingPosts || selectedSchool.totalTeachers} Sanctioned
                    </div>
                    <div className={`text-[11px] font-semibold ${plan?.vacantTeachingPosts ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {plan?.vacantTeachingPosts || 0} Vacancies
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Subject Teacher Deficit</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {plan?.subjectTeacherDeficit || 'None (Adequate)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HOI PROBLEMS LOG (ADMINISTRATOR ONLY) */}
          {activeTab === 'problems' && isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Institutional Problems Raised by HOI ({hoiName})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Maximum of 3 important problems allowed per institution as per ZEO directive.
                  </p>
                </div>

                {currentProblems.length < 3 && !showAddProblem && (
                  <button
                    onClick={() => {
                      if (!currentUser || currentUser.role === 'guest') {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      if (isSchool && currentUser.schoolId !== selectedSchool.id) {
                        alert(`You are logged in as ${currentUser.schoolName}. You can only log institutional problems for your own school.`);
                        return;
                      }
                      setShowAddProblem(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Problem #{currentProblems.length + 1}</span>
                    {(!currentUser || currentUser.role === 'guest') && <Lock className="w-3 h-3 ml-0.5 text-rose-200" />}
                  </button>
                )}
              </div>

              {/* Add Problem Form */}
              {showAddProblem && (
                <form onSubmit={handleCreateProblem} className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-3">
                  <div className="font-bold text-xs text-rose-900">
                    Log New Problem #{currentProblems.length + 1} of 3
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category</label>
                      <select
                        value={newProbCategory}
                        onChange={e => setNewProbCategory(e.target.value as HoiProblemCategory)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                      >
                        <option value="Infrastructure & Snow Damage">Infrastructure & Snow Damage</option>
                        <option value="Teacher & Staff Shortage">Teacher & Staff Shortage</option>
                        <option value="Winter Heating & Fuel">Winter Heating & Fuel</option>
                        <option value="Water & Sanitation">Water & Sanitation</option>
                        <option value="ICT & Smart Class">ICT & Smart Class</option>
                        <option value="Land & Boundary Wall">Land & Boundary Wall</option>
                        <option value="Mid-Day Meal & Ration">Mid-Day Meal & Ration</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Priority Level</label>
                      <select
                        value={newProbPriority}
                        onChange={e => setNewProbPriority(e.target.value as HoiProblemPriority)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                      >
                        <option value="Critical / Immediate">Critical / Immediate</option>
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Problem Subject / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CGI sheet roof leakage in classrooms"
                      value={newProbTitle}
                      onChange={e => setNewProbTitle(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Detailed Description</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Specify the exact issue, damage magnitude, or action requested from ZEO..."
                      value={newProbDesc}
                      onChange={e => setNewProbDesc(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddProblem(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs"
                    >
                      Save Problem Entry
                    </button>
                  </div>
                </form>
              )}

              {/* Problems List */}
              {currentProblems.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="font-bold text-slate-800 text-xs">No Outstanding Problems Reported</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    This institution has not logged any urgent grievances.
                  </p>
                </div>
              ) : (
                currentProblems.map((prob, idx) => (
                  <div 
                    key={prob.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 font-mono">
                          Problem #{prob.problemNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          prob.priority === 'Critical / Immediate'
                            ? 'bg-rose-100 text-rose-800'
                            : prob.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {prob.priority}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {prob.category}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteHoiProblem(selectedSchool.id, prob.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete this problem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs leading-snug">
                      {prob.title}
                    </h5>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {prob.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <div>
                        Status:{' '}
                        <select
                          value={prob.status}
                          onChange={e => updateHoiProblem(selectedSchool.id, prob.id, { status: e.target.value as any })}
                          className="font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 ml-1"
                        >
                          <option value="Pending ZEO Action">Pending ZEO Action</option>
                          <option value="Under ZEO Review">Under ZEO Review</option>
                          <option value="Forwarded to CEO/Directorate">Forwarded to CEO/Directorate</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <span>Reported: {prob.reportedDate}</span>
                    </div>

                    {prob.zeoRemarks && (
                      <div className="text-[11px] bg-indigo-50 text-indigo-900 p-2 rounded-md font-medium">
                        <strong>ZEO Note:</strong> {prob.zeoRemarks}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Action Controls Footer */}
        <div className="shrink-0 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          {/* Delete authority: Strictly Administrator only */}
          {isAdmin ? (
            <button
              onClick={() => {
                if (confirm(`ADMIN CONFIRMATION: Are you sure you want to remove "${selectedSchool.name}" from the ZEO Gurez registry?`)) {
                  deleteSchool(selectedSchool.id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              title="Administrator permission: Remove school"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove School</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Add / Delete Authority: ZEO Administrator Only</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Record</span>
            </button>

            {canEditSchool(selectedSchool.id) ? (
              <button
                onClick={() => {
                  setEditingSchool(selectedSchool);
                  setSelectedSchool(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>{isSchool ? 'Edit Basic School Info' : 'Edit School Details'}</span>
              </button>
            ) : (!currentUser || currentUser.role === 'guest') ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                title="Login to edit this school's records"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to Edit Details</span>
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-400 bg-slate-100 cursor-not-allowed border border-slate-200"
                title={`You are logged in as ${currentUser.schoolName}. You can only edit your assigned school.`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Editing Restricted to Assigned HOI</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

