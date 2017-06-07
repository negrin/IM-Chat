import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

import checkStatus from './checkStatus';
import parseJSON from './parseJson';

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export default function (key, q) {
    const params = {
        part: 'snippet',
        maxResults: '25',
        type: 'video',
        key,
        q
    };

    return fetch(`${SEARCH_URL}?${querystring.stringify(params)}`)
        .then(checkStatus)
        .then(parseJSON);
}
