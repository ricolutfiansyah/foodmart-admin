import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderStatus } from '@/types/order';

interface OrderDetailDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getValidNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case OrderStatus.PENDING:
      return [OrderStatus.PROCESSING, OrderStatus.CANCELLED];
    case OrderStatus.PROCESSING:
      return [OrderStatus.COMPLETED, OrderStatus.CANCELLED];
    case OrderStatus.COMPLETED:
    case OrderStatus.CANCELLED:
    default:
      return [];
  }
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(Number(amount));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('id-ID');
};

export default function OrderDetailDialog({ orderId, open, onOpenChange }: OrderDetailDialogProps) {
  const { data, isLoading, isError, isFetching } = useOrder(orderId as string, !!orderId && open);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const order = data?.data;

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === OrderStatus.CANCELLED) {
      setPendingStatus(newStatus);
      setConfirmCancelOpen(true);
    } else {
      if (orderId) {
        updateStatus(
          { id: orderId, status: newStatus },
          { onSuccess: () => toast.success('Status pesanan berhasil diperbarui') }
        );
      }
    }
  };

  const handleConfirmCancel = () => {
    if (orderId && pendingStatus) {
      updateStatus(
        { id: orderId, status: pendingStatus },
        { onSuccess: () => toast.success('Pesanan berhasil dibatalkan') }
      );
    }
    setConfirmCancelOpen(false);
    setPendingStatus(null);
  };

  useEffect(() => {
    if (!open) {
      setPendingStatus(null);
      setConfirmCancelOpen(false);
    }
  }, [open]);

  const validNextStatuses = order ? getValidNextStatuses(order.status) : [];
  const canUpdate = validNextStatuses.length > 0;
  const selectElement = (
    <Select
      disabled={!canUpdate || isUpdating}
      value={order?.status}
      onValueChange={(val) => handleStatusChange(val as OrderStatus)}
    >
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {order && (
          <SelectItem className='cursor-pointer' value={order.status} disabled>
            {order.status}
          </SelectItem>
        )}
        {validNextStatuses.map((status) => (
          <SelectItem className='cursor-pointer' key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:w-[calc(100vw-8rem)] lg:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              Detail Pesanan
              {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError || !order ? (
            <div className="text-center text-red-500 py-8">
              Gagal memuat detail pesanan
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID Pesanan</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Pesanan</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pelanggan</p>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-muted-foreground text-xs">{order.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    {!canUpdate ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block cursor-not-allowed">
                            {selectElement}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Status {order.status} tidak dapat diubah lagi.</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      selectElement
                    )}
                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isFetching && (
                      <span className='text-xs text-muted-foreground animate-pulse'>Updating...</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Catatan</p>
                  <p className="font-medium">{order.note || '-'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Item Pesanan</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='text-center'>Menu</TableHead>
                        <TableHead className="text-center">Harga</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-center">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center justify-center gap-3">
                              {item.food.imageUrl ? (
                                <img
                                  src={item.food.imageUrl}
                                  alt={item.food.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Img</span>
                                </div>
                              )}
                              <span className="font-medium">{item.food.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {formatCurrency(item.priceAtOrder)}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center font-medium">
                            {formatCurrency(String(Number(item.priceAtOrder) * item.quantity))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <p className="text-muted-foreground">Total Keseluruhan</p>
                    <p className="text-2xl font-bold">{formatCurrency(order.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmCancel}
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
