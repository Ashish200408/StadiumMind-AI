import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from './button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'warning';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}: ConfirmationDialogProps) {
  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
      bg: 'bg-destructive/10',
      button: 'danger' as const,
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      bg: 'bg-yellow-100',
      button: 'primary' as const,
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-600" />,
      bg: 'bg-blue-100',
      button: 'primary' as const,
    },
  };

  const style = typeStyles[type];

  const footer = (
    <div className="flex w-full justify-end gap-3 sm:w-auto">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button variant={style.button} onClick={onConfirm} isLoading={isLoading}>
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} className="max-w-md">
      <div className="flex flex-col sm:flex-row gap-4 items-start pt-6">
        <div
          className={cn(
            'flex shrink-0 h-12 w-12 items-center justify-center rounded-full',
            style.bg
          )}
        >
          {style.icon}
        </div>
        <div className="flex-1 mt-1 sm:mt-0">
          <h3 className="text-lg font-semibold leading-none tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
