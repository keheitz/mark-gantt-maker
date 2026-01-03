# How to Use IMPLEMENTATION.md with Cursor AI Agent

This guide provides best practices for using the `IMPLEMENTATION.md` file to effectively prompt Cursor's AI agent to build this project.

## Quick Start Strategy

### Approach 1: Phase-by-Phase (Recommended)

**Best for**: Systematic, controlled development with testing at each stage

Work through phases sequentially, one at a time:

```
Prompt Template:
"Follow Phase X from IMPLEMENTATION.md. Implement [specific phase name] 
including all steps. Test after completion before moving to the next phase."
```

**Example prompts:**

1. **Phase 1-3 Setup**:
   ```
   Follow Phases 1-3 from IMPLEMENTATION.md. Set up the React + Vite project, 
   install all dependencies listed in Phase 2, and create the directory structure 
   from Phase 3 with all the file stubs.
   ```

2. **Phase 4 - Basic Integration**:
   ```
   Implement Phase 4 from IMPLEMENTATION.md: Basic Gantt Integration. 
   Create the GanttChart component and integrate it into App.jsx exactly 
   as specified. Ensure frappe-gantt CSS is imported correctly.
   ```

3. **Single Phase at a Time**:
   ```
   Implement Phase 6 from IMPLEMENTATION.md: Task Management System. 
   Create the useGanttData hook, TaskEditor component, and TaskList component 
   as specified. Integrate them into App.jsx.
   ```

### Approach 2: Feature-Based (Alternative)

**Best for**: Faster iteration when you understand the architecture

Group related phases together:

```
"Implement [feature name] following Phases X, Y, Z from IMPLEMENTATION.md"
```

**Example:**
```
Implement the Theme System following Phases 8.1 through 8.5 from IMPLEMENTATION.md. 
Create the defaultThemes data file, useTheme hook, ThemeSelector component, 
ColorCustomizer component, and integrate CSS variables.
```

## Effective Prompt Patterns

### 1. Reference Specific Sections

Always reference the document explicitly:

✅ **Good:**
```
Follow Step 5.1 from IMPLEMENTATION.md to create the custom 15-minute view mode 
configuration. Use the exact view mode structure provided in that section.
```

