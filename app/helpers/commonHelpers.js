export const getVideoDuration = (videoDuration) => {
    const timeArray = videoDuration.match(/(\d+)/g);

    if (timeArray) {
        for (let i = 0; i <= timeArray.length - 1; i++) {
            if (timeArray[i].length <= 1) {
                timeArray[i] = `0${timeArray[i]}`;
            }
        }
    }
    return timeArray ? timeArray.join(':') : '';
};
