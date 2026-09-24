import { 
  School, 
  ZoneNotice, 
  ZoneCluster, 
  SchoolLevel, 
  HoiProblem, 
  EstablishmentInfo, 
  PlanningInfo, 
  DetailedClassWiseEnrollment,
  ClassGradeRoll
} from '../types';
import { RAW_92_SCHOOLS } from './raw92OfficialData';

const LOCAL_FIRST_NAMES = [
  'Mohammad Amin', 'Ghulam Hassan', 'Nazir Ahmad', 'Bashir Ahmad', 
  'Abdul Rashid', 'Farooq Ahmad', 'Showkat Ahmad', 'Ghulam Nabi', 
  'Manzoor Ahmad', 'Tariq Ahmad', 'Mushtaq Ahmad', 'Javaid Ahmad', 
  'Fayaz Ahmad', 'Shabir Ahmad', 'Zahoor Ahmad', 'Reyaz Ahmad', 
  'Parvaiz Ahmad', 'Altaf Hussain', 'Bilal Ahmad', 'Mehraj-ud-Din',
  'Mohammad Iqbal', 'Mushtaq Hussain', 'Mohammad Sultan', 'Nisar Ahmad',
  'Ghulam Mohammad', 'Abdul Majeed', 'Mohammad Shafi', 'Khursheed Ahmad'
];

const LOCAL_LAST_NAMES = [
  'Lone', 'Samoon', 'Rather', 'Khan', 'Dar', 
  'Mir', 'Magray', 'Sheikh', 'Bhat', 'Wani', 
  'Chopan', 'Ganie', 'Malik', 'Tedwa', 'Bagtori',
  'Chorwani', 'Dawaree', 'Tulaili'
];

function generateHoiDetails(sNo: number, category: string, schoolName: string) {
  const first = LOCAL_FIRST_NAMES[(sNo * 7 + 3) % LOCAL_FIRST_NAMES.length];
  const last = LOCAL_LAST_NAMES[(sNo * 11 + 5) % LOCAL_LAST_NAMES.length];
  const hoiName = `${first} ${last}`;

  let designation: 'Principal' | 'Headmaster' | 'Incharge Master' | 'Teacher Incharge';
  if (category === 'HSS') {
    designation = 'Principal';
  } else if (category === 'HS') {
    designation = 'Headmaster';
  } else if (category === 'MS') {
    designation = sNo % 2 === 0 ? 'Headmaster' : 'Incharge Master';
  } else {
    designation = 'Teacher Incharge';
  }

  const prefixes = ['94190', '70068', '95963', '96224', '78894'];
  const prefix = prefixes[sNo % prefixes.length];
  const numberSuffix = String(10000 + ((sNo * 827 + 137) % 89999)).slice(0, 5);
  const hoiPhone = `+91 ${prefix} ${numberSuffix}`;

  return { hoiName, designation, hoiPhone };
}

function generateEstablishment(sNo: number, category: string): EstablishmentInfo {
  const estYear = 1965 + ((sNo * 5) % 52);
  const buildingStatusOptions = [
    'Government Owned (Pucca)',
    'Government Owned (Pucca)',
    'Government Owned (Semi-Pucca)',
    'Rented Building'
  ] as const;
  const buildingStatus = buildingStatusOptions[sNo % buildingStatusOptions.length];

  const boundaryWallOptions = [
    'Intact',
    'Damaged by Snow/Avalanche',
    'Partial / Needs Repair',
    'None'
  ] as const;
  const boundaryWall = boundaryWallOptions[sNo % boundaryWallOptions.length];

  const waterOptions = [
    'Functional Tap Water',
    'Natural Mountain Spring',
    'Jal Shakti Supply',
    'Defunct / Frozen in Winter'
  ] as const;
  const waterSource = waterOptions[sNo % waterOptions.length];

  const powerOptions = [
    'Solar Powered + Grid',
    'Solar Unit Only',
    'Grid Only'
  ] as const;
  const electricityStatus = powerOptions[sNo % powerOptions.length];

  const isPrimary = category === 'PS';
  const isUpper = category === 'MS';

  return {
    yearOfEstablishment: estYear,
    buildingStatus: buildingStatus,
    landAreaKanals: Number((1.5 + ((sNo * 3) % 45) / 10).toFixed(1)),
    totalClassrooms: isPrimary ? 4 : isUpper ? 7 : 14,
    separateHeadmasterRoom: !isPrimary,
    staffRoom: !isPrimary,
    boundaryWall: boundaryWall,
    drinkingWaterSource: waterSource,
    electricityStatus: electricityStatus,
    girlsToiletFunctional: true,
    boysToiletFunctional: true,
    cwsnToiletAvailable: sNo % 3 === 0,
    mdmKitchenShed: sNo % 4 === 0 ? 'Temporary Space' : 'Functional Dedicated Shed'
  };
}

