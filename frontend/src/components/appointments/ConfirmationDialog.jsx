import React from 'react';
import { Button } from '../ui';
import { AlertCircle } from 'lucide-react';

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDestructive }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-background-light border-t border-divider flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700' : ''}
          >
            {confirmText || 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};
