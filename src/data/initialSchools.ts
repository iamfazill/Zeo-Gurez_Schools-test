import { School, ZoneNotice, ZoneCluster, SchoolLevel, HoiProblem, EstablishmentInfo, PlanningInfo } from '../types';
import { GUREZ_RAW_SCHOOLS, RawZoneSchool } from './gurezZoneData';

function determineCluster(name: string): ZoneCluster {
  const n = name.toLowerCase();
  if (
    n.includes('bagtore') || 
    n.includes('tarbal') || 
    n.includes('izmarg') || 
    n.includes('dangan') || 
    n.includes('kanzalwan') || 
    n.includes('nayal') || 
    n.includes('jalindora') || 
    n.includes('chuntiwari') || 
    n.includes('kuragbal')
  ) {
    return 'Bagtore & Kanzalwan Cluster';
  }

  if (
    n.includes('dawar') || 
    n.includes('markoot') || 
    n.includes('wanpora') || 
    n.includes('khandyal') || 
    n.includes('badwan') || 
    n.includes('faqirpora') || 
    n.includes('khopree') || 
    n.includes('mastan')
  ) {
    return 'Dawar Central Cluster';
  }

  if (
    n.includes('kilshay') || 
    n.includes('burnie') || 
    n.includes('kashpot') || 
    n.includes('chorwan') || 
    n.includes('achoora') || 
    n.includes('bulo neril') || 
    n.includes('bayant') || 
    n.includes('frachat')
  ) {
    return 'Kilshay & Chorwan Cluster';
  }

  return 'Tulail Valley Cluster';
}

function determineLevel(name: string): SchoolLevel {
  const n = name.trim();
  if (n.startsWith('HSS')) return 'Higher Secondary (Grades 11-12)';
  if (n.startsWith('HS')) return 'Secondary (Grades 9-10)';
  if (n.startsWith('PS')) return 'Primary (Grades 1-5)';
  return 'Upper Primary (Grades 6-8)';
}

function determineGender(name: string): 'Co-educational' | 'Girls Only' | 'Boys Only' {
  const n = name.trim();
  if (n.startsWith('GMS') || n.includes('Girls')) return 'Girls Only';
  if (n.startsWith('BMS') || n.includes('Boys')) return 'Boys Only';
  return 'Co-educational';
}

const LOCAL_FIRST_NAMES = [
  'Mohammad Amin', 'Ghulam Hassan', 'Nazir Ahmad', 'Bashir Ahmad', 
  'Abdul Rashid', 'Farooq Ahmad', 'Showkat Ahmad', 'Ghulam Nabi', 
  'Manzoor Ahmad', 'Tariq Ahmad', 'Mushtaq Ahmad', 'Javaid Ahmad', 
  'Fayaz Ahmad', 'Shabir Ahmad', 'Zahoor Ahmad', 'Reyaz Ahmad', 
  'Parvaiz Ahmad', 'Altaf Hussain', 'Bilal Ahmad', 'Mehraj-ud-Din'
];

const LOCAL_LAST_NAMES = [
  'Lone', 'Samoon', 'Rather', 'Khan', 'Dar', 
  'Mir', 'Magray', 'Sheikh', 'Bhat', 'Wani', 
  'Chopan', 'Ganie', 'Malik', 'Tedwa', 'Bagtori'
];

