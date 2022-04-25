import { combineReducers } from 'redux';
import themeReducer from './theme/themeReducer';
import accountReducer from './account/accountReducer';
import commonReducer from './common/commonReducer';
import openviduReducer from './openvidu/openviduReducer';

const rootReducer = combineReducers({
  themeReducer,
  accountReducer,
  commonReducer,
  openviduReducer,
});

export default rootReducer;
