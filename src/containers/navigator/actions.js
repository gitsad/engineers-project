/**
 * Created by gitsad on 27.06.17.
 */
import REDUX_CONST from './constants';

export function setRoute(route, navigator) {
    return {
        type: REDUX_CONST.SET_ROUTE,
        route,
        navigator
    }
}