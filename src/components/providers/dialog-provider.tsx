import { create } from 'zustand';
import React from 'react';

type DialogState = {
  isOpen: boolean;
  content: React.ReactNode | null;
  openDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  content: null,
  openDialog: (content) => set({ isOpen: true, content }),
  closeDialog: () => set({ isOpen: false, content: null }),
}));

export function DialogProvider() {
  const { isOpen, content, closeDialog } = useDialogStore();

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-xl border border-border animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeDialog}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {content}
      </div>
    </div>
  );
}
