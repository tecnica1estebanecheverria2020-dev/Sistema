import { useState, useEffect } from 'react';
import Table from '../../shared/components/Table/Table';
import Modal from '../../shared/components/Modal/Modal';
import { useInventario } from '../../shared/hooks/useInventario';

const Inventario = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    category: '',
    amount: 0,
    available: 0,
    state: 'activo',
    location: '',
  });
  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useInventario();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'available', label: 'Disponible' },
    { 
      key: 'state', 
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'location', label: 'Ubicación' },
  ];

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      code: item.code || '',
      category: item.category || '',
      amount: Number(item.amount ?? 0),
      available: Number(item.available ?? 0),
      state: item.state || 'activo',
      location: item.location || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      await deleteItem(item.id_inventory);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      category: formData.category,
      amount: Number(formData.amount),
      available: Number(formData.available),
      state: formData.state,
      location: formData.location,
    };

    if (currentItem?.id_inventory) {
      await updateItem(currentItem.id_inventory, payload);
    } else {
      await createItem(payload);
    }

    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData({ code: '', category: '', amount: 0, available: 0, state: 'activo', location: '' });
  };

  const renderActions = (item) => (
    <>
      <button
        onClick={() => handleEdit(item)}
        className="text-blue-600 hover:text-blue-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => handleDelete(item)}
        className="text-red-600 hover:text-red-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </>
  );

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <button
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
          className="bg-maroon-700 text-white px-4 py-2 rounded hover:bg-maroon-800"
        >
          Agregar Item
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, categoría o ubicación..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <Table
        columns={columns}
        data={items}
        actions={renderActions}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
          setFormData({ code: '', category: '', amount: 0, available: 0, state: 'activo', location: '' });
        }}
        title={currentItem ? 'Editar Item' : 'Agregar Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Disponible</label>
            <input
              type="number"
              name="available"
              value={formData.available}
              onChange={(e) => setFormData((prev) => ({ ...prev, available: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              name="state"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setCurrentItem(null);
                setFormData({ code: '', category: '', amount: 0, available: 0, state: 'activo', location: '' });
              }}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-maroon-700 text-white rounded-md hover:bg-maroon-800"
            >
              {currentItem ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventario;