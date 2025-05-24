import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  startOfMonth,
  endOfMonth
} from "date-fns-v3";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const MonthCalendar = ({selectedMonth, setSelectedMonth}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDayClick = (day) => {
    // console.log("day", day);
    setSelectedMonth(day);
    setShowCalendar(false);
  };

  const modifiers = { from: startOfMonth(selectedMonth), to: endOfMonth(selectedMonth) };

  return (
    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !selectedMonth && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedMonth, "LLLL y")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999]">
        <Calendar
          className={""}
          selected={modifiers}
          modifiers={modifiers}
          mode="range"
          initialFocus
          onDayClick={handleDayClick}
          month={selectedMonth}
          captionLayout="dropdown"
          fromMonth={new Date(1999, 11, 31)}
          toMonth={new Date(2499, 11, 31)}
          onMonthChange={(month) => {
            setSelectedMonth(month);
            setShowCalendar(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MonthCalendar;
