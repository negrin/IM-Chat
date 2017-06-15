import { connect } from 'react-redux';
import { CommandType } from '../helpers/commentHelpers';
import { postNewComment } from '../reduxStore/actions/commentActions';
import { updateSettings } from '../reduxStore/actions/settingsActions';
import { selectActiveUser } from '../reduxStore/selectors/activeUserSelectors';
import moment from 'moment';

class UserControlPanel extends React.Component {

    _handleSendPlayCommand() {
        const comment = this.getNewComment(CommandType.PLAY, '/play');

        this.props.postNewComment(comment, this.props.playerID);
    }

    _handleSendPauseCommand() {
        const comment = this.getNewComment(CommandType.PAUSE, '/pause');

        this.props.postNewComment(comment, this.props.playerID);
    }

    _handleSendNextCommand() {
        const comment = this.getNewComment(CommandType.NEXT, '/next');

        this.props.postNewComment(comment, this.props.playerID);
    }

    _handleVolumeChange() {
        this.props.updateSettings(this.props.playerID, 'volume', this.volumeInput.value);
    }

    getNewComment(commandType, text) {
        const now = Date.now();
        const momentNow = moment(now);
        const newComment = {
            name: this.props.activeUser.name,
            email: this.props.activeUser.email,
            date: momentNow.format('YYYY/MM/DD'),
            time: momentNow.format('HH:mm:ss'),
            text,
            showText: false,
            commandType,
            description: '',
            created: now
        };

        return newComment;
    }

    render() {
        return (
            <div className="user-control-panel">
                <div className="action-btn play" onClick={ this._handleSendPlayCommand.bind(this) }></div>
                <div className="action-btn pause" onClick={ this._handleSendPauseCommand.bind(this) }></div>
                <div className="action-btn next" onClick={ this._handleSendNextCommand.bind(this) }></div>
                <input className="volume" type="range" min="0" max="100" ref={ (instance) => { this.volumeInput = instance; } }
                        onChange={ () => this._handleVolumeChange() } step="1" value={ this.props.settings.volume }/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeUser: selectActiveUser(state)
    };
};

UserControlPanel.propTypes = {
    playerID: React.PropTypes.string,
    postNewComment: React.PropTypes.func,
    updateSettings: React.PropTypes.func,
    activeUser: React.PropTypes.object,
    settings: React.PropTypes.object
};

export default connect(mapStateToProps, { postNewComment, updateSettings })(UserControlPanel);

