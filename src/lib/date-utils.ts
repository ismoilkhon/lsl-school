import { type Locale } from "@/lib/translations";

/**
 * Format a date string or Date object according to the user's locale
 */
export const formatDate = (
  date: string | Date | null | undefined,
  locale: Locale = "en",
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a date and time according to the user's locale
 */
export const formatDateTime = (
  date: string | Date | null | undefined,
  locale: Locale = "en",
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a time only according to the user's locale
 */
export const formatTime = (
  date: string | Date | null | undefined,
  locale: Locale = "en"
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined,
  locale: Locale = "en"
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

  const intervals = [
    { unit: "year" as const, seconds: 31536000 },
    { unit: "month" as const, seconds: 2592000 },
    { unit: "week" as const, seconds: 604800 },
    { unit: "day" as const, seconds: 86400 },
    { unit: "hour" as const, seconds: 3600 },
    { unit: "minute" as const, seconds: 60 },
  ];

  for (const { unit, seconds } of intervals) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      return rtf.format(diffInSeconds < 0 ? -interval : interval, unit);
    }
  }

  return rtf.format(0, "second");
};

/**
 * Format a date range
 */
export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  locale: Locale = "en"
): string => {
  if (!startDate || !endDate) return "";
  
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }

  const startFormatted = formatDate(start, locale, { month: "short", day: "numeric" });
  const endFormatted = formatDate(end, locale, { month: "short", day: "numeric", year: "numeric" });
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Format a number according to the user's locale
 */
export const formatNumber = (
  value: number | string | null | undefined,
  locale: Locale = "en",
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined || value === "") return "";
  
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (Number.isNaN(num)) {
    return "";
  }

  return new Intl.NumberFormat(locale, options).format(num);
};

/**
 * Format currency according to the user's locale
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  locale: Locale = "en",
  currency: string = "USD"
): string => {
  if (value === null || value === undefined || value === "") return "";
  
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (Number.isNaN(num)) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);
};

