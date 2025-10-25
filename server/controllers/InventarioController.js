import inventarioService from '../services/InventarioService.js';
import handleError from '../utils/handleError.js';

class InventarioController {
  async getAll(req, res) {
    try {
      const items = await inventarioService.getAll();
      res.json(items);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await inventarioService.getById(id);
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json(item);
    } catch (error) {
      handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const newItem = await inventarioService.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      handleError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedItem = await inventarioService.update(id, req.body);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json(updatedItem);
    } catch (error) {
      handleError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedItem = await inventarioService.delete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json(deletedItem);
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new InventarioController();