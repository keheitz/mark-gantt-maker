import { useState, useRef, useEffect, useMemo } from 'react'
import GanttChart from './components/GanttChart/GanttChart'
import TaskList from './components/TaskEditor/TaskList'
import ThemeModal from './components/ThemeSelector/ThemeModal'
import ExportControls from './components/ExportControls/ExportControls'
import { useGanttData } from './hooks/useGanttData'
import { useTheme } from './hooks/useTheme'
import { useAutoSave } from './hooks/useAutoSave'
import { loadFromLocalStorage, clearLocalStorage } from './utils/localStorage'
import { getTodayDateString } from './utils/viewModes'
import './styles/globals.css'
import './styles/themes.css'

/**
 * Gets today's date and creates a single example task for the initial state.
 * @returns {Array} Array with one example task object
 */
function getSampleTasks() {
  const today = getTodayDateString()
  
  return [
    {
      id: 'task-1',
      name: 'Example Task',
      start: `${today} 09:00`,
      end: `${today} 10:00`,
      progress: 0
    }
  ]
}

function App() {
  const { tasks, addTask, updateTask, deleteTask, replaceTasks } = useGanttData(() => {
    const saved = loadFromLocalStorage()
    // Check if saved exists and has a tasks array (even if empty)
    if (saved && Array.isArray(saved.tasks)) {
      return saved.tasks
    }
    return getSampleTasks()
  })
  
  const { theme, setTheme } = useTheme()
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)
  const ganttRef = useRef(null)

  // Memoize data to prevent unnecessary auto-save triggers on every render
  const autoSaveData = useMemo(() => ({ tasks }), [tasks])
  useAutoSave(autoSaveData)

  /**
   * Resets the chart to the original sample tasks and clears storage
   */
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the chart? This will clear all your tasks.')) {
      clearLocalStorage()
      replaceTasks(getSampleTasks())
    }
  }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      // Ctrl/Cmd + Shift + S: Save
      if (modifier && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setSaveStatus('Saving...')
        setTimeout(() => {
          setSaveStatus('Saved!')
          setTimeout(() => setSaveStatus(null), 2000)
        }, 300)
      }

      // Ctrl/Cmd + Shift + E: Export PDF
      if (modifier && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        // Find the export button and click it
        const exportBtn = document.querySelector('.export-btn')
        if (exportBtn) exportBtn.click()
      }

      // Ctrl/Cmd + Shift + A: Add Task
      if (modifier && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        const addBtn = document.querySelector('.btn-add-task')
        if (addBtn) addBtn.click()
      }

      // Delete: Delete selected task
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if we have a selected task and aren't in an input field
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
        if (selectedTaskId && !isInput) {
          e.preventDefault()
          if (window.confirm('Are you sure you want to delete the selected task?')) {
            deleteTask(selectedTaskId)
            setSelectedTaskId(null)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTaskId, deleteTask])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Mark Gantt Maker</h1>
          <p className="subtitle">15-Minute Time-Blocking View</p>
        </div>
        <div className="header-actions">
          {saveStatus && (
            <span 
              className="save-status-msg" 
              role="status" 
              aria-live="polite"
            >
              {saveStatus}
            </span>
          )}
          <ExportControls ganttContainerRef={ganttRef} />
          <button 
            className="theme-toggle-btn" 
            onClick={() => setIsThemeModalOpen(true)}
            title="Change Theme"
            aria-label="Change Theme"
          >
            <i className="fas fa-palette" aria-hidden="true"></i> Theme
          </button>
          <button 
            className="reset-btn" 
            onClick={handleReset}
            title="Reset to Sample Tasks"
            aria-label="Reset to Sample Tasks"
          >
            <i className="fas fa-rotate-left" aria-hidden="true"></i> Reset
          </button>
        </div>
      </header>
      <main className="app-main">
        <TaskList
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
        />
        <GanttChart ref={ganttRef} tasks={tasks} />
      </main>

      <footer className="app-footer">
        <div className="shortcuts-info" aria-label="Keyboard Shortcuts">
          <span className="shortcut-item">
            <kbd aria-hidden="true">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}</kbd>
            <span className="sr-only">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Command' : 'Control'}</span>
             + <kbd>Shift</kbd> + <kbd>S</kbd> 
            <span className="shortcut-label">Save</span>
          </span>
          <span className="shortcut-item">
            <kbd aria-hidden="true">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}</kbd>
            <span className="sr-only">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Command' : 'Control'}</span>
             + <kbd>Shift</kbd> + <kbd>E</kbd>
            <span className="shortcut-label">Export PDF</span>
          </span>
          <span className="shortcut-item">
            <kbd aria-hidden="true">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}</kbd>
            <span className="sr-only">{navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Command' : 'Control'}</span>
             + <kbd>Shift</kbd> + <kbd>A</kbd>
            <span className="shortcut-label">Add Task</span>
          </span>
          <span className="shortcut-item"><kbd>Del</kbd> <span className="shortcut-label">Delete Task</span></span>
        </div>
      </footer>

      <ThemeModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  )
}

export default App
