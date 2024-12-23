import React, { useState } from "react";
import { Card, CardHeader, CardFooter, CardDescription } from "../components/ui/card"; // Assuming you have a `Card` component in your UI library

const tagStyles: { [key: string]: string } = {
  Personal: "bg-green-50",
  Work: "bg-blue-50",
  Meeting: "bg-yellow-50",
  Important: "bg-pink-50",
};

const Event = ({ events }: { events: any[] }) => {
  const [filters, setFilters] = useState({
    date: "",
    title: "",
    tag: "",
  });

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const day = d.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    return `${year}-${month}-${day}`; // Format to YYYY-MM-DD
  };

  // Filtered events based on the filters
  const filteredEvents = events.filter((event) => {
    const matchesDate = filters.date ? formatDate(event.date) === filters.date : true;
    const matchesTitle = filters.title
      ? event.name.toLowerCase().includes(filters.title.toLowerCase())
      : true;
    const matchesTag = filters.tag ? event.tag === filters.tag : true;
    return matchesDate && matchesTitle && matchesTag;
  });

  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date Filter */}
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />

        {/* Title Filter */}
        <input
          type="text"
          name="title"
          placeholder="Search by title"
          value={filters.title}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />

        {/* Tag Filter */}
        <select
          name="tag"
          value={filters.tag}
          onChange={handleFilterChange}
          className="p-2 border rounded">
          <option value="">All Tags</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Meeting">Meeting</option>
          <option value="Important">Important</option>
        </select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className={`bg-white shadow-lg rounded-lg overflow-hidden flex flex-col ${
                tagStyles[event.tag] || "bg-gray-200"
              }`}>
              <CardHeader className=" text-black border-b p-4">
                <h3 className="text-xl font-semibold">{event.name}</h3>
              </CardHeader>

              <CardDescription className="p-4 space-y-2 flex-grow text-black">
                <p className="text-gray-800">{event.description}</p>
                {/* Conditionally render start and end times */}
                {(event.startTime || event.endTime) && (
                  <div className="flex justify-between text-sm text-gray-600">
                    {event.startTime && <span>From: {event.startTime}</span>}
                    {event.endTime && <span>To: {event.endTime}</span>}
                  </div>
                )}
              </CardDescription>

              <CardFooter className="bg-gray-100 text-sm text-gray-500 p-4 mt-auto">
                {new Date(event.date).toLocaleDateString("en-GB")}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No events available.</p>
      )}
    </div>
  );
};

export default Event;
