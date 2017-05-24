export const getCommentCommand = (comment) => {
    return comment.text.substr(1).split(' ')[0];
};

export const getCommentCommandParam = (comment) => {
    return comment.text.substr(1).split(' ')[1];
};
