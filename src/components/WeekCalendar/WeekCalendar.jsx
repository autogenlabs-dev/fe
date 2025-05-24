import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  format,
} from "date-fns-v3";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const WeekCalendar = ({selectedWeek, setSelectedWeek}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const dispatch = useDispatch();
  const timeSheetData = useSelector(timeSheetSelector);
  const isLoading = useSelector((state) => state.timeSheetData.loading);

  const handleDayClick = (day) => {
    let week = {
      from: startOfWeek(day, { weekStartsOn: 1 }), // use the startOfWeek function from date-fns to get the from of the week, setting Monday as the first day
      to: endOfWeek(day, { weekStartsOn: 1 }), // use the endOfWeek function from date-fns to get the to of the week, setting Monday as the first day
    };
    setSelectedWeek(week);
    setShowCalendar(false);
  };

  const { from, to } = selectedWeek || {};

  const modifiers = { from, to };

  return (
    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedWeek && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
              </>
            ) : (
              format(from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          selected={selectedWeek}
          initialFocus
          modifiers={modifiers}
          onDayClick={handleDayClick}
          fixedWeeks
          weekStartsOn={1}
          mode="range"
          defaultMonth={selectedWeek?.from}
        />
      </PopoverContent>
    </Popover>
  );
};

export default WeekCalendar;
