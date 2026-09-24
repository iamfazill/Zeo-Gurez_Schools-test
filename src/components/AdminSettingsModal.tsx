import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  Sliders, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Copy, 
  Check, 
  Lock,
  Send,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchools } from '../context/SchoolContext';

export const AdminSettingsModal: React.FC = () => {
  const { 
    isAdminSettingsOpen, 
    setIsAdminSettingsOpen, 
    adminAccount,
    systemOptions,
    schoolAccounts,
    requestAdminEmailChange,
    verifyAdminEmailChangeOtp,
    updateAdminPassword,
    addFacilityOption,
    removeFacilityOption,
    resetSchoolPassword,
    otpNotice
  } = useAuth();
  const { schools, resetToDefault88 } = useSchools();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [activeTab, setActiveTab] = useState<'email' | 'facilities' | 'passwords' | 'adminPass'>('email');

  // Email change state
  const [emailCurrentPass, setEmailCurrentPass] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailStep, setEmailStep] = useState<'request' | 'verify'>('request');
  const [otpInput, setOtpInput] = useState('');
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Facility management state
  const [newFacilityName, setNewFacilityName] = useState('');
  const [facilityMsg, setFacilityMsg] = useState('');

  // School accounts search & reset state
  const [schoolSearch, setSchoolSearch] = useState('');
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [tempSchoolPass, setTempSchoolPass] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin password state
  const [oldAdminPass, setOldAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAdminSettingsOpen) return null;

  // Handle Request Email Change
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatusMsg(null);
    const res = requestAdminEmailChange(emailCurrentPass, newEmailInput);
    if (res.success) {
      setEmailStep('verify');
      setEmailStatusMsg({ type: 'success', text: res.message });
      if (res.otp) {
        setOtpInput(res.otp); // Pre-fill or make readily available for easy confirmation
      }
    } else {
      setEmailStatusMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatusMsg(null);
    const res = verifyAdminEmailChangeOtp(otpInput);
    if (res.success) {
      setEmailStatusMsg({ type: 'success', text: res.message });
      setEmailStep('request');
      setEmailCurrentPass('');
      setNewEmailInput('');
      setOtpInput('');
    } else {
      setEmailStatusMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Add Facility
  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName.trim()) return;
    const added = addFacilityOption(newFacilityName.trim());
    if (added) {
      setFacilityMsg(`Added "${newFacilityName.trim()}" to permitted school facilities.`);
      setNewFacilityName('');
      setTimeout(() => setFacilityMsg(''), 3000);
    } else {
      setFacilityMsg('Facility option already exists or is invalid.');
    }
  };

  // Handle Admin Password Change
  const handleAdminPassChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newAdminPass !== confirmAdminPass) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const res = updateAdminPassword(oldAdminPass, newAdminPass);
    if (res.success) {
      setPassMsg({ type: 'success', text: res.message });
      setOldAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
    } else {
      setPassMsg({ type: 'error', text: res.message });
    }
  };

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSchoolAccounts = schools.filter(s => 
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.principalName.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAdminSettingsOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="shrink-0 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>ZEO Administrator Control Center</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Root Admin Authority
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage registered administrator email, OTP security, system facility options, and school portal credentials.
              </p>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'email' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Admin Email (OTP)</span>
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'facilities' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Manage System Options ({systemOptions.availableFacilities.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('passwords')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'passwords' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>School Logins & Passwords</span>
            </button>
            <button
              onClick={() => setActiveTab('adminPass')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'adminPass' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Admin Password</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: CHANGE ADMIN EMAIL WITH OTP */}
          {activeTab === 'email' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Currently Registered Administrator Email
                </div>
                <div className="font-mono text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>{adminAccount.email}</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  For security, modifying this address requires entering your current administrator password and verifying a 6-digit One-Time Password (OTP) dispatched to this address.
                </p>
              </div>

              {emailStatusMsg && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  emailStatusMsg.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {emailStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{emailStatusMsg.text}</span>
                </div>
              )}

              {/* STEP 1: REQUEST OTP */}
              {emailStep === 'request' && (
                <form onSubmit={handleRequestOtp} className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="font-bold text-xs text-slate-800">
                    Step 1: Request Email Change Verification
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Current Administrator Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter your current admin password..."
                      value={emailCurrentPass}
                      onChange={e => setEmailCurrentPass(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      New Administrator Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. new.zeo.gurez@jk.gov.in"
                      value={newEmailInput}
                      onChange={e => setNewEmailInput(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send 6-Digit OTP to {adminAccount.email}</span>
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFY OTP */}
              {emailStep === 'verify' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 bg-white p-5 rounded-xl border border-indigo-200 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        Step 2: Enter Verification Code
                      </div>
                      <div className="text-[11px] text-slate-500">
                        OTP sent to <strong className="text-slate-800 font-mono">{adminAccount.email}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      10 min expiry
                    </span>
                  </div>

                  {otpNotice && (
                    <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900 text-[11px] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Simulated Secure Email Dispatch:
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpInput(otpNotice.code)}
                          className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-50"
                        >
                          Auto-fill {otpNotice.code}
                        </button>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Subject: ZEO Gurez Email Change Verification Code: <strong className="text-slate-900 font-mono font-bold text-sm tracking-widest">{otpNotice.code}</strong>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      6-Digit One-Time Password (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit OTP code"
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-widest font-mono text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEmailStep('request')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                    >
                      Cancel / Resend
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verify & Update Email</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SYSTEM FACILITIES & OPTIONS MANAGEMENT */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                <div className="font-bold mb-1">Administrator Option Authority:</div>
                <p className="text-[11px] leading-relaxed text-emerald-900">
                  Individual schools are restricted from adding unverified custom facilities. As the Zonal Administrator, you define the official master list of facilities and amenities that schools can choose from.
                </p>
              </div>

              {facilityMsg && (
                <div className="p-2.5 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium">
                  {facilityMsg}
                </div>
              )}

              {/* Add New Facility Form */}
              <form onSubmit={handleAddFacility} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g., Atal Tinkering Lab, Solar Heating, Broadband Fiber..."
                  value={newFacilityName}
                  onChange={e => setNewFacilityName(e.target.value)}
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Facility Option</span>
                </button>
              </form>

              {/* Existing Facilities List */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Current Permitted Amenities ({systemOptions.availableFacilities.length})</span>
                  <span className="text-[11px] text-slate-400 normal-case font-normal">
                    Click trash icon to remove option
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {systemOptions.availableFacilities.map((fac, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <span className="font-semibold text-slate-800">{fac}</span>
                      <button
                        onClick={() => removeFacilityOption(fac)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title={`Remove "${fac}" from options`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHOOL PORTAL CREDENTIALS & PASSWORDS */}
          {activeTab === 'passwords' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    School Portal Accounts & Logins ({schools.length} Schools)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    HOIs use these credentials to log in and edit their own school details.
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Search school name or code..."
                  value={schoolSearch}
                  onChange={e => setSchoolSearch(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden w-56"
                />
              </div>

              {/* Credentials Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr className="text-[11px] font-bold text-slate-600 uppercase">
                      <th className="py-2.5 px-3">U-DISE</th>
                      <th className="py-2.5 px-3">School Name</th>
                      <th className="py-2.5 px-3">Login Email</th>
                      <th className="py-2.5 px-3">Password</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchoolAccounts.map(s => {
                      const acc = schoolAccounts[s.id];
                      const currentPass = acc?.password || `School@${s.code.replace(/[^a-zA-Z0-9]/g, '')}`;
                      const loginEmail = acc?.email || s.email;

                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.code}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[180px] truncate">{s.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{loginEmail}</td>
                          <td className="py-2.5 px-3">
                            {editingSchoolId === s.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={tempSchoolPass}
                                  onChange={e => setTempSchoolPass(e.target.value)}
                                  className="w-24 text-[11px] font-mono p-1 border border-indigo-300 rounded bg-white"
                                />
                                <button
                                  onClick={() => {
                                    if (tempSchoolPass.trim()) {
                                      resetSchoolPassword(s.id, tempSchoolPass.trim());
                                      setEditingSchoolId(null);
                                    }
                                  }}
                                  className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                                {currentPass}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => handleCopyCredentials(`Email: ${loginEmail} | Password: ${currentPass}`, s.id)}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Copy Login Details"
                            >
                              {copiedId === s.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingSchoolId(s.id);
                                setTempSchoolPass(currentPass);
                              }}
                              className="text-[11px] text-indigo-600 hover:underline font-medium"
                            >
                              Reset
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CHANGE ADMIN PASSWORD */}
          {activeTab === 'adminPass' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950">
                <div className="font-bold mb-1">Update Administrator Login Password</div>
                <p className="text-[11px] text-amber-900">
                  Choose a secure password of at least 6 characters.
                </p>
              </div>

              {passMsg && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  passMsg.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {passMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleAdminPassChange} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password..."
                    value={oldAdminPass}
                    onChange={e => setOldAdminPass(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters..."
                    value={newAdminPass}
                    onChange={e => setNewAdminPass(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password..."
                    value={confirmAdminPass}
                    onChange={e => setConfirmAdminPass(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="shrink-0 pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official 92 Schools</span>
          </button>

          <button
            onClick={() => setIsAdminSettingsOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            Close Settings
          </button>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Reset Zone Database?
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                This will reload the official benchmark registry of 92 schools across the 8 clusters of Gurez & Tulail with complete class-wise enrollment rolls and HOI details.
              </p>
              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetToDefault88();
                    setShowResetConfirm(false);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
