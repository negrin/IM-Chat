import { connect } from 'react-redux';
import Comment from '../components/comment';
import DateMarker from '../components/dateMarker';
import User from '../components/user';
import TextInput from '../components/textInput';
import UserControlPanel from '../components/userControlPanel';
import SingIn from '../components/singIn';
import { getComments, addComment, removeComment } from '../reduxStore/actions/commentActions';
import { getUsers, addUser, removeUser, updateUser } from '../reduxStore/actions/usersActions';
import { getSettings } from '../reduxStore/actions/settingsActions';
import FirebaseAPI from '../firebase/firebase';
import { CommandType } from '../helpers/commentHelpers';

class Main extends React.Component {

    componentDidMount() {
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

        const commentsRef = FirebaseAPI.ref(`players/${ playerID }/comments`).limitToLast(30);

        FirebaseAPI.onChange('child_added', commentsRef, (comment, id) => {
            comment.id = id;
            this.props.addComment(comment);
        });
        FirebaseAPI.onChange('child_removed', `players/${ playerID }/comments`, (comment, id) => {
            this.props.removeComment(id);
        });
        FirebaseAPI.onChange('child_added', `players/${ playerID }/users`, (user, id) => {
            user.id = id;
            this.props.addUser(user);
        });
        FirebaseAPI.onChange('child_removed', `players/${ playerID }/users`, (user, id) => {
            this.props.removeUser(id);
        });
        FirebaseAPI.onChange('child_changed', `players/${ playerID }/users`, (user, id) => {
            this.props.updateUser(id, user);
        });
        FirebaseAPI.onChange('child_changed', `players/${ playerID }/settings`, (e) => {
            this.props.getSettings(playerID);
        });
    }

    renderCommentsList() {
        const comments = this.props.comments;
        const rendered = [];
        let prevComment;

        comments.forEach((comment) => {
            if (!prevComment || (prevComment.date !== comment.date)) {
                rendered.push(this.renderDateMarker(comment.date));
            }
            if (comment.commandType === CommandType.ADD) {
                rendered.push(this.renderComment(comment));
                prevComment = comment;
            }
        });

        return rendered;
    }

    renderComment(comment) {
        return <Comment key={ comment.id } comment={ comment }/>;
    }

    renderDateMarker(date) {
        return <DateMarker key={ date } date={ date }/>;
    }

    render() {

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
                            { this.renderCommentsList() }
                        </div>
                        <div className="chat-new-message">
                            <TextInput playerID={ this.props.params.playerID }/>
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
    addComment: React.PropTypes.func,
    removeComment: React.PropTypes.func,
    addUser: React.PropTypes.func,
    removeUser: React.PropTypes.func,
    updateUser: React.PropTypes.func,
    getSettings: React.PropTypes.func
};

export default connect(mapStateToProps, { getComments, getUsers, addComment, removeComment, addUser, removeUser, updateUser, getSettings })(Main);
