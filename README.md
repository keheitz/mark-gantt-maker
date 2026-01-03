# Mark Gantt Maker

A modern, client-side Gantt chart application with minute-level precision, built with React and frappe-gantt. Create detailed project timelines with 15-minute interval precision, customize appearance with themes and color pickers, and export high-quality PDFs - all running entirely in your browser.

## Features

### Time-Blocked Gantt Charts
- **True 15-minute interval precision**: Create detailed schedules with genuine 15-minute column increments
- Custom view modes optimized for time-blocking and detailed planning
- Smooth zoom and navigation controls

### Detailed Task Management
Each task item includes:
- **Name and description**: Comprehensive task information
- **Start and end date/time**: Precise scheduling with date and time pickers
- **Custom colors**: Individual color customization per task
- **Dependencies**: Link tasks to show relationships and dependencies between items
- **Progress tracking**: Visual progress indicators

### Design Customization
- **Predefined color themes**: Choose from multiple built-in color schemes
- **Custom color pickers**: Full control over:
  - Primary colors
  - Secondary colors
  - Background colors
  - Text colors
- Real-time preview of theme changes

### PDF Export
- Export your Gantt chart as a high-quality PDF
- Preserves all visual styling and formatting
- Landscape orientation optimized for charts
- Ready for printing or sharing

### Client-Side Only
- **No backend required**: All functionality runs entirely in your browser
- **Privacy-first**: Your data never leaves your device
- **Fast and responsive**: No network delays or server dependencies

### Auto-Save
- **Automatic saving**: Your work is automatically saved to browser localStorage
- **Data persistence**: Your charts are saved between sessions
- **Instant recovery**: Continue working where you left off

## Technology Stack

- **React 18+**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **frappe-gantt**: Open-source Gantt chart library (with custom patches)
- **jsPDF**: PDF generation library
- **date-fns**: Date manipulation and formatting utilities

## Installation

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mark-gantt-maker
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Usage

### Creating Tasks

1. Click the "Add Task" button to create a new task
2. Fill in the task details:
   - **Name**: Task name (required)
   - **Description**: Optional task description
   - **Start Date/Time**: When the task begins
   - **End Date/Time**: When the task ends
   - **Color**: Choose a custom color for the task bar
   - **Dependencies**: Select tasks that must complete before this one starts

### Viewing the Chart

- Use the view mode selector to switch between different time scales
- Scroll horizontally to navigate through time
- Click on task bars to view details
- Drag task bars to adjust start/end times (if editing is enabled)

### Customizing Appearance

1. **Using Predefined Themes**:
   - Click the theme selector dropdown
   - Choose from available color themes
   - The chart updates instantly

2. **Custom Colors**:
   - Open the color customizer panel
   - Use the color pickers to adjust:
     - Primary color (main task bar color)
     - Secondary color (accent colors)
     - Background color (chart background)
     - Text color (labels and text)
   - Changes apply in real-time

### Exporting to PDF

1. Arrange your Gantt chart as desired
2. Click the "Export PDF" button
3. The PDF will be generated and downloaded automatically
4. Open the PDF in your preferred PDF viewer

### Auto-Save

- Your chart data is automatically saved to browser localStorage
- No manual save required - just work and your progress is preserved
- To clear saved data, use your browser's developer tools or clear site data

## Configuration

### Custom View Modes

The application supports custom view modes for different time scales. The default 15-minute interval view is optimized for time-blocking:

- **15-Minute View**: Perfect for detailed daily planning (default)
- **Quarter Day**: 6-hour columns
- **Half Day**: 12-hour columns
- **Day**: Daily columns
- **Week/Month**: For longer-term planning

### Task Properties

Each task supports the following properties:

```javascript
{
  id: 'unique-task-id',
  name: 'Task Name',
  description: 'Optional description',
  start: '2024-01-15 09:00', // YYYY-MM-DD HH:mm format
  end: '2024-01-15 12:00',
  progress: 50, // 0-100 percentage
  dependencies: 'task-id-1,task-id-2', // Comma-separated task IDs
  custom_class: 'custom-css-class' // For styling
}
```

## Development

### Project Structure

The project follows a modular structure organized by feature and functionality:

