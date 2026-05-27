import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {message} <br />
                <span className="font-bold text-slate-800">"{itemName}"</span>
              </p>
            </div>
            <div className="p-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-md hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-brand-primary text-white text-[11px] font-bold rounded-md hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
