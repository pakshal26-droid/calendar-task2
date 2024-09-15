import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
} from "date-fns";
import React, { useEffect, useState } from "react";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventCalendar(props) {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventName, setNewEventName] = useState("");

  useEffect(() => {
    setEvents(props.events);
  });
  const currentMonth = new Date().getMonth();

  const currentDate = new Date(2019, currentMonth); // September 2019
  //   const holidays = events
  //     .filter((h) => h.date && h.date.datetime.month === currentMonth + 1) // Filter holidays for September
  //     .map((h) => ({
  //       name: h.name,
  //       date: h.date ? h.date.iso.split("T")[0] : "", // Get the date in "YYYY-MM-DD" format
  //       day: h.date && h.date.datetime ? h.date.datetime.day : null,
  //     }));
  const holidays = events
    .filter((h) => h.date?.datetime?.month === 9)
    .map((h) => ({
      name: h.name,
      date: h.date?.iso.split("T")[0] || "",
      day: h.date?.datetime?.day || null,
    }));
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  //handles when date is clicked
  const handleDateClick = (date) => {
    setSelectedDate(format(date, "yyyy-MM-dd")); //sets the date in particular format
    setIsModalOpen(true); //opens the modal
  };

  //handles when event is added
  const handleAddEvent = () => {
    const updatedEvents = [
      ...events,
      { name: newEventName, date: selectedDate }, //adds the event into the already existing holiday(events) array
    ];
    setEvents(updatedEvents); //updates the events
    setNewEventName("");
    setIsModalOpen(false); //closes the modal
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event.date !== selectedDate);
    setEvents(updatedEvents);
    setIsModalOpen(false); // Close modal after deleting the event
  };

  return (
    <div className="bg-white text-red-950 h-screen grid items-center">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h2 className="text-center text-2xl">
            {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => {
            return (
              <div
                className=" p-3 bg-slate-700 text-white border rounded-sm font-medium text-center"
                key={day}
              >
                {day}
              </div>
            );
          })}
          {Array.from({ length: startingDayIndex }).map((_, index) => {
            return (
              <div
                className="border rounded-sm p-2 text-center h-auto text-sm md:text-base flex justify-center items-center"
                key={`empty-${index}`}
              />
            );
          })}
          {daysInMonth.map((day, index) => {
            const formattedDate = format(day, "yyyy-MM-dd");

            // Check if there is a holiday on this date
            const holiday = holidays.find((h) => h.date === formattedDate);
            const event = events.find((e) => e.date === formattedDate);
            return (
              <div
                onClick={() => handleDateClick(day)}
                className="border rounded-sm p-2 text-center h-auto  text-sm md:text-base flex justify-center flex-col items-center"
                key={index}
              >
                <div>{format(day, "d")}</div> {/* Displays the day number */}
                {holiday ? (
                  <div className="holiday-name bg-slate-300   text-black mt-1">
                    {holiday.name} {/* Displays the holiday name if found */}
                  </div>
                ) : event ? (
                  <div className="event-name text-blue-500 mt-1">
                    {event.name}
                  </div>
                ) : (
                  <div className="no-event text-gray-500 mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Manage Events for {selectedDate}
            </h2>

            <input
              type="text"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="Enter event name"
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex justify-between">
              <button
                onClick={handleAddEvent}
                className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Event
              </button>

              <button
                onClick={handleDeleteEvent}
                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Event
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
