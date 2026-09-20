import React from 'react';
import { 
  ShieldCheck, 
  School as SchoolIcon, 
  Lock, 
  LogOut, 
  Settings, 
  Edit3, 
  AlertTriangle,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchools } from '../context/SchoolContext';

export const BottomLoginBar: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isSchool, 
    adminAccount, 
    openLoginModal, 
    setIsAdminSettingsOpen, 
    logout 
  } = useAuth();

  const { schools, setEditingSchool, setIsHoiProblemsLogOpen } = useSchools();

  const currentSchool = isSchool && currentUser?.schoolId 
    ? schools.find(s => s.id === currentUser.schoolId) 
    : null;

  return (
    <div className="bg-slate-900 border-t border-slate-800 text-white py-4 px-4 sm:px-6 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Status / Heading */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-indigo-400">
            {isAdmin ? (
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            ) : isSchool ? (
              <SchoolIcon className="w-5 h-5 text-emerald-400" />
            ) : (
              <Lock className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isAdmin 
                ? 'Master Administrator Session' 
                : isSchool 
                ? 'School Nodal Officer Portal' 
                : 'ZEO Gurez Portals & Authentication'}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              {isAdmin ? (
                <span>Signed in as <strong className="text-white font-bold">{adminAccount.email}</strong></span>
              ) : isSchool && currentSchool ? (
                <span>Authorized Nodal Officer for <strong className="text-emerald-300 font-bold">{currentSchool.name}</strong> ({currentSchool.code})</span>
              ) : (
                <span>Official administrative & school nodal officer login access</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {isAdmin ? (
            <>
              <button
                onClick={() => setIsHoiProblemsLogOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs"
                title="Institutional Problems Logged by HOIs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>HOI Problems Log</span>
              </button>

              <button
                onClick={() => setIsAdminSettingsOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                title="Admin Settings & Email Change OTP"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Settings</span>
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold transition-colors"
                title="Log Out Administrator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : isSchool ? (
            <>
              {currentSchool && (
                <button
                  onClick={() => setEditingSchool(currentSchool)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit My School Details</span>
                </button>
              )}

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
                title="Log out and return to general 88-school directory"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-300" />
                <span>Log Out to General Website</span>
              </button>
            </>
          ) : (
            <>
              {/* Administrator Login Button */}
              <button
                id="bottom-admin-login-btn"
                onClick={() => openLoginModal('admin')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 group"
                title="Login as Administrator (fazilshehri@gmail.com)"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                <span>Administrator Login</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>

              {/* School Nodal Officer Login Button */}
              <button
                id="bottom-school-login-btn"
                onClick={() => openLoginModal('school')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 group"
                title="Login as School Nodal Officer to change school details"
              >
                <SchoolIcon className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>School Nodal Officer (SNO) Login</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
