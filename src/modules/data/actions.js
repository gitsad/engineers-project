import REDUX_CONST from './constants';

export function addDataFromArduino(data, _time) {
    return {
        type: REDUX_CONST.ADD_DATA,
        payload: data,
        time: _time
    };
}

export function clearData() {
    return {
        type: REDUX_CONST.CLEAR_STATE
    };
}