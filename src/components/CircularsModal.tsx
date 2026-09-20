import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Calendar, 
  Tag, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { ZoneNotice } from '../types';

export const CircularsModal: React.FC = () => {
  const { isCircularsOpen, setIsCircularsOpen, notices, showToast } = useSchools();
  const [localNotices, setLocalNotices] = useState<ZoneNotice[]>(notices);
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General Directive');
  const [newPriority, setNewPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newContent, setNewContent] = useState('');

  if (!isCircularsOpen) return null;

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill both the circular title and text content');
      return;
    }

    const created: ZoneNotice = {
      id: `NOT-${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toISOString().slice(0, 10),
      priority: newPriority,
      targetClusters: 'All 4 Clusters (88 Schools)',
      category: newCategory,
      content: newContent.trim()
    };

    setLocalNotices([created, ...localNotices]);
    setIsComposing(false);
    setNewTitle('');
    setNewContent('');
    showToast('Zone circular broadcasted to all schools');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsCircularsOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Zone Education Office Directives</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Official Zone Circulars & Compliance Bulletins
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official instructions, inspection guidelines, and notifications circulated to the 88 zone schools.
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Circulars ({localNotices.length})
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
          <form onSubmit={handlePostNotice} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 space-y-3 text-xs sm:text-sm">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Compose Zone Bulletin
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700"
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
                placeholder="Full notice instructions for Headmasters and Principals..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast to 88 Schools
              </button>
            </div>
          </form>
        )}

        {/* Notices List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {localNotices.map(notice => (
            <div key={notice.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{notice.title}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      notice.priority === 'Urgent' 
                        ? 'bg-rose-100 text-rose-800' 
                        : notice.priority === 'High' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {notice.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-medium">{notice.category}</span>
                    <span>•</span>
                    <span className="text-indigo-600">{notice.targetClusters}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