function generateHoiDetails(sNo: number, level: SchoolLevel) {
  const first = LOCAL_FIRST_NAMES[(sNo * 7) % LOCAL_FIRST_NAMES.length];
  const last = LOCAL_LAST_NAMES[(sNo * 11) % LOCAL_LAST_NAMES.length];
  const hoiName = `${first} ${last}`;

  let designation: 'Principal' | 'Headmaster' | 'Incharge Master' | 'Teacher Incharge';
  if (level === 'Higher Secondary (Grades 11-12)') {
    designation = 'Principal';
  } else if (level === 'Secondary (Grades 9-10)') {
    designation = 'Headmaster';
  } else if (level === 'Upper Primary (Grades 6-8)') {
    designation = sNo % 2 === 0 ? 'Headmaster' : 'Incharge Master';
  } else {
    designation = 'Teacher Incharge';
  }

  const prefixes = ['94190', '70068', '95963', '96224'];
  const prefix = prefixes[sNo % prefixes.length];
  const numberSuffix = String(10000 + ((sNo * 827) % 89999)).slice(0, 5);
  const hoiPhone = `+91 ${prefix} ${numberSuffix}`;

  return { hoiName, designation, hoiPhone };
}

function generateEstablishment(sNo: number, level: SchoolLevel): EstablishmentInfo {
  const estYear = 1962 + ((sNo * 5) % 55);
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

  const isPrimary = level === 'Primary (Grades 1-5)';
  const isUpper = level === 'Upper Primary (Grades 6-8)';

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

function generateHoiProblems(sNo: number, schoolName: string, level: SchoolLevel): HoiProblem[] {
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
      title: 'Shortage of Hardwood Fuel & Bukhari Heating Units',
      desc: 'Existing bukharis are rusted and fuel wood quota sanctioned is insufficient for harsh 6-month winter sub-zero temperatures (-18°C).'
    }
  ];

  const p1 = p1Options[sNo % p1Options.length];
  problems.push({
    id: `PRB-${sNo}-1`,
    problemNumber: 1,
    category: p1.cat,
    title: p1.title,
    description: p1.desc,
    reportedDate: '2026-08-15',
    priority: sNo % 3 === 0 ? 'Critical / Immediate' : 'High',
    status: sNo % 2 === 0 ? 'Pending ZEO Action' : 'Under ZEO Review',
    zeoRemarks: 'Inspected by ZEO field team; repair proposal submitted to District Development Commissioner.'
  });

  // Problem 2: Staffing or Academic (Present in most schools)
  if (sNo % 5 !== 0) {
    const p2Options = [
      {
        cat: 'Teacher & Staff Shortage' as const,
        title: 'Urgent Requirement of Mathematics & Science Master',
        desc: 'Post of Teacher/Master in Science & Mathematics has remained unfilled since annual rationalization in May 2026. Upper primary students severely impacted.'
      },
      {
        cat: 'ICT & Smart Class' as const,
        title: 'Solar Inverter Battery Defunct for CAL/Smart Classroom',
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

export const INITIAL_88_SCHOOLS: School[] = GUREZ_RAW_SCHOOLS.map((raw: RawZoneSchool) => {
  const cluster = determineCluster(raw.name);
  const level = determineLevel(raw.name);
  const gender = determineGender(raw.name);

  const preTotal = raw.pre[2];
  const priTotal = raw.pri[2];
  const uppTotal = raw.upp[2];
  const totalBoys = raw.pre[0] + raw.pri[0] + raw.upp[0];
  const totalGirls = raw.pre[1] + raw.pri[1] + raw.upp[1];
  const totalStudents = Math.max(1, preTotal + priTotal + uppTotal);

  // Compute realistic teachers for Himalayan mountain zone
  let teachers = 3;
  if (level === 'Primary (Grades 1-5)') {
    teachers = Math.max(2, Math.round(totalStudents / 8));
  } else if (level === 'Upper Primary (Grades 6-8)') {
    teachers = Math.max(4, Math.round(totalStudents / 9));
  } else if (level === 'Secondary (Grades 9-10)') {
    teachers = Math.max(8, Math.round(totalStudents / 10));
  } else {
    teachers = Math.max(14, Math.round(totalStudents / 11));
  }

  const ptr = Math.max(1, Math.round(totalStudents / teachers));

  const inspectionStatuses = ['Compliant', 'Compliant', 'Compliant', 'Scheduled', 'Compliant'];
  const inspectionStatus = inspectionStatuses[raw.sNo % inspectionStatuses.length] as any;

  const { hoiName, designation, hoiPhone } = generateHoiDetails(raw.sNo, level);
  const establishment = generateEstablishment(raw.sNo, level);
  const planning = generatePlanning(raw.sNo, totalStudents, teachers);
  const hoiProblems = generateHoiProblems(raw.sNo, raw.name, level);

  return {
    id: `SCH-${String(raw.sNo).padStart(3, '0')}`,
    code: raw.udise,
    udiseCode: raw.udise,
    name: raw.name,
    cluster: cluster,
    level: level,
    category: raw.name.includes('Goodwill') ? 'Private Unaided' : 'Government / Public',
    gender: gender,
    hoiName: hoiName,
    hoiDesignation: designation,
    hoiPhone: hoiPhone,
    hoiEmail: `hoi.${raw.udise}@jk.gov.in`,
    principalName: `${hoiName} (${designation})`,
    principalPhone: hoiPhone,
    email: `school.${raw.udise}@jk.gov.in`,
    address: `${raw.name.replace(/^(MS|PS|BMS|GMS|HS|HSS)\s+/, '')}, Zone Gurez / Tulail, Bandipora, J&K`,
    establishedYear: establishment.yearOfEstablishment,
    totalStudents: totalStudents,
    totalTeachers: teachers,
    supportStaff: level === 'Primary (Grades 1-5)' ? 1 : level === 'Upper Primary (Grades 6-8)' ? 2 : 5,
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
      ...(level.includes('Secondary') ? ['Science Demonstration Lab', 'Computer IT Hub'] : [])
    ],
    shift: 'Standard Day',
    notes: `Official U-DISE Code: ${raw.udise}. HOI: ${hoiName} (${designation}, ${hoiPhone}). Pre-Primary Roll: ${preTotal}, Primary Roll: ${priTotal}, Upper-Primary Roll: ${uppTotal}.`,
    enrollment: {
      prePrimary: { boys: raw.pre[0], girls: raw.pre[1], total: raw.pre[2] },
      primary: { boys: raw.pri[0], girls: raw.pri[1], total: raw.pri[2] },
      upperPrimary: { boys: raw.upp[0], girls: raw.upp[1], total: raw.upp[2] },
      totalBoys: totalBoys,
      totalGirls: totalGirls
    },
    establishment: establishment,
    planning: planning,
    hoiProblems: hoiProblems
  };
});

export const INITIAL_NOTICES: ZoneNotice[] = [
  {
    id: 'NOT-001',
    title: 'Zone Gurez & Tulail Winter Preparedness & Heating Protocol',
    date: '2026-09-18',
    priority: 'Urgent',
    targetClusters: 'All 4 Clusters (88 Schools)',
    category: 'Safety & Winter Preparedness',
    content: 'All Headmasters and Principals of 88 schools across Dawar, Bagtore, Kilshay, and Tulail clusters are instructed to verify Bukhari/solar heating units, winter fuel quotas, and mid-day meal provisions.'
  },
  {
    id: 'NOT-002',
    title: 'Submission of Student U-DISE+ Roll & Gender Disaggregated Data',
    date: '2026-09-15',
    priority: 'High',
    targetClusters: 'All 88 Zone Schools',
    category: 'Academic & Enrollment',
    content: 'Verification of Pre-Primary, Primary, and Upper-Primary rolls (Boys & Girls) must be cross-verified against physical classroom attendance registers for the current academic session.'
  },
  {
    id: 'NOT-003',
    title: 'Inter-Cluster Science Exhibition & Sports Meet 2026',
    date: '2026-09-10',
    priority: 'Normal',
    targetClusters: 'Dawar Central & Tulail Clusters',
    category: 'Student Competitions',
    content: 'Selected schools from GMS Wanpora, MS Badugam, and HSS Kilshay will participate in the district-level youth talent showcase in Dawar sports complex.'
  }
];

