# Implementation Guide - Mark Gantt Maker

This document provides a comprehensive, step-by-step guide for implementing the Mark Gantt Maker application. Follow these phases sequentially to build the complete application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Project Initialization](#phase-1-project-initialization)
3. [Phase 2: Dependencies Installation](#phase-2-dependencies-installation)
4. [Phase 3: Project Structure Setup](#phase-3-project-structure-setup)
5. [Phase 4: Basic Gantt Integration](#phase-4-basic-gantt-integration)
6. [Phase 5: Custom 15-Minute View Mode](#phase-5-custom-15-minute-view-mode)
7. [Phase 6: Task Management System](#phase-6-task-management-system)
8. [Phase 7: Dependencies Implementation](#phase-7-dependencies-implementation)
9. [Phase 8: Theme System](#phase-8-theme-system)
10. [Phase 9: PDF Export Functionality](#phase-9-pdf-export-functionality)
11. [Phase 10: Auto-Save with localStorage](#phase-10-auto-save-with-localstorage)
12. [Phase 11: UI/UX Polish](#phase-11-uiux-polish)
13. [Testing](#testing)
14. [Deployment](#deployment)

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ installed (check with `node --version`)
- **npm**, **pnpm**, or **yarn** package manager
- **Code editor** (VS Code recommended)
- **Modern web browser** for testing
- Basic knowledge of:
  - React (hooks, components, state management)
  - JavaScript ES6+
  - CSS
  - HTML

## Phase 1: Project Initialization

### Step 1.1: Create React + Vite Project

```bash
npm create vite@latest mark-gantt-maker -- --template react
cd mark-gantt-maker
```

Or with pnpm:
```bash
pnpm create vite mark-gantt-maker --template react
cd mark-gantt-maker
```

### Step 1.2: Initialize Git Repository (Optional)

```bash
git init
git add .
git commit -m "Initial commit: React + Vite setup"
```

### Step 1.3: Verify Setup

Start the dev server to ensure everything works:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the default React app.

## Phase 2: Dependencies Installation

### Step 2.1: Install Core Dependencies

```bash
npm install frappe-gantt jspdf date-fns
```

### Step 2.2: Install Development Dependencies (if not already included)

```bash
npm install -D @vitejs/plugin-react
```

### Step 2.3: Verify Installation

Check `package.json` to confirm all dependencies are listed:
- `frappe-gantt`
- `jspdf`
- `date-fns`
- `react`
- `react-dom`

## Phase 3: Project Structure Setup

### Step 3.1: Create Directory Structure

Create the following directory structure:

```
src/
├── components/
│   ├── GanttChart/
│   │   ├── GanttChart.jsx
│   │   └── GanttChart.css
│   ├── TaskEditor/
│   │   ├── TaskEditor.jsx
│   │   ├── TaskList.jsx
│   │   └── TaskEditor.css
│   ├── ThemeSelector/
│   │   ├── ThemeSelector.jsx
│   │   └── ThemeSelector.css
│   ├── ColorCustomizer/
│   │   ├── ColorCustomizer.jsx
│   │   └── ColorCustomizer.css
│   └── ExportControls/
│       ├── ExportControls.jsx
│       └── ExportControls.css
├── hooks/
│   ├── useGanttData.js
│   ├── useAutoSave.js
│   └── useTheme.js
├── utils/
│   ├── localStorage.js
│   ├── pdfExport.js
│   └── dateUtils.js
├── styles/
│   ├── themes.css
│   └── globals.css
├── data/
│   └── defaultThemes.js
├── App.jsx
└── main.jsx
```

### Step 3.2: Create Initial File Stubs

Create empty files for all components, hooks, and utilities. We'll implement them in subsequent phases.

```bash
# Create directories
mkdir -p src/components/{GanttChart,TaskEditor,ThemeSelector,ColorCustomizer,ExportControls}
mkdir -p src/hooks src/utils src/styles src/data

# Create empty files (example for one component)
touch src/components/GanttChart/GanttChart.jsx
touch src/components/GanttChart/GanttChart.css
# Repeat for all files
```

## Phase 4: Basic Gantt Integration

### Step 4.1: Import frappe-gantt Styles

In `src/main.jsx`, add the frappe-gantt CSS import:

```javascript
import 'frappe-gantt/dist/frappe-gantt.css'
```

### Step 4.2: Create Basic GanttChart Component

In `src/components/GanttChart/GanttChart.jsx`:

```javascript
import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'
import './GanttChart.css'

function GanttChart({ tasks, options = {} }) {
  const ganttContainer = useRef(null)
  const ganttInstance = useRef(null)

  useEffect(() => {
    if (!ganttContainer.current) return

    const defaultOptions = {
      view_mode: 'Day',
      header_height: 50,
      column_width: 30,
      step: 24,
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      ...options
    }

    ganttInstance.current = new Gantt(
      ganttContainer.current,
      tasks,
      defaultOptions
    )

    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null
      }
    }
  }, [tasks, options])

  return <div ref={ganttContainer} className="gantt-container" />
}

export default GanttChart
```

### Step 4.3: Create Basic App Component

In `src/App.jsx`:

```javascript
import { useState } from 'react'
import GanttChart from './components/GanttChart/GanttChart'
import './styles/globals.css'

function App() {
  const [tasks] = useState([
    {
      id: '1',
      name: 'Sample Task',
      start: '2024-01-15',
      end: '2024-01-17',
      progress: 50
    }
  ])

  return (
    <div className="app">
      <header>
        <h1>Mark Gantt Maker</h1>
      </header>
      <main>
        <GanttChart tasks={tasks} />
      </main>
    </div>
  )
}

export default App
```

### Step 4.4: Test Basic Integration

Run `npm run dev` and verify the Gantt chart renders with the sample task.

## Phase 5: Custom View Mode Setup

### Overview

frappe-gantt has built-in view modes that control the timeline scale. The library overwrites custom `step` values based on the selected `view_mode`:

| View Mode | Step (hours) | Description |
|-----------|--------------|-------------|
| Quarter Day | 6 | 6-hour columns (most granular built-in) |
| Half Day | 12 | 12-hour columns |
| Day | 24 | Daily columns |
| Week | 168 | Weekly columns |
| Month | ~720 | Monthly columns |
| Year | ~8760 | Yearly columns |

**Current Implementation**: We use `'Quarter Day'` as it's the most granular built-in view mode, suitable for time-blocking with tasks spanning hours.

**Future Enhancement**: Phase 5b describes how to patch frappe-gantt for true 15-minute intervals.

### Step 5.1: Create View Mode Configuration

Create `src/utils/viewModes.js` with configuration for future custom view support:

```javascript
export const FIFTEEN_MINUTE_VIEW = {
  name: '15-Minute',
  padding: 15 * 60 * 1000, // 15 minutes in milliseconds
  step: 15 * 60 * 1000, // 15 minutes
  column_width: 40,
  date_format: 'HH:mm',
  upper_text: (date, prevDate, lang) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return minutes === 0 ? `${hours}:00` : ''
  },
  lower_text: (date, prevDate, lang) => {
    const minutes = date.getMinutes()
    return minutes % 15 === 0 ? `${minutes}` : ''
  },
  upper_text_frequency: 4, // Every hour
  thick_line: (date) => date.getMinutes() === 0
}
```

### Step 5.2: Update GanttChart Component

Modify `src/components/GanttChart/GanttChart.jsx` to use Quarter Day view mode:

```javascript
import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'
import { FIFTEEN_MINUTE_VIEW } from '../../utils/viewModes'
import './GanttChart.css'

function GanttChart({ tasks, options = {} }) {
  const ganttContainer = useRef(null)
  const ganttInstance = useRef(null)

  useEffect(() => {
    if (!ganttContainer.current) return

    // Use 'Quarter Day' view mode - the most granular built-in mode (6-hour intervals)
    // frappe-gantt overwrites step based on view_mode, so we can't use custom step values
    // 'Quarter Day' shows the timeline at a reasonable scale for time-blocking
    const defaultOptions = {
      view_mode: 'Quarter Day', // Most granular built-in mode (6-hour columns)
      header_height: 50,
      column_width: FIFTEEN_MINUTE_VIEW.column_width,
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      ...options
    }

    ganttInstance.current = new Gantt(
      ganttContainer.current,
      tasks,
      defaultOptions
    )

    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null
      }
    }
  }, [tasks, options])

  return <div ref={ganttContainer} className="gantt-container" />
}

export default GanttChart
```

### Step 5.3: Support Date/Time Format

Create `src/utils/dateUtils.js` with date/time parsing utilities:

```javascript
/**
 * Parses a date/time string in format YYYY-MM-DD HH:mm
 * @param {string} dateTimeString - Date/time string in format YYYY-MM-DD HH:mm
 * @returns {Date} Parsed Date object
 */
export function parseDateTime(dateTimeString) {
  if (!dateTimeString) return null
  
  // Handle both YYYY-MM-DD and YYYY-MM-DD HH:mm formats
  if (dateTimeString.includes(' ')) {
    const [datePart, timePart] = dateTimeString.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    return new Date(year, month - 1, day, hours, minutes || 0)
  } else {
    const [year, month, day] = dateTimeString.split('-').map(Number)
    return new Date(year, month - 1, day, 0, 0)
  }
}

/**
 * Formats a Date object to YYYY-MM-DD HH:mm format
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date/time string
 */
export function formatDateTime(date) {
  if (!date || !(date instanceof Date)) return ''
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
```

Update task creation to support date/time strings:
- Format: `YYYY-MM-DD HH:mm` (e.g., `2024-01-15 09:00`)

## Phase 5b: True 15-Minute View Mode (Extending frappe-gantt)

This phase describes how to patch frappe-gantt to support true 15-minute intervals. This requires modifying the library's internal `update_view_scale` function.

### Approach 1: Monkey-Patching (Recommended for Quick Implementation)

Create `src/utils/ganttPatch.js`:

```javascript
import Gantt from 'frappe-gantt'

/**
 * Patches frappe-gantt to support custom view modes with arbitrary step values.
 * Must be called before creating any Gantt instances.
 */
export function patchGanttForCustomViewModes() {
  // Store reference to original method
  const originalUpdateViewScale = Gantt.prototype.update_view_scale

  // Override update_view_scale to support custom view modes
  Gantt.prototype.update_view_scale = function(view_mode) {
    // Check if this is a custom view mode object (not a string)
    if (typeof view_mode === 'object' && view_mode.name) {
      this.options.view_mode = view_mode.name
      this.options.step = view_mode.step / (60 * 60 * 1000) // Convert ms to hours
      this.options.column_width = view_mode.column_width || 40
      
      // Store custom view mode for reference
      this._custom_view_mode = view_mode
      return
    }
    
    // Fall back to original behavior for built-in modes
    originalUpdateViewScale.call(this, view_mode)
  }

  // Add custom VIEW_MODE entry
  Gantt.VIEW_MODE = {
    ...Gantt.VIEW_MODE,
    FIFTEEN_MINUTE: '15-Minute'
  }
}
```

Usage in `main.jsx`:

```javascript
import { patchGanttForCustomViewModes } from './utils/ganttPatch'

// Apply patch before rendering app
patchGanttForCustomViewModes()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Then update GanttChart to use the custom view mode object:

```javascript
import { FIFTEEN_MINUTE_VIEW } from '../../utils/viewModes'

const defaultOptions = {
  view_mode: FIFTEEN_MINUTE_VIEW, // Pass the full view mode object
  view_modes: [FIFTEEN_MINUTE_VIEW, 'Quarter Day', 'Half Day', 'Day'],
  // ...
}
```

### Approach 2: Forking frappe-gantt

For a more maintainable long-term solution:

1. **Fork the repository**: Fork `https://github.com/frappe/gantt`

2. **Modify `src/index.js`**: Update the `update_view_scale` method to accept custom step values:

```javascript
update_view_scale(view_mode) {
  // Support custom view mode objects
  if (typeof view_mode === 'object') {
    this.options.view_mode = view_mode.name
    this.options.step = view_mode.step
    this.options.column_width = view_mode.column_width
    return
  }
  
  // Existing switch statement for built-in modes...
}
```

3. **Add new VIEW_MODE entries**:

```javascript
const VIEW_MODE = {
  HOUR: 'Hour',
  QUARTER_HOUR: '15-Minute', // New!
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
}
```

4. **Add case handlers for new modes**:

```javascript
} else if (view_mode === VIEW_MODE.QUARTER_HOUR) {
  this.options.step = 0.25 // 15 minutes = 0.25 hours
  this.options.column_width = 40
} else if (view_mode === VIEW_MODE.HOUR) {
  this.options.step = 1
  this.options.column_width = 38
}
```

5. **Install from your fork**:

```bash
npm install git+https://github.com/YOUR_USERNAME/gantt.git
```

### Approach 3: Post-Initialization Override

Override settings after Gantt initialization (less reliable but simpler):

```javascript
useEffect(() => {
  // ... create Gantt instance
  
  ganttInstance.current = new Gantt(ganttContainer.current, tasks, defaultOptions)
  
  // Force override after initialization
  ganttInstance.current.options.step = 0.25 // 15 minutes
  ganttInstance.current.options.column_width = 40
  ganttInstance.current.refresh(tasks) // Re-render with new settings
  
}, [tasks, options])
```

**Note**: This approach may not work reliably as frappe-gantt recalculates settings during various operations.

### Recommended Path Forward

1. **Start with Approach 1 (Monkey-Patching)** for rapid iteration and testing
2. **Graduate to Approach 2 (Fork)** once the custom view mode requirements are finalized
3. **Consider contributing upstream** if the changes are generally useful

## Phase 6: Task Management System

### Step 6.1: Create useGanttData Hook

In `src/hooks/useGanttData.js`:

```javascript
import { useState, useCallback } from 'react'

export function useGanttData(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = useCallback((task) => {
    const newTask = {
      id: task.id || `task-${Date.now()}`,
      name: task.name || 'New Task',
      start: task.start,
      end: task.end,
      progress: task.progress || 0,
      dependencies: task.dependencies || '',
      description: task.description || '',
      custom_class: task.custom_class || ''
    }
    setTasks(prev => [...prev, newTask])
    return newTask
  }, [])

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  return { tasks, addTask, updateTask, deleteTask, setTasks }
}
```

### Step 6.2: Create TaskEditor Component

In `src/components/TaskEditor/TaskEditor.jsx`:

```javascript
import { useState } from 'react'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="task-editor">
      {/* Form fields implementation */}
    </form>
  )
}

export default TaskEditor
```

### Step 6.3: Create TaskList Component

In `src/components/TaskEditor/TaskList.jsx`:

```javascript
import { useState } from 'react'
import TaskEditor from './TaskEditor'
import './TaskEditor.css'

function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  const [editingTask, setEditingTask] = useState(null)

  return (
    <div className="task-list">
      <button onClick={() => setEditingTask({})}>Add Task</button>
      {/* Task list rendering */}
      {editingTask && (
        <TaskEditor
          task={editingTask}
          onSave={(data) => {
            if (editingTask.id) {
              onUpdateTask(editingTask.id, data)
            } else {
              onAddTask(data)
            }
            setEditingTask(null)
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}

export default TaskList
```

### Step 6.4: Integrate Task Management

Update `App.jsx` to use the task management system:

```javascript
import { useGanttData } from './hooks/useGanttData'
import TaskList from './components/TaskEditor/TaskList'

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useGanttData([])

  return (
    <div className="app">
      <TaskList
        tasks={tasks}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
      <GanttChart tasks={tasks} />
    </div>
  )
}
```

## Phase 7: Dependencies Implementation

### Step 7.1: Update Task Format for Dependencies

frappe-gantt supports dependencies via the `dependencies` property (comma-separated task IDs). Ensure your task objects include this:

```javascript
{
  id: 'task-2',
  name: 'Task 2',
  dependencies: 'task-1', // Depends on task-1
  // ... other properties
}
```

### Step 7.2: Add Dependency Selector in TaskEditor

In the TaskEditor form, add a multi-select dropdown:

```javascript
<select
  multiple
  value={formData.dependencies.split(',').filter(Boolean)}
  onChange={(e) => {
    const deps = Array.from(e.target.selectedOptions, option => option.value)
    setFormData({ ...formData, dependencies: deps.join(',') })
  }}
>
  {tasks
    .filter(t => t.id !== task?.id)
    .map(t => (
      <option key={t.id} value={t.id}>{t.name}</option>
    ))
  }
</select>
```

### Step 7.3: Validate Dependencies

Add validation to prevent circular dependencies (optional but recommended).

## Phase 8: Theme System

### Step 8.1: Create Default Themes

In `src/data/defaultThemes.js`:

```javascript
export const defaultThemes = {
  default: {
    primary: '#4f46e5',
    secondary: '#818cf8',
    background: '#ffffff',
    text: '#1f2937'
  },
  dark: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    background: '#1f2937',
    text: '#f9fafb'
  },
  ocean: {
    primary: '#06b6d4',
    secondary: '#22d3ee',
    background: '#f0f9ff',
    text: '#0c4a6e'
  },
  forest: {
    primary: '#10b981',
    secondary: '#34d399',
    background: '#f0fdf4',
    text: '#064e3b'
  }
}
```

### Step 8.2: Create useTheme Hook

In `src/hooks/useTheme.js`:

```javascript
import { useState, useEffect } from 'react'
import { defaultThemes } from '../data/defaultThemes'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('gantt-theme')
    return saved ? JSON.parse(saved) : defaultThemes.default
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary)
    document.documentElement.style.setProperty('--color-secondary', theme.secondary)
    document.documentElement.style.setProperty('--color-background', theme.background)
    document.documentElement.style.setProperty('--color-text', theme.text)
    localStorage.setItem('gantt-theme', JSON.stringify(theme))
  }, [theme])

  return { theme, setTheme }
}
```

### Step 8.3: Create ThemeSelector Component

In `src/components/ThemeSelector/ThemeSelector.jsx`:

```javascript
import { defaultThemes } from '../../data/defaultThemes'
import './ThemeSelector.css'

function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="theme-selector">
      <label>Theme:</label>
      <select
        value={Object.keys(defaultThemes).find(
          key => JSON.stringify(defaultThemes[key]) === JSON.stringify(currentTheme)
        )}
        onChange={(e) => onThemeChange(defaultThemes[e.target.value])}
      >
        {Object.keys(defaultThemes).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
    </div>
  )
}

export default ThemeSelector
```

### Step 8.4: Create ColorCustomizer Component

In `src/components/ColorCustomizer/ColorCustomizer.jsx`:

```javascript
import './ColorCustomizer.css'

function ColorCustomizer({ theme, onThemeChange }) {
  const updateColor = (colorKey, value) => {
    onThemeChange({ ...theme, [colorKey]: value })
  }

  return (
    <div className="color-customizer">
      <label>
        Primary:
        <input
          type="color"
          value={theme.primary}
          onChange={(e) => updateColor('primary', e.target.value)}
        />
      </label>
      {/* Repeat for secondary, background, text */}
    </div>
  )
}

export default ColorCustomizer
```

### Step 8.5: Add CSS Variables

In `src/styles/themes.css`:

```css
:root {
  --color-primary: #4f46e5;
  --color-secondary: #818cf8;
  --color-background: #ffffff;
  --color-text: #1f2937;
}

.gantt-container {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

## Phase 9: PDF Export Functionality

### Step 9.1: Install html2canvas (for better PDF quality)

```bash
npm install html2canvas
```

Note: While jsPDF alone can work, html2canvas provides better visual quality for exporting the chart.

### Step 9.2: Create PDF Export Utility

In `src/utils/pdfExport.js`:

```javascript
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportGanttToPDF(containerElement, filename = 'gantt-chart.pdf') {
  try {
    // Convert the Gantt chart container to canvas
    const canvas = await html2canvas(containerElement, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    // Calculate PDF dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const pdfWidth = imgWidth / 2 // Scale down for PDF
    const pdfHeight = imgHeight / 2

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [pdfWidth, pdfHeight]
    })

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Save PDF
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw error
  }
}
```

### Step 9.3: Create ExportControls Component

In `src/components/ExportControls/ExportControls.jsx`:

```javascript
import { useRef } from 'react'
import { exportGanttToPDF } from '../../utils/pdfExport'
import './ExportControls.css'

function ExportControls({ ganttContainerRef }) {
  const handleExportPDF = async () => {
    if (!ganttContainerRef.current) return
    
    try {
      await exportGanttToPDF(ganttContainerRef.current, 'gantt-chart.pdf')
    } catch (error) {
      alert('Failed to export PDF. Please try again.')
    }
  }

  return (
    <div className="export-controls">
      <button onClick={handleExportPDF} className="export-btn">
        Export PDF
      </button>
    </div>
  )
}

export default ExportControls
```

### Step 9.4: Integrate Export Controls

Update `GanttChart.jsx` to expose a ref:

```javascript
import { forwardRef } from 'react'

const GanttChart = forwardRef(({ tasks, options }, ref) => {
  // ... existing code
  return <div ref={ref} className="gantt-container" />
})

export default GanttChart
```

Update `App.jsx`:

```javascript
import { useRef } from 'react'
import ExportControls from './components/ExportControls/ExportControls'

function App() {
  const ganttRef = useRef(null)
  // ...
  return (
    <div className="app">
      <ExportControls ganttContainerRef={ganttRef} />
      <GanttChart ref={ganttRef} tasks={tasks} />
    </div>
  )
}
```

## Phase 10: Auto-Save with localStorage

### Step 10.1: Create localStorage Utility

In `src/utils/localStorage.js`:

```javascript
const STORAGE_KEY = 'gantt-chart-data'

export function saveToLocalStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

export function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
```

### Step 10.2: Create useAutoSave Hook

In `src/hooks/useAutoSave.js`:

```javascript
import { useEffect, useRef } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'

export function useAutoSave(data, enabled = true) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (enabled && data) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(data)
      }, 1000) // Debounce: save 1 second after last change

      return () => clearTimeout(timeoutId)
    }
  }, [data, enabled])

  return {
    loadSaved: () => loadFromLocalStorage()
  }
}
```

### Step 10.3: Integrate Auto-Save

Update `App.jsx`:

```javascript
import { useEffect } from 'react'
import { useAutoSave } from './hooks/useAutoSave'
import { loadFromLocalStorage } from './utils/localStorage'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = loadFromLocalStorage()
    return saved?.tasks || []
  })

  useAutoSave({ tasks }, true)

  // ... rest of component
}
```

## Phase 11: UI/UX Polish

### Step 11.1: Add Loading States

Add loading indicators for async operations (PDF export, etc.)

### Step 11.2: Add Error Handling

Implement error boundaries and user-friendly error messages.

### Step 11.3: Add Responsive Design

Ensure the application works well on different screen sizes using CSS media queries.

### Step 11.4: Add Keyboard Shortcuts (Optional)

- `Ctrl/Cmd + S`: Save
- `Ctrl/Cmd + E`: Export PDF
- `Delete`: Delete selected task

### Step 11.5: Add Animations and Transitions

Use CSS transitions for smoother UI interactions.

### Step 11.6: Improve Accessibility

- Add ARIA labels
- Ensure keyboard navigation works
- Maintain proper contrast ratios
- Add focus indicators

## Testing

### Manual Testing Checklist

- [ ] Tasks can be added, edited, and deleted
- [ ] 15-minute view mode displays correctly
- [ ] Dependencies are visually connected
- [ ] Themes can be changed and customized
- [ ] PDF export generates correct output
- [ ] Auto-save works and data persists on page reload
- [ ] Application works in different browsers
- [ ] Responsive design works on mobile/tablet

### Testing Tools (Optional)

- **Jest + React Testing Library**: Unit and integration tests
- **Playwright/Cypress**: End-to-end testing
- **Lighthouse**: Performance and accessibility audits

## Deployment

### Build for Production

```bash
npm run build
```

This creates an `dist/` folder with optimized production files.

### Deployment Options

1. **Static Hosting (Recommended)**:
   - **Netlify**: Drag and drop the `dist/` folder or connect to Git
   - **Vercel**: Connect repository or deploy `dist/` folder
   - **GitHub Pages**: Use GitHub Actions to deploy
   - **Cloudflare Pages**: Similar to Netlify

2. **Self-Hosting**:
   - Serve the `dist/` folder with any static file server (nginx, Apache, etc.)

### Environment Configuration

If needed, create environment variables:
- `.env.development` for development
- `.env.production` for production

### Post-Deployment Checklist

- [ ] Verify all features work in production
- [ ] Check console for errors
- [ ] Test PDF export
- [ ] Verify localStorage works (should work the same)
- [ ] Check performance (Lighthouse audit)
- [ ] Test on multiple browsers

## Troubleshooting

### Common Issues

1. **frappe-gantt not rendering**:
   - Ensure CSS is imported in `main.jsx`
   - Check that container element exists before initializing

2. **PDF export fails**:
   - Ensure html2canvas is installed
   - Check browser console for CORS errors
   - Verify container element is visible

3. **localStorage quota exceeded**:
   - Implement data compression
   - Add cleanup for old data
   - Warn users if approaching limit

4. **15-minute view not displaying correctly**:
   - Verify view mode configuration
   - Check date/time formatting
   - Ensure tasks have proper date/time format

## Next Steps

After completing all phases:

1. Add more view modes (Hourly, Daily, Weekly)
2. Implement task grouping/categories
3. Add collaboration features (if adding backend)
4. Implement undo/redo functionality
5. Add import/export JSON functionality
6. Create user documentation/help section

## Resources

- [frappe-gantt Documentation](https://github.com/frappe/gantt)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [date-fns Documentation](https://date-fns.org/)

---

**Note**: This is a comprehensive guide. Implement each phase incrementally and test thoroughly before moving to the next phase. Customize the implementation to fit your specific needs and preferences.