❌ **Avoid:**
```
Create a 15-minute view mode
```
(Too vague - agent won't know which approach to use)

### 2. Include Context from Previous Phases

When working on later phases, remind the agent of dependencies:

✅ **Good:**
```
Implement Phase 7 from IMPLEMENTATION.md. Build on the TaskEditor component 
created in Phase 6, adding the dependency selector as specified in Step 7.2.
```

### 3. Request Code Verification

Ask the agent to verify against the implementation guide:

✅ **Good:**
```
Implement Phase 9.2 (PDF Export Utility) from IMPLEMENTATION.md. After creating 
the file, verify the code matches the structure and imports specified in that section.
```

### 4. Combine Multiple Steps

For smaller phases, you can combine steps:

✅ **Good:**
```
Implement all of Phase 2 from IMPLEMENTATION.md - install all dependencies 
listed in Steps 2.1 and 2.2, then verify installation as in Step 2.3.
```

## Advanced Strategies

### Strategy 1: Incremental Implementation with Testing

After each phase, test before proceeding:

```
1. "Implement Phase 4 from IMPLEMENTATION.md"
2. [Test the implementation manually]
3. "The Gantt chart renders but tasks aren't showing. Review Phase 4 code 
   and fix any issues based on IMPLEMENTATION.md specifications."
4. "Now implement Phase 5 from IMPLEMENTATION.md"
```

### Strategy 2: Reference Multiple Sections

Some implementations require code from multiple phases:

```
Implement Phase 10 (Auto-Save) from IMPLEMENTATION.md. Use the localStorage 
utility from Step 10.1, the useAutoSave hook from Step 10.2, and integrate 
it into App.jsx as shown in Step 10.3. Ensure it works with the task management 
system from Phase 6.
```

### Strategy 3: Customization Requests

Add your own requirements while following the guide:

```
Follow Phase 8 (Theme System) from IMPLEMENTATION.md, but also add a 'sunset' 
theme with colors: primary #f59e0b, secondary #fbbf24, background #fff7ed, 
text #7c2d12.
```

## Common Prompt Templates

### For Initial Setup (Phases 1-3)
```
Set up the project following Phases 1-3 from IMPLEMENTATION.md:
1. Initialize React + Vite project (Phase 1)
2. Install all dependencies (Phase 2)  
3. Create complete directory structure with file stubs (Phase 3)

Verify the setup works by starting the dev server.
```

### For Component Implementation
```
Implement [Component Name] from Phase X, Step Y.Z of IMPLEMENTATION.md. 
Include:
- The component file with all functionality
- The corresponding CSS file with styles
- Integration into the parent component as specified
- Any required imports or dependencies
```

### For Feature Completion
```
Complete Phase X from IMPLEMENTATION.md. This includes:
- Step X.1: [description]
- Step X.2: [description]  
- Step X.3: [description]

Test the feature works before marking complete.
```

### For Bug Fixes
```
Review Phase X from IMPLEMENTATION.md. The implementation isn't working as expected: 
[describe issue]. Compare the current code with the specifications in IMPLEMENTATION.md 
and fix any discrepancies.
```

## Tips for Better Results

### 1. Be Specific About File Paths

The implementation guide uses specific paths - reference them:

```
Create src/utils/viewModes.js as specified in Phase 5, Step 5.1 of IMPLEMENTATION.md
```

### 2. Include Code Block References

Reference specific code examples:

```
Implement the FIFTEEN_MINUTE_VIEW configuration from the code block in 
Phase 5, Step 5.1 of IMPLEMENTATION.md
```

### 3. Request Validation

Ask the agent to check against the guide:

```
After implementing Phase 6, verify all components match the specifications 
in IMPLEMENTATION.md Phase 6, including:
- useGanttData hook structure (Step 6.1)
- TaskEditor form fields (Step 6.2)
- TaskList integration (Step 6.3)
```

### 4. Handle Dependencies Explicitly

Mention when phases depend on each other:

```
Implement Phase 9 (PDF Export). Note that this requires the GanttChart component 
from Phase 4 to be completed. Use html2canvas as specified in Step 9.1, even 
though jsPDF was originally selected, as the guide recommends html2canvas for 
better quality.
```

## Recommended Workflow

### Session 1: Foundation (30-45 min)
```
1. "Set up project: Phases 1-3 from IMPLEMENTATION.md"
2. "Implement Phase 4: Basic Gantt Integration"
3. Test: Verify chart renders
```

### Session 2: Core Features (45-60 min)
```
1. "Implement Phase 5: Custom 15-Minute View Mode"
2. "Implement Phase 6: Task Management System"
3. Test: Add/edit/delete tasks works
```

### Session 3: Advanced Features (45-60 min)
```
1. "Implement Phase 7: Dependencies"
2. "Implement Phase 8: Theme System"
3. Test: Themes and dependencies work
```

### Session 4: Export & Save (30-45 min)
```
1. "Implement Phase 9: PDF Export"
2. "Implement Phase 10: Auto-Save"
3. Test: Export works, data persists
```

### Session 5: Polish (30-45 min)
```
1. "Implement Phase 11: UI/UX Polish"
2. Review and fix any issues
3. Final testing
```

## Handling Deviations

If you want to deviate from the implementation guide:

```
Follow Phase X from IMPLEMENTATION.md as a base, but modify it to [your change]. 
Maintain compatibility with the rest of the application as specified in other phases.
```

## Troubleshooting with the Guide

When things don't work, reference the guide:

```
[Feature] isn't working. Review Phase X from IMPLEMENTATION.md and compare 
with the current implementation. Identify and fix any differences.
```

## Example Complete Session Prompt

Here's a complete prompt for implementing a full phase:

```
Implement Phase 8 (Theme System) from IMPLEMENTATION.md completely:

1. Create src/data/defaultThemes.js with all themes from Step 8.1
2. Create src/hooks/useTheme.js following Step 8.2 exactly
3. Create ThemeSelector component (Step 8.3) with JSX and CSS
4. Create ColorCustomizer component (Step 8.4) with all color pickers
5. Add CSS variables to src/styles/themes.css (Step 8.5)
6. Integrate the theme system into App.jsx
7. Import themes.css in main.jsx or App.jsx

Verify the implementation matches all specifications in Phase 8 of IMPLEMENTATION.md.
```

## Pro Tips

1. **Use Cursor's @file reference**: You can reference the IMPLEMENTATION.md file directly:
   ```
   @IMPLEMENTATION.md Implement Phase 6 following the specifications
   ```

2. **Break complex phases into sub-steps**: For Phase 6 (large), do:
   ```
   "Implement Step 6.1 from Phase 6 (useGanttData hook)"
   "Now implement Step 6.2 (TaskEditor component)"
   ```

3. **Request explanations**: If something is unclear:
   ```
   "Implement Phase 5, Step 5.1. If anything is unclear in IMPLEMENTATION.md, 
   ask for clarification before proceeding."
   ```

4. **Combine testing prompts**: After implementation:
   ```
   "I've implemented Phase 4. Review the code against IMPLEMENTATION.md Phase 4 
   and suggest any improvements or fixes needed."
   ```

5. **Use the checklist**: Reference the testing checklist:
   ```
   "After implementing Phase 6, verify against the testing checklist in 
   IMPLEMENTATION.md to ensure everything works."
   ```

## Conclusion

The key to successfully using IMPLEMENTATION.md with Cursor's AI agent is:

1. **Be explicit** - Always reference the document and specific phases/steps
2. **Work incrementally** - One phase or feature at a time
3. **Test frequently** - Verify each phase before moving on
4. **Provide context** - Mention dependencies from previous phases
5. **Reference specifics** - File paths, function names, code structures

Following these patterns will help you efficiently build the entire application using the implementation guide as your roadmap.

