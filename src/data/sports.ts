export type SportsLink = {
  id: string;
  level: "High School" | "College" | "Pro";
  teamName: string;
  sport: string;
  scheduleUrl: string;
  notes?: string;
};

export const sportsLinks: SportsLink[] = [
  {
    id: "s1",
    level: "High School",
    teamName: "Utica Proctor Blue Devils",
    sport: "Football",
    scheduleUrl: "https://maxpreps.com/ny/utica/proctor-blue-devils/schedule",
    notes: "TVL League"
  },
  {
    id: "s2",
    level: "High School",
    teamName: "Rome Free Academy Black Knights",
    sport: "Basketball",
    scheduleUrl: "https://maxpreps.com/ny/rome/rome-free-academy/schedule"
  },
  {
    id: "s3",
    level: "College",
    teamName: "MVCC Hawks",
    sport: "Basketball",
    scheduleUrl: "https://mvccathletics.com/sports/mbkb/index"
  },
  {
    id: "s4",
    level: "College",
    teamName: "Herkimer Generals",
    sport: "Soccer",
    scheduleUrl: "https://herkimerathletics.com/sports/msoc/index"
  },
  {
    id: "s5",
    level: "Pro",
    teamName: "Utica Comets",
    sport: "Hockey (AHL)",
    scheduleUrl: "https://www.utica-comets.com/schedule"
  },
  {
    id: "s6",
    level: "Pro",
    teamName: "Utica City FC",
    sport: "Soccer (MASL)",
    scheduleUrl: "https://uticacityfc.com/schedule"
  }
];
