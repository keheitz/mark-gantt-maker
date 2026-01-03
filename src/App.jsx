import { useState } from 'react'
import GanttChart from './components/GanttChart/GanttChart'
import { getTodayDateString } from './utils/viewModes'
import './styles/globals.css'

/**
 * Gets today's date and creates sample tasks for demonstrating 15-minute view.
 * @returns {Array} Array of sample task objects
 */
function getSampleTasks() {
  const today = getTodayDateString()
  
  return [
    {
      id: '1',
      name: 'Morning Standup',
      start: `${today} 09:00`,
      end: `${today} 09:15`,
      progress: 100
    },
    {
      id: '2',
      name: 'Deep Work Session',
      start: `${today} 09:15`,
      end: `${today} 10:30`,
      progress: 75
    },
    {
      id: '3',
      name: 'Coffee Break',
      start: `${today} 10:30`,
      end: `${today} 10:45`,
      progress: 100
    },
    {
      id: '4',
      name: 'Team Meeting',
      start: `${today} 11:00`,
      end: `${today} 12:00`,
      progress: 50,
      dependencies: '2'
    },
    {
      id: '5',
      name: 'Lunch',
      start: `${today} 12:00`,
      end: `${today} 13:00`,
      progress: 0
    },
    {
      id: '6',
      name: 'Afternoon Focus',
      start: `${today} 13:00`,
      end: `${today} 15:00`,
      progress: 0,
      dependencies: '5'
    },
    {
      id: '7',
      name: 'Quick Sync',
      start: `${today} 15:00`,
      end: `${today} 15:15`,
      progress: 0
    },
    {
      id: '8',
      name: 'Code Review',
      start: `${today} 15:15`,
      end: `${today} 16:00`,
      progress: 0,
      dependencies: '6'
    }
  ]
}

function App() {
  const [tasks] = useState(getSampleTasks)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mark Gantt Maker</h1>
        <p className="subtitle">15-Minute Time-Blocking View</p>
      </header>
      <main className="app-main">
        <GanttChart tasks={tasks} />
      </main>
    </div>
  )
}

export default App
