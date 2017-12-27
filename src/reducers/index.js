import { combineReducers } from 'redux';
import navigatorReducer from '../containers/navigator/reducer';
import dataReducer from '../modules/data/reducer';

export default combineReducers({
    nav: navigatorReducer,
    dataReducer
});