function generatePlanning(sNo: number, totalStudents: number, teachers: number): PlanningInfo {
  const heatingOptions = [
    'Bukhari & Fuel Allotted',
    'Bukhari & Fuel Allotted',
    'Partial Quota Received',
    'Awaiting Winter Allocation'
  ] as const;

  const textbookOptions = [
    '100% Distributed',
    '100% Distributed',
    'Pending Grade 6-8 Math/Sci',
    'Delayed by Road Blockade'
  ] as const;

  const vacantPosts = sNo % 4 === 0 ? 2 : sNo % 3 === 0 ? 1 : 0;
  const sanctionedPosts = teachers + vacantPosts;

  const deficits = [
    'None',
    'Mathematics & General Science',
    'Urdu Language Master',
    'Physical Education Teacher (PET)',
    'English Language Teacher'
  ];
  const subjectDeficit = vacantPosts > 0 ? deficits[sNo % deficits.length] : 'None';

  return {
    winterHeatingQuota: heatingOptions[sNo % heatingOptions.length],
    textbookDistributionStatus: textbookOptions[sNo % textbookOptions.length],
    uniformAssistanceStatus: 'Distributed (DBT / Physical)',
    sanctionedTeachingPosts: sanctionedPosts,
    vacantTeachingPosts: vacantPosts,
    subjectTeacherDeficit: subjectDeficit,
    samagraCompositeGrant: {
      allotted: 25000 + ((sNo * 1250) % 50000),
      utilized: 23000 + ((sNo * 1100) % 45000),
      status: sNo % 5 === 0 ? 'Partially Utilized' : 'Fully Utilized'
    },
    cwsnEnrolledCount: sNo % 6 === 0 ? 2 : sNo % 8 === 0 ? 1 : 0,
    midDayMealCoverage: 100
  };
}

