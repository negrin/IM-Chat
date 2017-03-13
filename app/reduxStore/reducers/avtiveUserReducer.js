import Immutable from 'immutable';

const comments = Immutable.fromJS({});


export default function (state = comments, action = {}) {

    switch (action.type) {
        case 'SET_ACTIVE_USER':
            return state.set('name', action.payload.name).set('email', action.payload.email).set('id', action.payload.id);
        default:
            break;
    }

    return state;
}
