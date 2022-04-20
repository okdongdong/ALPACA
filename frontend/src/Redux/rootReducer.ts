import { combineReducers } from 'redux';
import themeReducer from './theme/themeReducer';

const rootReducer = combineReducers({
  themeReducer,
});

export default rootReducer;
