import React from 'react';

const { shape, string } = React.PropTypes;

const VideoListItem = ({ video }) => {
    return (
        <li className="video-item-container">
            <div className="video-item-body">
                <div className="video-item">
                    <a href={ `https://www.youtube.com/watch?v=${ video.id } ` } target="_blank"><img className="img"
                       src={ video.thumbnailUrl }/></a>
                    <div className="info">
                        <div><a href={ `https://www.youtube.com/watch?v=${ video.id} ` } target="_blank">{ video.title }</a></div>
                    </div>
                </div>
            </div>
        </li>
    );
};

VideoListItem.propTypes = {
    video: shape({
        title: string.isRequired,
        thumbnailUrl: string.isRequired,
        id: string
    })
};

export default VideoListItem;
