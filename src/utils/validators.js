import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Geçerli bir e-posta giriniz').required('E-posta zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
});

export const productSchema = yup.object({
  name: yup.string().required('Ürün adı zorunludur'),
  category: yup.string().required('Kategori zorunludur'),
  stock: yup.number().typeError('Sayı giriniz').min(0).required('Stok zorunludur'),
  price: yup.number().typeError('Sayı giriniz').min(0).required('Fiyat zorunludur'),
  suppliers: yup.array().of(yup.string()),
  description: yup.string(),
});

export const supplierSchema = yup.object({
  name: yup.string().required('Tedarikçi adı zorunludur'),
  email: yup.string().email('Geçerli e-posta giriniz'),
  phone: yup.string(),
  address: yup.string().required('Adres zorunludur'),
  company: yup.string().required('Şirket adı zorunludur'),
  deliveryDate: yup.date().nullable(),
  amount: yup.number().typeError('Sayı giriniz').min(0).default(0),
  status: yup.string().oneOf(['Active', 'Inactive', 'Pending']).required('Durum zorunludur'),
});
