export type ZoneCluster = 
  | 'HSS Baduab Tulail' 
  | 'HSS Kilshay' 
  | 'HSS Izmarg' 
  | 'GHSS Dawar' 
  | 'BHSS DAWAR' 
  | 'HS Kanzalwan' 
  | 'HSS Badugam' 
  | 'HSS PTL'
  | 'Bagtore & Kanzalwan Cluster' 
  | 'Dawar Central Cluster' 
  | 'Kilshay & Chorwan Cluster' 
  | 'Tulail Valley Cluster'
  | 'North Cluster' 
  | 'South Cluster' 
  | 'East Cluster' 
  | 'West Cluster'
  | string;

export type SchoolCategory = 'Government / Public' | 'Government Aided' | 'Private Unaided' | 'Special Needs / Inclusive';

export type SchoolLevel = 
  | 'Primary (Grades 1-5)'
  | 'Upper Primary (Grades 6-8)'
  | 'Secondary (Grades 9-10)'
  | 'Higher Secondary (Grades 11-12)'
  | 'Composite (K-12)';

export type InspectionStatus = 'Compliant' | 'Scheduled' | 'Pending Review' | 'Action Required';

export interface GradeRoll {
  boys: number;
  girls: number;
  total: number;
}

export interface ClassGradeRoll {
  male: number;
  female: number;
  total: number;
}

export interface DetailedClassWiseEnrollment {
  kg: ClassGradeRoll;
  grade1: ClassGradeRoll;
  grade2: ClassGradeRoll;
  grade3: ClassGradeRoll;
  grade4: ClassGradeRoll;
  grade5: ClassGradeRoll;
  grade6: ClassGradeRoll;
  grade7: ClassGradeRoll;
  grade8: ClassGradeRoll;
  grade9: ClassGradeRoll;
  grade10: ClassGradeRoll;
  totalMale: number;
  totalFemale: number;
  totalEnrollment: number;
}

export type HoiProblemCategory = 
  | 'Infrastructure & Snow Damage' 
  | 'Teacher & Staff Shortage' 
  | 'Winter Heating & Fuel' 
  | 'Water & Sanitation' 
  | 'ICT & Smart Class' 
  | 'Mid-Day Meal & Ration'
  | 'Land & Boundary Wall';

export type HoiProblemPriority = 'Critical / Immediate' | 'High' | 'Normal';

export type HoiProblemStatus = 'Pending ZEO Action' | 'Under ZEO Review' | 'Forwarded to CEO/Directorate' | 'Resolved';

export interface HoiProblem {
  id: string;
  problemNumber: 1 | 2 | 3;
  category: HoiProblemCategory;
  title: string;
  description: string;
  reportedDate: string;
  priority: HoiProblemPriority;
  status: HoiProblemStatus;
  zeoRemarks?: string;
  updatedAt?: string;
}

export interface EstablishmentInfo {
  yearOfEstablishment: number;
  buildingStatus: 'Government Owned (Pucca)' | 'Government Owned (Semi-Pucca)' | 'Rented Building' | 'Community / Panchayat Shed';
  landAreaKanals: number;
  totalClassrooms: number;
  separateHeadmasterRoom: boolean;
  staffRoom: boolean;
  boundaryWall: 'Intact' | 'Damaged by Snow/Avalanche' | 'Partial / Needs Repair' | 'None';
  drinkingWaterSource: 'Functional Tap Water' | 'Natural Mountain Spring' | 'Jal Shakti Supply' | 'Defunct / Frozen in Winter';
  electricityStatus: 'Solar Powered + Grid' | 'Solar Unit Only' | 'Grid Only' | 'No Electricity';
  girlsToiletFunctional: boolean;
  boysToiletFunctional: boolean;
  cwsnToiletAvailable: boolean;
  mdmKitchenShed: 'Functional Dedicated Shed' | 'Temporary Space' | 'Needs Construction';
  playgroundAvailable?: boolean;
}

