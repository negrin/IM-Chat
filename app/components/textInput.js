import { connect } from 'react-redux';
import { postNewComment } from '../reduxStore/actions/commentActions';
import { isTyping } from '../reduxStore/actions/usersActions';

class TextInput extends React.Component {

    constructor() {
        super();
        this.state = {
            isTextBoxEmpty: true
        };
        this.keydownListener = this.keydownListener.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keydownListener);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keydownListener);
    }

    keydownListener(e) {
        if (event.altKey && e.keyCode === 13 || event.shiftKey && e.keyCode === 13) {
            this.textInput.value = this.textInput.value += '\n';
            e.preventDefault();
        } else if (e.keyCode === 13) {
            this._handleSendNewComment();
            e.preventDefault();
        }
    }

    _getCurrentDate() {
        const newDate = new Date();
        const hours = newDate.getHours();
        const minutes = newDate.getMinutes();

        return (`${ hours }:${ minutes.toString().length === 1 ? '0' : '' }${ minutes }`);
    }

    _handleSendNewComment() {
        if (/\S/.test(this.textInput.value)) {
            const newComment = {
                name: this.props.activeUser.name,
                email: this.props.activeUser.email,
                date: this._getCurrentDate(),
                text: this.textInput.value
            };

            this._handleIsTyping(false);
            this.props.postNewComment(newComment, this.props.playerID);
            this.textInput.value = '';
            this.setState({ isTextBoxEmpty: true });
        }
    }

    _handleIsTyping(value) {
        this.props.users.find((user) => {
            if (user.userID === this.props.activeUser.id) {
                this.props.isTyping(user.id, value, this.props.playerID);
                setTimeout(() => { this.props.isTyping(user.id, false, this.props.playerID); }, 3000);
                return true;
            }
        });
    }

    _handleButtonColor() {
        this._handleIsTyping(true);
        if (/\S/.test(this.textInput.value)) {
            this.setState({ isTextBoxEmpty: false });
        } else {
            this.setState({ isTextBoxEmpty: true });
        }
    }


    render() {
        return (
            <div className="text-input">

                <textarea
                    className="text-box"
                    onChange={ () => this._handleButtonColor() }
                    placeholder="Type your message..."
                    ref={ (instance) => { this.textInput = instance; } }/>
                <button className="btn"
                        style={ this.state.isTextBoxEmpty ? { background: '#a3a3a3', cursor: 'default' } : null }
                        onClick={ this._handleSendNewComment.bind(this) }>SEND</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.commentReducer.toJS(),
        activeUser: state.activeUserReducer.toJS(),
        users: state.userReducer.toJS()
    };
};

TextInput.propTypes = {
    isTyping: React.PropTypes.func,
    playerID: React.PropTypes.string,
    postNewComment: React.PropTypes.func,
    activeUser: React.PropTypes.object,
    comments: React.PropTypes.array,
    users: React.PropTypes.array
};

export default connect(mapStateToProps, { postNewComment, isTyping })(TextInput);
