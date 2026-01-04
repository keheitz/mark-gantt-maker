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
function TimePicker({ hour, minute, period, onChange, label, idPrefix }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  
  return (
    <div className="time-picker-container">
      <label className="time-picker-main-label">{label}</label>
      <div className="time-picker">
        <div className="time-picker-group">
          <label htmlFor={`${idPrefix}-hour`} className="time-picker-label">Hour</label>
          <select
            id={`${idPrefix}-hour`}
            className="time-select"
            value={hour}
            onChange={(e) => onChange('hour', parseInt(e.target.value))}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <span className="time-separator" aria-hidden="true">:</span>
        <div className="time-picker-group">
          <label htmlFor={`${idPrefix}-min`} className="time-picker-label">Min</label>
          <select
            id={`${idPrefix}-min`}
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
          <label htmlFor={`${idPrefix}-period`} className="time-picker-label">AM/PM</label>
          <select
            id={`${idPrefix}-period`}
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
function TimeOnlyPicker({ value, dateString, onChange, label, idPrefix }) {
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
      idPrefix={idPrefix}
    />
  )
}

/**
 * Detects if adding a dependency would create a circular dependency chain
 * @param {string} currentTaskId - The task being edited
 * @param {string[]} proposedDependencies - Dependencies to check
 * @param {Array} allTasks - All tasks in the project
 * @returns {string|null} - Error message if circular, null if valid
 */
function detectCircularDependency(currentTaskId, proposedDependencies, allTasks) {
  if (!currentTaskId || proposedDependencies.length === 0) return null
  
  // Build a map of task dependencies for quick lookup
  const depsMap = new Map()
  allTasks.forEach(task => {
    // Ensure dependencies is a string before splitting
    const depsValue = task.dependencies
    const depsString = typeof depsValue === 'string' ? depsValue : String(depsValue || '')
    const deps = depsString ? depsString.split(',').filter(Boolean).map(d => d.trim()) : []
    depsMap.set(task.id, deps)
  })
  
  // For the current task, use proposed dependencies
  depsMap.set(currentTaskId, proposedDependencies)
  
  // Check each proposed dependency to see if it eventually depends on currentTaskId
  const visited = new Set()
  const visiting = new Set()
  
  function hasCycle(taskId) {
    if (visiting.has(taskId)) return true // Cycle detected
    if (visited.has(taskId)) return false // Already checked, no cycle
    
    visiting.add(taskId)
    
    const deps = depsMap.get(taskId) || []
    for (const dep of deps) {
      if (hasCycle(dep)) return true
    }
    
    visiting.delete(taskId)
    visited.add(taskId)
    return false
  }
  
  // Start from current task
  if (hasCycle(currentTaskId)) {
    return 'This would create a circular dependency. Tasks cannot depend on each other in a loop.'
  }
  
  return null
}

/**
 * Multi-select dropdown for choosing task dependencies
 */
function DependencySelector({ selectedDependencies, availableTasks, onChange, currentTaskId, error, ariaLabelledBy }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  
  // Filter out current task and sort by name
  const filteredTasks = availableTasks
    .filter(t => t.id !== currentTaskId)
    .sort((a, b) => a.name.localeCompare(b.name))
  
  // Ensure selectedDependencies is a string before splitting
  const depsString = typeof selectedDependencies === 'string' ? selectedDependencies : String(selectedDependencies || '')
  const selectedIds = depsString.split(',').filter(Boolean).map(s => s.trim())
  
  const toggleDependency = (taskId, e) => {
    if (e) e.stopPropagation()
    let newDeps
    if (selectedIds.includes(taskId)) {
      newDeps = selectedIds.filter(id => id !== taskId)
    } else {
      newDeps = [...selectedIds, taskId]
    }
    onChange(newDeps.join(','))
  }
  
  const removeDependency = (taskId, e) => {
    e.stopPropagation()
    const newDeps = selectedIds.filter(id => id !== taskId)
    onChange(newDeps.join(','))
  }
  
  const getTaskName = (taskId) => {
    const task = availableTasks.find(t => t.id === taskId)
    return task ? task.name : taskId
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        setIsOpen(true)
        setFocusedIndex(0)
      } else if (focusedIndex >= 0) {
        toggleDependency(filteredTasks[focusedIndex].id)
      }
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      if (!isOpen) {
        setIsOpen(true)
        setFocusedIndex(0)
      } else {
        setFocusedIndex(prev => (prev + 1) % filteredTasks.length)
      }
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      if (isOpen) {
        setFocusedIndex(prev => (prev - 1 + filteredTasks.length) % filteredTasks.length)
      }
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      e.preventDefault()
    }
  }
  
  if (filteredTasks.length === 0) {
    return (
      <div className="dependency-selector empty">
        <p className="no-tasks-message">No other tasks available for dependencies</p>
      </div>
    )
  }
  
  return (
    <div className="dependency-multiselect">
      <div 
        className={`dependency-select-trigger ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={ariaLabelledBy}
        aria-controls="dependency-listbox"
      >
        <div className="selected-deps">
          {selectedIds.length === 0 ? (
            <span className="placeholder">Select dependencies...</span>
          ) : (
            selectedIds.map(id => (
              <span key={id} className="dep-tag">
                {getTaskName(id)}
                <button 
                  type="button"
                  className="dep-tag-remove" 
                  onClick={(e) => removeDependency(id, e)}
                  aria-label={`Remove ${getTaskName(id)}`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <span className="dropdown-arrow" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div 
          id="dependency-listbox"
          className="dependency-dropdown"
          role="listbox"
          aria-multiselectable="true"
        >
          {filteredTasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`dependency-option ${selectedIds.includes(task.id) ? 'selected' : ''} ${focusedIndex === index ? 'focused' : ''}`}
              onClick={(e) => toggleDependency(task.id, e)}
              role="option"
              aria-selected={selectedIds.includes(task.id)}
            >
              <span className="dep-checkbox" aria-hidden="true">
                {selectedIds.includes(task.id) ? '✓' : ''}
              </span>
              <span className="dependency-name">{task.name}</span>
              <span className="dependency-id" aria-label={`Task ID: ${task.id}`}>({task.id})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Main TaskEditor component for adding and editing tasks
 */
function TaskEditor({ task, allTasks = [], onSave, onCancel }) {
  // Add escape key handler and focus trapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Focus the first input on mount
    const firstInput = document.getElementById('name')
    if (firstInput) firstInput.focus()
    
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

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
    
    // Validate circular dependencies
    if (task?.id && formData.dependencies) {
      // Ensure dependencies is a string before splitting
      const depsString = typeof formData.dependencies === 'string' 
        ? formData.dependencies 
        : String(formData.dependencies || '')
      const proposedDeps = depsString.split(',').filter(Boolean).map(d => d.trim())
      const circularError = detectCircularDependency(task.id, proposedDeps, allTasks)
      if (circularError) {
        newErrors.dependencies = circularError
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
    <div 
      className="task-editor-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <form 
        onSubmit={handleSubmit} 
        className="task-editor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-editor-header">
          <h2 id="modal-title">{task?.id ? 'Edit Task' : 'Add New Task'}</h2>
          <button 
            type="button" 
            className="close-btn" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        
        <div className="task-editor-body">
          <div className="form-group">
            <label htmlFor="name">
              Task Name <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter task name"
              className={errors.name ? 'error' : ''}
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <span className="error-text" id="name-error">{errors.name}</span>}
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
                aria-label="Select task date"
              />
              <span className="date-display" aria-hidden="true">{formatDateForDisplay(selectedDate)}</span>
            </div>
          </div>

          <div className="form-row time-row">
            <div className="form-group">
              <TimeOnlyPicker
                value={formData.start}
                dateString={selectedDate}
                onChange={(val) => handleChange('start', val)}
                label={<>Start Time <span className="required" aria-hidden="true">*</span></>}
                idPrefix="start-time"
              />
              {errors.start && <span className="error-text">{errors.start}</span>}
            </div>

            <div className="form-group">
              <TimeOnlyPicker
                value={formData.end}
                dateString={selectedDate}
                onChange={(val) => handleChange('end', val)}
                label={<>End Time <span className="required" aria-hidden="true">*</span></>}
                idPrefix="end-time"
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
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={formData.progress}
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
                aria-label="Progress percentage"
              />
            </div>
          </div>

          <div className="form-group">
            <label id="deps-label">Dependencies</label>
            <DependencySelector
              selectedDependencies={formData.dependencies}
              availableTasks={allTasks}
              onChange={(val) => handleChange('dependencies', val)}
              currentTaskId={task?.id}
              error={errors.dependencies}
              ariaLabelledBy="deps-label"
            />
            {errors.dependencies && (
              <span className="error-text" id="deps-error">
                {errors.dependencies}
              </span>
            )}
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
