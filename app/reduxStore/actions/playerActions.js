export const addVideo = (videoDetails) => {
    return {
        type: 'ADD_VIDEO',
        payload: videoDetails
    };
};

export const updateVideoInfo = (videoName, videoDuration, videoUId) => {
    return {
        type: 'UPDATE_VIDEO_INFO',
        payload: { videoName, videoDuration, videoUId }
    };
};

export const selectNextVideo = () => {
    return {
        type: 'SELECT_NEXT_VIDEO'
    };
};
