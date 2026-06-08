import { useEffect, useState } from 'react';
import { getProducts, getSuppliers, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Typography, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import ProductModal from '../components/ProductModal';
import './ProductsPage.css';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (params = {}) => {
    try {
      const res = await getProducts(params);
      setProducts(res.data.data);
      setCategories(res.data.categories || []);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Ürünler yüklenirken hata oluştu');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data.data);
    } catch (err) {
      console.error('Tedarikçiler alınamadı');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleFilter = () => {
    fetchProducts({ search: filter });
  };

  const handleAdd = async (data) => {
    await createProduct(data);
    setModalOpen(false);
    fetchProducts();
    toast.success('Ürün eklendi');
  };

  const handleEdit = async (id, data) => {
    await updateProduct(id, data);
    setEditingProduct(null);
    setModalOpen(false);
    fetchProducts();
    toast.success('Ürün güncellendi');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
        toast.success('Ürün silindi');
      } catch {
        toast.error('Silme başarısız');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="products-page">
      {/* Üst kontrol alanı */}
      <div className="products-toolbar">
        <div className="toolbar-left">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Product Name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="products-search"
          />
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleFilter}
            className="filter-btn"
          >
            Filter
          </Button>
        </div>
        <div className="toolbar-right">
          <button className="add-btn" onClick={openAddModal}>
            <span className="add-icon-circle">
              <AddIcon fontSize="small" />
            </span>
            <span className="add-text">Add a new product</span>
          </button>
        </div>
      </div>

      {/* Ana kart ve tablo */}
      <div className="products-card">
        <div className="table-header-banner">
          <Typography variant="h6" fontWeight={700} color="#111827">
            All products
          </Typography>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Suppliers</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">Henüz ürün bulunmamaktadır.</td>
              </tr>
            ) : (
              paginatedProducts.map((prod) => (
                <tr key={prod._id}>
                  <td className="product-name">{prod.name}</td>
                  <td>{prod.category}</td>
                  <td>{prod.stock}</td>
                  <td>
                    {Array.isArray(prod.suppliers) && prod.suppliers.length > 0
                      ? prod.suppliers.map(s => s.name || s.company).join(', ')
                      : (prod.suppliers || '—')}
                  </td>
                  <td>${parseFloat(prod.price).toFixed(2)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="edit-btn" onClick={() => openEditModal(prod)} title="Edit">
                        <EditIcon fontSize="small" />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(prod._id)} title="Delete">
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama noktaları */}
      {totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <span
              key={page}
              className={`dot ${page === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            />
          ))}
        </div>
      )}

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? (data) => handleEdit(editingProduct._id, data) : handleAdd}
        initialData={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
};

export default ProductsPage;