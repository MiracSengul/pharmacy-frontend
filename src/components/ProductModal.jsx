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
import { getSuppliers } from '../services/api';
import './ProductModal.css';

const productSchema = yup.object({
  name: yup.string().required('Ürün adı zorunludur'),
  category: yup.string().required('Kategori zorunludur'),
  stock: yup.number().typeError('Sayı giriniz').min(0, 'Stok 0 veya daha büyük olmalı').required('Stok zorunludur'),
  price: yup.number().typeError('Sayı giriniz').min(0, 'Fiyat 0 veya daha büyük olmalı').required('Fiyat zorunludur'),
  suppliers: yup.array().of(yup.string()).default([]),
});

const defaultCategories = [
  'Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care',
  'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'
];

const ProductModal = ({ open, onClose, onSubmit, initialData, categories = defaultCategories, suppliers = [] }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [supplierList, setSupplierList] = useState(suppliers);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
  });

  // Modal açıldığında tedarikçi listesini çek (eğer prop boşsa)
  useEffect(() => {
    if (open && suppliers.length === 0) {
      getSuppliers()
        .then(res => setSupplierList(res.data.data))
        .catch(() => setSupplierList([]));
    } else {
      setSupplierList(suppliers);
    }
  }, [open, suppliers]);

  // Formu sıfırla / mevcut verileri yükle
  useEffect(() => {
    if (initialData) {
      const supplierIds = initialData.suppliers
        ? initialData.suppliers.map(s => (typeof s === 'string' ? s : s._id))
        : [];
      reset({
        name: initialData.name || '',
        category: initialData.category || '',
        stock: initialData.stock ?? 0,
        price: initialData.price ?? 0,
        suppliers: supplierIds,
      });
    } else {
      reset({
        name: '',
        category: '',
        stock: 0,
        price: 0,
        suppliers: [],
      });
    }
  }, [initialData, reset]);

  const submitHandler = (data) => {
    onSubmit({
      name: data.name,
      category: data.category,
      stock: data.stock,
      price: data.price,
      suppliers: data.suppliers,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      className="product-modal"
    >
      <DialogTitle>
        {initialData ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Info"
            margin="dense"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Category"
                margin="dense"
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            fullWidth
            label="Stock"
            type="number"
            margin="dense"
            {...register('stock')}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />

          <Controller
            name="suppliers"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Supplier"
                margin="dense"
                SelectProps={{ multiple: true }}
                error={!!errors.suppliers}
                helperText={errors.suppliers?.message}
              >
                {supplierList.map((sup) => (
                  <MenuItem key={sup._id} value={sup._id}>
                    {sup.name} ({sup.company})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="dense"
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
            inputProps={{ step: '0.01' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#6b7280', fontWeight: 500 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#5EAA7B',
              '&:hover': { bgcolor: '#4b8f65' },
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {initialData ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;