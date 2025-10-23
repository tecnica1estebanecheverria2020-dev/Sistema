import { useState, useEffect } from 'react';
import Table from '../../shared/components/Table';
import Modal from '../../shared/components/Modal';
import { useInventario } from '../../shared/hooks/useInventario';

const Inventario = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useInventario();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'disponible', label: 'Disponible' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'ubicacion', label: 'Ubicación' },
  ];

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      await deleteItem(item.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      nombre: formData.get('nombre'),
      categoria: formData.get('categoria'),
      cantidad: parseInt(formData.get('cantidad')),
      disponible: parseInt(formData.get('disponible')),
      estado: formData.get('estado'),
      ubicacion: formData.get('ubicacion'),
    };

    if (currentItem) {
      await updateItem(currentItem.id, itemData);
    } else {
      await createItem(itemData);
    }

    setIsModalOpen(false);
    setCurrentItem(null);
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
        }}
        title={currentItem ? 'Editar Item' : 'Agregar Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              defaultValue={currentItem?.nombre}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              name="categoria"
              defaultValue={currentItem?.categoria}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              defaultValue={currentItem?.cantidad}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Disponible</label>
            <input
              type="number"
              name="disponible"
              defaultValue={currentItem?.disponible}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              name="estado"
              defaultValue={currentItem?.estado}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500"
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="No Disponible">No Disponible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              defaultValue={currentItem?.ubicacion}
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