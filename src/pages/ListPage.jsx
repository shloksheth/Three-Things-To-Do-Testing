import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Upload,
  Copy,
  ChevronLeft,
  List as ListIcon,
  RotateCcw,
  RotateCw,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import FreeFormCanvas from '../components/lists/FreeFormCanvas';

const ListPage = () => {
  const { tasks, categories, addTask, updateTask, deleteTask, toggleTaskCompletion, addCategory, undo, redo, reorderTasks, moveTask } = useStore();
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'kanban', 'side', 'free'
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState('spaced');

  const topLevelTasks = useMemo(() => tasks.filter(t => !t.parentId), [tasks]);
  const unassignedTasks = useMemo(() => tasks.filter(t => !t.date && !t.completed), [tasks]);

  const toggleExpand = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) newExpanded.delete(taskId);
    else newExpanded.add(taskId);
    setExpandedTasks(newExpanded);
  };

  const handleAddTask = (parentId = null, categoryId = null) => {
    const title = prompt('Enter task title:');
    if (title) {
      addTask({ title, parentId, categoryId });
    }
  };

  const handleDeleteTask = (task) => {
    const children = tasks.filter(t => t.parentId === task.id);
    if (children.length > 0) {
      const confirm1 = confirm(`This task has ${children.length} subtasks. Are you sure you want to delete it and all its children?`);
      if (confirm1) {
        const confirm2 = confirm(`Final confirmation: Delete "${task.title}" and all its sub-items?`);
        if (confirm2) {
          deleteTask(task.id);
        }
      }
    } else {
      deleteTask(task.id);
    }
  };

  const handleImport = () => {
    const lines = importText.split('\n').filter(l => l.trim());
    if (importFormat === 'comma') {
      lines.forEach(line => {
        const segments = [];
        let currentSegment = '';
        let commaCount = 0;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === ',') {
            if (currentSegment) {
              segments.push({ text: currentSegment.trim(), depth: commaCount });
              currentSegment = '';
              commaCount = 1;
            } else commaCount++;
          } else currentSegment += line[i];
        }
        if (currentSegment) segments.push({ text: currentSegment.trim(), depth: commaCount });
        if (segments.length === 0) return;
        let rootTask = addTask({ title: segments[0].text });
        let stack = [{ id: rootTask.id, depth: 0 }];
        for (let i = 1; i < segments.length; i++) {
          const { text, depth } = segments[i];
          while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop();
          const parent = stack[stack.length - 1];
          const newTask = addTask({ title: text, parentId: parent?.id });
          stack.push({ id: newTask.id, depth });
        }
      });
    } else if (importFormat === 'spaced') {
       let stack = [];
       lines.forEach(line => {
         const indent = line.search(/\S/);
         const title = line.trim();
         while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
         const parent = stack[stack.length - 1];
         const newTask = addTask({ title, parentId: parent?.id });
         stack.push({ id: newTask.id, indent });
       });
    } else if (importFormat === 'bullet') {
       let stack = [];
       lines.forEach(line => {
         const match = line.match(/^(\s*)(?:-|\*|\d+\.)\s+(.*)$/);
         if (match) {
           const indent = match[1].length;
           const title = match[2].trim();
           while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
           const parent = stack[stack.length - 1];
           const newTask = addTask({ title, parentId: parent?.id });
           stack.push({ id: newTask.id, indent });
         } else {
           const newTask = addTask({ title: line.trim() });
           stack = [{ id: newTask.id, indent: 0 }];
         }
       });
    }
    setShowImport(false);
    setImportText('');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (viewMode === 'kanban') {
       if (source.droppableId !== destination.droppableId) {
          moveTask(draggableId, null, destination.droppableId);
       }
       return;
    }

    // Tree reordering & Nesting
    const sourceParentId = source.droppableId === 'root' ? null : source.droppableId;
    const destParentId = destination.droppableId === 'root' ? null : destination.droppableId;

    if (source.droppableId === destination.droppableId) {
      // Reorder within same parent
      const siblingTasks = tasks.filter(t => t.parentId === sourceParentId);
      const otherTasks = tasks.filter(t => t.parentId !== sourceParentId);

      const [reorderedItem] = siblingTasks.splice(source.index, 1);
      siblingTasks.splice(destination.index, 0, reorderedItem);

      reorderTasks([...otherTasks, ...siblingTasks]);
    } else {
      // Move to a different parent (Nesting)
      moveTask(draggableId, destParentId);
    }
  };

  const TaskItem = ({ task, index, depth = 0 }) => {
    const children = tasks.filter(t => t.parentId === task.id);
    const isExpanded = expandedTasks.has(task.id);
    const hasChildren = children.length > 0;

    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={depth > 0 ? "ml-4 md:ml-6" : ""}
          >
            <div className={`group flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${task.completed ? 'opacity-50' : 'hover:bg-[var(--secondary)] bg-[var(--background)]'}`}>
              <div {...provided.dragHandleProps} className="opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
              </div>

              <button
                onClick={() => toggleExpand(task.id)}
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${!hasChildren ? 'opacity-0 pointer-events-none' : 'opacity-40'}`}
              >
                <ChevronRight size={18} />
              </button>

              <button onClick={() => toggleTaskCompletion(task.id)}>
                 {task.completed ? <CheckCircle2 size={20} className="text-[var(--primary)]" /> : <Circle size={20} className="opacity-20" />}
              </button>

              <div className="flex-1 flex items-center gap-3">
                 <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                 {task.date && (
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary)] text-white font-bold opacity-80">
                     {format(parseISO(task.date), 'MMM d')}
                   </span>
                 )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button onClick={() => handleAddTask(task.id)} className="p-1 hover:bg-[var(--border)] rounded">
                  <Plus size={16} />
                </button>
                <button onClick={() => {
                  const date = prompt('Enter date (YYYY-MM-DD):', task.date || format(new Date(), 'yyyy-MM-dd'));
                  if (date) updateTask(task.id, { date });
                }} className="p-1 hover:bg-[var(--border)] rounded">
                  <CalendarIcon size={16} />
                </button>
                <button onClick={() => handleDeleteTask(task)} className="p-1 hover:bg-red-100 text-red-500 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <Droppable droppableId={task.id} type="TASK">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="border-l border-[var(--border)] ml-2 mt-1 min-h-[4px]"
                  >
                    {children.map((child, idx) => (
                      <TaskItem key={child.id} task={child} index={idx} depth={depth + 1} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  const KanbanView = () => {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 h-full custom-scrollbar">
        {categories.length > 0 ? (
          categories.map(cat => (
            <Droppable key={cat.id} droppableId={cat.id} type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[300px] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </h3>
                    <button onClick={() => handleAddTask(null, cat.id)} className="p-1 hover:bg-[var(--secondary)] rounded"><Plus size={18} /></button>
                  </div>
                  <div className="flex-1 bg-[var(--secondary)] rounded-3xl p-4 space-y-3 min-h-[200px]">
                    {tasks.filter(t => t.categoryId === cat.id && !t.parentId).map((task, idx) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-[var(--background)] p-4 rounded-2xl shadow-sm border border-[var(--border)]"
                          >
                            <p className="font-medium">{task.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))
        ) : (
          <div className="text-center w-full py-20 opacity-30">
            <p>No categories found. Add some in Settings or Lists!</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            My Lists
            {unassignedTasks.length > 0 && (
              <div className="group relative">
                <AlertTriangle className="text-orange-500 cursor-help" size={24} />
                <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-white shadow-xl rounded-xl text-xs border border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-black">
                  You have {unassignedTasks.length} tasks without a date assigned.
                </div>
              </div>
            )}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex bg-[var(--secondary)] p-1 rounded-xl">
               {['tree', 'kanban', 'side', 'free'].map(mode => (
                 <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewMode === mode ? 'bg-[var(--background)] shadow-sm' : 'opacity-50'}`}
                 >
                   {mode}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-2">
               <button onClick={undo} className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors opacity-60 hover:opacity-100"><RotateCcw size={18}/></button>
               <button onClick={redo} className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors opacity-60 hover:opacity-100"><RotateCw size={18}/></button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-xl font-medium hover:bg-[var(--border)] transition-all"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>
          <button
            onClick={() => handleAddTask()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1">
          {viewMode === 'tree' && (
            <Droppable droppableId="root" type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 shadow-sm min-h-[400px]"
                >
                  {topLevelTasks.length > 0 ? (
                    <div className="space-y-2">
                      {topLevelTasks.map((task, idx) => (
                        <TaskItem key={task.id} task={task} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 opacity-30 gap-4">
                       <ListIcon size={64} />
                       <p className="text-xl font-medium">Your list is empty</p>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}

          {viewMode === 'kanban' && <KanbanView />}

          {viewMode === 'free' && <FreeFormCanvas tasks={tasks} />}

          {viewMode === 'side' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topLevelTasks.map((task, idx) => (
                <div key={task.id} className="bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">{task.title}</h3>
                  <TaskItem task={task} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {showImport && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--background)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="text-xl font-bold">Import Tasks</h3>
                <button onClick={() => setShowImport(false)} className="opacity-50 hover:opacity-100">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                 <div className="flex gap-2 p-1 bg-[var(--secondary)] rounded-xl">
                   {['spaced', 'bullet', 'comma'].map(format => (
                     <button
                      key={format}
                      onClick={() => setImportFormat(format)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${importFormat === format ? 'bg-[var(--background)] shadow-md text-[var(--primary)]' : 'opacity-50'}`}
                     >
                       {format}
                     </button>
                   ))}
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <label className="text-sm font-bold opacity-60">Paste your list here:</label>
                       <button
                        onClick={() => {
                          let promptStr = "";
                          if (importFormat === 'comma') promptStr = "Format my list with commas to represent hierarchy. Use one comma for a subtask, two for a sub-subtask. Example: Task, Subtask,, Mini-subtask";
                          else if (importFormat === 'spaced') promptStr = "Format my list with leading spaces to represent hierarchy. Example:\nTask\n  Subtask";
                          else promptStr = "Format my list with bullet points to represent hierarchy.";
                          navigator.clipboard.writeText(promptStr);
                          alert('AI Prompt copied to clipboard!');
                        }}
                        className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"
                       >
                         <Copy size={12} />
                         Copy AI Prompt
                       </button>
                    </div>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder={importFormat === 'spaced' ? "Task 1\n Subtask 1\n  Sub-subtask" : "Task1, Sub1, Sub2,, MiniSub2.1"}
                      className="w-full h-64 bg-[var(--secondary)] border-none rounded-2xl p-4 focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono text-sm"
                    />
                 </div>
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-1">
                    <p className="text-xs font-bold text-orange-800">Example ({importFormat}):</p>
                    <pre className="text-[10px] text-orange-700 font-mono opacity-80">
                      {importFormat === 'spaced' ? "Groceries\n Apples\n Bread" :
                       importFormat === 'comma' ? "Project, Step 1, Step 2,, Detail 2.1" :
                       "- Work\n - Meeting"}
                    </pre>
                 </div>
              </div>
              <div className="p-6 bg-[var(--secondary)] flex gap-3">
                <button onClick={() => setShowImport(false)} className="flex-1 py-3 rounded-xl font-bold border border-[var(--border)] hover:bg-[var(--background)] transition-all">Cancel</button>
                <button onClick={handleImport} className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:shadow-lg transition-all">Import Tasks</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListPage;
