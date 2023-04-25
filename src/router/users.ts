import express from 'express';

import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.put('/users/:id', isAuthenticated, isOwner, deleteUser);
  router.put('/users/update/:id', isAuthenticated, isOwner, updateUser);
};