```
mark-gantt-maker/
├── src/
│   ├── components/          # React components organized by feature
│   │   ├── GanttChart/      # Main Gantt chart visualization
│   │   │   ├── GanttChart.jsx
│   │   │   └── GanttChart.css
│   │   ├── TaskEditor/      # Task creation and editing
│   │   │   ├── TaskEditor.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskEditor.css
│   │   ├── ThemeSelector/   # Theme selection UI
│   │   │   ├── ThemeSelector.jsx
│   │   │   └── ThemeSelector.css
│   │   ├── ColorCustomizer/ # Color customization UI
│   │   │   ├── ColorCustomizer.jsx
│   │   │   └── ColorCustomizer.css
│   │   └── ExportControls/  # PDF export controls
│   │       ├── ExportControls.jsx
│   │       └── ExportControls.css
│   ├── hooks/               # Custom React hooks
│   │   ├── useGanttData.js  # Task data management
│   │   ├── useAutoSave.js   # Auto-save functionality
│   │   └── useTheme.js      # Theme management
│   ├── utils/               # Utility functions
│   │   ├── ganttPatch.js    # frappe-gantt monkey-patch for custom views
│   │   ├── viewModes.js     # View mode configurations
│   │   ├── localStorage.js  # Local storage helpers
│   │   ├── pdfExport.js     # PDF export functionality
│   │   └── dateUtils.js     # Date manipulation utilities
│   ├── styles/              # Global styles and themes
│   │   ├── themes.css       # Theme CSS variables
│   │   └── globals.css      # Global styles
│   ├── data/                # Static data and configurations
│   │   └── defaultThemes.js # Default theme definitions
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── .eslintrc.cjs            # ESLint configuration
```

### How to Run the Application

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   This will start the Vite development server, typically on `http://localhost:5173`

3. **Open in Browser**:
   - The terminal will display the local URL (usually `http://localhost:5173`)
   - Open this URL in your web browser
   - The application will hot-reload automatically when you make changes

4. **Build for Production**:
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist/` directory

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```
   This serves the production build locally for testing

### Available Scripts

- `npm run dev`: Start development server with hot reload on `http://localhost:5173`
- `npm run build`: Build for production (outputs to `dist/` directory)
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint to check code quality

### Key Implementation Details

#### Custom 15-Minute View Mode (frappe-gantt Patch)

frappe-gantt's built-in view modes only go as granular as "Quarter Day" (6-hour intervals). To achieve true 15-minute precision, we use a **monkey-patching approach** that extends frappe-gantt at runtime.

**How it works:**

The patch (`src/utils/ganttPatch.js`) overrides 5 key methods in the Gantt prototype:

1. **`setup_options`**: Detects when a custom view mode object is passed instead of a string
2. **`view_is`**: Recognizes custom view mode names for conditional logic
3. **`update_view_scale`**: Sets the step (0.25 hours = 15 minutes) and column width
4. **`setup_gantt_dates`**: Uses minimal date padding (1-2 hours instead of months) to keep column count manageable
5. **`get_date_info`**: Generates proper time labels for 15-minute columns (:00, :15, :30, :45)

**Usage:**

```javascript
// In main.jsx - apply patch before rendering
import { patchGanttForCustomViewModes } from './utils/ganttPatch'
patchGanttForCustomViewModes()

// In GanttChart.jsx - pass view mode object instead of string
import { FIFTEEN_MINUTE_VIEW } from '../../utils/viewModes'

const options = {
  view_mode: FIFTEEN_MINUTE_VIEW, // Object, not string
  // ...other options
}
```

**View Mode Configuration:**

```javascript
// src/utils/viewModes.js
export const FIFTEEN_MINUTE_VIEW = {
  name: '15-Minute',
  step: 0.25,        // 15 minutes in hours
  column_width: 40,  // pixels per column
  // ... header text formatting functions
}
```

#### Other Implementation Details

- **State Management**: React hooks (useState, useEffect, useMemo)
- **Local Storage**: Automatic saving/loading of chart data
- **PDF Export**: jsPDF with SVG/Canvas conversion
- **Theme System**: CSS variables with JavaScript updates

## Known Issues

- **SCSS Deprecation Warning**: frappe-gantt uses deprecated SASS color functions (`darken()`). This is a library issue and doesn't affect functionality.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [frappe-gantt](https://github.com/frappe/gantt) - Open-source Gantt chart library
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation library

## Support

For issues, feature requests, or questions, please open an issue on GitHub.
