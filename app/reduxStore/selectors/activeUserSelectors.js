export const selectActiveUserId = (state) => {
    return state.activeUserIdReducer;
};

export const selectActiveUser = (state) => {
    const activeUserId = selectActiveUserId(state);
    const activeUser = state.userReducer.find((user) => user.get('id') === activeUserId);

    return activeUser && activeUser.toJS();
};
