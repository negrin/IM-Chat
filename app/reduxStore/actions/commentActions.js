export const addNewComment = (comment) => {
    return {
        type: 'ADD_NEW_COMMENT',
        payload: comment
    };
};
export const getComments = () => {
    return {
        type: 'GET_COMMENTS',
        payload: {}
    };
};
export const syncComments = (comments) => {
    return {
        type: 'SYNC_COMMENTS',
        payload: { comments }
    };
};
export const postNewComment = (comment) => {
    return {
        type: 'POST_NEW_COMMENT',
        payload: comment
    };
};
