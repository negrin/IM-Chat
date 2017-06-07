import React from 'react';

import VideoListItem from './videoListItem';

const { arrayOf, shape, string } = React.PropTypes;

const VideoList = ({ videos }) => {
    const videoItems = videos.map((video) => {
        return <VideoListItem key={ video.id } video={ video }/>;
    });

    return <div className="video-list-container"><ul className="video-list">{ videoItems }</ul></div>;
};

VideoList.propTypes = {
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
