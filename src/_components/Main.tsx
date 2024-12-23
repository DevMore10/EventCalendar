import { useState, useEffect } from "react";
import { Calendar } from "./Calendar";
import Event from "./Event";

export const Main = () => {
  const [events, setEvents] = useState<any[]>([]);

  // Load events from localStorage only when the component mounts
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      setEvents(parsedEvents); // Update state with loaded events
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex">
      <Calendar setEvents={setEvents} /> {/* Pass setEvents to Calendar */}
      <Event events={events} /> {/* Pass events to Event */}
    </div>
  );
};
