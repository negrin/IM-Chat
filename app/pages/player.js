import { connect } from 'react-redux';
import YouTube from 'react-youtube';
import Gravatar from 'react-gravatar';
import { getComments } from '../reduxStore/actions/commentActions';
import { getUsers } from '../reduxStore/actions/usersActions';
import FirebaseAPI from '../firebase/firebase';

class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            playerHeight: ''
        };
        this._resizeScreen = this._resizeScreen.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this._resizeScreen());
        window.addEventListener('resize', this._resizeScreen.bind(this));
        this.props.getUsers();
        this.props.getComments();
        this.subscribeFB();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeScreen.bind(this));
    }

    subscribeFB() {
        FirebaseAPI.onChange('child_added', 'comments', (e) => {
            this.props.getComments();
            this._handleNewSong();
        });
    }
    _onReady(event) {
        event.target.playVideo();
    }

    _handleNewSong() {
        if (this.youtubeVideo) {
            setTimeout(() => this.youtubeVideo.internalPlayer.playVideo());
        }
    }

    _cutString() {
        const string = this.props.comments[this.props.comments.length - 1].text;

        if (string === 'stop' || string === 'pause') {
            setTimeout(() => this.youtubeVideo.internalPlayer.pauseVideo());
        } else if (string === 'play') {
            setTimeout(() => this.youtubeVideo.internalPlayer.playVideo());
        } else {
            const cutString = string.substr(string.length - 11);

            return cutString;
        }
    }

    _resizeScreen() {
        if (this.youtubePlaceHolder && this.youtubePlaceHolder.clientWidth > 0) {
            const heightNum = `${ Math.round(this.youtubePlaceHolder.clientWidth / 1.777) }px`;

            this.setState({ playerHeight: heightNum });
        }
    }

    _renderName() {
        const userName = this.props.comments[this.props.comments.length - 1].name;

        return (
            <div>
                <Gravatar
                    className="user-icon"
                    email={ userName } />
                <span>{ userName }:</span>
            </div>
        );
    }

    render() {
        return (
            <div className="player-page" >
                <div className="player-name">
                    { this.props.comments.length >= 1
                        ? this._renderName()
                        : null }
                </div>
                <div className="youtube-holder"
                    style={ { height: this.state.playerHeight } }
                     ref={ (div) => this.youtubePlaceHolder = div }>
                    { this.props.comments.length >= 1
                        ? <YouTube
                        ref={ (video) => this.youtubeVideo = video }
                        videoId={ this._cutString() }
                        onReady={ this._onReady }
                        className="youtube-player"/>
                        : null
                    }
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.commentReducer.toJS(),
        users: state.userReducer.toJS()
    };
};

Main.propTypes = {
    comments: React.PropTypes.array,
    users: React.PropTypes.array,
    getComments: React.PropTypes.func,
    getUsers: React.PropTypes.func
};

export default connect(mapStateToProps, { getComments, getUsers })(Main);
