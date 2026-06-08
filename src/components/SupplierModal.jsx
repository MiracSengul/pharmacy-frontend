import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import './SupplierModal.css';

// Tedarikçi validasyon şeması
const supplierSchema = yup.object({
  name: yup.string().required('Tedarikçi adı zorunludur'),
  email: yup.string().email('Geçerli bir e-posta giriniz'),
  phone: yup.string(),
  address: yup.string().required('Adres zorunludur'),
  company: yup.string().required('Şirket adı zorunludur'),
  deliveryDate: yup.string().nullable(),
  amount: yup.number().typeError('Sayı giriniz').min(0).default(0),
  status: yup.string().oneOf(['Active', 'Inactive', 'Pending']).required('Durum zorunludur'),
});

const statusOptions = ['Active', 'Inactive', 'Pending'];

const SupplierModal = ({ open, onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(supplierSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        company: initialData.company || '',
        deliveryDate: initialData.deliveryDate
          ? new Date(initialData.deliveryDate).toISOString().slice(0, 10)
          : '',
        amount: initialData.amount ?? 0,
        status: initialData.status || 'Active',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        deliveryDate: '',
        amount: 0,
        status: 'Active',
      });
    }
  }, [initialData, reset]);

  const submitHandler = (data) => {
    const payload = {
      ...data,
      deliveryDate: data.deliveryDate || null,
    };
    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      className="supplier-modal"
    >
      <DialogTitle>
        {initialData ? 'Edit Supplier' : 'Add New Supplier'}
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Supplier Name"
            margin="dense"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Phone"
            margin="dense"
            {...register('phone')}
          />
          <TextField
            fullWidth
            label="Address"
            margin="dense"
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <TextField
            fullWidth
            label="Company"
            margin="dense"
            {...register('company')}
            error={!!errors.company}
            helperText={errors.company?.message}
          />
          <TextField
            fullWidth
            label="Delivery Date"
            type="date"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            {...register('deliveryDate')}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="dense"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Status"
                margin="dense"
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#5EAA7B',
              '&:hover': { bgcolor: '#4b8f65' },
            }}
          >
            {initialData ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierModal;