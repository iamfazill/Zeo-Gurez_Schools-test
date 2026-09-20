import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Save, 
  Plus, 
  School as SchoolIcon,
  ShieldCheck,
  Lock,
  Sliders
} from 'lucide-react';
import { School, ZoneCluster, SchoolCategory, SchoolLevel, InspectionStatus } from '../types';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';

export const AddEditSchoolModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    editingSchool, 
    setEditingSchool, 
    addSchool, 
    updateSchool, 
    schools 
  } = useSchools();

  const {
    currentUser,
    isAdmin,
    isSchool,
    systemOptions,
    setIsAdminSettingsOpen
  } = useAuth();

  const isOpen = isAddModalOpen || !!editingSchool;
  const isEdit = !!editingSchool;

  const [formData, setFormData] = useState<Partial<School>>({
    code: '',
    name: '',
    cluster: 'North Cluster',
    level: 'Secondary (Grades 9-10)',
    category: 'Government / Public',
    gender: 'Co-educational',
    principalName: '',
    principalPhone: '+91 94190 00000',
    email: '',
    address: '',
    establishedYear: 2000,
    totalStudents: 500,
    totalTeachers: 22,
    supportStaff: 6,
    classroomsCount: 18,
    rating: 4.2,
    inspectionStatus: 'Compliant',
    lastInspectionDate: new Date().toISOString().slice(0, 10),
    nextInspectionDue: '2027-02-15',
    facilities: ['Functional Tap Water', 'Playground', 'Separate Girls Toilet'],
    shift: 'Standard Day',
    notes: '',
    hoiName: '',
    hoiDesignation: 'Headmaster',
    hoiPhone: '+91 94190 00000',
    hoiProblems: []
  });

  useEffect(() => {
    if (editingSchool) {
      setFormData(editingSchool);
    } else if (isAddModalOpen) {
      const nextNum = String(schools.length + 1).padStart(3, '0');
      setFormData({
        code: `ZN-GZ-${nextNum}`,
        name: '',
        cluster: 'North Cluster',
        level: 'Secondary (Grades 9-10)',
        category: 'Government / Public',
        gender: 'Co-educational',
        principalName: '',
        principalPhone: '+91 94190 00000',
        email: `school.${nextNum}@zeogurez.in`,
        address: 'Gurez Valley Campus, Bandipora',
        establishedYear: 2005,
        totalStudents: 120,
        totalTeachers: 8,
        supportStaff: 2,
        classroomsCount: 8,
        rating: 4.2,
        inspectionStatus: 'Compliant',
        lastInspectionDate: new Date().toISOString().slice(0, 10),
        nextInspectionDue: '2027-03-01',
        facilities: ['Functional Tap Water', 'Playground', 'Separate Girls Toilet'],
        shift: 'Standard Day',
        notes: '',
        hoiName: '',
        hoiDesignation: 'Headmaster',
        hoiPhone: '+91 94190 00000',
        hoiProblems: []
      });
    }
  }, [editingSchool, isAddModalOpen, schools.length]);

  if (!isOpen) return null;

  const handleFacilityToggle = (facility: string) => {
    const current = formData.facilities || [];
    if (current.includes(facility)) {
      setFormData({
        ...formData,
        facilities: current.filter(f => f !== facility)
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...current, facility]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a valid school name');
      return;
    }

    if (isEdit && editingSchool) {
      updateSchool({
        ...(editingSchool as School),
        ...(formData as School),
        hoiName: formData.principalName || (editingSchool as School).hoiName,
        hoiPhone: formData.principalPhone || (editingSchool as School).hoiPhone
      });
      setEditingSchool(null);
    } else {
      if (!isAdmin) {
        alert('Only Administrator (@Fazel) has authority to register or add schools.');
        return;
      }
      const newId = `SCH-GZ-${Date.now()}`;
      addSchool({
        ...(formData as School),
        id: newId,
        hoiName: formData.principalName || 'Head of Institution',
        hoiDesignation: formData.hoiDesignation || 'Headmaster',
        hoiPhone: formData.principalPhone || '+91 94190 00000',
        hoiProblems: [],
        pupilTeacherRatio: Math.round((formData.totalStudents || 100) / (formData.totalTeachers || 1))
      });
      setIsAddModalOpen(false);
    }
  };

  const handleClose = () => {
    if (isEdit) {
      setEditingSchool(null);
    } else {
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span>{isEdit ? 'Update Institution Record' : 'Register New School in Zone'}</span>
            </div>
            {isSchool && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                School Self-Service Mode (Basic Info Only)
              </span>
            )}
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                Administrator Full Access
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEdit ? `Edit: ${editingSchool?.name}` : 'Add New School to Zone Registry'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSchool 
              ? 'You can update your institution’s basic details, HOI contact, roll counts, and select from permitted facilities.' 
              : 'Maintain official administrative records, student numbers, faculty allocations, and infrastructure status.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Row 1: Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>School Name *</span>
                {isSchool && <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Admin Controlled</span>}
              </label>
              <input
                type="text"
                required
                disabled={isSchool}
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Govt. High School Dawar"
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 ${
                  isSchool ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-80' : 'bg-slate-50 border-slate-200 focus:outline-hidden focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>U-DISE Code *</span>
                {isSchool && <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Locked</span>}
              </label>
              <input
                type="text"
                required
                disabled={isSchool}
                value={formData.code || ''}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. ZN-001"
                className={`w-full font-mono px-3 py-2 border rounded-lg text-slate-900 ${
                  isSchool ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-80' : 'bg-slate-50 border-slate-200 focus:outline-hidden focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Row 2: Cluster, Category, Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Zone Cluster / Valley *</span>
                {isSchool && <span className="text-[10px] text-slate-400 font-normal"><Lock className="w-2.5 h-2.5 inline" /></span>}
              </label>
              <select
                disabled={isSchool}
                value={formData.cluster}
                onChange={e => setFormData({ ...formData, cluster: e.target.value as ZoneCluster })}
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 ${
                  isSchool ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-80' : 'bg-slate-50 border-slate-200 focus:outline-hidden'
                }`}
              >
                <option value="North Cluster">North Cluster (Dawar)</option>
                <option value="South Cluster">South Cluster (Bagtore)</option>
                <option value="East Cluster">East Cluster (Tulail)</option>
                <option value="West Cluster">West Cluster (Kilshay)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Category *</span>
                {isSchool && <span className="text-[10px] text-slate-400 font-normal"><Lock className="w-2.5 h-2.5 inline" /></span>}
              </label>
              <select
                disabled={isSchool}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as SchoolCategory })}
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 ${
                  isSchool ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-80' : 'bg-slate-50 border-slate-200 focus:outline-hidden'
                }`}
              >
                <option value="Government / Public">Government / Public</option>
                <option value="Government Aided">Government Aided</option>
                <option value="Private Unaided">Private Unaided</option>
                <option value="Special Needs / Inclusive">Special Needs / Inclusive</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Level *</span>
                {isSchool && <span className="text-[10px] text-slate-400 font-normal"><Lock className="w-2.5 h-2.5 inline" /></span>}
              </label>
              <select
                disabled={isSchool}
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as SchoolLevel })}
                className={`w-full px-3 py-2 border rounded-lg text-slate-900 ${
                  isSchool ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-80' : 'bg-slate-50 border-slate-200 focus:outline-hidden'
                }`}
              >
                <option value="Primary (Grades 1-5)">Primary (Grades 1-5)</option>
                <option value="Upper Primary (Grades 6-8)">Upper Primary (Grades 6-8)</option>
                <option value="Secondary (Grades 9-10)">Secondary (Grades 9-10)</option>
                <option value="Higher Secondary (Grades 11-12)">Higher Secondary (Grades 11-12)</option>
                <option value="Composite (K-12)">Composite (K-12)</option>
              </select>
            </div>
          </div>

          {/* Row 3: HOI / Principal Name, Phone, Email (Editable by School) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
            <div>
              <label className="block font-semibold text-emerald-950 mb-1">
                HOI / Headmaster Name *
              </label>
              <input
                type="text"
                required
                value={formData.principalName || ''}
                onChange={e => setFormData({ ...formData, principalName: e.target.value, hoiName: e.target.value })}
                placeholder="e.g. Mohammad Iqbal Lone"
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-950 mb-1">
                HOI Cell / Phone *
              </label>
              <input
                type="text"
                required
                value={formData.principalPhone || ''}
                onChange={e => setFormData({ ...formData, principalPhone: e.target.value, hoiPhone: e.target.value })}
                placeholder="+91 94190 XXXXX"
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:outline-hidden text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-950 mb-1">
                Registered School Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="school@zeogurez.in"
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          {/* Row 4: Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Campus Locality / Village
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Near Markazi Jamia Masjid, Dawar, Gurez"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
            />
          </div>

          {/* Row 5: Students, Teachers, Classrooms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Students Enrolled
              </label>
              <input
                type="number"
                min={0}
                value={formData.totalStudents || 0}
                onChange={e => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Teaching Staff
              </label>
              <input
                type="number"
                min={1}
                value={formData.totalTeachers || 1}
                onChange={e => setFormData({ ...formData, totalTeachers: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Classrooms
              </label>
              <input
                type="number"
                min={1}
                value={formData.classroomsCount || 1}
                onChange={e => setFormData({ ...formData, classroomsCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          {/* Row 6: Facilities Checklist (Populated from Administrator Options) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-700">
                School Facilities & Amenities Checklist
              </label>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setIsAdminSettingsOpen(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Configure Permitted Options</span>
                </button>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Options managed by ZEO Administrator
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
              {systemOptions.availableFacilities.map(fac => {
                const checked = formData.facilities?.includes(fac);
                return (
                  <label key={fac} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleFacilityToggle(fac)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{fac}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Row 7: Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              School Remarks / Institutional Update Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Winter heating stock received, road connectivity status, repair requirements..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Save Changes' : 'Register School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

