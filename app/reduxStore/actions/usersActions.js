export const getUsers = (playerID) => {
    return {
        type: 'GET_USERS',
        payload: playerID
    };
};
export const syncUsers = (users) => {
    return {
        type: 'SYNC_USERS',
        payload: { users }
    };
};
export const postNewUser = (user, playerID) => {
    return {
        type: 'POST_NEW_USER',
        payload: { user, playerID }
    };
};
export const setActiveUser = (name, id) => {
    return {
        type: 'SET_ACTIVE_USER',
        payload: { name, id }
    };
};
export const removeUser = (id, playerID) => {
    return {
        type: 'REMOVE_USER',
        payload: { id, playerID }
    };
};
export const isTyping = (id, value, playerID) => {
    return {
        type: 'IS_TYPING',
        payload: { id, value, playerID }
    };
};
