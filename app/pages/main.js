import { connect } from 'react-redux';
import Comment from '../components/comment';
import DateMarker from '../components/dateMarker';
import User from '../components/user';
import TextInput from '../components/textInput';
import UserControlPanel from '../components/userControlPanel';
import SingIn from '../components/singIn';
import { getComments } from '../reduxStore/actions/commentActions';
import { getUsers } from '../reduxStore/actions/usersActions';
import FirebaseAPI from '../firebase/firebase';
import { CommandType } from '../helpers/commentHelpers';

class Main extends React.Component {

    componentDidMount() {
        this.props.getUsers();
        this.props.getComments();
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
    }

    renderComment(comment) {
        if (comment.command === 'newDate') {
            return <DateMarker key={ comment.date } date={ comment.date }/>;
        }
        return <Comment key={ comment.id } comment={ comment }/>;
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
                        <UserControlPanel playerID={ this.props.params.playerID }/>
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
        users: state.userReducer.toJS()
    };
};

Main.propTypes = {
    comments: React.PropTypes.array,
    params: React.PropTypes.object,
    users: React.PropTypes.array,
    getComments: React.PropTypes.func,
    getUsers: React.PropTypes.func
};

export default connect(mapStateToProps, { getComments, getUsers })(Main);
