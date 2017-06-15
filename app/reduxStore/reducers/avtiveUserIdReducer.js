import Immutable from 'immutable';

const activeUserId = null;


export default function (state = activeUserId, action = {}) {

    switch (action.type) {
        case 'SET_ACTIVE_USER':
            return Immutable.fromJS(action.payload);
        default:
            break;
    }

    return state;
}
