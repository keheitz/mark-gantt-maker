import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Exports a Gantt chart container to a high-quality PDF.
 * @param {HTMLElement} containerElement - The DOM element containing the Gantt chart
 * @param {string} filename - The name of the PDF file to save
 */
export async function exportGanttToPDF(containerElement, filename = 'gantt-chart.pdf') {
  if (!containerElement) {
    throw new Error('Container element not found')
  }

  try {
    // Add a temporary class for printing if needed
    containerElement.classList.add('gantt-printing')

    // Convert the Gantt chart container to canvas
    // We use a higher scale for better resolution in the PDF
    const canvas = await html2canvas(containerElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff', // Ensure white background
      windowWidth: containerElement.scrollWidth,
      windowHeight: containerElement.scrollHeight
    })

    // Remove the temporary printing class
    containerElement.classList.remove('gantt-printing')

    // Calculate PDF dimensions
    // html2canvas scale=2 means canvas dimensions are 2x the element dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    
    // We want the image to fit in the PDF, maintaining aspect ratio
    // jsPDF uses points (pt) by default, 1pt = 1/72 inch
    // For simplicity, we can use pixels as units in jsPDF
    const pdfWidth = imgWidth / 2 // Back to original size in px
    const pdfHeight = imgHeight / 2

    // Create PDF
    // Orientation is determined by the aspect ratio of the chart
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
