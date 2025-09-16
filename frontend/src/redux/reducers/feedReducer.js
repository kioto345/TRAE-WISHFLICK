import {
  GET_POPULAR_WISHLISTS,
  GET_NEW_WISHLISTS,
  GET_CATEGORY_WISHLISTS,
  SEARCH_WISHLISTS,
  FEED_ERROR,
  CLEAR_FEED
} from '../actions/types';

const initialState = {
  popularWishlists: [],
  newWishlists: [],
  categoryWishlists: [],
  searchResults: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POPULAR_WISHLISTS:
      return {
        ...state,
        popularWishlists: payload,
        loading: false
      };
    case GET_NEW_WISHLISTS:
      return {
        ...state,
        newWishlists: payload,
        loading: false
      };
    case GET_CATEGORY_WISHLISTS:
      return {
        ...state,
        categoryWishlists: payload,
        loading: false
      };
    case SEARCH_WISHLISTS:
      return {
        ...state,
        searchResults: payload,
        loading: false
      };
    case FEED_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_FEED:
      return {
        ...state,
        popularWishlists: [],
        newWishlists: [],
        categoryWishlists: [],
        searchResults: [],
        loading: false
      };
    default:
      return state;
  }
}