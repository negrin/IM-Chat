import React from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import VideoListItem from './videoListItem';

const { arrayOf, shape, string, func } = React.PropTypes;

class VideoList extends React.Component {

    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClickOutside() {
        this.props.hideList();
    }

    render() {
        return (
            <div className="video-list-container">
                <div className="title"><img className="youtube-img"
                                            src="http://img3.wikia.nocookie.net/__cb20150508044310/clashofclans/images/2/28/Youtube_Icon_Transparent.png"/><span>Search results:</span>
                </div>
                <ul className="video-list">
                    { this.props.videos.map((video) => {
                        return (
                            <VideoListItem key={ video.id } video={ video } onSend={ this.props.onSend }/>
                        );
                    })
                    }
                </ul>
            </div>
        );
    }
}

VideoList.propTypes = {
    hideList: func,
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

export default enhanceWithClickOutside(VideoList);
