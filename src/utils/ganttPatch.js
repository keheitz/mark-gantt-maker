import Gantt from 'frappe-gantt'

/**
 * Patches frappe-gantt to support custom view modes with arbitrary step values.
 * This enables true 15-minute intervals for single-day time-blocking views.
 * Must be called before creating any Gantt instances.
 */
export function patchGanttForCustomViewModes() {
  // Store reference to original methods
  const originalSetupOptions = Gantt.prototype.setup_options
  const originalUpdateViewScale = Gantt.prototype.update_view_scale
  const originalSetupGanttDates = Gantt.prototype.setup_gantt_dates
  const originalSetupDateValues = Gantt.prototype.setup_date_values
  const originalViewIs = Gantt.prototype.view_is
  const originalGetDateInfo = Gantt.prototype.get_date_info

  // Override setup_options to detect custom view mode early
  Gantt.prototype.setup_options = function(options) {
    // Call original first
    originalSetupOptions.call(this, options)
    
    // Check if view_mode is a custom object and store it
    if (typeof this.options.view_mode === 'object' && this.options.view_mode.name) {
      this._custom_view_mode = this.options.view_mode
    }
  }

  // Override view_is to recognize custom view modes
  Gantt.prototype.view_is = function(modes) {
    if (typeof modes === 'string') {
      modes = [modes]
    }
    
    // Check if current view mode matches any of the provided modes
    if (this._custom_view_mode) {
      return modes.includes(this._custom_view_mode.name)
    }
    
    return originalViewIs.call(this, modes)
  }

  // Override update_view_scale to support custom view modes
  Gantt.prototype.update_view_scale = function(view_mode) {
    // Check if this is a custom view mode object (not a string)
    if (typeof view_mode === 'object' && view_mode.name) {
      this.options.view_mode = view_mode.name
      // Step is in hours for frappe-gantt (e.g., 24 = 1 day, 6 = quarter day)
      // 15 minutes = 0.25 hours
      this.options.step = view_mode.step
      this.options.column_width = view_mode.column_width || 40
      
      // Store custom view mode for reference
      this._custom_view_mode = view_mode
      return
    }
    
    // Check if we have a stored custom view mode by name
    if (this._custom_view_mode && view_mode === this._custom_view_mode.name) {
      this.options.view_mode = this._custom_view_mode.name
      this.options.step = this._custom_view_mode.step
      this.options.column_width = this._custom_view_mode.column_width || 40
      return
    }
    
    // Clear custom view mode when switching to built-in mode
    this._custom_view_mode = null
    
    // Fall back to original behavior for built-in modes
    originalUpdateViewScale.call(this, view_mode)
  }

  // Override setup_gantt_dates to handle custom view modes with minimal padding
  Gantt.prototype.setup_gantt_dates = function() {
    // If not a custom view mode, use original behavior
    if (!this._custom_view_mode) {
      return originalSetupGanttDates.call(this)
    }

    // Custom handling for 15-minute (and similar granular) view modes
    this.gantt_start = this.gantt_end = null

    for (let task of this.tasks) {
      // Set global start and end date
      if (!this.gantt_start || task._start < this.gantt_start) {
        this.gantt_start = task._start
      }
      if (!this.gantt_end || task._end > this.gantt_end) {
        this.gantt_end = task._end
      }
    }

    // For 15-minute view, use minimal padding (1 hour before and after)
    // Round start to the beginning of the hour, then subtract 1 hour for padding
    this.gantt_start = new Date(this.gantt_start)
    this.gantt_start.setMinutes(0, 0, 0)
    this.gantt_start = new Date(this.gantt_start.getTime() - 60 * 60 * 1000) // 1 hour before
    
    // Round end to the end of the hour, then add 1 hour for padding
    this.gantt_end = new Date(this.gantt_end)
    this.gantt_end.setMinutes(0, 0, 0)
    this.gantt_end = new Date(this.gantt_end.getTime() + 2 * 60 * 60 * 1000) // 2 hours after
  }

  // Override setup_date_values to handle custom view modes
  Gantt.prototype.setup_date_values = function() {
    // If not a custom view mode, use original behavior
    if (!this._custom_view_mode) {
      return originalSetupDateValues.call(this)
    }

    // Custom date value generation for 15-minute increments
    this.dates = []
    let cur_date = new Date(this.gantt_start)
    
    // Safety limit to prevent infinite loops
    const maxIterations = 1000
    let iterations = 0
    
    while (cur_date < this.gantt_end && iterations < maxIterations) {
      this.dates.push(new Date(cur_date))
      // Add step hours (0.25 for 15 minutes)
      cur_date = new Date(cur_date.getTime() + this.options.step * 60 * 60 * 1000)
      iterations++
    }
  }

  // Override get_date_info to handle custom view modes
  Gantt.prototype.get_date_info = function(date, last_date, i) {
    // If not a custom view mode, use original behavior
    if (!this._custom_view_mode) {
      return originalGetDateInfo.call(this, date, last_date, i)
    }

    if (!last_date) {
      last_date = new Date(date.getTime() - 15 * 60 * 1000) // 15 minutes before
    }

    const hours = date.getHours()
    const minutes = date.getMinutes()
    
    // Format time for display
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHour = hours % 12 || 12
    
    // Lower text: show minutes for all columns
    const lower_text = `:${String(minutes).padStart(2, '0')}`
    
    // Upper text: show hour label only at the start of each hour
    let upper_text = ''
    if (minutes === 0) {
      upper_text = `${displayHour}:00 ${period}`
    }

    const base_x = i * this.options.column_width

    return {
      upper_text,
      lower_text,
      upper_x: base_x,
      lower_x: base_x + this.options.column_width / 2,
      upper_y: this.options.header_height - 25,
      lower_y: this.options.header_height,
    }
  }

  // Add custom VIEW_MODE entry for easy reference
  if (Gantt.VIEW_MODE) {
    Gantt.VIEW_MODE = {
      ...Gantt.VIEW_MODE,
      FIFTEEN_MINUTE: '15-Minute'
    }
  }

  console.log('[ganttPatch] frappe-gantt patched for custom view modes')
}
