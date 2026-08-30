import { hours } from "./site";

export const TIME_ZONE = "America/Chicago";

/** Current weekday and minutes past midnight in the shop's own timezone. */
export function nowInShopTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = weekdays.indexOf(lookup.weekday ?? "Sun");
  const hour = Number(lookup.hour ?? 0) % 24;
  const minute = Number(lookup.minute ?? 0);
  return { day: day < 0 ? 0 : day, minutes: hour * 60 + minute };
}

function toMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export type OpenState = {
  isOpen: boolean;
  /** Closing time when open, next opening time when closed. */
  boundary: string;
  day: number;
};

export function getOpenState(date = new Date()): OpenState {
  const { day, minutes } = nowInShopTime(date);
  const today = hours[day];
  const open = toMinutes(today.open);
  const close = toMinutes(today.close);

  if (minutes >= open && minutes < close) {
    return { isOpen: true, boundary: today.close, day };
  }

  // Before opening today, or after closing and waiting on tomorrow.
  const nextDay = minutes < open ? day : (day + 1) % 7;
  return { isOpen: false, boundary: hours[nextDay].open, day };
}
