// Format a number as currency
export function formatCurrency(amount: number, locale = "vi-VN", currency = "VND"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

// Format a date
export function formatDate(date: Date | string, locale = "vi-VN"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

// Format a phone number
export function formatPhoneNumber(phoneNumber: string): string {
  // Example: format 0123456789 to 012-345-6789
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
}

