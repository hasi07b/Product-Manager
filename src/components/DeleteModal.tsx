import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, productName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle size={32} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Delete Product?</h2>
          <p className="text-slate-400 mb-8">
            Are you sure you want to delete{' '}
            <span className="text-white font-semibold">"{productName}"</span>? This action
            cannot be undone in this session.
          </p>

          <div className="flex gap-3 w-full">
            <button
              id="modal-cancel-btn"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="modal-confirm-delete-btn"
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
