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

    subscribeFB() {
        FirebaseAPI.onChange('child_added', 'comments', (e) => {
            this.props.getComments();
        });
        FirebaseAPI.onChange('child_removed', 'comments', (e) => {
            this.props.getComments();
        });
        FirebaseAPI.onChange('child_added', 'users', (e) => {
            this.props.getUsers();
        });
        FirebaseAPI.onChange('child_removed', 'users', (e) => {
            this.props.getUsers();
        });
        FirebaseAPI.onChange('child_changed', 'users', (e) => {
            this.props.getUsers();
        });
    }

    render() {
        return (
            <div>
                <SingIn />
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
                            <TextInput />
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
    users: React.PropTypes.array,
    getComments: React.PropTypes.func,
    getUsers: React.PropTypes.func
};

export default connect(mapStateToProps, { getComments, getUsers })(Main);
