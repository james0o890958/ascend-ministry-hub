export type CellMeeting = {
  id: string;
  cellId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
};

let cellMeetings: CellMeeting[] = [
  {
    id: "m1",
    cellId: "c1",
    title: "Friday Fellowship & Prayer",
    date: "2026-05-22",
    time: "19:00",
    location: "Leader's Home",
    agenda: "Scripture study on Faith and Prayer",
  },
];

const listeners = new Set<() => void>();

export function getCellMeetings(): CellMeeting[] {
  return cellMeetings;
}

export function addCellMeeting(meeting: CellMeeting) {
  cellMeetings = [meeting, ...cellMeetings];
  listeners.forEach((fn) => fn());
}

export function subscribeCellMeetings(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
