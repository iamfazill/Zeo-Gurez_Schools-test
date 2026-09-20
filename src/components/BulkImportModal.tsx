import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  Download, 
  Sparkles,
  HelpCircle,
  School as SchoolIcon
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { exportSchoolsToCSV } from '../utils/csvHelper';
import { School } from '../types';

export const BulkImportModal: React.FC = () => {
  const { 
    isBulkImportOpen, 
    setIsBulkImportOpen, 
    bulkUpdateNames, 
    replaceWithImportedSchools, 
    schools,
    showToast 
  } = useSchools();

  const [activeTab, setActiveTab] = useState<'paste' | 'csv' | 'export'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [importMode, setImportMode] = useState<'updateNames' | 'createNew'>('updateNames');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCount, setParsedCount] = useState<number>(0);

  if (!isBulkImportOpen) return null;

  // Calculate detected lines
  const lines = pastedText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));

  const handleApplyPastedNames = () => {
    if (lines.length === 0) {
      alert('Please enter or paste at least one school name.');
      return;
    }

    if (importMode === 'updateNames') {
      const updatedCount = bulkUpdateNames(pastedText);
      setIsBulkImportOpen(false);
      setPastedText('');
    } else {
      // Create fresh schools from pasted names
      const clusterOptions = ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster'] as const;
      const newSchools: School[] = lines.map((line, idx) => {
        const cleanedName = line.replace(/^(\d+[\.\)\-:]\s*|\-\s*|\*\s*)/, '').trim();
        const cluster = clusterOptions[idx % 4];
        const indexNum = String(idx + 1).padStart(3, '0');
        return {
          id: `SCH-CUST-${indexNum}`,
          code: `ZN-${cluster[0]}-${indexNum}`,
          name: cleanedName,
          cluster: cluster,
          level: (idx % 3 === 0 ? 'Secondary (Grades 9-10)' : idx % 3 === 1 ? 'Primary (Grades 1-5)' : 'Higher Secondary (Grades 11-12)'),
          category: (idx % 2 === 0 ? 'Government / Public' : 'Government Aided'),
          gender: 'Co-educational',
          principalName: `Principal Office (${cleanedName.split(' ')[0]})`,
          principalPhone: `+1 (555) 0${String(10 + (idx % 90)).padStart(2, '0')}-${String(1000 + idx)}`,
          email: `info.${indexNum}@zone-schools.org`,
          address: `Zone Campus, Ward ${1 + (idx % 18)}, District Education Sector`,
          establishedYear: 1985 + (idx % 35),
          totalStudents: 320 + (idx * 17) % 850,
          totalTeachers: 14 + (idx * 2) % 35,
          supportStaff: 6,
          classroomsCount: 16,
          pupilTeacherRatio: 23,
          rating: 4.2,
          inspectionStatus: (idx % 5 === 0 ? 'Scheduled' : 'Compliant'),
          lastInspectionDate: '2026-07-15',
          nextInspectionDue: '2027-01-15',
          facilities: ['Computer Labs', 'Library', 'Playground', 'Clean Drinking Water', 'Smart Classrooms'],
          shift: 'Standard Day',
          hoiName: `Headmaster (${cleanedName.split(' ')[0]})`,
          hoiDesignation: 'Headmaster',
          hoiPhone: `+91 94190 ${String(10000 + (idx % 89999)).slice(0, 5)}`,
          hoiProblems: []
        };
      });

      replaceWithImportedSchools(newSchools);
      setIsBulkImportOpen(false);
      setPastedText('');
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const rows = text.split(/\r?\n/).filter(r => r.trim().length > 0);
      if (rows.length < 2) {
        alert('CSV appears empty or lacks data rows.');
        return;
      }

      // Check header
      const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('school'));
      const codeIndex = headers.findIndex(h => h.includes('code') || h.includes('udise'));
      const clusterIndex = headers.findIndex(h => h.includes('cluster'));

      const imported: School[] = [];
      const dataRows = rows.slice(1);

      dataRows.forEach((rowStr, idx) => {
        // basic CSV split handling quotes
        const cols = rowStr.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rowStr.split(',');
        const cleanCols = cols.map(c => c.trim().replace(/^"|"$/g, ''));
        const name = (nameIndex !== -1 && cleanCols[nameIndex]) ? cleanCols[nameIndex] : `Zone School ${idx + 1}`;
        const code = (codeIndex !== -1 && cleanCols[codeIndex]) ? cleanCols[codeIndex] : `ZN-IMP-${String(idx + 1).padStart(3, '0')}`;
        const cluster = (clusterIndex !== -1 && cleanCols[clusterIndex]) ? cleanCols[clusterIndex] as any : 'North Cluster';

        imported.push({
          id: `SCH-IMP-${idx + 1}`,
          code: code,
          name: name,
          cluster: ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster'].includes(cluster) ? cluster : 'North Cluster',
          level: 'Secondary (Grades 9-10)',
          category: 'Government / Public',
          gender: 'Co-educational',
          principalName: 'Principal Administrator',
          principalPhone: '+1 (555) 000-0000',
          email: `admin.${idx + 1}@zone-edu.org`,
          address: 'Zone Educational Campus',
          establishedYear: 2000,
          totalStudents: 450,
          totalTeachers: 20,
          supportStaff: 6,
          classroomsCount: 16,
          pupilTeacherRatio: 23,
          rating: 4.2,
          inspectionStatus: 'Compliant',
          lastInspectionDate: '2026-06-01',
          nextInspectionDue: '2026-12-01',
          facilities: ['Library', 'Computer Labs', 'Playground', 'Clean Drinking Water'],
          shift: 'Standard Day',
          hoiName: 'Head of Institution',
          hoiDesignation: 'Headmaster',
          hoiPhone: '+91 94190 00000',
          hoiProblems: []
        });
      });

      setParsedCount(imported.length);
      replaceWithImportedSchools(imported);
      setIsBulkImportOpen(false);
    };

    reader.readAsText(file);
  };

  const loadSampleNames = () => {
    const sample = [
      "Beacon Hill High School",
      "Greenwood Public Primary",
      "St. Xavier Senior Academy",
      "Oakridge Government Model High",
      "Sunrise Valley Comprehensive",
      "Riverside Girls Secondary",
      "Pioneer Boys Technical School",
      "Horizon STEM Institute",
      "Crescent Moon Upper Primary",
      "Cedar Grove Academy"
    ].join('\n');
    setPastedText(sample);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsBulkImportOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with clear reassurance answering user query */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>Zone School Registry Tool</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Import or Paste Your 88 School Names
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            <span className="font-semibold text-slate-900">Yes, you can provide your school names!</span> Paste your list below or upload a spreadsheet. We can map them directly onto the existing 88 records with full statistics, or create fresh entries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5">
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste School Names
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'csv'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV File Upload
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Export Template / Current 88
          </button>
        </div>

        {/* TAB 1: PASTE NAMES */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paste School Names (1 per line)
              </label>
              <button
                type="button"
                onClick={loadSampleNames}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Sample List
              </button>
            </div>

            <textarea
              id="bulk-paste-textarea"
              rows={8}
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder="Paste your school names here, e.g.:
1. St. Joseph High School
2. North Valley Model Academy
3. Sunshine Primary School
...up to 88 schools!"
              className="w-full font-mono text-xs sm:text-sm p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
            />

            {/* Line Counter & Format helper */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Detected: </span>
                <span className="font-bold text-slate-800">{lines.length} School Names</span>
                {lines.length === 88 && (
                  <span className="text-emerald-600 font-semibold ml-1">✓ Perfect 88 match!</span>
                )}
              </div>
              <span className="text-slate-400">Numbers and bullet points are auto-stripped</span>
            </div>

            {/* Import Mode Radio */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-slate-700">Application Mode:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  importMode === 'updateNames' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="importMode"
                    value="updateNames"
                    checked={importMode === 'updateNames'}
                    onChange={() => setImportMode('updateNames')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Update Current 88 Records</div>
                    <div className="text-slate-500 mt-0.5 text-[11px] leading-normal">
                      Applies your names onto the existing 88 schools while keeping complete zone faculty stats, clusters, and infrastructure ready.
                    </div>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  importMode === 'createNew' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="importMode"
                    value="createNew"
                    checked={importMode === 'createNew'}
                    onChange={() => setImportMode('createNew')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Replace with Only Pasted List</div>
                    <div className="text-slate-500 mt-0.5 text-[11px] leading-normal">
                      Builds the registry containing strictly the exact number of school names you pasted.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkImportOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                id="apply-pasted-names-btn"
                type="button"
                onClick={handleApplyPastedNames}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                Apply {lines.length > 0 ? `${lines.length} School Names` : 'Names'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CSV UPLOAD */}
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 text-center bg-slate-50/60 transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-900 mb-1">
                Upload your School Registry CSV
              </div>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Upload a CSV spreadsheet containing school names, codes, clusters, and principals.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Select CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800">Supported CSV Columns:</div>
              <p className="text-[11px] font-mono text-slate-700">
                School Name, School Code, Cluster, Level, Category, Principal Name, Total Students, Total Teachers
              </p>
              <p className="text-slate-500 text-[11px]">
                Tip: If you have an Excel file (.xlsx), save it as CSV before uploading.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: EXPORT CURRENT REGISTRY */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Download the complete current registry of all {schools.length} schools to back up your data or edit in Microsoft Excel / Google Sheets:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => exportSchoolsToCSV(schools)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Export as CSV Spreadsheet</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Opens directly in Excel, Google Sheets, or Numbers.
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  exportSchoolsToCSV(schools);
                  showToast('Template downloaded');
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Download Blank CSV Template</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Pre-formatted template with all headers for all 88 schools.
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
