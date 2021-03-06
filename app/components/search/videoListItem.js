import React from 'react';

const { shape, string, func } = React.PropTypes;

const VideoListItem = ({ video, onSend }) => {

    function handleClick() {
        onSend(video.id);
    }

    return (
        <li className="video-item-container" onClick={ handleClick }>
            <div className="video-item-body">
                <div className="video-item">
                    <img className="img" src={ video.thumbnailUrl }/>
                    <div className="info">
                        <div>{ video.title }</div>
                        <div className="video-description">{ video.description }</div>
                        <div>{ video.channelTitle }</div>
                    </div>
                </div>
            </div>
        </li>
    );
};

VideoListItem.propTypes = {
    onSend: func,
    video: shape({
        title: string.isRequired,
        thumbnailUrl: string.isRequired,
        id: string
    })
};

export default VideoListItem;
