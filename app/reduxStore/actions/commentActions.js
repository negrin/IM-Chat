export const addComment = (comment) => {
    return {
        type: 'ADD_COMMENT',
        payload: comment
    };
};
export const removeComment = (comment_id) => {
    return {
        type: 'REMOVE_COMMENT',
        payload: comment_id
    };
};
export const getComments = (playerID, limit) => {
    return {
        type: 'GET_COMMENTS',
        payload: { playerID, limit }
    };
};
export const syncComments = (comments) => {
    return {
        type: 'SYNC_COMMENTS',
        payload: { comments }
    };
};
export const postNewComment = (comment, playerID) => {
    return {
        type: 'POST_NEW_COMMENT',
        payload: { comment, playerID }
    };
};
