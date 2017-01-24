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
        case 'ADD_NEW_COMMENT':
            return state.push(Immutable.fromJS(action.payload));
        case 'SYNC_COMMENTS':
            return Immutable.fromJS(buildList(action.payload.comments));
        default:
            break;
    }

    return state;
}
