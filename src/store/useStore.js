import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create()(
  persist(
    (set, get) => ({
      // --- STATE ---
      user: {
        name: 'Friend',
        theme: 'red-pastel',
      },
      categories: [
        { id: 'cat-1', name: 'Work', color: '#e57373' },
        { id: 'cat-2', name: 'Personal', color: '#64b5f6' },
        { id: 'cat-3', name: 'School', color: '#81c784' },
      ],
      tasks: [],
      events: [],

      // History for Undo/Redo
      history: [],
      future: [],

      // --- ACTIONS ---

      _saveHistory: () => {
        const { tasks, categories, events, history } = get();
        const currentState = JSON.stringify({ tasks, categories, events });
        if (history.length > 0 && history[history.length - 1] === currentState) return;

        set({
          history: [...history.slice(-49), currentState],
          future: []
        });
      },

      undo: () => {
        const { history, future, tasks, categories, events } = get();
        if (history.length === 0) return;

        const prevState = JSON.parse(history[history.length - 1]);
        const currentState = JSON.stringify({ tasks, categories, events });

        set({
          ...prevState,
          history: history.slice(0, -1),
          future: [currentState, ...future.slice(0, 49)]
        });
      },

      redo: () => {
        const { history, future, tasks, categories, events } = get();
        if (future.length === 0) return;

        const nextState = JSON.parse(future[0]);
        const currentState = JSON.stringify({ tasks, categories, events });

        set({
          ...nextState,
          history: [...history, currentState],
          future: future.slice(1)
        });
      },

      // User Actions
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

      // Category Actions
      addCategory: (category) => {
        get()._saveHistory();
        const newCategory = {
          id: crypto.randomUUID(),
          name: category.name,
          color: category.color || '#e57373',
          ...category
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      updateCategory: (id, updates) => {
        get()._saveHistory();
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
      },

      deleteCategory: (id) => {
        get()._saveHistory();
        set((state) => ({
          categories: state.categories.filter(c => c.id !== id),
          tasks: state.tasks.map(t => t.categoryId === id ? { ...t, categoryId: null } : t)
        }));
      },

      // Task Actions
      addTask: (task) => {
        get()._saveHistory();
        const newTask = {
          id: crypto.randomUUID(),
          title: '',
          completed: false,
          subtasks: [],
          date: null, // assigned date string 'YYYY-MM-DD'
          categoryId: null,
          parentId: null,
          ...task
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        get()._saveHistory();
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
      },

      deleteTask: (id) => {
        get()._saveHistory();
        const deleteTaskRecursive = (tasks, taskId) => {
          const children = tasks.filter(t => t.parentId === taskId);
          let currentTasks = tasks.filter(t => t.id !== taskId);
          children.forEach(child => {
            currentTasks = deleteTaskRecursive(currentTasks, child.id);
          });
          return currentTasks;
        };
        set((state) => ({ tasks: deleteTaskRecursive(state.tasks, id) }));
      },

      moveTask: (id, newParentId, newCategoryId = null) => {
        get()._saveHistory();
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === id ? { ...t, parentId: newParentId, categoryId: newCategoryId || t.categoryId } : t
          )
        }));
      },

      reorderTasks: (newTasks) => {
        get()._saveHistory();
        set({ tasks: newTasks });
      },

      updateTaskPosition: (id, position) => {
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, position } : t)
        }));
      },

      toggleTaskCompletion: (id) => {
        get()._saveHistory();
        const state = get();
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;

        const newCompleted = !task.completed;

        // Update task and all its children
        const updateChildren = (tasks, parentId, completed) => {
          return tasks.map(t => {
            if (t.parentId === parentId) {
              return { ...t, completed, ...(t.subtasks.length > 0 ? { subtasks: updateChildren(tasks, t.id, completed) } : {}) };
            }
            return t;
          });
        };

        // This logic needs to be more robust for nested structures
        // Actually, my state structure is flat with parentId, which is better.

        const setCompletedRecursive = (tasks, taskId, completed) => {
          return tasks.map(t => {
            if (t.id === taskId || t.parentId === taskId) {
              const updatedTask = { ...t, completed };
              // if it has children, we need to recurse
              // But since we are mapping over all tasks, we will hit the children anyway if we check parentId
              return updatedTask;
            }
            return t;
          });
        };

        // Correct recursive toggle:
        const markRecursive = (tasks, tid, val) => {
          const children = tasks.filter(t => t.parentId === tid);
          tasks = tasks.map(t => t.id === tid ? { ...t, completed: val } : t);
          children.forEach(c => {
            tasks = markRecursive(tasks, c.id, val);
          });
          return tasks;
        };

        let newTasks = markRecursive(state.tasks, id, newCompleted);

        // After updating children, we might need to update parents (if all siblings are done)
        const updateParents = (tasks, childId) => {
          const child = tasks.find(t => t.id === childId);
          if (!child || !child.parentId) return tasks;

          const parent = tasks.find(t => t.id === child.parentId);
          const siblings = tasks.filter(t => t.parentId === parent.id);
          const allSiblingsDone = siblings.every(s => s.completed);

          if (parent.completed !== allSiblingsDone) {
             tasks = tasks.map(t => t.id === parent.id ? { ...t, completed: allSiblingsDone } : t);
             return updateParents(tasks, parent.id);
          }
          return tasks;
        };

        newTasks = updateParents(newTasks, id);

        set({ tasks: newTasks });
      },

      // Event Actions
      addEvent: (event) => {
        get()._saveHistory();
        set((state) => ({
          events: [...state.events, { id: crypto.randomUUID(), title: '', date: '', time: '', notify: false, ...event }]
        }));
      },

      updateEvent: (id, updates) => {
        get()._saveHistory();
        set((state) => ({
          events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
        }));
      },

      deleteEvent: (id) => {
        get()._saveHistory();
        set((state) => ({
          events: state.events.filter(e => e.id !== id)
        }));
      },

      // Global Actions
      clearData: () => {
        get()._saveHistory();
        set({ tasks: [], categories: [], events: [] });
      },
      importData: (data) => {
        get()._saveHistory();
        set({ ...data });
      },
    }),
    {
      name: 'three-things-data',
    }
  )
);
