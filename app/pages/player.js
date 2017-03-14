import { connect } from 'react-redux';
import cx from 'classnames';
import YouTube from 'react-youtube';
import Gravatar from 'react-gravatar';
import { addVideo, selectNextVideo } from '../reduxStore/actions/playerActions';
import FirebaseAPI from '../firebase/firebase';
import { getUrlParamValue } from '../helpers/urlHelpers';

class Player extends React.Component {

    constructor() {
        super();

        this.state = {
            playerHeight: '',
            videoData: {},
            videoDuration: '',
            videoUId: 0,
            isFullScreen: false
        };

        this._resizeScreen = this._resizeScreen.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this._resizeScreen());
        window.addEventListener('resize', this._resizeScreen.bind(this));
        this.subscribeFB();
    }

    componentDidUpdate(prevProps) {
        const { currentVideo = {} } = this.props;
        const { prevVideo = {} } = prevProps;

        if (currentVideo.videoId !== prevVideo.videoId) {
            setTimeout(() => this.youtubeVideo.internalPlayer.playVideo());
            const playlistItem = this[`playlistItem${currentVideo.videoUId}`];

            this.playlistDiv.scrollTop = playlistItem.offsetTop - 10;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeScreen.bind(this));
    }

    subscribeFB() {
        FirebaseAPI.onChange('child_added', `players/${ this.props.params.playerID }/comments`, (e) => {
            // TODO - temp solution for not handling precious (existing) comments
            const now = new Date();
            let minutes = now.getMinutes();

            if (minutes.toString().length === 1) {
                minutes = `0${minutes}`;
            }
            const currentTime = `${now.getHours()}:${minutes}`;

            if (e.text && e.text[0] === '/' && currentTime === e.date) {
                this._parseCommand(e);
            }
        });
    }

    _parseCommand(e) {
        const command = e.text.substr(1).split(' ')[0];
        const commandParam = e.text.substr(1).split(' ')[1];
        const userName = e.name;
        const email = e.email;

        switch (command) {
            case 'volume':
            case 'vol':
                if (!isNaN(commandParam) && commandParam >= 0 && commandParam <= 100) {
                    this.youtubeVideo.internalPlayer.setVolume(commandParam);
                    this.setState({ volume: commandParam });
                }
                break;
            case 'stop':
            case 'pause':
                this.youtubeVideo.internalPlayer.pauseVideo();
                break;
            case 'play':
                this.youtubeVideo.internalPlayer.playVideo();
                break;
            case 'full':
                this.setState({ isFullScreen: !this.state.isFullScreen });
                break;
            case 'add':
                this.setState({ videoUId: this.state.videoUId + 1 });
                const videoUId = this.state.videoUId;
                const videoId = getUrlParamValue(commandParam, 'v');

                this.props.addVideo({ videoId, userName, email, videoUId });

                if (this.youtubeVideo) {
                    this.youtubeVideo.internalPlayer.getPlayerState().then(
                        (status) => {
                            if (status === 0 || status === -1 || status === 2) {
                                this.props.selectNextVideo();
                            }
                        }
                    );
                }
                break;
            case 'next':
                this.props.selectNextVideo();
                break;
            default:
                break;
        }

    }

    _resizeScreen() {
        if (this.youtubePlaceHolder && this.youtubePlaceHolder.clientWidth > 0) {
            const heightNum = `${ Math.round(this.youtubePlaceHolder.clientWidth / 1.777) }px`;

            this.setState({ playerHeight: heightNum });
        }
    }

    _renderName() {
        const { userName, email } = this.props.currentVideo;

        if (!userName) {
            return null;
        }

        return (
            <div className="player-name">
                <Gravatar
                    className="user-icon"
                    email={ email } />
                <span>{ userName }:</span>
            </div>
        );
    }

    _renderVideoDetails() {
        const { videoData, videoDuration } = this.state;

        if (!videoData || !videoData.title) {
            return null;
        }

        return (
            <div className="video-data">
                <p><b>Title: </b>{ videoData.title }</p>
                <p><b>Duration: </b>{ videoDuration }</p>
            </div>
        );
    }

    extractVideoData(e) {
        const internalPlayer = e.target;

        const videoDuration = internalPlayer.getDuration();
        const minutes =  Math.floor(videoDuration / 60);
        const seconds = (videoDuration - minutes * 60).toFixed(0);
        const finalTime = `${minutes}:${seconds}`;

        const videoData = internalPlayer.getVideoData();

        this.setState({ videoData, videoDuration: finalTime });
    }

    _renderPlayer() {
        const { videoId } = this.props.currentVideo;
        const holderClassName = cx({
            'youtube-holder': true,
            'youtube-holder__full-screen': this.state.isFullScreen
        });

        return (
            <div className={ holderClassName }
                 style={ { height: this.state.playerHeight } }
                 ref={ (div) => this.youtubePlaceHolder = div }>
                <YouTube
                    ref={ (video) => this.youtubeVideo = video }
                    videoId={ videoId }
                    onReady={ this._onReady.bind(this) }
                    onEnd={ this.props.selectNextVideo }
                    onPlay={ this.extractVideoData.bind(this) }
                    className="youtube-player"/>
            </div>
        );
    }

    _renderPlaylist() {
        const { currentVideo, playlist } = this.props;

        return (
            <div className="playlist-panel" ref={ (playlistDiv) => this.playlistDiv = playlistDiv }>
                {
                    playlist.map((video) => {
                        const videoClassName = cx({
                            playlistItem: true,
                            selected: video.videoUId === currentVideo.videoUId
                        });

                        return (
                            <div className={ videoClassName } ref={ (div) => this[`playlistItem${video.videoUId}`] = div }>
                                <img className="playlist-item-img" src={ `https://i.ytimg.com/vi/${ video.videoId }/hqdefault.jpg` } />
                                <div className="playlist-item-info">
                                    <div>{ video.videoId }</div>
                                    {/* <div>4:15</div> */}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    _renderVolume() {
        if (!this.youtubeVideo || !this.state.volume) {
            return null;
        }

        return (
            <div className="player-volume"><b>Vol </b>{ this.state.volume }</div>
        );
    }

    _onReady(event) {
        if (this.state.videoId) {
            event.target.playVideo();
        }

        this.youtubeVideo.internalPlayer.getVolume().then((volume) => { this.setState({ volume }); });
    }

    render() {
        return (
            <div className="player-page" >
                { this._renderPlaylist() }
                <div className="player-container">
                    { this._renderVolume() }
                    { this._renderName() }
                    { this._renderPlayer() }
                    { this._renderVideoDetails() }
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    const { playlist, currentPlayedIndex } = state.playerReducer.toJS();
    const currentVideo = playlist[currentPlayedIndex || 0] || {};

    return { currentVideo, playlist };
};

Player.propTypes = {
    currentVideo: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.array.isRequired,
    addVideo: React.PropTypes.func.isRequired,
    selectNextVideo: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, { addVideo, selectNextVideo })(Player);
