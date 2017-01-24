export const getUsers = () => {
    return {
        type: 'GET_USERS',
        payload: {}
    };
};
export const syncUsers = (users) => {
    return {
        type: 'SYNC_USERS',
        payload: { users }
    };
};
export const postNewUser = (user) => {
    return {
        type: 'POST_NEW_USER',
        payload: user
    };
};
export const setActiveUser = (name, id) => {
    return {
        type: 'SET_ACTIVE_USER',
        payload: { name, id }
    };
};
export const removeUser = (id) => {
    return {
        type: 'REMOVE_USER',
        payload: id
    };
};
export const isTyping = (id, value) => {
    return {
        type: 'IS_TYPING',
        payload: { id, value }
    };
};