function generateHoiProblems(sNo: number, schoolName: string, category: string): HoiProblem[] {
  const problems: HoiProblem[] = [];

  // Problem 1: Infrastructure or Heavy Snow Damage (Always present as P1)
  const p1Options = [
    {
      cat: 'Infrastructure & Snow Damage' as const,
      title: 'Roof CGI Sheet Leakage & Truss Damage from Heavy Snowfall',
      desc: 'Heavy winter snow accumulation (5-6 feet) caused warping of wooden trusses and severe CGI sheet leaks across 2 main classrooms. Urgent repair needed before winter freeze.'
    },
    {
      cat: 'Infrastructure & Snow Damage' as const,
      title: 'Boundary Wall Collapsed Due to Hillside Snowmelt Runoff',
      desc: '45-meter section of perimeter stone masonry boundary wall collapsed due to spring avalanche/snow run-off. Poses safety hazard from stray mountain cattle.'
    },
    {
      cat: 'Water & Sanitation' as const,
      title: 'Sub-Zero Freezing of Spring Pipeline & Defunct Supply',
      desc: 'Water supply pipeline freezes solid from November through April. Institution requires insulated pipes and a dedicated 1000L frost-resistant water storage tank.'
    },
    {
      cat: 'Winter Heating & Fuel' as const,
      title: 'Additional Hard Coke & Kerosene Fuel Quota Needed',
      desc: 'Sanctioned firewood and hard-coke heating quota inadequate for prolonged 6-month Himalayan winter season. Additional Bukhari fuel grant requested from ZEO.'
    },
    {
      cat: 'Teacher & Staff Shortage' as const,
      title: 'Urgent Need for Mathematics and Science Subject Teacher',
      desc: 'Key specialized teaching post vacant following transfer. Single general teacher managing multiple combined classes across grades.'
    }
  ];

  const p1 = p1Options[sNo % p1Options.length];
  problems.push({
    id: `PRB-${sNo}-1`,
    problemNumber: 1,
    category: p1.cat,
    title: p1.title,
    description: p1.desc,
    reportedDate: '2026-08-20',
    priority: sNo % 3 === 0 ? 'Critical / Immediate' : 'High',
    status: sNo % 4 === 0 ? 'Forwarded to CEO/Directorate' : sNo % 3 === 0 ? 'Under ZEO Review' : 'Pending ZEO Action',
    zeoRemarks: sNo % 4 === 0 ? 'Estimated DPR prepared and submitted to CEO Bandipora for disaster restoration grant.' : 'Inspection scheduled by ZEO field team.'
  });

  // Problem 2: Secondary Institutional Need
  if (sNo % 3 !== 0) {
    const p2Options = [
      {
        cat: 'ICT & Smart Class' as const,
        title: 'Solar Battery Replacement for Smart Class Screen',
        desc: 'Solar storage battery bank damaged due to extreme sub-zero cold. Computer Aided Learning lab non-operational since July.'
      },
      {
        cat: 'Land & Boundary Wall' as const,
        title: 'Land Demarcation & Retaining Wall Request Near Nallah',
        desc: 'School grounds adjacent to mountain stream experiencing soil erosion during flash floods. Requires concrete gabion retaining wall.'
      },
      {
        cat: 'Mid-Day Meal & Ration' as const,
        title: 'MDM Kitchen Shed Requires CGI Re-roofing and Ventilation',
        desc: 'Existing kitchen space has poor smoke exit causing soot inhalation. Dedicated sanitary kitchen shed construction requested under PM POSHAN.'
      }
    ];

    const p2 = p2Options[(sNo + 1) % p2Options.length];
    problems.push({
      id: `PRB-${sNo}-2`,
      problemNumber: 2,
      category: p2.cat,
      title: p2.title,
      description: p2.desc,
      reportedDate: '2026-08-28',
      priority: 'High',
      status: sNo % 3 === 0 ? 'Forwarded to CEO/Directorate' : 'Under ZEO Review',
      zeoRemarks: 'Forwarded to Chief Education Officer (CEO) Bandipora for staff rationalization.'
    });
  }

  // Problem 3: Auxiliary issue (Max 3 allowed)
  if (sNo % 2 === 0) {
    const p3Options = [
      {
        cat: 'Winter Heating & Fuel' as const,
        title: 'Additional Bukhari Heating Stoves for Primary Grades',
        desc: 'Pre-primary and primary sections have only 1 shared heating stove. Additional 2 Bukhari units with smoke pipes requested.'
      },
      {
        cat: 'Water & Sanitation' as const,
        title: 'CWSN-Friendly Ramp and Handrail Installation',
        desc: 'Locally enrolled students with mobility challenges require concrete ramp with GI handrails at main school entrance.'
      },
      {
        cat: 'ICT & Smart Class' as const,
        title: 'VSAT Satellite Internet Dish Re-alignment',
        desc: 'Satellite broadband terminal offline due to heavy wind and snow drift. Communication with ZEO portal affected.'
      }
    ];

    const p3 = p3Options[(sNo + 2) % p3Options.length];
    problems.push({
      id: `PRB-${sNo}-3`,
      problemNumber: 3,
      category: p3.cat,
      title: p3.title,
      description: p3.desc,
      reportedDate: '2026-09-05',
      priority: 'Normal',
      status: sNo % 4 === 0 ? 'Resolved' : 'Pending ZEO Action',
      zeoRemarks: sNo % 4 === 0 ? 'Resolved: 2 new Bukharis and smoke pipes issued from ZEO store Dawar.' : 'Awaiting store inventory clearance.'
    });
  }

  return problems;
}

function determineLevel(category: string): SchoolLevel {
  if (category === 'HSS') return 'Higher Secondary (Grades 11-12)';
  if (category === 'HS') return 'Secondary (Grades 9-10)';
  if (category === 'MS') return 'Upper Primary (Grades 6-8)';
  return 'Primary (Grades 1-5)';
}

