import {
  GET_WISHLISTS,
  GET_WISHLIST,
  WISHLIST_ERROR,
  CREATE_WISHLIST,
  UPDATE_WISHLIST,
  DELETE_WISHLIST,
  ADD_WISHLIST_ITEM,
  UPDATE_WISHLIST_ITEM,
  DELETE_WISHLIST_ITEM,
  CLEAR_WISHLIST
} from '../actions/types';

const initialState = {
  wishlists: [],
  wishlist: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_WISHLISTS:
      return {
        ...state,
        wishlists: payload,
        loading: false
      };
    case GET_WISHLIST:
      return {
        ...state,
        wishlist: payload,
        loading: false
      };
    case CREATE_WISHLIST:
      return {
        ...state,
        wishlists: [payload, ...state.wishlists],
        loading: false
      };
    case UPDATE_WISHLIST:
      return {
        ...state,
        wishlists: state.wishlists.map(wishlist =>
          wishlist._id === payload._id ? payload : wishlist
        ),
        wishlist: payload,
        loading: false
      };
    case DELETE_WISHLIST:
      return {
        ...state,
        wishlists: state.wishlists.filter(wishlist => wishlist._id !== payload),
        loading: false
      };
    case ADD_WISHLIST_ITEM:
    case UPDATE_WISHLIST_ITEM:
    case DELETE_WISHLIST_ITEM:
      return {
        ...state,
        wishlist: payload,
        loading: false
      };
    case WISHLIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_WISHLIST:
      return {
        ...state,
        wishlist: null,
        loading: false
      };
    default:
      return state;
  }
}