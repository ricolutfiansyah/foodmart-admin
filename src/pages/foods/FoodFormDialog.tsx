import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCreateFood, useUpdateFood } from '@/hooks/useFoods';
import { useCategories } from '@/hooks/useCategories';
import type { Food } from '@/types/food';
import type { ValidationError } from '@/types/api';

const handleInputNumber = (onchange: (val: number) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    onchange(isNaN(val) ? 0 : val);
  }

const fileSchema = z.instanceof(File, { message: 'File tidak valid' });

const foodSchema = z.object({
  name: z.string().min(1, 'Nama makanan wajib diisi'),
  description: z.string().optional(),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  isAvailable: z.boolean(),
  image: fileSchema.optional(),
});

type FormValues = z.infer<typeof foodSchema>;

interface FoodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food?: Food;
}

export default function FoodFormDialog({
  open,
  onOpenChange,
  food,
}: FoodFormDialogProps) {
  const createFood = useCreateFood();
  const updateFood = useUpdateFood();
  const { data: categories } = useCategories();

  const isPending = createFood.isPending || updateFood.isPending;
  const isEditMode = !!food;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && food) {
        form.reset({
          name: food.name,
          description: food.description || '',
          price: Number(food.price),
          stock: Number(food.stock),
          categoryId: food.categoryId,
          isAvailable: food.isAvailable,
        });
        setImagePreview(food.imageUrl || null);
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          categoryId: '',
          isAvailable: true,
        });
        setImagePreview(null);
      }
    }
  }, [open, isEditMode, food, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran gambar maksimal 2MB');
        return;
      }
      form.setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    form.setValue('image', undefined);
    if (isEditMode && food?.imageUrl) {
      setImagePreview(food.imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (isEditMode && food) {
      updateFood.mutate(
        { id: food.id, data: values },
        {
          onSuccess: () => {
            toast.success('Makanan berhasil diperbarui');
            onOpenChange(false);
          },
          onError: (error: any) => {
            if (error.response?.status === 400 && error.response.data?.errors) {
              error.response.data.errors.forEach((err: ValidationError) => {
                form.setError(err.field as any, { message: err.message });
              });
            }
          },
        }
      );
    } else {
      createFood.mutate(values as any, {
        onSuccess: () => {
          toast.success('Makanan berhasil ditambahkan');
          onOpenChange(false);
        },
        onError: (error: any) => {
          if (error.response?.status === 400 && error.response.data?.errors) {
            error.response.data.errors.forEach((err: ValidationError) => {
              form.setError(err.field as any, { message: err.message });
            });
          }
        },
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isPending) return;
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Makanan' : 'Tambah Makanan'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Makanan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isPending}
                        {...field}
                        onChange={handleInputNumber(field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isPending}
                        {...field}
                        onChange={handleInputNumber(field.onChange)}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi makanan..."
                      className="resize-none"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tersedia</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Tentukan apakah makanan ini tersedia untuk dipesan.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      className='cursor-pointer'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Gambar Makanan</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative h-24 w-24 rounded-md border overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-md border border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                    <ImagePlus className="h-6 w-6 mb-1" />
                    <span className="text-xs">No image</span>
                  </div>
                )}

                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isPending}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Maksimal ukuran file: 2MB. Format: JPG, PNG, GIF.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                className='cursor-pointer'
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
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
