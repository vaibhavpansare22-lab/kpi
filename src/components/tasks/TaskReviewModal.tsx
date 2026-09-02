import React from 'react';
import { Task } from '../../types';
import { TaskReviewPage } from './TaskReviewPage';
import { X } from 'lucide-react';

interface TaskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
}

export const TaskReviewModal: React.FC<TaskReviewModalProps> = ({
  isOpen,
  onClose,
  taskId,
}) => {
  if (!isOpen || !taskId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-indigo-500/40 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto relative">
        <div className="flex justify-end pb-2">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TaskReviewPage taskId={taskId} onBack={onClose} />
      </div>
    </div>
  );
};
