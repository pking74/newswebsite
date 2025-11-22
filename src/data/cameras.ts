export type CameraLink = {
  id: string;
  title: string;
  location?: string;
  viewUrl: string;
  notes?: string;
};

export const cameras: CameraLink[] = [
  {
    id: "c1",
    title: "Utica - Genesee St at Burrstone Rd",
    location: "Utica",
    viewUrl: "https://511ny.org/Cameras/utica-genesee-burrstone",
    notes: "NYSDOT Traffic Cam"
  },
  {
    id: "c2",
    title: "Rome - Rt 49 at Black River Blvd",
    location: "Rome",
    viewUrl: "https://511ny.org/Cameras/rome-rt49-blackriver"
  },
  {
    id: "c3",
    title: "I-90 East Utica Exit 32",
    location: "Utica",
    viewUrl: "https://511ny.org/Cameras/i90-e-utica32"
  },
  {
    id: "c4",
    title: "Rt 12 Southbound New Hartford",
    location: "New Hartford",
    viewUrl: "https://511ny.org/Cameras/rt12-s-newhartford"
  },
  {
    id: "c5",
    title: "Utica Harbor Lock Cam",
    location: "Utica",
    viewUrl: "https://utica-harbor.org/webcam"
  },
  {
    id: "c6",
    title: "Rome Fish Creek Webcam",
    location: "Rome",
    viewUrl: "https://romesentinel.com/webcams/fishcreek"
  }
];