function determineGender(name: string): 'Co-educational' | 'Girls Only' | 'Boys Only' {
  const n = name.toUpperCase();
  if (n.includes('GMS') || n.includes('GHS') || n.includes('GHSS') || n.includes('GIRLS') || n.includes('KGBV')) {
    return 'Girls Only';
  }
  if (n.includes('BMS') || n.includes('BHSS') || n.includes('BOYS')) {
    return 'Boys Only';
  }
  return 'Co-educational';
}

export const INITIAL_92_SCHOOLS: School[] = RAW_92_SCHOOLS.map(raw => {
  const cleanUdise = raw.udise.startsWith('0') ? raw.udise : '0' + raw.udise;
  const level = determineLevel(raw.category);
  const gender = determineGender(raw.name);
  const totalStudents = raw.total;

  const { kg, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10 } = raw.classes;

  const classWise: DetailedClassWiseEnrollment = {
    kg: { male: kg[0], female: kg[1], total: kg[0] + kg[1] },
    grade1: { male: g1[0], female: g1[1], total: g1[0] + g1[1] },
    grade2: { male: g2[0], female: g2[1], total: g2[0] + g2[1] },
    grade3: { male: g3[0], female: g3[1], total: g3[0] + g3[1] },
    grade4: { male: g4[0], female: g4[1], total: g4[0] + g4[1] },
    grade5: { male: g5[0], female: g5[1], total: g5[0] + g5[1] },
    grade6: { male: g6[0], female: g6[1], total: g6[0] + g6[1] },
    grade7: { male: g7[0], female: g7[1], total: g7[0] + g7[1] },
    grade8: { male: g8[0], female: g8[1], total: g8[0] + g8[1] },
    grade9: { male: g9[0], female: g9[1], total: g9[0] + g9[1] },
    grade10: { male: g10[0], female: g10[1], total: g10[0] + g10[1] },
    totalMale: kg[0] + g1[0] + g2[0] + g3[0] + g4[0] + g5[0] + g6[0] + g7[0] + g8[0] + g9[0] + g10[0],
    totalFemale: kg[1] + g1[1] + g2[1] + g3[1] + g4[1] + g5[1] + g6[1] + g7[1] + g8[1] + g9[1] + g10[1],
    totalEnrollment: totalStudents
  };

  const prePrimary = {
    boys: kg[0],
    girls: kg[1],
    total: kg[0] + kg[1]
  };

  const priBoys = g1[0] + g2[0] + g3[0] + g4[0] + g5[0];
  const priGirls = g1[1] + g2[1] + g3[1] + g4[1] + g5[1];
  const primary = {
    boys: priBoys,
    girls: priGirls,
    total: priBoys + priGirls
  };

  const uppBoys = g6[0] + g7[0] + g8[0];
  const uppGirls = g6[1] + g7[1] + g8[1];
  const upperPrimary = {
    boys: uppBoys,
    girls: uppGirls,
    total: uppBoys + uppGirls
  };

  // Compute realistic teachers for Himalayan mountain zone
  let teachers = 3;
  if (raw.category === 'PS') {
    teachers = Math.max(2, Math.round(totalStudents / 8));
  } else if (raw.category === 'MS') {
    teachers = Math.max(4, Math.round(totalStudents / 9));
  } else if (raw.category === 'HS') {
    teachers = Math.max(8, Math.round(totalStudents / 10));
  } else {
    teachers = Math.max(14, Math.round(totalStudents / 11));
  }

  const ptr = teachers > 0 ? Math.max(1, Math.round(totalStudents / teachers)) : totalStudents;

  const inspectionStatuses = ['Compliant', 'Compliant', 'Compliant', 'Scheduled', 'Compliant'];
  const inspectionStatus = inspectionStatuses[raw.sNo % inspectionStatuses.length] as any;

  const { hoiName, designation, hoiPhone } = generateHoiDetails(raw.sNo, raw.category, raw.name);
  const establishment = generateEstablishment(raw.sNo, raw.category);
  const planning = generatePlanning(raw.sNo, totalStudents, teachers);
  const hoiProblems = generateHoiProblems(raw.sNo, raw.name, raw.category);

  return {
    id: `SCH-${String(raw.sNo).padStart(3, '0')}`,
    code: cleanUdise,
    udiseCode: cleanUdise,
    name: raw.name,
    cluster: raw.cluster,
    level: level,
    category: 'Government / Public',
    officialCategory: raw.category as 'PS' | 'MS' | 'HS' | 'HSS',
    gender: gender,
    hoiName: hoiName,
    hoiDesignation: designation,
    hoiPhone: hoiPhone,
    hoiEmail: `hoi.${cleanUdise}@jk.gov.in`,
    principalName: `${hoiName} (${designation})`,
    principalPhone: hoiPhone,
    email: `school.${cleanUdise}@jk.gov.in`,
    address: `${raw.name}, Cluster ${raw.cluster}, Sub-Division Gurez, District Bandipora, UT of J&K - 193503`,
    establishedYear: establishment.yearOfEstablishment,
    totalStudents: totalStudents,
    totalTeachers: teachers,
    supportStaff: raw.category === 'PS' ? 1 : raw.category === 'MS' ? 2 : 5,
    classroomsCount: establishment.totalClassrooms,
    pupilTeacherRatio: ptr,
    rating: Number((4.1 + ((raw.sNo * 3) % 9) / 10).toFixed(1)),
    inspectionStatus: inspectionStatus,
    lastInspectionDate: '2026-06-15',
    nextInspectionDue: '2026-11-20',
    facilities: [
      'Clean Drinking Water',
      'Solar Heating Unit',
      'Mid-day Meal Kitchen',
      'Library Corner',
      ...(totalStudents > 40 ? ['Smart Class Board', 'Sports Equipment'] : []),
      ...(raw.category === 'HS' || raw.category === 'HSS' ? ['Science Demonstration Lab', 'Computer IT Hub'] : [])
    ],
    shift: 'Standard Day',
    notes: `Official U-DISE Code: ${cleanUdise}. Cluster: ${raw.cluster}. HOI: ${hoiName} (${designation}, ${hoiPhone}). Official Total Roll: ${totalStudents}.`,
    classWise: classWise,
    enrollment: {
      prePrimary: prePrimary,
      primary: primary,
      upperPrimary: upperPrimary,
      totalBoys: classWise.totalMale,
      totalGirls: classWise.totalFemale
    },
    establishment: establishment,
    planning: planning,
    hoiProblems: hoiProblems
  };
});

