import Gravatar from 'react-gravatar';
import { getVideoDuration } from '../helpers/commonHelpers';

class Comment extends React.Component {

    _handleBRintext() {
        const text = this.props.comment.text;
        const rows = text.split(/\r?\n/g);

        return rows.map((row, i) => {
            if (i === rows.length - 1) {
                return row;
            }
            return [
                row,
                <br/>
            ];
        });
    }

    render() {
        return (
            <div className="comment">
                <div className="comment-info">
                    <Gravatar
                        className="comment-user-icon"
                        email={ this.props.comment.email } />
                    <div className="comment-date">
                        { this.props.comment.time }
                    </div>

                </div>
                <div className="arrow-left"/>
                <div className="comment-body">
                    <div className="comment-username">
                        { this.props.comment.name }
                    </div>
                    <div className="comment-text">
                        { this._handleBRintext() }
                        { this.props.comment.videoInfo && this.props.comment.videoInfo.videoId &&
                        <div className="comment-video-item">
                            <img className="img"
                                 src={ `https://i.ytimg.com/vi/${ this.props.comment.videoInfo.videoId }/hqdefault.jpg` }/>
                            <div className="info">
                                <div>{ this.props.comment.videoInfo.title }</div>
                                <div>{ getVideoDuration(this.props.comment.videoInfo.duration) }</div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    comment: React.PropTypes.object
};

export default Comment;
