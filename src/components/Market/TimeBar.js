import React from "react";
import "./TimeBar.css";

const TimeBar = () => {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const month = d.toLocaleString("default", { month: "long" });
      setDate(`${month} ${""} ${d.getDate()}, ${d.getFullYear()}`);

      const t = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(t);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time-date-section">
      <span id="current-date-display">{date}</span>
      <span>{time}</span>
    </div>
  );
};

export default TimeBar;
