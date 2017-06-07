import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    volume: 50
});

export default function (state = initialState, action = {}) {

    switch (action.type) {
        case 'SYNC_SETTINGS':
            return Immutable.fromJS(action.payload.settings);
        default:
            break;
    }

    return state;
}
