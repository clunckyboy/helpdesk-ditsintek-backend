import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import UserRepositories from '../repositories/user-repositories.js';

export const createUser = async (req, res, next) => {
  const { name, username, password, role } = req.validated;

  const user = await UserRepositories.createUser({
    name,
    username, 
    password,
    role
  });

  if (!user) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil ditambahkan', { id: user.id_user });
};

export const getAllUsers = async (req, res, next) => {
  const users = await UserRepositories.getAllUsers();
  return response(res, 200, 'Users berhasil diambil', users);
}

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const { user } = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil diambil', user);
};

export const updateUserById = async (req, res, next) => {
  const { id } = req.params;

  const oldUserData = await UserRepositories.getUserById(id);
  if (!oldUserData) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  const { name, username, password, role } = { ...oldUserData, ...req.validated };
  const userId = await UserRepositories.updateUserByid(id, name, username, password, role);

  if (!userId) {
    return next(new InvariantError('User gagal diupdate'));
  }

  return response(res, 200, 'User berhasil diupdate', userId);
};

export const deleteUserById = async (req, res, next) => {
  const { id } = req.params;

  const userId = await UserRepositories.deleteUserById(id);
  if (!userId) {
    return next(new NotFoundError('User gagal dihapus'));
  }

  return response(res, 200, 'User berhasil dihapus', userId);
}