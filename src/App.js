import React, { useEffect, useState } from "react";
import data from "./calendar.json";
import EventCalendar from "./EventCalendar";
import { addDays, subDays } from "date-fns";
import "./App.css";

function App() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    setHolidays(data.response.holidays);
    console.log(holidays);
  });

  return (
    <div className="">
      <EventCalendar events={holidays} />
    </div>
  );
}

export default App;
