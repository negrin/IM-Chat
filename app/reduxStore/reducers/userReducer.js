import Immutable from 'immutable';

const comments = Immutable.fromJS([]);

const buildList = (data) => {
    const list = data.slice();

    return list;
};

export default function (state = comments, action = {}) {

    switch (action.type) {
        case 'SYNC_USERS':
            return Immutable.fromJS(buildList(action.payload.users));
        default:
            break;
    }

    return state;
}
