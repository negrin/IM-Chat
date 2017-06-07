import { connect } from 'react-redux';
import Comment from '../components/comment';
import DateMarker from '../components/dateMarker';
import User from '../components/user';
import TextInput from '../components/textInput';
import UserControlPanel from '../components/userControlPanel';
import SingIn from '../components/singIn';
import { getComments } from '../reduxStore/actions/commentActions';
import { getUsers } from '../reduxStore/actions/usersActions';
import { getSettings } from '../reduxStore/actions/settingsActions';
import FirebaseAPI from '../firebase/firebase';
import { CommandType } from '../helpers/commentHelpers';
import SearchYoutube from '../components/search/searchYoutube';
import search from '../helpers/youtubeApiSearch';
import VideoList from '../components/search/videoList';
import debounce from 'debounce';

const createVideo = (item) => {
    return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.default.url
    };
};

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = { videos: null };

        this.handleSearch = debounce(this.handleSearch.bind(this), 300);
    }

    componentDidMount() {
        const { playerID } = this.props.params;
        this.props.getUsers(playerID);
        this.props.getComments(playerID);
        this.props.getSettings(playerID);
        this.subscribeFB();
    }

    componentDidUpdate() {
        this._getMassageDivHeight();
    }

    _getMassageDivHeight() {
        this.massageDiv.scrollTop = this.massageDiv.scrollHeight;
    }

    subscribeFB() {
        const { playerID } = this.props.params;

        FirebaseAPI.onChange('child_added', `players/${ playerID }/comments`, () => {
            this.props.getComments(playerID);
        });
        FirebaseAPI.onChange('child_removed', `players/${ playerID }/comments`, () => {
            this.props.getComments(playerID);
        });
        FirebaseAPI.onChange('child_added', `players/${ playerID }/users`, () => {
            this.props.getUsers(playerID);
        });
        FirebaseAPI.onChange('child_removed', `players/${ playerID }/users`, () => {
            this.props.getUsers(playerID);
        });
        FirebaseAPI.onChange('child_changed', `players/${ playerID }/users`, () => {
            this.props.getUsers(playerID);
        });
        FirebaseAPI.onChange('child_changed', `players/${ playerID }/settings`, (e) => {
            this.props.getSettings(playerID);
        });
    }

    renderComment(comment) {
        if (comment.command === 'newDate') {
            return <DateMarker key={ comment.date } date={ comment.date }/>;
        }
        return <Comment key={ comment.id } comment={ comment }/>;
    }

    handleSearch(q) {
        search('AIzaSyDOSKJMms3-EdO9mFv2t4-nkKcXYggXK3s', q)
            .then((data) => {
                console.log(data);
                const videos = data.items.map((item) => createVideo(item));
                this.setState({ videos });
            })
            .catch((error) => console.error(error));
    }

    sendVideoAsComment(video) {
    }

    render() {

        const { videos } = this.state;

        let videosContainer = null;

        if (videos) {
            if (videos.length) {
                videosContainer = (
                    <div>
                        <VideoList videos={ videos } onSend={ this.sendVideoAsComment }/>
                    </div>
                );
            } else {
                videosContainer = <div>No videos found</div>;
            }
        }

        return (
            <div>
                <SingIn playerID={ this.props.params.playerID }/>
                <div className="chat">
                    <div className="chat-left-panel">
                        <div>
                            { this.props.users.map((user) => {
                                return <User key={ user.id } user={ user }/>;
                            }) }
                        </div>
                        <UserControlPanel playerID={ this.props.params.playerID } settings={ this.props.settings }/>
                    </div>
                    <div className="chat-body">
                        <div ref={ (instance) => { this.massageDiv = instance; } } className="chat-messages">
                            { this.props.comments.map((comment) => {
                                if (comment.commandType === CommandType.ADD) {
                                    return this.renderComment(comment);
                                }
                            }
                            ) }
                        </div>
                        <div className="chat-new-message">
                            { videosContainer }
                            <TextInput playerID={ this.props.params.playerID } onSearch={ this.handleSearch }/>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.commentReducer.toJS(),
        users: state.userReducer.toJS(),
        settings: state.settingsReducer ? state.settingsReducer.toJS() : { settings: {} }
    };
};

Main.propTypes = {
    comments: React.PropTypes.array,
    params: React.PropTypes.object,
    users: React.PropTypes.array,
    settings: React.PropTypes.object,
    getComments: React.PropTypes.func,
    getUsers: React.PropTypes.func,
    getSettings: React.PropTypes.func
};

export default connect(mapStateToProps, { getComments, getUsers, getSettings })(Main);
