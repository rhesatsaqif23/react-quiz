'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QuizConfigForm } from './quiz-config-form';

interface QuizConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuizConfigDialog: React.FC<QuizConfigDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-wide sm:text-3xl">
            Quiz Configuration
          </DialogTitle>
          <DialogDescription className="text-center text-base font-medium text-muted-foreground sm:text-lg">
            Customize your quiz experience
          </DialogDescription>
        </DialogHeader>
        <QuizConfigForm />
      </DialogContent>
    </Dialog>
  );
};
