/**
 * Custom view mode for 15-minute intervals.
 * Used with the patched frappe-gantt to enable true 15-minute time-blocking views.
 * 
 * This configuration creates a single-day view with:
 * - 15-minute columns (step = 0.25 hours)
 * - Hour labels on the upper row
 * - Minute markers on the lower row
 * - Thick lines at hour boundaries
 */
export const FIFTEEN_MINUTE_VIEW = {
  name: '15-Minute',
  // Step is in hours for frappe-gantt: 15 minutes = 0.25 hours
  step: 0.25,
  column_width: 40,
  date_format: 'HH:mm',
  
  /**
   * Generates upper header text (hour labels)
   * @param {Date} date - Current column date
   * @param {Date} prevDate - Previous column date (unused)
   * @param {string} lang - Language code (unused)
   * @returns {string} Hour label or empty string
   */
  upper_text: (date, prevDate, lang) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    if (minutes === 0) {
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHour = hours % 12 || 12
      return `${displayHour}:00 ${period}`
    }
    return ''
  },
  
  /**
   * Generates lower header text (minute markers)
   * @param {Date} date - Current column date
   * @param {Date} prevDate - Previous column date (unused)
   * @param {string} lang - Language code (unused)
   * @returns {string} Minute marker
   */
  lower_text: (date, prevDate, lang) => {
    const minutes = date.getMinutes()
    return `:${String(minutes).padStart(2, '0')}`
  },
  
  upper_text_frequency: 4, // Show upper text every 4 columns (every hour)
  
  /**
   * Determines if a column should have a thick line
   * @param {Date} date - Column date
   * @returns {boolean} True if at hour boundary
   */
  thick_line: (date) => date.getMinutes() === 0
}

/**
 * Available view modes for the Gantt chart.
 * Custom modes (like FIFTEEN_MINUTE_VIEW) require the ganttPatch to be applied.
 */
export const VIEW_MODES = {
  FIFTEEN_MINUTE: FIFTEEN_MINUTE_VIEW,
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month'
}

/**
 * Gets today's date formatted as YYYY-MM-DD
 * @returns {string} Today's date string
 */
export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Creates a date-time string for a specific time today
 * @param {number} hours - Hour (0-23)
 * @param {number} minutes - Minutes (0-59)
 * @returns {string} Date-time string in format YYYY-MM-DD HH:mm
 */
export function createTodayTimeString(hours, minutes = 0) {
  const dateStr = getTodayDateString()
  const hoursStr = String(hours).padStart(2, '0')
  const minutesStr = String(minutes).padStart(2, '0')
  return `${dateStr} ${hoursStr}:${minutesStr}`
}
