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
            videoDuration: {}
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

        switch (command) {
            case 'volume':
            case 'vol':
                if (!isNaN(commandParam) && commandParam >= 0 && commandParam <= 100) {
                    setTimeout(() => this.youtubeVideo.internalPlayer.setVolume(commandParam));
                }
                break;
            case 'stop':
            case 'pause':
                setTimeout(() => this.youtubeVideo.internalPlayer.pauseVideo());
                break;
            case 'play':
                setTimeout(() => this.youtubeVideo.internalPlayer.playVideo());
                break;
            case 'add':
                let videoId = getUrlParamValue(commandParam, 'v');

                if (this.youtubeVideo) {
                    setTimeout(() => {
                        this.youtubeVideo.internalPlayer.getPlayerState().then(
                            (status) => {
                                if (status === 0 || status === -1 || status === 2) {
                                    this.props.selectNextVideo();
                                }
                            }
                        );
                        this.youtubeVideo.internalPlayer.getDuration().then(
                            (videoDuration) => {
                                const minutes =  Math.floor(videoDuration / 60);
                                const seconds = (videoDuration - minutes * 60).toFixed(0);
                                const finalTime = `${minutes}:${seconds}`;

                                this.setState({ videoDuration: finalTime });
                            }
                        );
                        this.youtubeVideo.internalPlayer.getVideoData().then(
                            (videoData) => { this.setState({ videoData }); }
                        );


                    });
                }

                this.props.addVideo({ videoId, userName });

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
        const { userName } = this.props.currentVideo;

        if (!userName) {
            return null;
        }

        return (
            <div className="player-name">
                <Gravatar
                    className="user-icon"
                    email={ userName } />
                <span>{ userName }:</span>
            </div>
        );
    }

    _renderPlayer() {
        const { videoId } = this.props.currentVideo;

        if (!videoId) {
            return null;
        }

        return (
            <div className="youtube-holder"
                 style={ { height: this.state.playerHeight } }
                 ref={ (div) => this.youtubePlaceHolder = div }>
                <YouTube
                    ref={ (video) => this.youtubeVideo = video }
                    videoId={ videoId }
                    onReady={ this._onReady }
                    onEnd={ this.props.selectNextVideo }
                    className="youtube-player"/>
            </div>
        );
    }

    _rendePlaylist() {
        return (
            <div className="playlist-panel">
                {
                    this.props.playlist.map((video) => {
                        const videoClassName = cx({
                            playlistItem: true,
                            selected: video.videoId === this.props.currentVideo.videoId
                        });

                        return (
                            <div className={ videoClassName }>
                                <img className="playlist-item-img" src={ `https://i.ytimg.com/vi/${ video.videoId }/hqdefault.jpg` } />
                                <div className="playlist-item-info">
                                    <div>{ video.videoId }</div>
                                    <div>4:15</div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    _onReady(event) {
        event.target.playVideo();
    }

    render() {
        return (
            <div className="player-page" >
                { this._rendePlaylist() }
                <div className="player-container">
                    { this._renderName() }
                    { this._renderPlayer() }
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
