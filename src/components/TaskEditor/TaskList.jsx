import { useState } from 'react'
import TaskEditor from './TaskEditor'
import './TaskEditor.css'

/**
 * Formats a datetime string for display
 * @param {string} dateTimeStr - Date/time string in YYYY-MM-DD HH:mm format
 * @returns {string} Formatted display string
 */
function formatDisplayDateTime(dateTimeStr) {
  if (!dateTimeStr) return ''
  
  const [datePart, timePart] = dateTimeStr.split(' ')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours24, minutes] = (timePart || '00:00').split(':').map(Number)
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hour12 = hours24 % 12 || 12
  const period = hours24 >= 12 ? 'PM' : 'AM'
  
  return `${monthNames[month - 1]} ${day} at ${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

/**
 * Single task row component
 */
function TaskRow({ task, onEdit, onDelete, allTasks, isSelected, onSelect }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  
  // Get dependency task names
  const getDependencyNames = () => {
    if (!task.dependencies) return null
    // Ensure dependencies is a string before splitting
    const depsString = typeof task.dependencies === 'string' ? task.dependencies : String(task.dependencies || '')
    if (!depsString) return null
    const depIds = depsString.split(',').filter(Boolean).map(s => s.trim())
    const depNames = depIds.map(id => {
      const depTask = allTasks.find(t => t.id === id)
      return depTask ? depTask.name : id
    })
    return depNames.join(', ')
  }
  
  const dependencyNames = getDependencyNames()
  
  return (
    <div 
      className={`task-row ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(task.id)}
    >
      <div className="task-info">
        <div className="task-name-row">
          <span className="task-name">{task.name}</span>
          <span className="task-id">ID: {task.id}</span>
        </div>
        <div className="task-times">
          <span className="task-time">
            <span className="time-label">Start:</span> {formatDisplayDateTime(task.start)}
          </span>
          <span className="time-arrow">→</span>
          <span className="task-time">
            <span className="time-label">End:</span> {formatDisplayDateTime(task.end)}
          </span>
        </div>
        <div className="task-meta">
          <div className="task-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
            <span className="progress-text">{task.progress || 0}%</span>
          </div>
          {dependencyNames && (
            <span className="task-dependencies">
              <span className="dep-label">Depends on:</span> {dependencyNames}
            </span>
          )}
        </div>
      </div>
      
      <div className="task-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button"
          className="btn-icon edit" 
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        
        {showConfirmDelete ? (
          <div className="delete-confirm">
            <span className="delete-confirm-text">Delete?</span>
            <button 
              type="button"
              className="btn-icon confirm-yes" 
              onClick={() => {
                onDelete(task.id)
                setShowConfirmDelete(false)
              }}
              title="Confirm delete"
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button 
              type="button"
              className="btn-icon confirm-no" 
              onClick={() => setShowConfirmDelete(false)}
              title="Cancel delete"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ) : (
          <button 
            type="button"
            className="btn-icon delete" 
            onClick={() => setShowConfirmDelete(true)}
            title="Delete task"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * TaskList component for displaying and managing all tasks
 */
function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, selectedTaskId, setSelectedTaskId }) {
  const [editingTask, setEditingTask] = useState(null)
  const [isAddingTask, setIsAddingTask] = useState(false)
  
  const handleSave = (formData) => {
    if (editingTask?.id) {
      onUpdateTask(editingTask.id, formData)
    } else {
      onAddTask(formData)
    }
    setEditingTask(null)
    setIsAddingTask(false)
  }
  
  const handleCancel = () => {
    setEditingTask(null)
    setIsAddingTask(false)
  }
  
  const handleEdit = (task) => {
    setEditingTask(task)
    setIsAddingTask(false)
  }
  
  const handleAddNew = () => {
    setEditingTask(null)
    setIsAddingTask(true)
  }

  const handleSelect = (taskId) => {
    setSelectedTaskId(prevId => prevId === taskId ? null : taskId)
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <button 
          type="button"
          className="btn-add-task" 
          onClick={handleAddNew}
        >
          <i className="fa-solid fa-plus"></i>
          Add Task
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-solid fa-clipboard-list"></i></div>
          <p className="empty-title">No tasks yet</p>
          <p className="empty-subtitle">Click "Add Task" to create your first task</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={onDeleteTask}
              allTasks={tasks}
              isSelected={selectedTaskId === task.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
      
      {(editingTask || isAddingTask) && (
        <TaskEditor
          task={editingTask}
          allTasks={tasks}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default TaskList
