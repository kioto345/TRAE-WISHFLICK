import axios from 'axios';
import {
  GET_POPULAR_WISHLISTS,
  GET_NEW_WISHLISTS,
  GET_CATEGORY_WISHLISTS,
  SEARCH_WISHLISTS,
  FEED_ERROR,
  CLEAR_FEED
} from './types';

// Получение популярных вишлистов
export const getPopularWishlists = (limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`/api/feed/popular?limit=${limit}`);

    dispatch({
      type: GET_POPULAR_WISHLISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FEED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение новых вишлистов
export const getNewWishlists = (limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`/api/feed/new?limit=${limit}`);

    dispatch({
      type: GET_NEW_WISHLISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FEED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получение вишлистов по категории
export const getCategoryWishlists = (category, limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`/api/feed/category/${category}?limit=${limit}`);

    dispatch({
      type: GET_CATEGORY_WISHLISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FEED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Поиск вишлистов
export const searchWishlists = (query) => async dispatch => {
  try {
    const res = await axios.get(`/api/feed/search?q=${query}`);

    dispatch({
      type: SEARCH_WISHLISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FEED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Очистка ленты
export const clearFeed = () => dispatch => {
  dispatch({ type: CLEAR_FEED });
};