export interface PlanningInfo {
  winterHeatingQuota: 'Bukhari & Fuel Allotted' | 'Partial Quota Received' | 'Awaiting Winter Allocation';
  textbookDistributionStatus: '100% Distributed' | 'Pending Grade 6-8 Math/Sci' | 'Delayed by Road Blockade';
  uniformAssistanceStatus: 'Distributed (DBT / Physical)' | 'In Process';
  sanctionedTeachingPosts: number;
  vacantTeachingPosts: number;
  subjectTeacherDeficit: string;
  samagraCompositeGrant: {
    allotted: number;
    utilized: number;
    status: 'Fully Utilized' | 'Partially Utilized' | 'Audit Pending';
  };
  cwsnEnrolledCount: number;
  midDayMealCoverage: number; // percentage e.g. 100
}

export interface School {
  id: string;
  code: string; // UDISE code e.g. 01160802806
  udiseCode?: string;
  name: string;
  cluster: ZoneCluster;
  level: SchoolLevel;
  category: SchoolCategory;
  gender: 'Co-educational' | 'Girls Only' | 'Boys Only';
  
  // Head of Institution (HOI) Details
  hoiName: string;
  hoiDesignation: 'Principal' | 'Headmaster' | 'Incharge Master' | 'Teacher Incharge';
  hoiPhone: string;
  hoiEmail?: string;
  
  // Legacy alias for compatibility
  principalName: string;
  principalPhone: string;
  email: string;
  address: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  supportStaff: number;
  classroomsCount: number;
  pupilTeacherRatio: number;
  rating: number; // e.g. 4.2
  inspectionStatus: InspectionStatus;
  lastInspectionDate: string;
  nextInspectionDue: string;
  facilities: string[];
  shift: 'Morning Shift' | 'Standard Day' | 'Double Shift';
  notes?: string;

  // Grade-wise Enrollment Roll from Zone Records
  enrollment?: {
    prePrimary: GradeRoll;
    primary: GradeRoll;
    upperPrimary: GradeRoll;
    totalBoys: number;
    totalGirls: number;
  };

  // Official Class-wise Male/Female Enrollment (KG to 10th) from ZEO Records
  classWise?: DetailedClassWiseEnrollment;
  officialCategory?: 'PS' | 'MS' | 'HS' | 'HSS';

  // Comprehensive Establishment & Planning
  establishment?: EstablishmentInfo;
  planning?: PlanningInfo;

  // Max 3 Important Problems raised by the HOI
  hoiProblems: HoiProblem[];
}

export interface ZoneSummaryStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  averagePTR: number;
  compliantCount: number;
  actionRequiredCount: number;
  clusterCounts: Record<ZoneCluster, number>;
  totalHoiProblems: number;
  criticalHoiProblems: number;
  resolvedHoiProblems: number;
}

export interface FilterState {
  search: string;
  cluster: string;
  category: string;
  level: string;
  inspectionStatus: string;
  hoiProblemFilter?: 'All' | 'Has Problems' | 'Critical Issues' | 'No Problems';
  sortBy: 'name-asc' | 'name-desc' | 'students-desc' | 'students-asc' | 'ptr-desc' | 'rating-desc' | 'problems-desc';
}

export interface ZoneNotice {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetClusters: string;
  category: string;
  content: string;
}

// Authentication & Role-Based Access Control (RBAC)
export type UserRole = 'super_admin' | 'school' | 'guest';

export interface AuthUser {
  role: UserRole;
  email: string;
  name: string;
  schoolId?: string;
  schoolCode?: string;
  schoolName?: string;
}

export interface AdminAccount {
  email: string;
  password: string;
  pendingOtp?: {
    code: string;
    newEmail: string;
    expiresAt: number;
  };
}

export interface SchoolAccount {
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  email: string;
  password: string;
  lastLogin?: string;
}

export interface SystemOptions {
  availableFacilities: string[];
}

export type SchoolChangeType = 
  | 'profile_update'
  | 'problem_logged'
  | 'problem_updated'
  | 'problem_removed'
  | 'facility_update'
  | 'enrollment_update';

export interface SchoolNotification {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  changeType: SchoolChangeType;
  title: string;
  details: string;
  timestamp: string;
  read: boolean;
  authorName?: string;
  authorRole?: string;
}

