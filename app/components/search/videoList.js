import React from 'react';

import VideoListItem from './videoListItem';

const { arrayOf, shape, string, func } = React.PropTypes;

const VideoList = ({ videos, onSend }) => {
    const videoItems = videos.map((video, index) => {
        return <VideoListItem key={ video.id } video={ video } itemType={ index % 2 === 0 ? 'even' : 'odd' }  onSend={ onSend }/>;
    });

    return <div className="video-list-container"><ul className="video-list">{ videoItems }</ul></div>;
};

VideoList.propTypes = {
    onSend: func,
    videos: arrayOf(
        shape({
            id: string.isRequired,
            title: string.isRequired,
            description: string.isRequired,
            thumbnailUrl: string.isRequired
        })
    )
};

export default VideoList;