import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

import { checkStatus, parseJson } from './commonHelpers';

export const search = (key, q) => {
    const params = {
        part: 'snippet',
        maxResults: '25',
        type: 'video',
        key,
        q
    };

    return fetch(`${'https://www.googleapis.com/youtube/v3/search'}?${querystring.stringify(params)}`)
        .then(checkStatus)
        .then(parseJson);
};

export const getVideoInfo = (videoId) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2C+snippet&id=${ videoId }&key=AIzaSyBYHPYcobof9p6rApxR4mIRQkj-2NdR2to`, false);
    xhr.send();

    const youtubeInfo = JSON.parse(xhr.response);

    let videoInfo;

    if (youtubeInfo) {
        videoInfo = {
            title: youtubeInfo.items[0].snippet.title,
            duration: youtubeInfo.items[0].contentDetails.duration,
            videoId
        };
    }
    return videoInfo;
};
