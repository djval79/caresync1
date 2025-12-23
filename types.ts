
export enum StaffRole {
  MANAGER = 'Registered Manager',
  SENIOR = 'Senior Carer',
  CARER = 'Care Assistant',
  NURSE = 'Nurse',
  DOMESTIC = 'Domestic/Housekeeping'
}

export enum ShiftType {
  MORNING = 'Morning (07:00-14:30)',
  AFTERNOON = 'Afternoon (14:00-21:30)',
  LONG_DAY = 'Long Day (07:00-21:30)',
  NIGHT = 'Night (21:00-07:30)'
}

export enum CareType {
  RESIDENTIAL = 'Residential',
  DOMICILIARY = 'Domiciliary'
}

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  contractedHours: number;
  currentHours: number;
  rating: number;
  complianceStatus: 'Green' | 'Amber' | 'Red';
}

export interface Client {
  id: string;
  name: string;
  careType: CareType;
  roomNumber?: string;
  address?: string;
  postcode?: string;
  careLevel: 'Low' | 'Medium' | 'High';
}

export interface Shift {
  id: string;
  staffId: string | null;
  clientId: string | null;
  date: string;
  type: ShiftType;
  startTime: string; // e.g., "08:30"
  duration: number;  // in minutes
  status: 'Unassigned' | 'Assigned' | 'Confirmed';
}

export interface RotaInsight {
  title: string;
  description: string;
  type: 'compliance' | 'optimization' | 'warning';
}
