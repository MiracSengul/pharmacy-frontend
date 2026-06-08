import { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, updateSupplier } from '../services/api';
import { Typography, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import SupplierModal from '../components/SupplierModal';
import './SuppliersPage.css';

const ITEMS_PER_PAGE = 10;

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSuppliers = async (params = {}) => {
    try {
      const res = await getSuppliers(params);
      setSuppliers(res.data.data);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Tedarikçiler yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFilter = () => {
    fetchSuppliers({ search: filter });
  };

  const handleAdd = async (data) => {
    await createSupplier(data);
    setModalOpen(false);
    fetchSuppliers();
    toast.success('Tedarikçi eklendi');
  };

  const handleEdit = async (id, data) => {
    await updateSupplier(id, data);
    setEditingSupplier(null);
    setModalOpen(false);
    fetchSuppliers();
    toast.success('Tedarikçi güncellendi');
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  // Client-side pagination
  const totalPages = Math.ceil(suppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = suppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="suppliers-page">
      {/* Üst kontrol alanı */}
      <div className="suppliers-toolbar">
        <div className="toolbar-left">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Supplier Name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="suppliers-search"
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
          <button className="add-supplier-btn" onClick={openAddModal}>
            <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
            Add a new supplier
          </button>
        </div>
      </div>

      {/* Ana kart ve tablo */}
      <div className="suppliers-card">
        <div className="table-header-banner">
          <Typography variant="h6" fontWeight={700} color="#111827">
            All Suppliers
          </Typography>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Suppliers Info</th>
              <th>Address</th>
              <th>Company</th>
              <th>Delivery date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Henüz tedarikçi bulunmamaktadır.
                </td>
              </tr>
            ) : (
              paginatedSuppliers.map((sup) => (
                <tr key={sup._id}>
                  <td className="supplier-name">
                    {sup.name}
                    {sup.email && <div className="supplier-email">{sup.email}</div>}
                  </td>
                  <td>{sup.address || '—'}</td>
                  <td>{sup.company || '—'}</td>
                  <td>
                    {sup.deliveryDate
                      ? new Date(sup.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td>${sup.amount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${sup.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {sup.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-edit-btn"
                      onClick={() => openEditModal(sup)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination noktaları */}
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

      <SupplierModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSupplier(null);
        }}
        onSubmit={editingSupplier ? (data) => handleEdit(editingSupplier._id, data) : handleAdd}
        initialData={editingSupplier}
      />
    </div>
  );
};

export default SuppliersPage;