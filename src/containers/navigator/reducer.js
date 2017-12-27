/**
 * Created by gitsad on 27.06.17.
 */
import REDUX_CONST from './constants';

export default function navigatorReducer(state = {}, action) {
    switch (action.type) {
        case REDUX_CONST.SET_ROUTE:
            return({
                ...state,
                route: action.route,
                screenNavigator: action.navigator
            });
        default:
            return state;
    }
}