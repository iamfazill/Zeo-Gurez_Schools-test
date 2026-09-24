import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  X, 
  Filter, 
  Search, 
  Download, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Send, 
  Flame, 
  Users, 
  Droplets, 
  Cpu, 
  ShieldAlert,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { HoiProblem, HoiProblemStatus, HoiProblemPriority, HoiProblemCategory } from '../types';
import { exportHoiProblemsLogToCSV } from '../utils/csvHelper';

export const HoiGrievanceLogModal: React.FC = () => {
  const { 
    isHoiProblemsLogOpen, 
    setIsHoiProblemsLogOpen, 
    schools, 
    updateHoiProblem,
    setSelectedSchool
  } = useSchools();

  const { isAdmin } = useAuth();

  if (!isHoiProblemsLogOpen || !isAdmin) return null;

  const [search, setSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'infrastructure' | 'staffing' | 'winter'>('all');

  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState('');

  // Collect flat list of all problems with their school details
  const allProblemsWithSchool = useMemo(() => {
    const list: Array<{
      problem: HoiProblem;
      schoolId: string;
      schoolName: string;
      schoolUdise: string;
      schoolCluster: string;
      hoiName: string;
      hoiPhone: string;
      hoiDesignation: string;
    }> = [];

    schools.forEach(s => {
      (s.hoiProblems || []).forEach(p => {
        list.push({
          problem: p,
          schoolId: s.id,
          schoolName: s.name,
          schoolUdise: s.code,
          schoolCluster: s.cluster,
          hoiName: s.hoiName || s.principalName,
          hoiPhone: s.hoiPhone || s.principalPhone,
          hoiDesignation: s.hoiDesignation || 'Headmaster'
        });
      });
    });

    return list;
  }, [schools]);

  // Summary counts
  const stats = useMemo(() => {
    let total = allProblemsWithSchool.length;
    let critical = 0;
    let pending = 0;
    let underReview = 0;
    let forwarded = 0;
    let resolved = 0;
    let snowDamage = 0;
    let staffShortage = 0;
    let winterFuel = 0;

    allProblemsWithSchool.forEach(item => {
      if (item.problem.priority === 'Critical / Immediate') critical++;
      if (item.problem.status === 'Pending ZEO Action') pending++;
      if (item.problem.status === 'Under ZEO Review') underReview++;
      if (item.problem.status === 'Forwarded to CEO/Directorate') forwarded++;
      if (item.problem.status === 'Resolved') resolved++;

      if (item.problem.category === 'Infrastructure & Snow Damage') snowDamage++;
      if (item.problem.category === 'Teacher & Staff Shortage') staffShortage++;
      if (item.problem.category === 'Winter Heating & Fuel') winterFuel++;
    });

    return { total, critical, pending, underReview, forwarded, resolved, snowDamage, staffShortage, winterFuel };
  }, [allProblemsWithSchool]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return allProblemsWithSchool.filter(item => {
      // Tab filter
      if (activeTab === 'critical' && item.problem.priority !== 'Critical / Immediate') return false;
      if (activeTab === 'infrastructure' && item.problem.category !== 'Infrastructure & Snow Damage') return false;
      if (activeTab === 'staffing' && item.problem.category !== 'Teacher & Staff Shortage') return false;
      if (activeTab === 'winter' && item.problem.category !== 'Winter Heating & Fuel') return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesSchool = item.schoolName.toLowerCase().includes(q);
        const matchesUdise = item.schoolUdise.includes(q);
        const matchesHoi = item.hoiName.toLowerCase().includes(q);
        const matchesPhone = item.hoiPhone.includes(q);
        const matchesTitle = item.problem.title.toLowerCase().includes(q);
        const matchesDesc = item.problem.description.toLowerCase().includes(q);
        if (!matchesSchool && !matchesUdise && !matchesHoi && !matchesPhone && !matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // Dropdown filters
      if (selectedCluster !== 'All' && item.schoolCluster !== selectedCluster) return false;
      if (selectedCategory !== 'All' && item.problem.category !== selectedCategory) return false;
      if (selectedPriority !== 'All' && item.problem.priority !== selectedPriority) return false;
      if (selectedStatus !== 'All' && item.problem.status !== selectedStatus) return false;

      return true;
    });
  }, [allProblemsWithSchool, activeTab, search, selectedCluster, selectedCategory, selectedPriority, selectedStatus]);

  if (!isHoiProblemsLogOpen) return null;

  const handleStatusChange = (schoolId: string, problemId: string, newStatus: HoiProblemStatus) => {
    updateHoiProblem(schoolId, problemId, { status: newStatus });
  };

  const handleSaveRemark = (schoolId: string, problemId: string) => {
    if (!remarkText.trim()) return;
    updateHoiProblem(schoolId, problemId, { zeoRemarks: remarkText.trim() });
    setEditingRemarkId(null);
    setRemarkText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                HOI Official Grievance & Issue Register
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ZEO Office Gurez • Max 3 Priority Problems/School
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Institutional Problems Logbook
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct issues, winter challenges, and infrastructure distress reported by Headmasters & Principals across {schools.length} schools in Gurez & Tulail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportHoiProblemsLogToCSV(schools)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
              title="Export all problems to Excel CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Problems Register</span>
            </button>
            <button
              onClick={() => setIsHoiProblemsLogOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-slate-500 font-medium">Total Logged</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across {schools.length} institutions</div>
          </div>
          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
            <div className="text-rose-700 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Critical / Urgent
            </div>
            <div className="text-xl font-extrabold text-rose-800 mt-0.5">{stats.critical}</div>
            <div className="text-[11px] text-rose-600 mt-0.5">Immediate ZEO intervention</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <div className="text-amber-800 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              Snow Damage
            </div>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">{stats.snowDamage}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Roof leaks & boundary wall</div>
          </div>
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200">
            <div className="text-indigo-800 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-700" />
              Staff Deficit
            </div>
            <div className="text-xl font-extrabold text-indigo-900 mt-0.5">{stats.staffShortage}</div>
            <div className="text-[11px] text-indigo-700 mt-0.5">Subject master requests</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
            <div className="text-emerald-800 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Resolved
            </div>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5">{stats.resolved}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">{stats.pending} pending action</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          {/* Quick Segment Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Issues ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('critical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'critical' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                Critical Priority ({stats.critical})
              </button>
              <button
                onClick={() => setActiveTab('infrastructure')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'infrastructure' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Snow & Roof Damage ({stats.snowDamage})
              </button>
              <button
                onClick={() => setActiveTab('staffing')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'staffing' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff Shortage ({stats.staffShortage})
              </button>
              <button
                onClick={() => setActiveTab('winter')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'winter' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Winter Heating ({stats.winterFuel})
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredProblems.length}</strong> logged problems
            </span>
          </div>

          {/* Search & Select dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search school, U-DISE, HOI name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedCluster}
              onChange={e => setSelectedCluster(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="All">All Clusters (4 Valleys)</option>
              <option value="Bagtore & Kanzalwan Cluster">Bagtore & Kanzalwan</option>
              <option value="Dawar Central Cluster">Dawar Central</option>
              <option value="Kilshay & Chorwan Cluster">Kilshay & Chorwan</option>
              <option value="Tulail Valley Cluster">Tulail Valley</option>
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="All">All Problem Categories</option>
              <option value="Infrastructure & Snow Damage">Infrastructure & Snow Damage</option>
              <option value="Teacher & Staff Shortage">Teacher & Staff Shortage</option>
              <option value="Winter Heating & Fuel">Winter Heating & Fuel</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="ICT & Smart Class">ICT & Smart Class</option>
              <option value="Land & Boundary Wall">Land & Boundary Wall</option>
              <option value="Mid-Day Meal & Ration">Mid-Day Meal & Ration</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="All">All Resolution Statuses</option>
              <option value="Pending ZEO Action">Pending ZEO Action</option>
              <option value="Under ZEO Review">Under ZEO Review</option>
              <option value="Forwarded to CEO/Directorate">Forwarded to CEO/Directorate</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-100/60">
          {filteredProblems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No issues found</h4>
              <p className="text-xs text-slate-500 mt-1">
                No institutional grievances match your current search and filter criteria.
              </p>
            </div>
          ) : (
            filteredProblems.map(({ problem, schoolId, schoolName, schoolUdise, schoolCluster, hoiName, hoiPhone, hoiDesignation }) => {
              const isCritical = problem.priority === 'Critical / Immediate';
              const isResolved = problem.status === 'Resolved';

              return (
                <div 
                  key={problem.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    isCritical 
                      ? 'border-rose-300 ring-1 ring-rose-200' 
                      : isResolved
                      ? 'border-emerald-200 opacity-90'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3">
                    <div>
                      {/* Category & Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 font-mono">
                          Problem #{problem.problemNumber} of 3
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : problem.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {problem.priority}
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {problem.category}
                        </span>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Reported: {problem.reportedDate}
                        </span>
                      </div>

                      {/* Problem Subject & School Name */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {problem.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                        <span className="font-semibold text-indigo-700 hover:underline cursor-pointer"
                          onClick={() => {
                            const found = schools.find(s => s.id === schoolId);
                            if (found) setSelectedSchool(found);
                          }}
                        >
                          {schoolName}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">U-DISE: {schoolUdise}</span>
                        <span>•</span>
                        <span className="text-slate-500">{schoolCluster}</span>
                      </div>
                    </div>

                    {/* HOI Contact Box */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between lg:justify-end gap-3 min-w-[240px]">
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">Head of Institution (HOI)</div>
                        <div className="text-xs font-bold text-slate-900">{hoiName}</div>
                        <div className="text-[11px] text-slate-500">{hoiDesignation}</div>
                      </div>
                      <a
                        href={`tel:${hoiPhone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
                        title={`Call HOI ${hoiName}`}
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed my-3 font-normal">
                    {problem.description}
                  </div>

                  {/* Status & ZEO Action Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Action Status:</span>
                      <select
                        value={problem.status}
                        onChange={e => handleStatusChange(schoolId, problem.id, e.target.value as HoiProblemStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                          problem.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : problem.status === 'Forwarded to CEO/Directorate'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : problem.status === 'Under ZEO Review'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Pending ZEO Action">Pending ZEO Action</option>
                        <option value="Under ZEO Review">Under ZEO Review</option>
                        <option value="Forwarded to CEO/Directorate">Forwarded to CEO/Directorate</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    {/* ZEO Remarks */}
                    <div className="flex-1 sm:max-w-md text-right">
                      {editingRemarkId === problem.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={remarkText}
                            onChange={e => setRemarkText(e.target.value)}
                            placeholder="Enter ZEO remarks / resolution note..."
                            className="flex-1 px-2.5 py-1 text-xs border border-indigo-300 rounded-lg focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRemark(schoolId, problem.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRemarkId(null)}
                            className="px-2 py-1 text-slate-500 text-xs hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-[11px]">
                          <span className="text-slate-500 italic truncate max-w-xs">
                            {problem.zeoRemarks ? `ZEO Note: "${problem.zeoRemarks}"` : 'No action note added yet'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingRemarkId(problem.id);
                              setRemarkText(problem.zeoRemarks || '');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
                          >
                            {problem.zeoRemarks ? 'Edit Note' : '+ Add Note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Official ZEO Gurez Grievance Tracking Protocol • Academic Session 2026-27</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHoiProblemsLogOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              Close Logbook
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
