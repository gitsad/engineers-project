import REDUX_CONST from './constants';

/*
const mockData = () => {
    const array = [];
    for (let i = 0; i <= 1000; i++) {
        array.push({current: Math.random(), time: i/10});
    }
    return array;
};
*/

const initialState = {
    data: []
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case REDUX_CONST.ADD_DATA:
            return {
                ...state,
                data: state.data.concat({
                    current: action.payload,
                    time: action.time
                })
            };
        case REDUX_CONST.CLEAR_STATE:
            return initialState;
        default:
            return state;
    }
}