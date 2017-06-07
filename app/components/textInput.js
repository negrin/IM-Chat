import { connect } from 'react-redux';
import moment from 'moment';
import { postNewComment } from '../reduxStore/actions/commentActions';
import { isTyping } from '../reduxStore/actions/usersActions';
import { CommandType, parseCommentCommand, getCommentCommand, getCommentCommandParam } from '../helpers/commentHelpers';
import { getUrlParamValue } from '../helpers/urlHelpers';

class TextInput extends React.Component {

    constructor() {
        super();
        this.state = {
            isTextBoxEmpty: true
        };
        this.keydownListener = this.keydownListener.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keydownListener);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keydownListener);
    }

    keydownListener(e) {
        if (event.altKey && e.keyCode === 13 || event.shiftKey && e.keyCode === 13) {
            this.textInput.value = this.textInput.value += '\n';
            e.preventDefault();
        } else if (e.keyCode === 13) {
            this._handleSendNewComment();
            e.preventDefault();
        }
    }

    _getCommentDescription(commandType) {
        let comment = '';
        switch (commandType) {
            case CommandType.ADD:
                comment = ' added:';
                break;
            default:
                break;
        }
        return comment;
    }

    _handleSendNewComment() {
        if (/\S/.test(this.textInput.value)) {
            const command = getCommentCommand(this.textInput.value);
            const commentCommandType = parseCommentCommand(command);
            const now = Date.now();
            const momentNow = moment(now);
            const newComment = {
                name: this.props.activeUser.name,
                email: this.props.activeUser.email,
                date: momentNow.format('YYYY/MM/DD'),
                time: momentNow.format('HH:mm:ss'),
                text: this.textInput.value,
                showText: commentCommandType !== CommandType.ADD,
                commandType: commentCommandType,
                description: this._getCommentDescription(commentCommandType),
                created: now
            };

            if (commentCommandType === CommandType.ADD) {
                const commandParam = getCommentCommandParam(this.textInput.value);
                const videoId = getUrlParamValue(commandParam, 'v');

                newComment.videoInfo = this._getVideoInfo(videoId);
            }
            this._handleIsTyping(false);
            this.props.postNewComment(newComment, this.props.playerID);
            this.textInput.value = '';
            this.setState({ isTextBoxEmpty: true });
        }
    }

    _getVideoInfo(videoId) {
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
    }

    _handleIsTyping(value) {
        this.props.users.find((user) => {
            if (user.userID === this.props.activeUser.id) {
                this.props.isTyping(user.id, value, this.props.playerID);
                setTimeout(() => { this.props.isTyping(user.id, false, this.props.playerID); }, 3000);
                return true;
            }
        });
    }

    _handleChange() {
        this._handleIsTyping(true);
        if (/\S/.test(this.textInput.value)) {
            this.setState({ isTextBoxEmpty: false });
            this.props.onSearch(this.textInput.value);
        } else {
            this.setState({ isTextBoxEmpty: true });
        }
    }


    render() {
        return (
            <div className="text-input">

                <textarea
                    className="text-box"
                    onChange={ () => this._handleChange() }
                    placeholder="Type your message..."
                    ref={ (instance) => { this.textInput = instance; } }/>
                <button className="btn"
                        style={ this.state.isTextBoxEmpty ? { background: '#a3a3a3', cursor: 'default' } : null }
                        onClick={ this._handleSendNewComment.bind(this) }>SEND</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.commentReducer.toJS(),
        activeUser: state.activeUserReducer.toJS(),
        users: state.userReducer.toJS()
    };
};

TextInput.propTypes = {
    isTyping: React.PropTypes.func,
    playerID: React.PropTypes.string,
    postNewComment: React.PropTypes.func,
    activeUser: React.PropTypes.object,
    comments: React.PropTypes.array,
    users: React.PropTypes.array,
    onSearch: React.PropTypes.func
};

export default connect(mapStateToProps, { postNewComment, isTyping })(TextInput);
