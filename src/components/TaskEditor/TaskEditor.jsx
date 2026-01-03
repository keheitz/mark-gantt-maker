import { useState, useEffect } from 'react'
import { formatDateTime, parseDateTime } from '../../utils/dateUtils'
import './TaskEditor.css'

function TaskEditor({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    start: task?.start || '',
    end: task?.end || '',
    progress: task?.progress || 0,
    dependencies: task?.dependencies || '',
    custom_class: task?.custom_class || ''
  })

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        start: task.start || '',
        end: task.end || '',
        progress: task.progress || 0,
        dependencies: task.dependencies || '',
        custom_class: task.custom_class || ''
      })
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate date/time format (YYYY-MM-DD HH:mm)
    const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
    
    if (formData.start && !dateTimePattern.test(formData.start)) {
      alert('Start date/time must be in format YYYY-MM-DD HH:mm (e.g., 2024-01-15 09:00)')
      return
    }
    
    if (formData.end && !dateTimePattern.test(formData.end)) {
      alert('End date/time must be in format YYYY-MM-DD HH:mm (e.g., 2024-01-15 12:00)')
      return
    }

    // Validate that end is after start
    if (formData.start && formData.end) {
      const startDate = parseDateTime(formData.start)
      const endDate = parseDateTime(formData.end)
      if (startDate && endDate && endDate <= startDate) {
        alert('End date/time must be after start date/time')
        return
      }
    }

    onSave(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Helper to get current date/time in YYYY-MM-DD HH:mm format for default values
  const getDefaultDateTime = () => {
    const now = new Date()
    return formatDateTime(now)
  }

  return (
    <form onSubmit={handleSubmit} className="task-editor">
      <div className="form-group">
        <label htmlFor="name">
          Task Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="Enter task name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start">
            Start Date/Time <span className="required">*</span>
          </label>
          <input
            type="text"
            id="start"
            value={formData.start}
            onChange={(e) => handleChange('start', e.target.value)}
            required
            placeholder="YYYY-MM-DD HH:mm (e.g., 2024-01-15 09:00)"
            pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}"
            title="Format: YYYY-MM-DD HH:mm (e.g., 2024-01-15 09:00)"
          />
          <small className="help-text">Format: YYYY-MM-DD HH:mm</small>
        </div>

        <div className="form-group">
          <label htmlFor="end">
            End Date/Time <span className="required">*</span>
          </label>
          <input
            type="text"
            id="end"
            value={formData.end}
            onChange={(e) => handleChange('end', e.target.value)}
            required
            placeholder="YYYY-MM-DD HH:mm (e.g., 2024-01-15 12:00)"
            pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}"
            title="Format: YYYY-MM-DD HH:mm (e.g., 2024-01-15 12:00)"
          />
          <small className="help-text">Format: YYYY-MM-DD HH:mm</small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="progress">Progress (%)</label>
        <input
          type="number"
          id="progress"
          value={formData.progress}
          onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
          min="0"
          max="100"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dependencies">Dependencies</label>
        <input
          type="text"
          id="dependencies"
          value={formData.dependencies}
          onChange={(e) => handleChange('dependencies', e.target.value)}
          placeholder="Comma-separated task IDs (e.g., task-1,task-2)"
        />
        <small className="help-text">Comma-separated task IDs</small>
      </div>

      <div className="form-group">
        <label htmlFor="custom_class">Custom CSS Class</label>
        <input
          type="text"
          id="custom_class"
          value={formData.custom_class}
          onChange={(e) => handleChange('custom_class', e.target.value)}
          placeholder="Optional CSS class for styling"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {task?.id ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskEditor
