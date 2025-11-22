export type LinkCategory = {
  id: string;
  name: string;
  links: {
    id: string;
    label: string;
    url: string;
    description?: string;
  }[];
};

export const linkCategories: LinkCategory[] = [
  {
    id: "local-gov",
    name: "Local Government",
    links: [
      { id: "lg1", label: "Oneida County", url: "https://oneidacountyny.gov/", description: "Official county website" },
      { id: "lg2", label: "City of Utica", url: "https://www.cityofutica.com/", description: "City services and news" },
      { id: "lg3", label: "City of Rome", url: "https://romeny.com/", description: "Rome government portal" },
      { id: "lg4", label: "Oneida County Sheriff", url: "https://oneidasheriff.ny.gov/", description: "Sheriff's office" },
      { id: "lg5", label: "Utica Police Dept", url: "https://uticapd.org/", description: "Police blotter and reports" }
    ]
  },
  {
    id: "utilities",
    name: "Utilities",
    links: [
      { id: "u1", label: "National Grid", url: "https://www.nationalgridus.com/NY-Home/", description: "Electric and gas" },
      { id: "u2", label: "Utica Gas & Electric", url: "https://www.utica-gas.com/", description: "Local utility info" },
      { id: "u3", label: "Oneida County Water Authority", url: "https://ocwa.org/", description: "Water services" },
      { id: "u4", label: "MV Water Dept", url: "https://mvwater.org/", description: "Mohawk Valley water" }
    ]
  },
  {
    id: "schools",
    name: "Schools",
    links: [
      { id: "s1", label: "Utica City School District", url: "https://www.uticaschools.org/", description: "K-12 public schools" },
      { id: "s2", label: "Rome City School District", url: "https://www.romecsd.org/", description: "Rome schools" },
      { id: "s3", label: "MVCC", url: "https://www.mvcc.edu/", description: "Mohawk Valley Community College" },
      { id: "s4", label: "SUNY Polytechnic", url: "https://sunypoly.edu/", description: "Utica campus" },
      { id: "s5", label: "St. Elizabeth College of Nursing", url: "https://www.secon.edu/", description: "Nursing program" }
    ]
  },
  {
    id: "media",
    name: "Media",
    links: [
      { id: "m1", label: "Utica Observer-Dispatch", url: "https://www.uticaod.com/", description: "Local newspaper" },
      { id: "m2", label: "Rome Sentinel", url: "https://romesentinel.com/", description: "Rome news" },
      { id: "m3", label: "WKTV News", url: "https://www.wktv.com/", description: "Local TV news" },
      { id: "m4", label: "Spectrum News CNY", url: "https://spectrumlocalnews.com/nys/central-ny", description: "Regional cable news" }
    ]
  },
  {
    id: "transit",
    name: "Transit",
    links: [
      { id: "t1", label: "UTM Rural Metro", url: "https://ruralmetrofire.com/utica/", description: "Public transit and paratransit" },
      { id: "t2", label: "Trailways of New York", url: "https://trailwaysny.com/", description: "Bus services" },
      { id: "t3", label: "Amtrak Empire Service", url: "https://www.amtrak.com/empire-service-train", description: "Train to NYC/Albany" },
      { id: "t4", label: "511NY Traffic", url: "https://511ny.org/", description: "Road conditions and cams" }
    ]
  },
  {
    id: "misc",
    name: "Miscellaneous",
    links: [
      { id: "misc1", label: "Oneida County Tourism", url: "https://visitcentralny.com/counties/oneida/", description: "Things to do" },
      { id: "misc2", label: "Utica Comets Tickets", url: "https://www.utica-comets.com/tickets", description: "AHL Hockey" },
      { id: "misc3", label: "Munson-Williams-Proctor Arts", url: "https://mwpa.org/", description: "Museum and gallery" },
      { id: "misc4", label: "Utica Zoo", url: "https://uticazoo.org/", description: "Family attraction" },
      { id: "misc5", label: "Oneida County Fair", url: "https://oneidacountyfair.com/", description: "Annual fair" }
    ]
  }
];
