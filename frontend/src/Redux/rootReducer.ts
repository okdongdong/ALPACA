import { combineReducers } from 'redux';
import themeReducer from './theme/themeReducer';
import accountReducer from './account/accountReducer';
import commonReducer from './common/commonReducer';

const rootReducer = combineReducers({
  themeReducer,
  accountReducer,
  commonReducer,
});

export default rootReducer;
