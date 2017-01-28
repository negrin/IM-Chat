import { connect } from 'react-redux';
import Commment from '../components/comment';
import User from '../components/user';
import TextInput from '../components/textInput';
import SingIn from '../components/singIn';
import { getComments } from '../reduxStore/actions/commentActions';
import { getUsers } from '../reduxStore/actions/usersActions';
import FirebaseAPI from '../firebase/firebase';

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
        FirebaseAPI.onChange('child_added', `players/${ this.props.params.playerID }/comments`, () => {
            this.props.getComments(this.props.params.playerID);
        });
        FirebaseAPI.onChange('child_removed', `players/${ this.props.params.playerID }/comments`, () => {
            this.props.getComments(this.props.params.playerID);
        });
        FirebaseAPI.onChange('child_added', `players/${ this.props.params.playerID }/users`, () => {
            this.props.getUsers(this.props.params.playerID);
        });
        FirebaseAPI.onChange('child_removed', `players/${ this.props.params.playerID }/users`, () => {
            this.props.getUsers(this.props.params.playerID);
        });
        FirebaseAPI.onChange('child_changed', `players/${ this.props.params.playerID }/users`, () => {
            this.props.getUsers(this.props.params.playerID);
        });
    }

    render() {
        return (
            <div>
                <SingIn playerID={ this.props.params.playerID }/>
                <div className="chat">
                    <div className="chat-user-list">
                        { this.props.users.map((user) => {
                            return <User key={ user.id } user={ user }/>;
                        }) }
                    </div>
                    <div className="chat-body">
                        <div ref={ (instance) => { this.massageDiv = instance; } } className="chat-messages">
                            { this.props.comments.map((comment) => {
                                return <Commment key={ comment.id } comment={ comment }/>;
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
