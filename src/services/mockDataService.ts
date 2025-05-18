
export interface Incident {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  location: string;
  timestamp: string;
  cause: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  imageUrl: string;
  status: 'submitted' | 'verified' | 'funded' | 'completed';
  amountNeeded?: number;
  amountFunded?: number;
  ngoId?: string;
  ngoName?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  incidentId: string;
  amount: number;
  timestamp: string;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
}

// Mock data
const mockIncidents: Incident[] = [
  {
    id: "incident-1",
    beneficiaryId: "ben-1",
    beneficiaryName: "John Doe",
    location: "Port-au-Prince, Haiti",
    timestamp: "2023-05-12T09:30:00Z",
    cause: "Earthquake",
    description: "A 7.2 magnitude earthquake has devastated our community. We need immediate support for food, water, and medical supplies.",
    severity: "critical",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    status: "verified",
    amountNeeded: 5000,
    amountFunded: 2000,
    ngoId: "ngo-1",
    ngoName: "Rebuild Together"
  },
  {
    id: "incident-2",
    beneficiaryId: "ben-2",
    beneficiaryName: "Maria Garcia",
    location: "Manila, Philippines",
    timestamp: "2023-06-23T14:15:00Z",
    cause: "Typhoon",
    description: "Typhoon Yagi has flooded our village, destroying homes and infrastructure. We need help with temporary shelter and clean water.",
    severity: "high",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    status: "submitted",
    amountNeeded: 3000
  },
  {
    id: "incident-3",
    beneficiaryId: "ben-3",
    beneficiaryName: "Ahmed Hassan",
    location: "Cairo, Egypt",
    timestamp: "2023-07-05T11:45:00Z",
    cause: "Drought",
    description: "Prolonged drought has depleted our water sources and devastated crops. We urgently need water supplies and food assistance.",
    severity: "medium",
    imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    status: "funded",
    amountNeeded: 2500,
    amountFunded: 2500,
    ngoId: "ngo-2",
    ngoName: "Water Relief International"
  }
];

const mockDonations: Donation[] = [
  {
    id: "donation-1",
    donorId: "don-1",
    donorName: "Sarah Johnson",
    incidentId: "incident-1",
    amount: 1000,
    timestamp: "2023-05-15T13:20:00Z",
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    status: "completed"
  },
  {
    id: "donation-2",
    donorId: "don-2",
    donorName: "Michael Smith",
    incidentId: "incident-1",
    amount: 1000,
    timestamp: "2023-05-16T09:45:00Z",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    status: "completed"
  },
  {
    id: "donation-3",
    donorId: "don-1",
    donorName: "Sarah Johnson",
    incidentId: "incident-3",
    amount: 2500,
    timestamp: "2023-07-06T16:30:00Z",
    transactionHash: "0x7890abcdef1234567890abcdef1234567890abcd",
    status: "completed"
  }
];

// Mock service functions
export const fetchIncidents = async (): Promise<Incident[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockIncidents];
};

export const fetchIncidentsByStatus = async (status: string): Promise<Incident[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockIncidents.filter(incident => incident.status === status);
};

export const fetchIncidentById = async (id: string): Promise<Incident | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIncidents.find(incident => incident.id === id);
};

export const fetchDonations = async (): Promise<Donation[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockDonations];
};

export const fetchDonationsByDonor = async (donorId: string): Promise<Donation[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDonations.filter(donation => donation.donorId === donorId);
};

export const createIncident = async (incident: Omit<Incident, 'id'>): Promise<Incident> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newIncident: Incident = {
    ...incident,
    id: `incident-${Math.random().toString(36).substring(2, 9)}`,
  };
  mockIncidents.push(newIncident);
  return newIncident;
};

export const approveIncident = async (id: string, ngoId: string, ngoName: string): Promise<Incident> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const incident = mockIncidents.find(inc => inc.id === id);
  if (!incident) {
    throw new Error('Incident not found');
  }
  
  incident.status = 'verified';
  incident.ngoId = ngoId;
  incident.ngoName = ngoName;
  
  return incident;
};

export const makeDonation = async (donorId: string, donorName: string, incidentId: string, amount: number): Promise<Donation> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // First update the incident
  const incident = mockIncidents.find(inc => inc.id === incidentId);
  if (!incident) {
    throw new Error('Incident not found');
  }
  
  if (!incident.amountFunded) {
    incident.amountFunded = 0;
  }
  
  incident.amountFunded += amount;
  
  if (incident.amountFunded >= (incident.amountNeeded || 0)) {
    incident.status = 'funded';
  }
  
  // Create donation record
  const newDonation: Donation = {
    id: `donation-${Math.random().toString(36).substring(2, 9)}`,
    donorId,
    donorName,
    incidentId,
    amount,
    timestamp: new Date().toISOString(),
    transactionHash: `0x${Math.random().toString(36).substring(2, 30)}${Math.random().toString(36).substring(2, 30)}`,
    status: 'completed'
  };
  
  mockDonations.push(newDonation);
  return newDonation;
};

export const releaseFunds = async (incidentId: string): Promise<Incident> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const incident = mockIncidents.find(inc => inc.id === incidentId);
  if (!incident) {
    throw new Error('Incident not found');
  }
  
  incident.status = 'completed';
  return incident;
};
