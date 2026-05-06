import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ImageOff } from 'lucide-react';
import { useFoods, useUpdateFood } from '@/hooks/useFoods';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import type { Food } from '@/types/food';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import FoodFormDialog from './FoodFormDialog';
import DeleteFoodDialog from './DeleteFoodDialog';

export default function FoodsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [categoryId, setCategoryId] = useState('');

  const { data: foods, isLoading, isError, refetch } = useFoods({
    search: debouncedSearch,
    categoryId: categoryId || undefined,
  });
  const { data: categories } = useCategories();
  const updateFood = useUpdateFood();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreate = () => {
    setSelectedFood(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setIsFormOpen(true);
  };

  const handleDelete = (food: Food) => {
    setSelectedFood(food);
    setIsDeleteOpen(true);
  };

  const handleToggleAvailable = (food: Food, newValue: boolean) => {
    updateFood.mutate({ id: food.id, data: { isAvailable: newValue } });
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setCategoryId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Makanan</h1>
          <p className="text-muted-foreground">Kelola daftar makanan yang tersedia.</p>
        </div>
        <Button className='cursor-pointer' onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Makanan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari makanan..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryId === '' ? 'all' : categoryId} onValueChange={(val) => setCategoryId(val === 'all' ? '' : val)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleResetFilter}>
          Reset Filter
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  Gagal memuat data makanan.
                  <Button variant="link" onClick={() => refetch()}>Coba lagi</Button>
                </TableCell>
              </TableRow>
            ) : !foods?.data || foods.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Belum ada makanan.
                </TableCell>
              </TableRow>
            ) : (
              foods?.data.map((food) => (
                <TableRow key={food.id}>
                  <TableCell>
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                        <ImageOff className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{food.name}</TableCell>
                  <TableCell>{food.category?.name || '-'}</TableCell>
                  <TableCell>{formatRupiah(food.price)}</TableCell>
                  <TableCell>{food.stock}</TableCell>
                  <TableCell>
                    <Switch
                      checked={food.isAvailable}
                      onCheckedChange={(checked) => handleToggleAvailable(food, checked)}
                      aria-label="Status ketersediaan makanan"
                      aria-checked={food.isAvailable}
                      className='cursor-pointer'
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className='cursor-pointer'
                        onClick={() => handleEdit(food)}
                        aria-label='Edit makanan'
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDelete(food)}
                        aria-label='Hapus makanan'
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

      <FoodFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        food={selectedFood}
      />

      {selectedFood && (
        <DeleteFoodDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          food={selectedFood}
        />
      )}
    </div>
  );
}
