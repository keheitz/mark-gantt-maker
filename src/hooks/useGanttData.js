import { useState, useCallback } from 'react'

/**
 * Custom hook for managing Gantt chart task data.
 * Provides CRUD operations for tasks with proper state management.
 * 
 * @param {Array} initialTasks - Initial array of task objects
 * @returns {Object} Task state and manipulation functions
 */
export function useGanttData(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks)

  /**
   * Adds a new task to the task list
   * @param {Object} task - Task object with name, start, end, progress, etc.
   * @returns {Object} The newly created task with generated ID
   */
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

  /**
   * Updates an existing task by ID
   * @param {string} taskId - The ID of the task to update
   * @param {Object} updates - Object containing the fields to update
   */
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }, [])

  /**
   * Deletes a task by ID and removes it from other tasks' dependencies
   * @param {string} taskId - The ID of the task to delete
   */
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => {
      // Remove the task and also remove it from any dependencies
      return prev
        .filter(task => task.id !== taskId)
        .map(task => {
          if (task.dependencies) {
            // Ensure dependencies is a string before splitting
            const depsString = typeof task.dependencies === 'string' 
              ? task.dependencies 
              : String(task.dependencies || '')
            // Remove the deleted task from dependencies
            const deps = depsString.split(',').filter(dep => dep.trim() !== taskId)
            return { ...task, dependencies: deps.join(',') }
          }
          return task
        })
    })
  }, [])

  /**
   * Replaces all tasks with a new array
   * @param {Array} newTasks - New array of tasks
   */
  const replaceTasks = useCallback((newTasks) => {
    setTasks(newTasks)
  }, [])

  /**
   * Gets a task by ID
   * @param {string} taskId - The ID of the task to find
   * @returns {Object|undefined} The task object or undefined if not found
   */
  const getTask = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId)
  }, [tasks])

  /**
   * Validates that adding a dependency won't create a circular reference
   * @param {string} taskId - The task that would have the dependency
   * @param {string} dependencyId - The potential dependency
   * @returns {boolean} True if the dependency is valid (no circular reference)
   */
  const isValidDependency = useCallback((taskId, dependencyId) => {
    if (taskId === dependencyId) return false
    
    // Check for circular dependencies by traversing the dependency graph
    const visited = new Set()
    const stack = [dependencyId]
    
    while (stack.length > 0) {
      const current = stack.pop()
      if (current === taskId) return false
      if (visited.has(current)) continue
      visited.add(current)
      
      const task = tasks.find(t => t.id === current)
      if (task?.dependencies) {
        // Ensure dependencies is a string before splitting
        const depsString = typeof task.dependencies === 'string' 
          ? task.dependencies 
          : String(task.dependencies || '')
        const deps = depsString.split(',').map(d => d.trim()).filter(Boolean)
        stack.push(...deps)
      }
    }
    
    return true
  }, [tasks])

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    replaceTasks,
    getTask,
    isValidDependency
  }
}

export default useGanttData
