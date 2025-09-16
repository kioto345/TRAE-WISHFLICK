import {
  GET_DONATIONS,
  GET_DONATION,
  CREATE_DONATION,
  UPDATE_DONATION_STATUS,
  DONATION_ERROR,
  CLEAR_DONATION
} from '../actions/types';

const initialState = {
  donations: [],
  donation: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DONATIONS:
      return {
        ...state,
        donations: payload,
        loading: false
      };
    case GET_DONATION:
      return {
        ...state,
        donation: payload,
        loading: false
      };
    case CREATE_DONATION:
      return {
        ...state,
        donations: [payload, ...state.donations],
        donation: payload,
        loading: false
      };
    case UPDATE_DONATION_STATUS:
      return {
        ...state,
        donations: state.donations.map(donation =>
          donation._id === payload._id ? payload : donation
        ),
        donation: payload,
        loading: false
      };
    case DONATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_DONATION:
      return {
        ...state,
        donation: null,
        loading: false
      };
    default:
      return state;
  }
}