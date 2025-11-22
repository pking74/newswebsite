export type PoliceCall = {
  id: string;
  timestamp: string; // ISO
  agency?: string;
  description: string;
  location?: string;
  sourceUrl?: string;
};

export type PoliceRelease = {
  id: string;
  title: string;
  publishedAt: string; // ISO
  summary: string;
  sourceUrl: string;
};

export const policeCalls: PoliceCall[] = [
  {
    id: "pc1",
    timestamp: "2025-11-20T14:20:00Z",
    agency: "Utica PD",
    description: "Medical emergency - chest pain",
    location: "Genesee St, Utica",
    sourceUrl: "https://oneidacounty911.com/call-log/2025/11/20"
  },
  {
    id: "pc2",
    timestamp: "2025-11-20T13:45:00Z",
    agency: "Rome PD",
    description: "Vehicle accident with injuries",
    location: "Black River Blvd, Rome"
  },
  {
    id: "pc3",
    timestamp: "2025-11-20T12:30:00Z",
    agency: "Oneida County Sheriff",
    description: "Domestic dispute",
    location: "Rt 12, Deerfield"
  },
  {
    id: "pc4",
    timestamp: "2025-11-20T11:15:00Z",
    agency: "Utica FD",
    description: "Structure fire",
    location: "Oneida St, Utica"
  },
  {
    id: "pc5",
    timestamp: "2025-11-20T09:50:00Z",
    agency: "State Police",
    description: "Traffic stop - DUI suspected",
    location: "I-90 Eastbound"
  }
];

export const policeReleases: PoliceRelease[] = [
  {
    id: "pr1",
    title: "Utica PD Arrest in Drug Trafficking Ring",
    publishedAt: "2025-11-20T10:00:00Z",
    summary: "Three individuals charged following multi-agency investigation.",
    sourceUrl: "https://uticapd.org/press/2025/11/drug-ring-arrest"
  },
  {
    id: "pr2",
    title: "Oneida County Sheriff Weekly Blotter",
    publishedAt: "2025-11-19T16:00:00Z",
    summary: "Summary of recent calls and arrests in county jurisdiction.",
    sourceUrl: "https://oneidasheriff.ny.gov/blotter/2025-11-19"
  },
  {
    id: "pr3",
    title: "Rome PD Community Alert: Vehicle Thefts",
    publishedAt: "2025-11-19T14:30:00Z",
    summary: "Increase in car break-ins reported; prevention tips provided.",
    sourceUrl: "https://romepolice.com/alerts/2025/11/vehicle-thefts"
  },
  {
    id: "pr4",
    title: "NYS Police Troop D Update",
    publishedAt: "2025-11-18T18:00:00Z",
    summary: "Recent DWI arrests and traffic enforcement stats.",
    sourceUrl: "https://troopers.ny.gov/troop-d-update-2025"
  }
];
