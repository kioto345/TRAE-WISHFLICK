import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_WISHLISTS,
  GET_WISHLIST,
  CREATE_WISHLIST,
  UPDATE_WISHLIST,
  DELETE_WISHLIST,
  ADD_WISHLIST_ITEM,
  UPDATE_WISHLIST_ITEM,
  DELETE_WISHLIST_ITEM,
  WISHLIST_ERROR,
  CLEAR_WISHLIST
} from './types';

// Получение всех вишлистов пользователя
export const getWishlists = () => async dispatch => {
  try {
    const res = await axios.get('/api/wishlists/me');

    dispatch({
      type: GET_WISHLISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение вишлиста по ID
export const getWishlist = id => async dispatch => {
  try {
    const res = await axios.get(`/api/wishlists/${id}`);

    dispatch({
      type: GET_WISHLIST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение вишлиста по ID (алиас для getWishlist)
export const getWishlistById = (id) => async dispatch => {
  return dispatch(getWishlist(id));
};

// Создание вишлиста
export const createWishlist = (formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/wishlists', formData, config);

    dispatch({
      type: CREATE_WISHLIST,
      payload: res.data
    });

    dispatch(setAlert('Вишлист создан', 'success'));

    navigate(`/wishlist/${res.data._id}`);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновление вишлиста
export const updateWishlist = (id, formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/wishlists/${id}`, formData, config);

    dispatch({
      type: UPDATE_WISHLIST,
      payload: res.data
    });

    dispatch(setAlert('Вишлист обновлен', 'success'));

    navigate(`/wishlist/${res.data._id}`);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удаление вишлиста
export const deleteWishlist = (id, navigate) => async dispatch => {
  if (window.confirm('Вы уверены? Это действие нельзя отменить!')) {
    try {
      await axios.delete(`/api/wishlists/${id}`);

      dispatch({
        type: DELETE_WISHLIST,
        payload: id
      });

      dispatch(setAlert('Вишлист удален', 'success'));

      navigate('/dashboard');
    } catch (err) {
      dispatch({
        type: WISHLIST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Добавление элемента в вишлист
export const addWishlistItem = (wishlistId, formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post(`/api/wishlists/${wishlistId}/items`, formData, config);

    dispatch({
      type: ADD_WISHLIST_ITEM,
      payload: res.data
    });

    dispatch(setAlert('Желание добавлено', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновление элемента в вишлисте
export const updateWishlistItem = (wishlistId, itemId, formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/wishlists/${wishlistId}/items/${itemId}`, formData, config);

    dispatch({
      type: UPDATE_WISHLIST_ITEM,
      payload: res.data
    });

    dispatch(setAlert('Желание обновлено', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: WISHLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удаление элемента из вишлиста
export const deleteWishlistItem = (wishlistId, itemId) => async dispatch => {
  if (window.confirm('Вы уверены? Это действие нельзя отменить!')) {
    try {
      const res = await axios.delete(`/api/wishlists/${wishlistId}/items/${itemId}`);

      dispatch({
        type: DELETE_WISHLIST_ITEM,
        payload: res.data
      });

      dispatch(setAlert('Желание удалено', 'success'));
    } catch (err) {
      dispatch({
        type: WISHLIST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Очистка текущего вишлиста
export const clearWishlist = () => dispatch => {
  dispatch({ type: CLEAR_WISHLIST });
};