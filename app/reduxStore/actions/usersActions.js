export const addUser = (user) => {
    return {
        type: 'ADD_USER',
        payload: user
    };
};
export const removeUser = (user_id) => {
    return {
        type: 'REMOVE_USER',
        payload: user_id
    };
};
export const updateUser = (user_id, user) => {
    return {
        type: 'UPDATE_USER',
        payload: { user_id, user }
    };
};
export const getUsers = (playerID) => {
    return {
        type: 'GET_USERS',
        payload: { playerID }
    };
};
export const syncUsers = (users) => {
    return {
        type: 'SYNC_USERS',
        payload: { users }
    };
};
export const setActiveUser = (name, email, id) => {
    return {
        type: 'SET_ACTIVE_USER',
        payload: { name, email, id }
    };
};
export const isTyping = (id, value, playerID) => {
    return {
        type: 'IS_TYPING',
        payload: { id, value, playerID }
    };
};
export const userSignIn = (user, playerID) => {
    return {
        type: 'USER_SIGN_IN',
        payload: { user, playerID }
    };
};
export const userSignOut = (id, playerID) => {
    return {
        type: 'USER_SIGN_OUT',
        payload: { id, playerID }
    };
};
