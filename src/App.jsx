import { useState, useRef } from 'react'
import GanttChart from './components/GanttChart/GanttChart'
import TaskList from './components/TaskEditor/TaskList'
import ThemeModal from './components/ThemeSelector/ThemeModal'
import ExportControls from './components/ExportControls/ExportControls'
import { useGanttData } from './hooks/useGanttData'
import { useTheme } from './hooks/useTheme'
import { getTodayDateString } from './utils/viewModes'
import './styles/globals.css'
import './styles/themes.css'

/**
 * Gets today's date and creates sample tasks for demonstrating 15-minute view.
 * @returns {Array} Array of sample task objects
 */
function getSampleTasks() {
  const today = getTodayDateString()
  
  return [
    {
      id: 'task-1',
      name: 'Morning Standup',
      start: `${today} 09:00`,
      end: `${today} 09:15`,
      progress: 100
    },
    {
      id: 'task-2',
      name: 'Deep Work Session',
      start: `${today} 09:15`,
      end: `${today} 10:30`,
      progress: 75,
      dependencies: 'task-1'
    },
    {
      id: 'task-3',
      name: 'Coffee Break',
      start: `${today} 10:30`,
      end: `${today} 10:45`,
      progress: 100,
      dependencies: 'task-2'
    },
    {
      id: 'task-4',
      name: 'Team Meeting',
      start: `${today} 11:00`,
      end: `${today} 12:00`,
      progress: 50,
      dependencies: 'task-3'
    }
  ]
}

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useGanttData(getSampleTasks)
  const { theme, setTheme } = useTheme()
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const ganttRef = useRef(null)

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
