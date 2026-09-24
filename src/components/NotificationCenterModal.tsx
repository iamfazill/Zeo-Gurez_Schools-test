import React, { useState, useMemo } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Send, 
  Plus, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { SchoolNotification, ZoneNotice } from '../types';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    setSelectedSchool,
    schools,
    notices,
    showToast
  } = useSchools();

  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'school_changes' | 'circulars'>('school_changes');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'profile' | 'problem'>('all');

  // If not admin, hide problem notifications
  const visibleNotifications = useMemo(() => {
    return isAdmin ? notifications : notifications.filter((n: SchoolNotification) => !n.changeType.startsWith('problem_'));
  }, [notifications, isAdmin]);

  const visibleUnreadCount = useMemo(() => {
    return visibleNotifications.filter((n: SchoolNotification) => !n.read).length;
  }, [visibleNotifications]);

  // Circular compose state
  const [localNotices, setLocalNotices] = useState<ZoneNotice[]>(notices);
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General Directive');
  const [newPriority, setNewPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newContent, setNewContent] = useState('');

  if (!isNotificationCenterOpen) return null;

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please enter a title and instructions content for the circular');
      return;
    }

    const created: ZoneNotice = {
      id: `NOT-${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toISOString().slice(0, 10),
      priority: newPriority,
      targetClusters: 'All 8 Clusters (92 Schools)',
      category: newCategory,
      content: newContent.trim()
    };

    setLocalNotices([created, ...localNotices]);
    setIsComposing(false);
    setNewTitle('');
    setNewContent('');
    showToast('Official ZEO Circular broadcasted to all 92 schools');
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const filteredNotifications = visibleNotifications.filter((n: SchoolNotification) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'profile') return n.changeType === 'profile_update' || n.changeType === 'facility_update' || n.changeType === 'enrollment_update';
    if (filterType === 'problem') return isAdmin && n.changeType.startsWith('problem_');
    return true;
  });

  const handleInspectSchool = (schoolId: string, notificationId: string) => {
    markNotificationAsRead(notificationId);
    const target = schools.find(s => s.id === schoolId);
    if (target) {
      setSelectedSchool(target);
      setIsNotificationCenterOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setIsNotificationCenterOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close Notification Area"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Bell className="w-3.5 h-3.5" />
              <span>ZEO Gurez Notification Area</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-2xs">
                {unreadNotificationsCount} Unread
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Activity & Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time feed of profile changes, roll updates, and institutional problems reported by Gurez schools.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-4 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('school_changes')}
              className={`relative pb-2 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'school_changes'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>School Activity Alerts</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === 'school_changes'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {notifications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('circulars')}
              className={`relative pb-2 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'circulars'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Zone Circulars & Directives</span>
              <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {localNotices.length}
              </span>
            </button>
          </div>

          {/* Quick Header Actions */}
          {activeTab === 'school_changes' && notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Clear all school change notifications from the notification area?')) {
                    clearAllNotifications();
                  }
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
                title="Clear notification history"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: School Activity Alerts */}
        {activeTab === 'school_changes' && (
          <div>
            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({visibleNotifications.length})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === 'unread'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Unread ({visibleUnreadCount})
              </button>
              <button
                onClick={() => setFilterType('profile')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                Profile & Rolls
              </button>
              {isAdmin && (
                <button
                  onClick={() => setFilterType('problem')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    filterType === 'problem'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Institutional Problems
                </button>
              )}
            </div>

            {/* Notification List */}
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Notifications in This Filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Whenever any of the 92 Gurez zone schools update their student counts, staff rolls, or institutional problems, alerts will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredNotifications.map((item: SchoolNotification) => {
                  const isProblem = item.changeType.startsWith('problem_');
                  const isFacility = item.changeType === 'facility_update';
                  const isRemoved = item.changeType === 'problem_removed';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        !item.read
                          ? 'bg-indigo-50/40 border-indigo-200/80 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon badge */}
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                          isProblem
                            ? isRemoved
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                            : isFacility
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {isProblem ? (
                            isRemoved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />
                          ) : isFacility ? (
                            <Building2 className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>

                        {/* Details content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {item.schoolName}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {item.schoolCode}
                              </span>
                              {!item.read && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" title="Unread notification" />
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(item.timestamp)}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-slate-800 mt-1">
                            {item.title}
                          </div>

                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 font-sans">
                            {item.details}
                          </p>

                          {item.authorName && (
                            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between gap-2 flex-wrap">
                              <span>
                                Submitted by: <strong className="text-slate-600">{item.authorName}</strong> ({item.authorRole || 'HOI'})
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleInspectSchool(item.schoolId, item.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                                  title="Open this school's full record"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Inspect School</span>
                                </button>

                                {!item.read && (
                                  <button
                                    onClick={() => markNotificationAsRead(item.id)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => deleteNotification(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Dismiss notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Zone Circulars & Directives */}
        {activeTab === 'circulars' && (
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Zone Circulars ({localNotices.length})
              </span>
              <button
                onClick={() => setIsComposing(!isComposing)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isComposing ? 'Cancel Compose' : 'Broadcast New Circular'}</span>
              </button>
            </div>

            {/* Compose Form */}
            {isComposing && (
              <form onSubmit={handlePostNotice} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compose Zone Bulletin</span>
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Circular Subject / Heading..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs"
                    >
                      <option value="General Directive">General Directive</option>
                      <option value="Compliance & Audit">Compliance & Audit</option>
                      <option value="Staff Training">Staff Training</option>
                      <option value="Academics & Events">Academics & Events</option>
                      <option value="Safety Protocol">Safety Protocol</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs"
                    >
                      <option value="Normal">Priority: Normal</option>
                      <option value="High">Priority: High</option>
                      <option value="Urgent">Priority: Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Official notice guidelines for Headmasters and Principals..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast to 92 Schools</span>
                  </button>
                </div>
              </form>
            )}

            {/* Circulars List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {localNotices.map(notice => (
                <div key={notice.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{notice.title}</span>
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          notice.priority === 'Urgent' 
                            ? 'bg-rose-100 text-rose-800' 
                            : notice.priority === 'High' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {notice.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {notice.date}
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{notice.category}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{notice.targetClusters}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Updates logged automatically whenever a school submits edits to their profile or problems.</span>
          </div>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
