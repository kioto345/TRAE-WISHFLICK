import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_DONATIONS,
  GET_DONATION,
  CREATE_DONATION,
  UPDATE_DONATION_STATUS,
  DONATION_ERROR,
  CLEAR_DONATION
} from './types';

// Получение всех полученных донатов
export const getReceivedDonations = () => async dispatch => {
  try {
    const res = await axios.get('/api/donations/received');

    dispatch({
      type: GET_DONATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DONATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение всех отправленных донатов
export const getSentDonations = () => async dispatch => {
  try {
    const res = await axios.get('/api/donations/sent');

    dispatch({
      type: GET_DONATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DONATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение доната по ID
export const getDonation = id => async dispatch => {
  try {
    const res = await axios.get(`/api/donations/${id}`);

    dispatch({
      type: GET_DONATION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DONATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Создание доната
export const createDonation = (formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/donations', formData, config);

    dispatch({
      type: CREATE_DONATION,
      payload: res.data
    });

    dispatch(setAlert('Донат успешно отправлен', 'success'));

    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: DONATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновление статуса доната (только для админов)
export const updateDonationStatus = (id, status) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/donations/${id}/status`, { status }, config);

    dispatch({
      type: UPDATE_DONATION_STATUS,
      payload: res.data
    });

    dispatch(setAlert('Статус доната обновлен', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: DONATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Очистка текущего доната
export const clearDonation = () => dispatch => {
  dispatch({ type: CLEAR_DONATION });
};