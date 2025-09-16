import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_PROFILE,
  GET_USER_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  GET_RECEIVED_DONATIONS,
  GET_SENT_DONATIONS,
  GET_BALANCE,
  PROFILE_ERROR,
  CLEAR_PROFILE
} from './types';

// Получение профиля текущего пользователя
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение профиля пользователя по ID
export const getUserProfile = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_USER_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновление профиля пользователя
export const updateProfile = (formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    // Обновляем данные пользователя в состоянии auth
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Профиль обновлен', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение полученных донатов
export const getReceivedDonations = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/donations/received');

    dispatch({
      type: GET_RECEIVED_DONATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение отправленных донатов
export const getSentDonations = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/donations/sent');

    dispatch({
      type: GET_SENT_DONATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение баланса пользователя
export const getBalance = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/balance');

    dispatch({
      type: GET_BALANCE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Очистка профиля
export const clearProfile = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
};