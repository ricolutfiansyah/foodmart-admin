import React from 'react';
import { toast } from 'sonner';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDeleteCategory } from '@/hooks/useCategories';
import type { Category } from '@/types/category';

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();

  if (!category) return null;

  const hasProducts = category._count.foods > 0;
  const isPending = deleteCategory.isPending;

  const handleDelete = () => {
    if (hasProducts) return;

    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        toast.success('Kategori berhasil dihapus');
        onOpenChange(false);
      }
    });
  };

  const ActionButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
    <AlertDialogAction
      {...props}
      ref={ref}
      onClick={handleDelete}
      disabled={hasProducts || isPending}
      className={'bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Hapus
    </AlertDialogAction>
  ));
  ActionButton.displayName = "ActionButton";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => { if (!isPending) onOpenChange(open) }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kategori <strong className="text-foreground">{category.name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer' disabled={isPending}>Batal</AlertDialogCancel>
          {hasProducts ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div tabIndex={0}>
                    <ActionButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tidak dapat dihapus. Masih ada {category._count.foods} produk.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <ActionButton />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
