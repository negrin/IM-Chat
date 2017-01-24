import Immutable from 'immutable';

const comments = Immutable.fromJS([]);

const buildList = (ob) => {
    const list = [];

    for (const key in ob) {
        if (ob[key]) {
            list.push(Object.assign({}, ob[key], { id: key }));
        }
    }

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
