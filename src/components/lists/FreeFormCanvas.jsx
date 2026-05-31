import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useStore } from '../../store/useStore';
import { GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';

const FreeFormCanvas = ({ tasks }) => {
  const { updateTaskPosition } = useStore();
  const [snapToGrid, setSnapToGrid] = useState(true);
  const gridSize = 20;

  return (
    <div className="relative w-full h-[600px] bg-[var(--background)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-inner group">
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`
        }}
      />

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${snapToGrid ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] opacity-50'}`}
        >
          {snapToGrid ? 'Grid Snapping On' : 'Free Positioning'}
        </button>
      </div>

      <div className="w-full h-full relative p-10">
        {tasks.map(task => (
          <Draggable
            key={task.id}
            grid={snapToGrid ? [gridSize, gridSize] : [1, 1]}
            position={task.position || { x: 50, y: 50 }}
            onStop={(e, data) => updateTaskPosition(task.id, { x: data.x, y: data.y })}
            handle=".drag-handle"
          >
            <div className="absolute bg-[var(--background)] border border-[var(--border)] p-4 rounded-2xl shadow-lg min-w-[200px] cursor-default active:shadow-xl transition-shadow">
              <div className="drag-handle cursor-grab active:cursor-grabbing flex items-center justify-between mb-2 opacity-30 hover:opacity-100 transition-opacity">
                <GripHorizontal size={16} />
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              </div>
              <p className="font-bold text-sm">{task.title}</p>
              {task.date && <p className="text-[10px] opacity-50 mt-1">{task.date}</p>}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default FreeFormCanvas;
