import Immutable from 'immutable';
import { getCommentCommand } from '../../helpers/commentHelpers';

const comments = Immutable.fromJS([]);

const buildList = (ob) => {
    const list = [];
    let prevComment;

    for (const key in ob) {
        if (ob.hasOwnProperty(key)) {
            const command = getCommentCommand(ob[key]);
            const comment = Object.assign({}, ob[key], { id: key, command });

            if (!prevComment || (prevComment.date !== comment.date)) {
                list.push({ command: 'newDate', date: comment.date });
            }

            list.push(comment);
            prevComment = comment;
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
