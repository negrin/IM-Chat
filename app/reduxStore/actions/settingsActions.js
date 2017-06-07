export const getSettings = (playerID) => {
    return {
        type: 'GET_SETTINGS',
        payload: {
            playerID
        }
    };
};
export const updateSettings = (playerID, key, value) => {
    return {
        type: 'UPDATE_SETTINGS',
        payload: {
            playerID,
            key,
            value
        }
    };
};
export const syncSettings = (settings) => {
    return {
        type: 'SYNC_SETTINGS',
        payload: { settings }
    };
};
