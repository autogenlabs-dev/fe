import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { zonedTimeToUtc } from "date-fns-tz";
import {
  formatISO,
} from "date-fns-v3";
let loc = "UTC";

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const convertToUTC = (date) => {
  const utcDate = zonedTimeToUtc(date, loc);
  const isoDate = formatISO(utcDate);
  return isoDate;
};

export {
  cn,
  convertToUTC
}