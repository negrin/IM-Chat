export const addNewComment = (comment) => {
    return {
        type: 'ADD_NEW_COMMENT',
        payload: comment
    };
};
export const getComments = (playerID) => {
    return {
        type: 'GET_COMMENTS',
        payload: playerID
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
