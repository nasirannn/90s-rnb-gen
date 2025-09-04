"use client";
import React from "react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default"
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {message}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className={`px-6 ${
              variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : ""
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
