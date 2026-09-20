import { School, HoiProblem } from '../types';

/**
 * Generates an Excel-ready CSV file with UTF-8 BOM encoding for seamless opening in MS Excel.
 * Covers all fields: Identity, HOI Name & Phone, Grade Rolls, Teachers, Establishment, Planning, and HOI 3-Problem Log.
 */
export function exportZEOComprehensiveExcel(schools: School[]): void {
  const headers = [
    'S.No',
    'U-DISE Code',
    'School Name',
    'Valley Cluster',
    'Category',
    'Level',
    'Gender Intake',
    'Head of Institution (HOI) Name',
    'HOI Designation',
    'HOI Cell / Mobile Number',
    'HOI Email Address',
    'Total Enrolled Students',
    'Pre-Primary Boys',
    'Pre-Primary Girls',
    'Pre-Primary Total',
    'Primary (1-5) Boys',
    'Primary (1-5) Girls',
    'Primary (1-5) Total',
    'Upper Primary (6-8) Boys',
    'Upper Primary (6-8) Girls',
    'Upper Primary (6-8) Total',
    'Aggregate Boys',
    'Aggregate Girls',
    'Total Teachers Posted',
    'Sanctioned Teaching Posts',
    'Vacant Teaching Posts',
    'Subject Teacher Deficit',
    'Pupil-Teacher Ratio (PTR)',
    'Establishment Year',
    'Building Ownership / Type',
    'Land Area (Kanals)',
    'Classrooms Count',
    'Headmaster Office Available',
    'Staff Room Available',
    'Boundary Wall Condition',
    'Drinking Water Source',
    'Electricity / Solar Power',
    'Functional Girls Toilet',
    'CWSN Toilet Available',
    'MDM Kitchen Shed Status',
    'Winter Heating / Bukhari Fuel Quota',
    'Textbook Distribution Status',
    'Samagra Composite Grant Allotted (INR)',
    'Samagra Composite Grant Utilized (INR)',
    'CWSN Enrolled',
    'Inspection Status',
    'HOI Problem 1 - Category',
    'HOI Problem 1 - Title & Summary',
    'HOI Problem 1 - Priority & Status',
    'HOI Problem 2 - Category',
    'HOI Problem 2 - Title & Summary',
    'HOI Problem 2 - Priority & Status',
    'HOI Problem 3 - Category',
    'HOI Problem 3 - Title & Summary',
    'HOI Problem 3 - Priority & Status',
    'ZEO Gurez Action / Remarks'
  ];

  const rows = schools.map((s, idx) => {
    const est = s.establishment;
    const plan = s.planning;
    const p1 = s.hoiProblems && s.hoiProblems[0];
    const p2 = s.hoiProblems && s.hoiProblems[1];
    const p3 = s.hoiProblems && s.hoiProblems[2];

    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    return [
      idx + 1,
      escape(s.code),
      escape(s.name),
      escape(s.cluster),
      escape(s.category),
      escape(s.level),
      escape(s.gender),
      escape(s.hoiName || s.principalName),
      escape(s.hoiDesignation || 'Headmaster'),
      escape(s.hoiPhone || s.principalPhone),
      escape(s.hoiEmail || s.email),
      s.totalStudents,
      s.enrollment?.prePrimary?.boys ?? 0,
      s.enrollment?.prePrimary?.girls ?? 0,
      s.enrollment?.prePrimary?.total ?? 0,
      s.enrollment?.primary?.boys ?? 0,
      s.enrollment?.primary?.girls ?? 0,
      s.enrollment?.primary?.total ?? 0,
      s.enrollment?.upperPrimary?.boys ?? 0,
      s.enrollment?.upperPrimary?.girls ?? 0,
      s.enrollment?.upperPrimary?.total ?? 0,
      s.enrollment?.totalBoys ?? 0,
      s.enrollment?.totalGirls ?? 0,
      s.totalTeachers,
      plan?.sanctionedTeachingPosts ?? s.totalTeachers,
      plan?.vacantTeachingPosts ?? 0,
      escape(plan?.subjectTeacherDeficit || 'None'),
      s.pupilTeacherRatio,
      est?.yearOfEstablishment ?? s.establishedYear,
      escape(est?.buildingStatus || 'Government Owned (Pucca)'),
      est?.landAreaKanals ?? 2.0,
      est?.totalClassrooms ?? s.classroomsCount,
      est?.separateHeadmasterRoom ? 'Yes' : 'No',
      est?.staffRoom ? 'Yes' : 'No',
      escape(est?.boundaryWall || 'Intact'),
      escape(est?.drinkingWaterSource || 'Functional Tap Water'),
      escape(est?.electricityStatus || 'Solar Powered + Grid'),
      est?.girlsToiletFunctional ? 'Yes' : 'No',
      est?.cwsnToiletAvailable ? 'Yes' : 'No',
      escape(est?.mdmKitchenShed || 'Functional Dedicated Shed'),
      escape(plan?.winterHeatingQuota || 'Bukhari & Fuel Allotted'),
      escape(plan?.textbookDistributionStatus || '100% Distributed'),
      plan?.samagraCompositeGrant?.allotted ?? 25000,
      plan?.samagraCompositeGrant?.utilized ?? 25000,
      plan?.cwsnEnrolledCount ?? 0,
      escape(s.inspectionStatus),
      escape(p1?.category || 'N/A'),
      escape(p1 ? `${p1.title} - ${p1.description}` : 'No Problem Logged'),
      escape(p1 ? `[${p1.priority}] ${p1.status}` : 'N/A'),
      escape(p2?.category || 'N/A'),
      escape(p2 ? `${p2.title} - ${p2.description}` : 'No Problem Logged'),
      escape(p2 ? `[${p2.priority}] ${p2.status}` : 'N/A'),
      escape(p3?.category || 'N/A'),
      escape(p3 ? `${p3.title} - ${p3.description}` : 'No Problem Logged'),
      escape(p3 ? `[${p3.priority}] ${p3.status}` : 'N/A'),
      escape(p1?.zeoRemarks || s.notes || '')
    ];
  });

  // UTF-8 BOM \uFEFF ensures Excel renders non-ASCII characters & symbols cleanly without scrambling
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZEO_Gurez_Master_Excel_Registry_88_Schools_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a dedicated HOI Grievance and Problems Register spreadsheet.
 */
export function exportHoiProblemsLogToCSV(schools: School[]): void {
  const headers = [
    'Problem ID',
    'School U-DISE',
    'School Name',
    'Valley Cluster',
    'HOI Name',
    'HOI Cell Number',
    'Problem No.',
    'Category',
    'Priority',
    'Status',
    'Date Reported',
    'Problem Subject',
    'Detailed Description',
    'ZEO Action / Resolution Remarks'
  ];

  const rows: string[][] = [];
  const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  schools.forEach(s => {
    (s.hoiProblems || []).forEach(p => {
      rows.push([
        escape(p.id),
        escape(s.code),
        escape(s.name),
        escape(s.cluster),
        escape(s.hoiName || s.principalName),
        escape(s.hoiPhone || s.principalPhone),
        `Problem ${p.problemNumber}`,
        escape(p.category),
        escape(p.priority),
        escape(p.status),
        escape(p.reportedDate),
        escape(p.title),
        escape(p.description),
        escape(p.zeoRemarks || 'Pending ZEO Review')
      ]);
    });
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZEO_Gurez_HOI_Problems_Register_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a clean, blank Excel template for ZEO field data collection.
 */
export function downloadEmptyZEOExcelTemplate(): void {
  const headers = [
    'U-DISE Code',
    'School Name',
    'Valley Cluster',
    'School Level',
    'HOI Name',
    'HOI Designation',
    'HOI Cell Number',
    'Total Students',
    'Total Teachers',
    'Building Status',
    'Boundary Wall',
    'Drinking Water Source',
    'Winter Heating Status',
    'HOI Problem 1 (Max 3)',
    'HOI Problem 2 (Max 3)',
    'HOI Problem 3 (Max 3)'
  ];

  const sampleRow = [
    '"01160802806"',
    '"MS Banjran"',
    '"Bagtore & Kanzalwan Cluster"',
    '"Upper Primary (Grades 6-8)"',
    '"Mohammad Amin Lone"',
    '"Headmaster"',
    '"+91 94190 12345"',
    '38',
    '4',
    '"Government Owned (Pucca)"',
    '"Damaged by Snow/Avalanche"',
    '"Functional Tap Water"',
    '"Bukhari & Fuel Allotted"',
    '"Roof CGI sheet leakage due to heavy winter snow"',
    '"Need 01 General Line Teacher for Science/Maths"',
    '"Water supply pipeline freezes in winter months"'
  ];

  const csvContent = '\uFEFF' + [headers.join(','), sampleRow.join(',')].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZEO_Gurez_Blank_School_Data_Collection_Template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSchoolsToCSV(schools: School[]): void {
  exportZEOComprehensiveExcel(schools);
}

export function exportSchoolsToJSON(schools: School[]): void {
  const jsonContent = JSON.stringify(schools, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZEO_Gurez_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseSchoolNamesList(rawText: string, existingSchools: School[]): School[] {
  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));

  if (lines.length === 0) return existingSchools;

  const cleanedNames = lines.map(line => {
    return line.replace(/^(\d+[\.\)\-:]\s*|\-\s*|\*\s*)/, '').trim();
  }).filter(name => name.length > 0);

  const updated: School[] = [];

  for (let i = 0; i < cleanedNames.length; i++) {
    const name = cleanedNames[i];
    if (i < existingSchools.length) {
      updated.push({
        ...existingSchools[i],
        name: name
      });
    } else {
      const clusterOptions = ['Bagtore & Kanzalwan Cluster', 'Dawar Central Cluster', 'Kilshay & Chorwan Cluster', 'Tulail Valley Cluster'] as const;
      const cluster = clusterOptions[i % 4];
      const indexNum = String(i + 1).padStart(3, '0');
      updated.push({
        id: `SCH-${indexNum}`,
        code: `011608028${String(800 + i).slice(-3)}`,
        name: name,
        cluster: cluster,
        level: 'Upper Primary (Grades 6-8)',
        category: 'Government / Public',
        gender: 'Co-educational',
        hoiName: `Incharge ${name}`,
        hoiDesignation: 'Headmaster',
        hoiPhone: `+91 94190 ${String(20000 + i * 111).slice(0, 5)}`,
        hoiEmail: `hoi.${indexNum}@jk.gov.in`,
        principalName: `Incharge ${name} (Headmaster)`,
        principalPhone: `+91 94190 ${String(20000 + i * 111).slice(0, 5)}`,
        email: `school.${indexNum}@jk.gov.in`,
        address: `${name}, Zone Gurez, Bandipora, J&K`,
        establishedYear: 1980 + (i % 30),
        totalStudents: 35 + (i * 3) % 80,
        totalTeachers: 4,
        supportStaff: 1,
        classroomsCount: 6,
        pupilTeacherRatio: 12,
        rating: 4.2,
        inspectionStatus: 'Compliant',
        lastInspectionDate: '2026-06-15',
        nextInspectionDue: '2026-11-20',
        facilities: ['Clean Drinking Water', 'Solar Heating Unit', 'Mid-day Meal Kitchen'],
        shift: 'Standard Day',
        hoiProblems: []
      });
    }
  }

  if (cleanedNames.length < existingSchools.length) {
    for (let i = cleanedNames.length; i < existingSchools.length; i++) {
      updated.push(existingSchools[i]);
    }
  }

  return updated;
}

