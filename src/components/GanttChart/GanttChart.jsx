import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'
import { FIFTEEN_MINUTE_VIEW } from '../../utils/viewModes'
import './GanttChart.css'

/**
 * GanttChart component that wraps frappe-gantt with custom 15-minute view support.
 * Uses the patched frappe-gantt (via ganttPatch.js) to enable true 15-minute intervals.
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects with id, name, start, end, progress
 * @param {Object} props.options - Optional frappe-gantt options to override defaults
 */
function GanttChart({ tasks, options = {} }) {
  const ganttContainer = useRef(null)
  const ganttInstance = useRef(null)

  useEffect(() => {
    if (!ganttContainer.current) return
    if (!tasks || tasks.length === 0) return

    // Use custom 15-Minute view mode object for true 15-minute intervals
    // This works because we've patched frappe-gantt in ganttPatch.js
    const defaultOptions = {
      view_mode: FIFTEEN_MINUTE_VIEW, // Pass the full view mode object
      view_modes: [FIFTEEN_MINUTE_VIEW, 'Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
      header_height: 60,
      column_width: FIFTEEN_MINUTE_VIEW.column_width,
      bar_height: 24,
      bar_corner_radius: 4,
      arrow_curve: 5,
      padding: 18,
      date_format: 'YYYY-MM-DD HH:mm',
      popup_trigger: 'click',
      language: 'en',
      ...options
    }

    // Clean up existing instance
    if (ganttInstance.current) {
      ganttInstance.current = null
      ganttContainer.current.innerHTML = ''
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
      if (ganttContainer.current) {
        ganttContainer.current.innerHTML = ''
      }
    }
  }, [tasks, options])

  return (
    <div className="gantt-wrapper">
      <div ref={ganttContainer} className="gantt-container" />
    </div>
  )
}

export default GanttChart
