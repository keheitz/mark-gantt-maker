/**
 * Parses a date/time string in format YYYY-MM-DD HH:mm
 * @param {string} dateTimeString - Date/time string in format YYYY-MM-DD HH:mm
 * @returns {Date} Parsed Date object
 */
export function parseDateTime(dateTimeString) {
  if (!dateTimeString) return null
  
  // Handle both YYYY-MM-DD and YYYY-MM-DD HH:mm formats
  if (dateTimeString.includes(' ')) {
    // Format: YYYY-MM-DD HH:mm
    const [datePart, timePart] = dateTimeString.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    return new Date(year, month - 1, day, hours, minutes || 0)
  } else {
    // Format: YYYY-MM-DD (fallback to start of day)
    const [year, month, day] = dateTimeString.split('-').map(Number)
    return new Date(year, month - 1, day, 0, 0)
  }
}

/**
 * Formats a Date object to YYYY-MM-DD HH:mm format
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date/time string
 */
export function formatDateTime(date) {
  if (!date || !(date instanceof Date)) return ''
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * Formats a Date object to YYYY-MM-DD format (for compatibility)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date || !(date instanceof Date)) return ''
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}
