import { useState, useEffect } from 'react'
import './TaskEditor.css'

/**
 * Gets today's date string in YYYY-MM-DD format
 */
function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats a date string for display (e.g., "Fri, Jan 3, 2026")
 */
function formatDateForDisplay(dateString) {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/**
 * Time picker component with hour, minute, and AM/PM selection
 */
function TimePicker({ hour, minute, period, onChange, label }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  
  return (
    <div className="time-picker-container">
      <label className="time-picker-main-label">{label}</label>
      <div className="time-picker">
        <div className="time-picker-group">
          <label className="time-picker-label">Hour</label>
          <select
            className="time-select"
            value={hour}
            onChange={(e) => onChange('hour', parseInt(e.target.value))}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <span className="time-separator">:</span>
        <div className="time-picker-group">
          <label className="time-picker-label">Min</label>
          <select
            className="time-select"
            value={minute}
            onChange={(e) => onChange('minute', parseInt(e.target.value))}
          >
            {minutes.map(m => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        <div className="time-picker-group">
          <label className="time-picker-label">AM/PM</label>
          <select
            className="time-select period-select"
            value={period}
            onChange={(e) => onChange('period', e.target.value)}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/**
 * Time-only picker that uses the provided date
 */
function TimeOnlyPicker({ value, dateString, onChange, label }) {
  // Parse existing value or use defaults
  const parseValue = () => {
    if (!value) {
      const now = new Date()
      return {
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        period: now.getHours() >= 12 ? 'PM' : 'AM'
      }
    }
    
    // Parse YYYY-MM-DD HH:mm format
    const [, timePart] = value.split(' ')
    const [hours24, mins] = (timePart || '09:00').split(':').map(Number)
    
    const hour = hours24 % 12 || 12
    const period = hours24 >= 12 ? 'PM' : 'AM'
    
    return { hour, minute: mins, period }
  }
  
  const { hour, minute, period } = parseValue()
  
  const handleTimeChange = (field, val) => {
    let newHour = hour
    let newMinute = minute
    let newPeriod = period
    
    if (field === 'hour') newHour = val
    else if (field === 'minute') newMinute = val
    else if (field === 'period') newPeriod = val
    
    // Convert to 24-hour format
    let hours24 = newHour
    if (newPeriod === 'PM' && newHour !== 12) {
      hours24 = newHour + 12
    } else if (newPeriod === 'AM' && newHour === 12) {
      hours24 = 0
    }
    
    const hourStr = String(hours24).padStart(2, '0')
    const minStr = String(newMinute).padStart(2, '0')
    
    onChange(`${dateString} ${hourStr}:${minStr}`)
  }
  
  return (
    <TimePicker
      hour={hour}
      minute={minute}
      period={period}
      onChange={handleTimeChange}
      label={label}
    />
  )
}

/**
 * Dependency selector component for choosing task dependencies
 */
function DependencySelector({ selectedDependencies, availableTasks, onChange, currentTaskId }) {
  // Filter out current task and sort by start time descending (most recent first)
  const filteredTasks = availableTasks
    .filter(t => t.id !== currentTaskId)
    .sort((a, b) => {
      // Parse start times for comparison
      const getTime = (task) => {
        if (!task.start) return 0
        const [datePart, timePart] = task.start.split(' ')
        const [year, month, day] = datePart.split('-').map(Number)
        const [hours, minutes] = (timePart || '00:00').split(':').map(Number)
        return new Date(year, month - 1, day, hours, minutes).getTime()
      }
      return getTime(b) - getTime(a) // Descending order
    })
  
  // Ensure selectedDependencies is a string before splitting
  const depsString = typeof selectedDependencies === 'string' ? selectedDependencies : String(selectedDependencies || '')
  const selectedIds = depsString.split(',').filter(Boolean).map(s => s.trim())
  
  const toggleDependency = (taskId) => {
    let newDeps
    if (selectedIds.includes(taskId)) {
      newDeps = selectedIds.filter(id => id !== taskId)
    } else {
      newDeps = [...selectedIds, taskId]
    }
    onChange(newDeps.join(','))
  }
  
  if (filteredTasks.length === 0) {
    return (
      <div className="dependency-selector empty">
        <p className="no-tasks-message">No other tasks available for dependencies</p>
      </div>
    )
  }
  
  return (
    <div className="dependency-selector">
      {filteredTasks.map(task => (
        <label key={task.id} className="dependency-option">
          <input
            type="checkbox"
            checked={selectedIds.includes(task.id)}
            onChange={() => toggleDependency(task.id)}
          />
          <span className="dependency-name">{task.name}</span>
          <span className="dependency-id">({task.id})</span>
        </label>
      ))}
    </div>
  )
}

/**
 * Main TaskEditor component for adding and editing tasks
 */
function TaskEditor({ task, allTasks = [], onSave, onCancel }) {
  // Get the date from the task or default to today
  const getDateFromTask = () => {
    if (task?.start) {
      const [datePart] = task.start.split(' ')
      return datePart
    }
    return getTodayDateString()
  }

  // Initialize with today's date and default times if no task provided
  const getDefaultStart = (dateStr) => {
    const date = dateStr || getTodayDateString()
    if (task?.start) {
      const [, timePart] = task.start.split(' ')
      return `${date} ${timePart}`
    }
    return `${date} 09:00`
  }
  
  const getDefaultEnd = (dateStr) => {
    const date = dateStr || getTodayDateString()
    if (task?.end) {
      const [, timePart] = task.end.split(' ')
      return `${date} ${timePart}`
    }
    return `${date} 10:00`
  }
  
  const [selectedDate, setSelectedDate] = useState(getDateFromTask)
  
  const [formData, setFormData] = useState({
    name: task?.name || '',
    start: getDefaultStart(selectedDate),
    end: getDefaultEnd(selectedDate),
    progress: task?.progress || 0,
    dependencies: task?.dependencies || ''
  })
  
  const [errors, setErrors] = useState({})

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      const taskDate = task.start ? task.start.split(' ')[0] : getTodayDateString()
      setSelectedDate(taskDate)
      setFormData({
        name: task.name || '',
        start: task.start || getDefaultStart(taskDate),
        end: task.end || getDefaultEnd(taskDate),
        progress: task.progress || 0,
        dependencies: task.dependencies || ''
      })
    }
  }, [task])

  // Update start/end times when date changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    
    // Update start and end times with new date
    const startTime = formData.start.split(' ')[1] || '09:00'
    const endTime = formData.end.split(' ')[1] || '10:00'
    
    setFormData(prev => ({
      ...prev,
      start: `${newDate} ${startTime}`,
      end: `${newDate} ${endTime}`
    }))
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required'
    }
    
    if (!formData.start) {
      newErrors.start = 'Start time is required'
    }
    
    if (!formData.end) {
      newErrors.end = 'End time is required'
    }
    
    // Validate that end is after start
    if (formData.start && formData.end) {
      const [startDatePart, startTimePart] = formData.start.split(' ')
      const [endDatePart, endTimePart] = formData.end.split(' ')
      
      const [sYear, sMonth, sDay] = startDatePart.split('-').map(Number)
      const [sHours, sMinutes] = startTimePart.split(':').map(Number)
      const startDate = new Date(sYear, sMonth - 1, sDay, sHours, sMinutes)
      
      const [eYear, eMonth, eDay] = endDatePart.split('-').map(Number)
      const [eHours, eMinutes] = endTimePart.split(':').map(Number)
      const endDate = new Date(eYear, eMonth - 1, eDay, eHours, eMinutes)
      
      if (endDate <= startDate) {
        newErrors.end = 'End time must be after start time'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    onSave({
      ...formData,
      progress: parseInt(formData.progress) || 0
    })
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="task-editor-overlay" onClick={onCancel}>
      <form 
        onSubmit={handleSubmit} 
        className="task-editor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-editor-header">
          <h2>{task?.id ? 'Edit Task' : 'Add New Task'}</h2>
          <button type="button" className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>
        
        <div className="task-editor-body">
          <div className="form-group">
            <label htmlFor="name">
              Task Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter task name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="date-input"
              />
              <span className="date-display">{formatDateForDisplay(selectedDate)}</span>
            </div>
          </div>

          <div className="form-row time-row">
            <div className="form-group">
              <TimeOnlyPicker
                value={formData.start}
                dateString={selectedDate}
                onChange={(val) => handleChange('start', val)}
                label={<>Start Time <span className="required">*</span></>}
              />
              {errors.start && <span className="error-text">{errors.start}</span>}
            </div>

            <div className="form-group">
              <TimeOnlyPicker
                value={formData.end}
                dateString={selectedDate}
                onChange={(val) => handleChange('end', val)}
                label={<>End Time <span className="required">*</span></>}
              />
              {errors.end && <span className="error-text">{errors.end}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="progress">Progress: {formData.progress}%</label>
            <div className="progress-input-group">
              <input
                type="range"
                id="progress"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                min="0"
                max="100"
                className="progress-slider"
              />
              <input
                type="number"
                value={formData.progress}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                  handleChange('progress', val)
                }}
                min="0"
                max="100"
                className="progress-number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dependencies</label>
            <DependencySelector
              selectedDependencies={formData.dependencies}
              availableTasks={allTasks}
              onChange={(val) => handleChange('dependencies', val)}
              currentTaskId={task?.id}
            />
            <small className="help-text">Select tasks that must complete before this task can start</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {task?.id ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskEditor
