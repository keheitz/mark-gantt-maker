import { useState, useRef, useEffect, useMemo } from 'react'
import GanttChart from './components/GanttChart/GanttChart'
import TaskList from './components/TaskEditor/TaskList'
import ThemeModal from './components/ThemeSelector/ThemeModal'
import ExportControls from './components/ExportControls/ExportControls'
import { useGanttData } from './hooks/useGanttData'
import { useTheme } from './hooks/useTheme'
import { useAutoSave } from './hooks/useAutoSave'
import { loadFromLocalStorage } from './utils/localStorage'
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
  const { tasks, addTask, updateTask, deleteTask } = useGanttData(() => {
    const saved = loadFromLocalStorage()
    // Check if saved exists and has a tasks array (even if empty)
    if (saved && Array.isArray(saved.tasks)) {
      return saved.tasks
    }
    return getSampleTasks()
  })
  
  const { theme, setTheme } = useTheme()
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const ganttRef = useRef(null)

  // Memoize data to prevent unnecessary auto-save triggers on every render
  const autoSaveData = useMemo(() => ({ tasks }), [tasks])
  useAutoSave(autoSaveData)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Mark Gantt Maker</h1>
          <p className="subtitle">15-Minute Time-Blocking View</p>
        </div>
        <div className="header-actions">
          <ExportControls ganttContainerRef={ganttRef} />
          <button 
            className="theme-toggle-btn" 
            onClick={() => setIsThemeModalOpen(true)}
            title="Change Theme"
          >
            <i className="fas fa-palette"></i> Theme
          </button>
        </div>
      </header>
      <main className="app-main">
        <TaskList
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
        <GanttChart ref={ganttRef} tasks={tasks} />
      </main>

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
