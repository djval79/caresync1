
import { Staff, StaffRole, Client, Shift, ShiftType, CareType } from './types';

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Sarah Jenkins', role: StaffRole.MANAGER, contractedHours: 37.5, currentHours: 35, rating: 5, complianceStatus: 'Green', hourlyRate: 25.00 },
  { id: '2', name: 'David Thompson', role: StaffRole.SENIOR, contractedHours: 40, currentHours: 44, rating: 4.8, complianceStatus: 'Amber', hourlyRate: 15.00 },
  { id: '3', name: 'Emma Wilson', role: StaffRole.CARER, contractedHours: 30, currentHours: 28, rating: 4.5, complianceStatus: 'Green', hourlyRate: 12.00 },
  { id: '4', name: 'James Miller', role: StaffRole.CARER, contractedHours: 24, currentHours: 36, rating: 4.2, complianceStatus: 'Red', hourlyRate: 12.50 },
  { id: '5', name: 'Linda Carter', role: StaffRole.NURSE, contractedHours: 37.5, currentHours: 37.5, rating: 4.9, complianceStatus: 'Green', hourlyRate: 22.00 },
  { id: '6', name: 'Robert Hall', role: StaffRole.CARER, contractedHours: 40, currentHours: 40, rating: 4.0, complianceStatus: 'Green', hourlyRate: 11.50 },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Arthur Bentley',
    roomNumber: '101',
    careType: CareType.RESIDENTIAL,
    careLevel: 'High',
    hourlyRate: 35.00,
    medications: [
      { id: 'm1', name: 'Aspirin Dispersible', dosage: '75mg', frequency: 'Daily', times: ['08:00'], stockLevel: 28, instructions: 'Dissolve in water' },
      { id: 'm2', name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily', times: ['18:00'], stockLevel: 24 }
    ]
  },
  {
    id: 'c2',
    name: 'Margaret Rose',
    roomNumber: '104',
    careType: CareType.RESIDENTIAL,
    careLevel: 'Medium',
    hourlyRate: 32.00,
    medications: [
      { id: 'm3', name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', times: ['08:00', '18:00'], stockLevel: 56, instructions: 'Take with food' },
      { id: 'm4', name: 'Paracetamol', dosage: '500mg', frequency: 'PRN', times: [], stockLevel: 100, instructions: 'Max 4 doses in 24hrs' }
    ]
  },
  { id: 'c3', name: 'William Smith', address: '12 Baker Street, London', postcode: 'NW1 6XE', careType: CareType.DOMICILIARY, careLevel: 'Low', hourlyRate: 28.00 },
  { id: 'c4', name: 'Elizabeth Jones', roomNumber: '201', careType: CareType.RESIDENTIAL, careLevel: 'High', hourlyRate: 35.00 },
  { id: 'c5', name: 'George Harrison', address: '45 Abbey Road, London', postcode: 'NW8 9AY', careType: CareType.DOMICILIARY, careLevel: 'Medium', hourlyRate: 30.00 },
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1',
    staffId: '2',
    clientId: 'c1',
    date: '2024-05-20',
    type: ShiftType.MORNING,
    startTime: '08:00',
    duration: 60,
    status: 'Confirmed'
  },
  {
    id: 's2',
    staffId: '3',
    clientId: 'c3',
    date: '2024-05-20',
    type: ShiftType.MORNING,
    startTime: '09:30',
    duration: 45,
    status: 'Confirmed'
  },
  {
    id: 's3',
    staffId: '5',
    clientId: 'c4',
    date: '2024-05-20',
    type: ShiftType.NIGHT,
    startTime: '21:00',
    duration: 600,
    status: 'Confirmed'
  },
  {
    id: 's4',
    staffId: null,
    clientId: 'c5',
    date: '2024-05-20',
    type: ShiftType.AFTERNOON,
    startTime: '14:30',
    duration: 30,
    status: 'Unassigned'
  },
];
