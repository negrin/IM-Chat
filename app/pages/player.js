import { connect } from 'react-redux';
import YouTube from 'react-youtube';
import Gravatar from 'react-gravatar';
import { addVideo, selectNextVideo } from '../reduxStore/actions/playerActions';
import FirebaseAPI from '../firebase/firebase';

class Player extends React.Component {

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
        FirebaseAPI.onChange('child_added', 'comments', (e) => {
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

    _onReady(event) {
        event.target.playVideo();
    }

    _parseCommand(e) {
        const command = e.text.substr(1).split(' ')[0];
        const commandParam = e.text.substr(1).split(' ')[1];
        const userName = e.name;

        switch (command) {
            case 'stop':
            case 'pause':
                setTimeout(() => this.youtubeVideo.internalPlayer.pauseVideo());
                break;
            case 'play':
                setTimeout(() => this.youtubeVideo.internalPlayer.playVideo());
                break;
            case 'add':
                let videoId = commandParam.split('v=')[1];
                const ampersandPosition = videoId.indexOf('&');

                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
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
                    className="youtube-player"/>
            </div>
        );
    }

    render() {
        return (
            <div className="player-page" >
                { this._renderName() }
                { this._renderPlayer() }
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    const { playlist, currentPlayedIndex } = state.playerReducer.toJS();
    const currentVideo = playlist[currentPlayedIndex || 0] || {};

    return { currentVideo };
};

Player.propTypes = {
    currentVideo: React.PropTypes.object.isRequired,
    addVideo: React.PropTypes.func.isRequired,
    selectNextVideo: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, { addVideo, selectNextVideo })(Player);
