import { connect } from 'react-redux';
import YouTube from 'react-youtube';
import Gravatar from 'react-gravatar';
import { getComments } from '../reduxStore/actions/commentActions';
import { getUsers } from '../reduxStore/actions/usersActions';
import FirebaseAPI from '../firebase/firebase';

class Player extends React.Component {

    constructor() {
        super();
        this.state = {
            playerHeight: '',
            userName: null,
            videoId: null
        };
        this._resizeScreen = this._resizeScreen.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this._resizeScreen());
        window.addEventListener('resize', this._resizeScreen.bind(this));
        this.subscribeFB();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.videoId !== prevState.videoId) {
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
                let videoId = commandParam.split('v=')[1];
                const ampersandPosition = videoId.indexOf('&');

                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }

                this.setState({ videoId, userName });

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
        const { userName } = this.state;

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
        if (!this.state.videoId) {
            return null;
        }

        return (
            <div className="youtube-holder"
                 style={ { height: this.state.playerHeight } }
                 ref={ (div) => this.youtubePlaceHolder = div }>
                <YouTube
                    ref={ (video) => this.youtubeVideo = video }
                    videoId={ this.state.videoId }
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
    return {

    };
};

Player.propTypes = {

};

export default connect(mapStateToProps, { getComments, getUsers })(Player);
