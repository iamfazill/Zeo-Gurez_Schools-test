import * as XLSX from 'xlsx';
import { School, ZoneNotice, ZoneSummaryStats } from '../types';

/**
 * Generates and downloads a complete, professional multi-sheet Excel Workbook (.xlsx)
 * storing all details of the ZEO Gurez Educational Portal.
 * 
 * Sheets included:
 * 1. 🏫 92 Schools Master Registry (Comprehensive fields: Identity, HOI, Staff, Infrastructure, Planning, Grants, Problems)
 * 2. 📊 Official Class-Wise Rolls (KG to 10th Male/Female breakdown matching official ZEO records)
 * 3. ⚠️ HOI Problems & Grievance Log (Max 3 issues per institution with priority & ZEO review status)
 * 4. 📜 Zone Directives & Circulars (Official administrative notifications & orders)
 * 5. 📈 Zone Statistical Overview (Zone totals, cluster breakdown, PTR, infrastructure metrics)
 */
export function exportZEOAllDetailsToExcel(
  schools: School[], 
  notices: ZoneNotice[] = [],
  summaryStats?: ZoneSummaryStats
): void {
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: 92 Schools Master Registry
  // -------------------------------------------------------------
  const masterHeaders = [
    'S.No',
    'U-DISE Code',
    'School Name',
    'Cluster Complex',
    'Official Category',
    'Education Level',
    'Gender Intake',
    'Full Campus Address',
    'Operating Shift',
    'Performance Rating (out of 5)',
    'Head of Institution (HOI) Name',
    'HOI Designation',
    'HOI Mobile / Cell Number',
    'HOI Official Email',
    'Total Enrolled Students',
    'Aggregate Boys (Roll)',
    'Aggregate Girls (Roll)',
    'Total Faculty Posted',
    'Sanctioned Teaching Posts',
    'Vacant Teaching Posts',
    'Subject Teacher Deficit',
    'Pupil-Teacher Ratio (PTR)',
    'Support Staff Posted',
    // Class-wise roll KG to 10th
    'KG Male', 'KG Female', 'KG Total',
    '1st Male', '1st Female', '1st Total',
    '2nd Male', '2nd Female', '2nd Total',
    '3rd Male', '3rd Female', '3rd Total',
    '4th Male', '4th Female', '4th Total',
    '5th Male', '5th Female', '5th Total',
    '6th Male', '6th Female', '6th Total',
    '7th Male', '7th Female', '7th Total',
    '8th Male', '8th Female', '8th Total',
    '9th Male', '9th Female', '9th Total',
    '10th Male', '10th Female', '10th Total',
    // Establishment & Infrastructure
    'Establishment Year',
    'Building Ownership Status',
    'Land Area (Kanals)',
    'Total Classrooms Count',
    'Dedicated HOI / Headmaster Office',
    'Staff Room Available',
    'Boundary Wall Condition',
    'Drinking Water Facility',
    'Electricity / Solar Power System',
    'Functional Girls Toilet',
    'Functional Boys Toilet',
    'CWSN Disabled-Friendly Toilet',
    'MDM Dedicated Kitchen Shed',
    'Playground Available',
    // Planning & Welfare
    'Mid-Day Meal Coverage (%)',
    'Winter Heating / Bukhari Fuel Quota',
    'Free Textbook Distribution Status',
    'Free Uniform Assistance Status',
    'Samagra Composite Grant Allotted (INR)',
    'Samagra Composite Grant Utilized (INR)',
    'Samagra Grant Utilization Status',
    'CWSN Children Enrolled',
    'Inspection Verification Status',
    'Last Inspection Date',
    'Next Inspection Due Date',
    'Active School Amenities & Facilities',
    // HOI Problems 1, 2, 3
    'HOI Issue 1 - Category',
    'HOI Issue 1 - Title',
    'HOI Issue 1 - Details',
    'HOI Issue 1 - Priority & Status',
    'HOI Issue 2 - Category',
    'HOI Issue 2 - Title',
    'HOI Issue 2 - Details',
    'HOI Issue 2 - Priority & Status',
    'HOI Issue 3 - Category',
    'HOI Issue 3 - Title',
    'HOI Issue 3 - Details',
    'HOI Issue 3 - Priority & Status',
    'ZEO Administration Remarks & Action Plan'
  ];

  const masterRows = schools.map((s, idx) => {
    const est = s.establishment;
    const plan = s.planning;
    const cw = s.classWise;
    const p1 = s.hoiProblems?.[0];
    const p2 = s.hoiProblems?.[1];
    const p3 = s.hoiProblems?.[2];

    const kgM = cw?.kg?.male ?? 0;
    const kgF = cw?.kg?.female ?? 0;
    const g1M = cw?.grade1?.male ?? 0;
    const g1F = cw?.grade1?.female ?? 0;
    const g2M = cw?.grade2?.male ?? 0;
    const g2F = cw?.grade2?.female ?? 0;
    const g3M = cw?.grade3?.male ?? 0;
    const g3F = cw?.grade3?.female ?? 0;
    const g4M = cw?.grade4?.male ?? 0;
    const g4F = cw?.grade4?.female ?? 0;
    const g5M = cw?.grade5?.male ?? 0;
    const g5F = cw?.grade5?.female ?? 0;
    const g6M = cw?.grade6?.male ?? 0;
    const g6F = cw?.grade6?.female ?? 0;
    const g7M = cw?.grade7?.male ?? 0;
    const g7F = cw?.grade7?.female ?? 0;
    const g8M = cw?.grade8?.male ?? 0;
    const g8F = cw?.grade8?.female ?? 0;
    const g9M = cw?.grade9?.male ?? 0;
    const g9F = cw?.grade9?.female ?? 0;
    const g10M = cw?.grade10?.male ?? 0;
    const g10F = cw?.grade10?.female ?? 0;

    return [
      idx + 1,
      s.code,
      s.name,
      s.cluster,
      s.category,
      s.level,
      s.gender,
      s.address || `${s.name}, Gurez Zone`,
      s.shift || 'Standard Day',
      s.rating || 4.5,
      s.hoiName || s.principalName,
      s.hoiDesignation || 'Headmaster',
      s.hoiPhone || s.principalPhone,
      s.hoiEmail || s.email,
      s.totalStudents,
      s.enrollment?.totalBoys ?? cw?.totalMale ?? Math.round(s.totalStudents * 0.52),
      s.enrollment?.totalGirls ?? cw?.totalFemale ?? Math.round(s.totalStudents * 0.48),
      s.totalTeachers,
      plan?.sanctionedTeachingPosts ?? s.totalTeachers,
      plan?.vacantTeachingPosts ?? 0,
      plan?.subjectTeacherDeficit || 'None',
      s.pupilTeacherRatio,
      s.supportStaff || 1,
      // KG
      kgM, kgF, kgM + kgF,
      // 1st
      g1M, g1F, g1M + g1F,
      // 2nd
      g2M, g2F, g2M + g2F,
      // 3rd
      g3M, g3F, g3M + g3F,
      // 4th
      g4M, g4F, g4M + g4F,
      // 5th
      g5M, g5F, g5M + g5F,
      // 6th
      g6M, g6F, g6M + g6F,
      // 7th
      g7M, g7F, g7M + g7F,
      // 8th
      g8M, g8F, g8M + g8F,
      // 9th
      g9M, g9F, g9M + g9F,
      // 10th
      g10M, g10F, g10M + g10F,
      // Establishment
      est?.yearOfEstablishment ?? s.establishedYear,
      est?.buildingStatus || 'Government Owned (Pucca)',
      est?.landAreaKanals ?? 2.0,
      est?.totalClassrooms ?? s.classroomsCount,
      est?.separateHeadmasterRoom ? 'Yes' : 'No',
      est?.staffRoom ? 'Yes' : 'No',
      est?.boundaryWall || 'Intact',
      est?.drinkingWaterSource || 'Functional Tap Water',
      est?.electricityStatus || 'Solar Powered + Grid',
      est?.girlsToiletFunctional ? 'Yes' : 'No',
      est?.boysToiletFunctional ? 'Yes' : 'No',
      est?.cwsnToiletAvailable ? 'Yes' : 'No',
      est?.mdmKitchenShed || 'Functional Dedicated Shed',
      est?.playgroundAvailable ? 'Yes' : 'No',
      // Planning
      plan?.midDayMealCoverage ?? 100,
      plan?.winterHeatingQuota || 'Bukhari & Fuel Allotted',
      plan?.textbookDistributionStatus || '100% Distributed',
      plan?.uniformAssistanceStatus || 'Distributed (DBT / Physical)',
      plan?.samagraCompositeGrant?.allotted ?? 25000,
      plan?.samagraCompositeGrant?.utilized ?? 25000,
      plan?.samagraCompositeGrant?.status || 'Fully Utilized',
      plan?.cwsnEnrolledCount ?? 0,
      s.inspectionStatus,
      s.lastInspectionDate || '2026-06-15',
      s.nextInspectionDue || '2026-11-20',
      (s.facilities || []).join('; '),
      // Problems
      p1?.category || 'None',
      p1?.title || 'None',
      p1?.description || 'No issue registered',
      p1 ? `[${p1.priority}] ${p1.status}` : 'N/A',
      p2?.category || 'None',
      p2?.title || 'None',
      p2?.description || 'No issue registered',
      p2 ? `[${p2.priority}] ${p2.status}` : 'N/A',
      p3?.category || 'None',
      p3?.title || 'None',
      p3?.description || 'No issue registered',
      p3 ? `[${p3.priority}] ${p3.status}` : 'N/A',
      p1?.zeoRemarks || s.notes || 'Routine academic session in progress'
    ];
  });

  const wsMaster = XLSX.utils.aoa_to_sheet([masterHeaders, ...masterRows]);
  XLSX.utils.book_append_sheet(wb, wsMaster, '92 Schools Master Registry');

  // -------------------------------------------------------------
  // Sheet 2: Official Class-Wise Rolls (KG to 10th Matching Image)
  // -------------------------------------------------------------
  const classHeaders = [
    'S.No',
    'Valley Cluster',
    'Name of School',
    'Category',
    'U-DISE Code',
    'KG Boys', 'KG Girls', 'KG Total',
    '1st Boys', '1st Girls', '1st Total',
    '2nd Boys', '2nd Girls', '2nd Total',
    '3rd Boys', '3rd Girls', '3rd Total',
    '4th Boys', '4th Girls', '4th Total',
    '5th Boys', '5th Girls', '5th Total',
    '6th Boys', '6th Girls', '6th Total',
    '7th Boys', '7th Girls', '7th Total',
    '8th Boys', '8th Girls', '8th Total',
    '9th Boys', '9th Girls', '9th Total',
    '10th Boys', '10th Girls', '10th Total',
    'Grand Total Boys',
    'Grand Total Girls',
    'Total Enrolled Roll'
  ];

  const classRows = schools.map((s, idx) => {
    const cw = s.classWise;
    const kgM = cw?.kg?.male ?? 0;
    const kgF = cw?.kg?.female ?? 0;
    const g1M = cw?.grade1?.male ?? 0;
    const g1F = cw?.grade1?.female ?? 0;
    const g2M = cw?.grade2?.male ?? 0;
    const g2F = cw?.grade2?.female ?? 0;
    const g3M = cw?.grade3?.male ?? 0;
    const g3F = cw?.grade3?.female ?? 0;
    const g4M = cw?.grade4?.male ?? 0;
    const g4F = cw?.grade4?.female ?? 0;
    const g5M = cw?.grade5?.male ?? 0;
    const g5F = cw?.grade5?.female ?? 0;
    const g6M = cw?.grade6?.male ?? 0;
    const g6F = cw?.grade6?.female ?? 0;
    const g7M = cw?.grade7?.male ?? 0;
    const g7F = cw?.grade7?.female ?? 0;
    const g8M = cw?.grade8?.male ?? 0;
    const g8F = cw?.grade8?.female ?? 0;
    const g9M = cw?.grade9?.male ?? 0;
    const g9F = cw?.grade9?.female ?? 0;
    const g10M = cw?.grade10?.male ?? 0;
    const g10F = cw?.grade10?.female ?? 0;

    const totM = kgM + g1M + g2M + g3M + g4M + g5M + g6M + g7M + g8M + g9M + g10M;
    const totF = kgF + g1F + g2F + g3F + g4F + g5F + g6F + g7F + g8F + g9F + g10F;

    return [
      idx + 1,
      s.cluster,
      s.name,
      s.category,
      s.code,
      kgM, kgF, kgM + kgF,
      g1M, g1F, g1M + g1F,
      g2M, g2F, g2M + g2F,
      g3M, g3F, g3M + g3F,
      g4M, g4F, g4M + g4F,
      g5M, g5F, g5M + g5F,
      g6M, g6F, g6M + g6F,
      g7M, g7F, g7M + g7F,
      g8M, g8F, g8M + g8F,
      g9M, g9F, g9M + g9F,
      g10M, g10F, g10M + g10F,
      totM,
      totF,
      s.totalStudents
    ];
  });

  const wsClass = XLSX.utils.aoa_to_sheet([classHeaders, ...classRows]);
  XLSX.utils.book_append_sheet(wb, wsClass, 'Official Class Rolls (KG-10)');

  // -------------------------------------------------------------
  // Sheet 3: HOI Problems & Grievances Register
  // -------------------------------------------------------------
  const probHeaders = [
    'Log ID',
    'U-DISE Code',
    'School Name',
    'Cluster Complex',
    'HOI Name',
    'HOI Phone / Mobile',
    'Problem No.',
    'Problem Category',
    'Severity / Priority',
    'Resolution Status',
    'Issue Title',
    'Detailed Description',
    'Date Reported',
    'ZEO Gurez Action Taken / Remarks'
  ];

  const probRows: any[] = [];
  schools.forEach(s => {
    (s.hoiProblems || []).forEach(p => {
      probRows.push([
        p.id,
        s.code,
        s.name,
        s.cluster,
        s.hoiName || s.principalName,
        s.hoiPhone || s.principalPhone,
        `Issue #${p.problemNumber}`,
        p.category,
        p.priority,
        p.status,
        p.title,
        p.description,
        p.reportedDate || '2026-04-10',
        p.zeoRemarks || 'Awaiting site review'
      ]);
    });
  });

  const wsProb = XLSX.utils.aoa_to_sheet([probHeaders, ...probRows]);
  XLSX.utils.book_append_sheet(wb, wsProb, 'HOI Problems Register');

  // -------------------------------------------------------------
  // Sheet 4: Official Zone Directives & Circulars
  // -------------------------------------------------------------
  const noticeHeaders = [
    'Notice ID',
    'Issue Date',
    'Priority Level',
    'Category',
    'Title / Directive Subject',
    'Target Clusters',
    'Directive Content'
  ];

  const noticeRows = notices.map(n => [
    n.id,
    n.date || '2026-06-01',
    n.priority || 'Normal',
    n.category || 'General Administration',
    n.title,
    n.targetClusters || 'All Valley Clusters',
    n.content
  ]);

  const wsNotices = XLSX.utils.aoa_to_sheet([noticeHeaders, ...noticeRows]);
  XLSX.utils.book_append_sheet(wb, wsNotices, 'Zone Circulars & Directives');

  // -------------------------------------------------------------
  // Sheet 5: Zone Executive Summary & Statistics
  // -------------------------------------------------------------
  const totalStudents = schools.reduce((acc, s) => acc + (s.totalStudents || 0), 0);
  const totalTeachers = schools.reduce((acc, s) => acc + (s.totalTeachers || 0), 0);
  const avgPTR = totalTeachers > 0 ? (totalStudents / totalTeachers).toFixed(1) : '0';

  const summaryData = [
    ['ZONAL EDUCATION OFFICE, GUREZ (DISTRICT BANDIPORA, J&K)'],
    ['MASTER SYSTEM DATABASE AUDIT & COMPLETE REGISTRY EXPORT'],
    ['Export Timestamp:', new Date().toLocaleString()],
    ['Authorized Access:', 'ZEO Administrator (Protected Export)'],
    [''],
    ['KEY PERFORMANCE INDICATOR', 'METRIC VALUE'],
    ['Total Registered Educational Institutions', schools.length],
    ['Total Enrolled Students (Boys & Girls)', totalStudents],
    ['Total Faculty & Teaching Staff Posted', totalTeachers],
    ['Average Pupil-Teacher Ratio (PTR)', `${avgPTR}:1`],
    ['Total Clusters Managed', 8],
    ['Total Institutional Problems Logged', probRows.length],
    ['Total Official Circulars / Orders', notices.length],
    [''],
    ['CLUSTER-WISE INSTITUTION BREAKDOWN'],
    ['Cluster Name', 'Number of Schools', 'Total Students', 'Total Teachers', 'Average PTR']
  ];

  // Group by cluster
  const clusterMap: Record<string, { schools: number; students: number; teachers: number }> = {};
  schools.forEach(s => {
    if (!clusterMap[s.cluster]) {
      clusterMap[s.cluster] = { schools: 0, students: 0, teachers: 0 };
    }
    clusterMap[s.cluster].schools += 1;
    clusterMap[s.cluster].students += s.totalStudents || 0;
    clusterMap[s.cluster].teachers += s.totalTeachers || 0;
  });

  Object.entries(clusterMap).forEach(([cluster, data]) => {
    const ptr = data.teachers > 0 ? (data.students / data.teachers).toFixed(1) : '0';
    summaryData.push([cluster, data.schools, data.students, data.teachers, `${ptr}:1`]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Zone Executive Summary');

  // Generate and trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `ZEO_Gurez_Master_Database_Complete_${dateStr}.xlsx`);
}
