import Immutable from 'immutable';
import { getCommentCommand } from '../../helpers/commentHelpers';

const comments = Immutable.fromJS([]);

const buildList = (data) => {
    const list = [];

    data.forEach((v) => {
        const command = getCommentCommand(v);
        const comment = Object.assign({}, v, { command });

        list.push(comment);
    });

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
