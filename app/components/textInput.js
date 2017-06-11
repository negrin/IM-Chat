import { connect } from 'react-redux';
import moment from 'moment';
import { postNewComment } from '../reduxStore/actions/commentActions';
import { isTyping } from '../reduxStore/actions/usersActions';
import { CommandType, parseCommentCommand, getCommentCommand, getCommentCommandParam } from '../helpers/commentHelpers';
import { getUrlParamValue } from '../helpers/urlHelpers';
import VideoList from '../components/search/videoList';
import debounce from 'debounce';
import { search, getVideoInfo } from '../helpers/youtubeHelpers';
import { updateSettings } from '../reduxStore/actions/settingsActions';


const createVideo = (item) => {
    return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.default.url
    };
};

class TextInput extends React.Component {

    constructor() {
        super();
        this.state = {
            isTextBoxEmpty: true,
            videos: null
        };

        this.handleSearch = debounce(this.handleSearch.bind(this), 300);
        this.keydownListener = this.keydownListener.bind(this);
        this._handleSendNewComment = this._handleSendNewComment.bind(this);
        this.sendVideoAsComment = this.sendVideoAsComment.bind(this);
        this.hideVideoList = this.hideVideoList.bind(this);
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
            const commandParam = getCommentCommandParam(this.textInput.value);

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

            switch (commentCommandType) {
                case CommandType.VOLUME:
                    this.props.updateSettings(this.props.playerID, 'volume', commandParam);
                    break;
                case CommandType.ADD:
                    const videoId = getUrlParamValue(commandParam, 'v');

                    newComment.videoInfo = getVideoInfo(videoId);
                    break;
                default:
                    break;
            }

            this._handleIsTyping(false);
            this.props.postNewComment(newComment, this.props.playerID);
            this.textInput.value = '';
            this.setState({ isTextBoxEmpty: true });
        }
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
        } else {
            this.setState({ isTextBoxEmpty: true });
        }
        if (this.textInput.value.trim() === '' || this.textInput.value.startsWith('/')) {
            this.setState({ videos: [] });
        } else {
            this.handleSearch(this.textInput.value);
        }
    }

    handleSearch(q) {
        search('AIzaSyDOSKJMms3-EdO9mFv2t4-nkKcXYggXK3s', q)
            .then((data) => {
                if (this.textInput.value.trim() !== '' && !this.textInput.value.startsWith('/')) {
                    const videos = data.items.map((item) => createVideo(item));
                    this.setState({ videos });
                }
            })
            .catch((error) => console.error(error));
    }

    sendVideoAsComment(videoId) {
        this.setState({ videos: [] });
        this.textInput.value = '/add https://www.youtube.com/watch?v=' + videoId;
        this._handleSendNewComment();
    }

    hideVideoList() {
        this.setState({ videos: [] });
    }

    render() {

        const { videos } = this.state;

        let videosContainer = null;

        if (videos) {
            if (videos.length) {
                videosContainer = (
                    <div>
                        <VideoList videos={ videos } onSend={ this.sendVideoAsComment } hideList={ this.hideVideoList }/>
                    </div>
                );
            } else {
                videosContainer = null;
            }
        }

        return (
            <div className="text-input">
                { videosContainer }
                <textarea
                    className="text-box"
                    onChange={ () => this._handleChange() }
                    placeholder="Type your message..."
                    ref={ (instance) => { this.textInput = instance; } }/>
                <button className="btn"
                        style={ this.state.isTextBoxEmpty ? { background: '#a3a3a3', cursor: 'default' } : null }
                        onClick={ this._handleSendNewComment }>SEND</button>
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
    updateSettings: React.PropTypes.func
};

export default connect(mapStateToProps, { postNewComment, isTyping, updateSettings })(TextInput);
