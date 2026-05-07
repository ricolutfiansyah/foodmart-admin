import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/types/category';
import type { ApiAxiosError } from '@/types/api';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama kategori minimal 2 karakter.' }).max(50, { message: 'Nama kategori maksimal 50 karakter.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormDialogProps {
  mode: 'create' | 'edit';
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CategoryFormDialog({
  mode,
  category,
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        mode === 'edit' && category
          ? { name: category.name }
          : { name: '' }
      );
    }
  }, [open, mode, category, form]);

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      createCategory.mutate(values, {
        onSuccess: () => {
          toast.success('Kategori berhasil ditambahkan');
          onOpenChange(false);
        },
        onError: (error: ApiAxiosError) => {
          if (error.response?.status === 400 && error.response.data?.errors) {
            return;
          }
          toast.error(error.response?.data?.message || 'Gagal menambahkan kategori');
        }
      });
    } else if (mode === 'edit' && category) {
      updateCategory.mutate(
        { id: category.id, data: values },
        {
          onSuccess: () => {
            toast.success('Kategori berhasil diperbarui');
            onOpenChange(false);
          }
        }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => { if (!isPending) onOpenChange(open) }}
    >
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kategori" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className='cursor-pointer'
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button className='cursor-pointer' type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
