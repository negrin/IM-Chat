import { connect } from 'react-redux';
import cx from 'classnames';
import YouTube from 'react-youtube';
import Gravatar from 'react-gravatar';
import { addVideo, updateVideoInfo, selectNextVideo } from '../reduxStore/actions/playerActions';
import FirebaseAPI from '../firebase/firebase';
import { getUrlParamValue } from '../helpers/urlHelpers';
import { getCommentCommand, getCommentCommandParam } from '../helpers/commentHelpers';

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
        FirebaseAPI.onNewChange('child_added', `players/${ this.props.params.playerID }/comments`, (e) => {
            this._parseCommand(e);
        });
    }

    _parseCommand(e) {
        const command = getCommentCommand(e.text);
        const commandParam = getCommentCommandParam(e.text);
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
                this.props.updateVideoInfo(e.videoInfo.title, e.videoInfo.duration, videoUId);

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

    _renderVideoDetails() {

        const { currentVideo, playlist } = this.props;
        const { userName, email } = currentVideo;

        if (!currentVideo || !playlist) {
            return null;
        }

        const playerData = cx({
            'player-data': true,
            'player-data__full-screen': this.state.isFullScreen
        });

        return (
          <div className={ playerData }>
              <div className="player-data-name">
                  <Gravatar
                      className="player-data-name-icon"
                      email={ email ? email : 'fdg' } />
              </div>
              <div className="player-data-info">
                  <div className="player-data-text-large">{ userName ? `${userName}:` : '....' }</div>
                  <div className="player-data-text"><b>Title:</b> { currentVideo.videoName ? currentVideo.videoName : '....' }</div>
                  <div className="player-data-aliment">
                      <div className="player-data-text">
                          <b>Duration:</b> { currentVideo.videoDuration ? currentVideo.videoDuration : '00:00:00' }
                          </div>
                      <div className="player-data-text">
                          <b>Volume:</b> { this.youtubeVideo || this.state.volume ? this.state.volume : '....' }
                          </div>
                  </div>
              </div>
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
                                      <div>{ video.videoName }</div>
                                      <div>{ video.videoDuration }</div>
                                      <div>by: { video.userName }</div>
                                  </div>
                              </div>
                          );
                    })
                }
            </div>
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
                    { this._renderVideoDetails() }
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
    updateVideoInfo: React.PropTypes.func.isRequired,
    selectNextVideo: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { addVideo, selectNextVideo, updateVideoInfo })(Player);
