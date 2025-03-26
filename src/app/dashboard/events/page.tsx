import React from "react";

type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
};

const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Event One",
    date: "2023-10-01",
    description: "This is the first sample event.",
  },
  {
    id: 2,
    title: "Event Two",
    date: "2023-10-15",
    description: "This is the second sample event.",
  },
  {
    id: 3,
    title: "Event Three",
    date: "2023-11-01",
    description: "This is the third sample event.",
  },
];

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="text-gray-600">{event.date}</p>
      <p className="mt-2">{event.description}</p>
    </div>
  );
};

const EventsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Events</h1>
      {sampleEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsPage;
