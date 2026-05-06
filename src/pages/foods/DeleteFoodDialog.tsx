import React from 'react';
import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteFood } from '@/hooks/useFoods';
import type { Food } from '@/types/food';

interface DeleteFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: Food | null;
}

export default function DeleteFoodDialog({
  open,
  onOpenChange,
  food,
}: DeleteFoodDialogProps) {
  const deleteFood = useDeleteFood();

  if (!food) return null;

  const isPending = deleteFood.isPending;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending) return;

    deleteFood.mutate(food.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isPending) return;
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Makanan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus makanan <strong className="text-foreground">{food.name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
