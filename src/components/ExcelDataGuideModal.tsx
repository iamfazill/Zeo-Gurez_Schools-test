import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  X, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Users, 
  AlertCircle, 
  Phone, 
  Layers, 
  BookOpen, 
  Flame, 
  Droplets,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';
import { exportZEOComprehensiveExcel, downloadEmptyZEOExcelTemplate, exportHoiProblemsLogToCSV } from '../utils/csvHelper';
import { exportZEOAllDetailsToExcel } from '../utils/excelExporter';

export const ExcelDataGuideModal: React.FC = () => {
  const { isExcelGuideOpen, setIsExcelGuideOpen, schools, notices, summaryStats } = useSchools();

  if (!isExcelGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-emerald-900 text-white flex items-start justify-between gap-4 border-b border-emerald-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-700/60 text-emerald-200 border border-emerald-500/40 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                ZEO Gurez Data Requirement Specification
              </span>
              <span className="text-xs text-emerald-200/80 font-mono">Office of ZEO Gurez</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Official Excel Data Structure & Download Center
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Complete reference guide for all data fields required to operate the ZEO Gurez School Management System, with one-click Excel downloads.
            </p>
          </div>

          <button
            onClick={() => setIsExcelGuideOpen(false)}
            className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/80 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Action Bar */}
        <div className="p-4 sm:p-5 bg-emerald-50/80 border-b border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-700" />
              Download Ready-to-Use Excel Spreadsheets
            </h3>
            <p className="text-xs text-emerald-800/90 mt-0.5">
              Exports are encoded with UTF-8 BOM so Microsoft Excel opens all columns, numbers, and symbols without character scrambling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => exportZEOAllDetailsToExcel(schools, notices, summaryStats)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Master 92-School Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => downloadEmptyZEOExcelTemplate()}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-900 border border-emerald-300 text-xs font-semibold transition-all shadow-xs"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Download Blank Template</span>
            </button>

            <button
              onClick={() => exportHoiProblemsLogToCSV(schools)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-rose-900 border border-rose-200 text-xs font-semibold transition-all shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Problems Log Excel</span>
            </button>
          </div>
        </div>

        {/* Content Body: The 7 Pillars of Information Needed */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Summary: What Information You Need to Collect from Each School
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              To ensure the website operates at 100% capacity with full departmental accuracy for the <strong>Office of the Zonal Education Officer (ZEO) Gurez</strong>, you need the following 7 categories of information for each of the 92 schools:
            </p>
          </div>

          {/* 1. School Identity */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-slate-900">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>1. Basic School Identification & Location</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="pb-2">Field Name</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Example / Valid Values</th>
                    <th className="pb-2">Mandatory?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-mono font-bold text-indigo-700">School Name</td>
                    <td className="py-2">Official name of the school as per government records</td>
                    <td className="py-2 font-semibold text-slate-900">BMS Dawar, MS Banjran, PS Achoora</td>
                    <td className="py-2"><span className="text-emerald-700 font-bold">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-indigo-700">U-DISE Code</td>
                    <td className="py-2">11-digit unique government school identifier code</td>
                    <td className="py-2 font-mono text-slate-900">01160802801 to 01160802888</td>
                    <td className="py-2"><span className="text-emerald-700 font-bold">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-indigo-700">Valley Cluster</td>
                    <td className="py-2">Zonal administrative sub-cluster for Gurez valley</td>
                    <td className="py-2">Bagtore & Kanzalwan / Dawar Central / Kilshay & Chorwan / Tulail Valley</td>
                    <td className="py-2"><span className="text-emerald-700 font-bold">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-indigo-700">Category & Level</td>
                    <td className="py-2">Stage of school education</td>
                    <td className="py-2">Primary (1-5) / Upper Primary (6-8) / Secondary (9-10) / HSS (11-12)</td>
                    <td className="py-2"><span className="text-emerald-700 font-bold">Yes</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. HOI Contact & Details */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-slate-900">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>2. Head of Institution (HOI) Contact Details (Requested by You)</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="pb-2">Field Name</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Example / Format</th>
                    <th className="pb-2">Use in Website</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-mono font-bold text-emerald-700">HOI Name</td>
                    <td className="py-2">Full name of the Headmaster, Headmistress, or Principal in-charge</td>
                    <td className="py-2 font-semibold text-slate-900">Mohammad Amin Lone, Ghulam Hassan Rather</td>
                    <td className="py-2">Displayed in cards, directory & search</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-emerald-700">HOI Designation</td>
                    <td className="py-2">Official cadre/post held</td>
                    <td className="py-2">Headmaster / Incharge HM / Principal / Master In-Charge</td>
                    <td className="py-2">HOI badge on modal & roster</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-emerald-700">HOI Cell Number</td>
                    <td className="py-2">Active mobile number of the institution head</td>
                    <td className="py-2 font-mono text-slate-900">+91 94190 12345 / 9622x xxxxx</td>
                    <td className="py-2"><span className="text-emerald-700 font-bold">One-tap direct dial button</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-emerald-700">HOI Email</td>
                    <td className="py-2">Official or personal communication email</td>
                    <td className="py-2 font-mono text-slate-500">hm.dawar@jk.gov.in</td>
                    <td className="py-2">Email link</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Students Roll Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-slate-900">
              <Users className="w-4 h-4 text-blue-600" />
              <span>3. Student Enrollment & Roll Breakdown</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="pb-2">Field Name</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Breakdown Columns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-mono font-bold text-blue-700">Pre-Primary Roll</td>
                    <td className="py-2">Balvatika / Kindergarten / Nursery enrollment</td>
                    <td className="py-2 font-mono">Boys, Girls, and Total Pre-Primary</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-blue-700">Primary Roll (1st to 5th)</td>
                    <td className="py-2">Students in grade 1 through 5</td>
                    <td className="py-2 font-mono">Boys, Girls, and Total Primary</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-blue-700">Upper Primary Roll (6th to 8th)</td>
                    <td className="py-2">Students in grade 6 through 8</td>
                    <td className="py-2 font-mono">Boys, Girls, and Total Upper Primary</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-blue-700">Aggregate Total Roll</td>
                    <td className="py-2">Sum of all enrolled boys and girls</td>
                    <td className="py-2 font-semibold text-slate-900">Total Students, Total Boys, Total Girls</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Establishment Information */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-slate-900">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>4. Establishment Section (Infrastructure & Assets)</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="pb-2">Field Name</th>
                    <th className="pb-2">Values / Types</th>
                    <th className="pb-2">Significance for Gurez</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Building Ownership</td>
                    <td className="py-2">Govt Owned (Pucca) / Rented / Rented Kacha / Under Construction</td>
                    <td className="py-2">Identifies schools needing new building sanctions</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Total Classrooms</td>
                    <td className="py-2">Number of functional classrooms</td>
                    <td className="py-2">Computes space-to-student congestion ratio</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Boundary Wall Condition</td>
                    <td className="py-2">Intact / Partial / No Boundary Wall / Damaged by Avalanche</td>
                    <td className="py-2 text-rose-700 font-semibold">High risk due to wildlife and snow movement</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Drinking Water Source</td>
                    <td className="py-2">Functional Tap / Gravity Spring / Winter Frozen / No Water</td>
                    <td className="py-2">Tracks winter pipeline freeze vulnerability</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Electricity / Solar</td>
                    <td className="py-2">Grid + Solar / Solar Unit Only / No Electricity</td>
                    <td className="py-2">Essential for ICT labs and smart class operation</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">Sanitation & Toilets</td>
                    <td className="py-2">Separate Functional Girls Toilet (Yes/No), CWSN Toilet</td>
                    <td className="py-2 text-emerald-700 font-semibold">Swachh Vidyalaya statutory requirement</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-amber-700">MDM Kitchen Shed</td>
                    <td className="py-2">Functional Dedicated Shed / Makeshift / Under Repair</td>
                    <td className="py-2">PM POSHAN Mid-Day Meal hygiene tracking</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Planning Section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-slate-900">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>5. Planning & Logistics Section</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="pb-2">Field Name</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Example Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-mono font-bold text-purple-700">Winter Heating / Bukhari Fuel</td>
                    <td className="py-2">Status of firewood and Bukhari fuel quota before Razdan pass closes</td>
                    <td className="py-2 font-semibold text-slate-900">Allotted & Stocked / Partial Stock / Emergency Needed</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-purple-700">Free Textbook Distribution</td>
                    <td className="py-2">Status of school textbook delivery from Directorate</td>
                    <td className="py-2">100% Distributed / 85% Distributed (Maths deficit)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-purple-700">Samagra Composite School Grant</td>
                    <td className="py-2">Yearly school maintenance grant in INR</td>
                    <td className="py-2 font-mono">₹25,000 / ₹50,000 (Allotted vs Utilized)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-purple-700">Teacher Vacancies & Deficits</td>
                    <td className="py-2">Sanctioned posts vs actual posted teachers</td>
                    <td className="py-2 text-rose-700">Subject deficits (e.g., Science, Mathematics, Urdu)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. HOI Problems Log Section */}
          <div className="bg-white rounded-xl border border-rose-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-rose-50 border-b border-rose-200 flex items-center gap-2 font-bold text-xs text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>6. HOI Priority Problems Log (Max 3 Problems Per Institution)</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                As explicitly instructed, each school can register up to <strong>3 Important Problems</strong> submitted by the HOI. In the Excel file, these appear as separate columns for each problem:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200">
                  <div className="font-bold text-xs text-rose-900 mb-1">Problem #1 (Top Priority)</div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Problem Category</li>
                    <li>Problem Title & Details</li>
                    <li>Priority (Critical / High / Normal)</li>
                    <li>Status (Pending / In-Review / Resolved)</li>
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                  <div className="font-bold text-xs text-amber-900 mb-1">Problem #2 (Secondary)</div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Problem Category</li>
                    <li>Problem Title & Details</li>
                    <li>Priority (High / Normal)</li>
                    <li>Status (Pending / In-Review / Resolved)</li>
                  </ul>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                  <div className="font-bold text-xs text-blue-900 mb-1">Problem #3 (Tertiary)</div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Problem Category</li>
                    <li>Problem Title & Details</li>
                    <li>Priority (Normal / Low)</li>
                    <li>Status (Pending / In-Review / Resolved)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 7. How to Open in Microsoft Excel */}
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
            <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tip for Microsoft Excel Users:
            </h5>
            <p className="leading-relaxed">
              When you download the Excel file, double-click it to open directly in Microsoft Excel. Because we have embedded the <strong>UTF-8 BOM header</strong>, Excel will format all phone numbers (+91), student numbers, currency amounts (₹), and text columns without splitting or garbling characters.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Developed for <strong className="text-slate-800">Office of the ZEO Gurez</strong> • By <strong>@Fazel</strong>, assisted by <strong>Firdous Ahmad Magrey - Teacher Zone Gurez</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportZEOAllDetailsToExcel(schools, notices, summaryStats)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => setIsExcelGuideOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
