import usersService from '../services/UsersService.js';
import handleError from '../utils/handleError.js';

// Utilidades simples de validación en capa controlador
const isEmail = (email) => /^(?=.{3,100}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
const sanitizeText = (v) => String(v ?? '').trim();
const sanitizeTel = (v) => String(v ?? '').replace(/[^0-9]/g, '').slice(0, 11);

class UsersController {
  async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        throw { status: 400, message: 'ID de usuario inválido' };
      }
      const user = await usersService.getById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const {
        name,
        email,
        password,
        tel,
        active = 1,
        id_role,
        roles,
      } = req.body || {};

      if (!name || !email || !password) {
        throw { status: 400, message: 'Faltan campos obligatorios: name, email, password' };
      }
      if (!isEmail(email)) {
        throw { status: 400, message: 'Email inválido' };
      }

      const payload = {
        name: sanitizeText(name),
        email: String(email).toLowerCase().trim(),
        password: String(password),
        tel: sanitizeTel(tel),
        active: Number(active) ? 1 : 0,
        roles: Array.isArray(roles) ? roles : (id_role ? [id_role] : []),
      };

      const newUser = await usersService.create(payload);
      res.status(201).json(newUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        throw { status: 400, message: 'ID de usuario inválido' };
      }

      const {
        name,
        email,
        password,
        tel,
        active,
        id_role,
        roles,
      } = req.body || {};

      const data = {};
      if (name !== undefined) data.name = sanitizeText(name);
      if (email !== undefined) {
        if (!isEmail(email)) throw { status: 400, message: 'Email inválido' };
        data.email = String(email).toLowerCase().trim();
      }
      if (password !== undefined) {
        data.password = String(password);
      }
      if (tel !== undefined) data.tel = sanitizeTel(tel);
      if (active !== undefined) data.active = Number(active) ? 1 : 0;
      if (roles !== undefined || id_role !== undefined) {
        data.roles = Array.isArray(roles) ? roles : (id_role ? [id_role] : []);
      }

      const updatedUser = await usersService.update(Number(id), data);
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(updatedUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        throw { status: 400, message: 'ID de usuario inválido' };
      }
      const deletedUser = await usersService.delete(Number(id));
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(deletedUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        throw { status: 400, message: 'ID de usuario inválido' };
      }
      const user = await usersService.toggleActive(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new UsersController();

