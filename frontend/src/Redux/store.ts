import { applyMiddleware, createStore } from 'redux';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension'; // 리덕스 개발자 도구

const middleware = [];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));

export default store;
