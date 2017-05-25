import Immutable from 'immutable';
import { getCommentCommand } from '../../helpers/commentHelpers';

const initialComments = Immutable.fromJS([]);

const buildComment = (data) => {
    const command = getCommentCommand(data);

    return Object.assign({}, data, { command });
};

const buildList = (data) => {
    return data.map((v) => buildComment);
};

export default function (state = initialComments, action = {}) {

    switch (action.type) {
        case 'ADD_COMMENT':
            const comment = action.payload;

            return state.push(Immutable.fromJS(buildComment(comment)));
        case 'REMOVE_COMMENT':
            const comment_id = action.payload;

            return state.delete(state.findIndex((v) => v.id === comment_id));
        case 'SYNC_COMMENTS':
            const { comments } = action.payload;

            return Immutable.fromJS(buildList(comments));
        default:
            break;
    }

    return state;
}
