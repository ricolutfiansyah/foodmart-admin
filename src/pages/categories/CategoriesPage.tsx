import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import CategoryFormDialog from './CategoryFormDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import type { AxiosError } from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, error, refetch } = useCategories();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreate = () => {
    setFormMode('create');
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground">Kelola daftar kategori produk.</p>
        </div>
        <Button className='cursor-pointer' onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Jumlah Produk</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="text-red-500 font-medium">Gagal memuat data kategori</div>
                  <div className="text-sm text-muted-foreground">
                    {(error as AxiosError<{ message: string }>)?.response?.data?.message || 'Silahkan coba lagi'}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='cursor-pointer mt-2'
                    onClick={() => refetch()}
                  >
                    Coba Lagi
                  </Button>
                </TableCell>
              </TableRow>
            ) : !categories || categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category._count.foods} items</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label='Edit kategori'
                        className='cursor-pointer'
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label='Hapus kategori'
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog
        mode={formMode}
        category={selectedCategory}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <DeleteCategoryDialog
        category={selectedCategory}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
