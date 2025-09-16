import {
  GET_PROFILE,
  GET_USER_PROFILE,
  UPDATE_PROFILE,
  GET_RECEIVED_DONATIONS,
  GET_SENT_DONATIONS,
  GET_BALANCE,
  PROFILE_ERROR,
  CLEAR_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  userProfile: null,
  receivedDonations: [],
  sentDonations: [],
  balance: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_USER_PROFILE:
      return {
        ...state,
        userProfile: payload,
        loading: false
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_RECEIVED_DONATIONS:
      return {
        ...state,
        receivedDonations: payload,
        loading: false
      };
    case GET_SENT_DONATIONS:
      return {
        ...state,
        sentDonations: payload,
        loading: false
      };
    case GET_BALANCE:
      return {
        ...state,
        balance: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        userProfile: null,
        receivedDonations: [],
        sentDonations: [],
        balance: null,
        loading: false
      };
    default:
      return state;
  }
}