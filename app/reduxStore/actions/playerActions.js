export const addVideo = (videoDetails) => {
    return {
        type: 'ADD_VIDEO',
        payload: videoDetails
    };
};

export const selectNextVideo = () => {
    return {
        type: 'SELECT_NEXT_VIDEO'
    };
};
