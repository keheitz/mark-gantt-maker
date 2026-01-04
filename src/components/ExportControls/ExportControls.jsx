import React, { useState } from 'react'
import { exportGanttToPDF } from '../../utils/pdfExport'
import './ExportControls.css'

/**
 * ExportControls component providing a button to export the Gantt chart to PDF.
 * @param {Object} props
 * @param {React.RefObject} props.ganttContainerRef - Ref to the Gantt chart container element
 */
function ExportControls({ ganttContainerRef }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!ganttContainerRef || !ganttContainerRef.current) {
      alert('Gantt chart not found. Please try again.')
      return
    }
    
    setIsExporting(true)
    
    try {
      // Use a timeout to allow the UI to update to 'Exporting...'
      // and give the browser a chance to render everything
      setTimeout(async () => {
        try {
          await exportGanttToPDF(ganttContainerRef.current, 'gantt-chart.pdf')
        } catch (error) {
          console.error('PDF Export Error:', error)
          alert('Failed to export PDF. Please check the console for details.')
        } finally {
          setIsExporting(false)
        }
      }, 100)
    } catch (error) {
      console.error('Export logic error:', error)
      setIsExporting(false)
    }
  }

  return (
    <div className="export-controls">
      <button 
        onClick={handleExportPDF} 
        className={`export-btn ${isExporting ? 'exporting' : ''}`}
        disabled={isExporting}
        aria-label={isExporting ? "Exporting PDF" : "Export Gantt chart to PDF"}
        aria-busy={isExporting}
      >
        {isExporting ? (
          <span aria-live="polite" className="export-status">
            <span className="spinner" aria-hidden="true"></span>
            Exporting PDF...
          </span>
        ) : (
          <>
            <i className="fa-solid fa-file-export" aria-hidden="true"></i>
            Export PDF
          </>
        )}
      </button>
    </div>
  )
}

export default ExportControls