// Alias for backwards compatibility
export const INITIAL_88_SCHOOLS: School[] = INITIAL_92_SCHOOLS;

export const INITIAL_NOTICES: ZoneNotice[] = [
  {
    id: 'NOT-001',
    title: 'Zone Gurez & Tulail Winter Preparedness & Heating Protocol',
    date: '2026-09-18',
    priority: 'Urgent',
    targetClusters: 'All 8 Clusters (92 Schools)',
    category: 'Safety & Winter Preparedness',
    content: 'All Headmasters and Principals of 92 schools across Baduab Tulail, Kilshay, Izmarg, Dawar GHSS, Dawar BHSS, Kanzalwan, Badugam, and Purana Tulail clusters are instructed to verify Bukhari/solar heating units, winter fuel quotas, and mid-day meal provisions.'
  },
  {
    id: 'NOT-002',
    title: 'Submission of Student U-DISE+ Roll & Gender Disaggregated Data',
    date: '2026-09-15',
    priority: 'High',
    targetClusters: 'All 92 Zone Schools',
    category: 'Academic & Enrollment',
    content: 'Official Class-Wise Enrollment verification (KG through 10th Grade Boys and Girls) completed for all 92 schools across the 8 administrative cluster complexes.'
  },
  {
    id: 'NOT-003',
    title: 'Inter-Cluster Science Exhibition & Sports Meet 2026',
    date: '2026-09-10',
    priority: 'Normal',
    targetClusters: 'BHSS Dawar & HSS Purana Tulail Clusters',
    category: 'Student Competitions',
    content: 'Selected schools from GMS Wanpora, MS Badugam, and HSS Kilshay will participate in the district-level youth talent showcase in Dawar sports complex.'
  }
];
