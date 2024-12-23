import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Card, CardHeader, CardFooter, CardDescription } from "../components/ui/card";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2024, 2025, 2026, 2027, 2028];

const tagStyles: { [key: string]: string } = {
  Personal: "bg-green-50",
  Work: "bg-blue-50",
  Meeting: "bg-yellow-50",
  Important: "bg-pink-50",
};

export const Calendar = ({
  setEvents,
}: {
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventForm, setEventForm] = useState({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    tag: "Personal", // Default tag
  });
  const [showModal, setShowModal] = useState(false);
  const [events, setEventsState] = useState<any[]>([]);

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      setEventsState(parsedEvents);
      setEvents(parsedEvents);
    }
  }, [setEvents]);

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setEventForm({
      id: "",
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      tag: "Personal",
    });
  };

  const handleAddEvent = () => {
    if (selectedDate && eventForm.name) {
      const eventKey = selectedDate.toDateString();
      const newEvent = { ...eventForm, date: eventKey };

      setEventsState((prevEvents) => {
        let updatedEvents;
        if (eventForm.id) {
          updatedEvents = prevEvents.map((event) => (event.id === eventForm.id ? newEvent : event));
        } else {
          updatedEvents = [...prevEvents, { ...newEvent, id: uuidv4() }];
        }

        // Save the updated events to localStorage
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        setEvents(updatedEvents); // <-- Trigger update in parent component
        return updatedEvents;
      });

      setEventForm({
        id: "",
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        tag: "Personal",
      });
      setShowModal(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEventsState((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => event.id !== id);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents); // <-- Trigger update in parent component
      return updatedEvents;
    });
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    const calendarDays = [];
    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      calendarDays.push(day > 0 && day <= daysInMonth ? day : null);
    }
    return calendarDays;
  };

  const calendarDays = generateCalendar();

  const handleEditEvent = (event: any) => {
    setEventForm(event);
    setShowModal(true);
  };

  const exportEvents = (format: "json" | "csv") => {
    const filteredEvents = events.filter(
      (event) => new Date(event.date).getMonth() === currentDate.getMonth()
    );

    if (format === "json") {
      const blob = new Blob([JSON.stringify(filteredEvents, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `events-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}.json`;
      link.click();
    } else if (format === "csv") {
      const csv = [
        ["ID", "Name", "Start Time", "End Time", "Description", "Tag", "Date"],
        ...filteredEvents.map((event) => [
          event.id,
          event.name,
          event.startTime,
          event.endTime,
          event.description,
          event.tag,
          new Date(event.date).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `events-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}.csv`;
      link.click();
    }
  };

  return (
    <div className="p-8 w-full m-2 mt-5 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-6 gap-3">
        <select
          value={currentDate.getMonth()}
          onChange={handleMonthChange}
          className="px-4 py-2 border rounded-lg text-lg flex-1">
          {months.map((month, index) => (
            <option
              key={index}
              value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={currentDate.getFullYear()}
          onChange={handleYearChange}
          className="px-4 py-2 border rounded-lg text-lg flex-1">
          {years.map((year) => (
            <option
              key={year}
              value={year}>
              {year}
            </option>
          ))}
        </select>

        <Button
          className="px-4 py-2 bg-purple-950 text-white rounded-lg"
          onClick={() => {
            if (selectedDate) setShowModal(true);
          }}>
          Add Event
        </Button>
      </div>

      <div className="flex justify-between mb-6">
        <Button
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={() => exportEvents("json")}>
          Export as JSON
        </Button>
        <Button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => exportEvents("csv")}>
          Export as CSV
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-lg">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className={index === 0 || index === 6 ? "text-red-500" : "text-gray-700"}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mt-4">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`py-3 rounded-lg text-lg font-medium cursor-pointer ${
              day ? "hover:bg-gray-200" : "bg-transparent"
            } ${day && selectedDate?.getDate() === day ? "bg-red-500 text-white" : ""}`}
            onClick={() => day && handleDayClick(day)}>
            {day}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-xl mb-4">Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {events
            .filter((event) => event.date === selectedDate?.toDateString())
            .map((event) => (
              <Card
                key={event.id}
                className={`bg-white shadow-lg rounded-lg overflow-hidden ${
                  tagStyles[event.tag] || "bg-gray-200"
                }`}>
                <CardHeader className="text-black p-4">
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                </CardHeader>

                <CardDescription className="p-4 space-y-2">
                  <p className="text-gray-800">{event.description}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Start: {event.startTime}</span>
                    <span>End: {event.endTime}</span>
                  </div>
                </CardDescription>

                <CardFooter className="bg-gray-100 text-sm text-gray-500 p-4">
                  {new Date(event.date).toLocaleDateString()}
                </CardFooter>

                <div className="p-4 grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleEditEvent(event)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg">
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={setShowModal}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? selectedDate.toDateString() : "Select a Date"}
            </DialogTitle>
            <DialogDescription>Enter event details for the selected date.</DialogDescription>
          </DialogHeader>

          <input
            type="text"
            placeholder="Event Name"
            value={eventForm.name}
            onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="time"
            value={eventForm.startTime}
            onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="time"
            value={eventForm.endTime}
            onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Event Description"
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />

          <select
            value={eventForm.tag}
            onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })}
            className="w-full mb-2 p-2 border rounded">
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Meeting">Meeting</option>
            <option value="Important">Important</option>
          </select>

          <DialogFooter>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleAddEvent}>
              {eventForm.id ? "Update Event" : "Save Event"}
            </button>
            <DialogClose className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
