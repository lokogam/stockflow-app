"use client";

import { AlertCircle, X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-[2px]">
      <div className="bg-card mx-4 w-full max-w-md border border-border shadow-2xl">
        <div className="bg-muted/50 flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-bold uppercase tracking-[0.1em]">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-[2px]">
      <div className="bg-card mx-4 w-full max-w-sm border border-border p-6 shadow-2xl">
        <div className="mb-6 flex items-start gap-3">
          <div className="bg-destructive/10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center">
            <AlertCircle size={16} className="text-destructive" />
          </div>
          <p className="text-sm leading-relaxed text-foreground">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground px-4 py-2 text-[11px] font-semibold uppercase tracking-widest hover:opacity-90"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
