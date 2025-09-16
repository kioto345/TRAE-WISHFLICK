import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import wishlistReducer from './wishlistReducer';
import donationReducer from './donationReducer';
import feedReducer from './feedReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  wishlist: wishlistReducer,
  donation: donationReducer,
  feed: feedReducer,
  profile: profileReducer
});