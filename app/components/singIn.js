import { connect } from 'react-redux';
import { setActiveUser, userSignIn, userSignOut } from '../reduxStore/actions/usersActions';
import { selectActiveUser } from '../reduxStore/selectors/activeUserSelectors';

class SingIn extends React.Component {

    constructor() {
        super();
        this.state = {
            isNameInputEmpty: true,
            isSingInOver: false
        };
        this.keydownListener = this.keydownListener.bind(this);
    }


    componentDidMount() {
        window.onbeforeunload = () => {
            this._handleSingOut();
        };
        window.addEventListener('keydown', this.keydownListener);
        this.nameInput.focus();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keydownListener);
    }

    keydownListener(e) {
        if (e.keyCode === 13) {
            this._handleSingIn();
        }
    }

    _handleSingIn() {
        if (/\S/.test(this.nameInput.value)) {
            const name = this.nameInput.value;
            const email = this.emailInput && this.emailInput.value !== '' ? this.emailInput.value : name;

            const newUser = {
                name,
                email,
                isTyping: false
            };

            this.props.userSignIn(newUser, this.props.playerID);
            this.nameInput.value = '';
            this.setState({ isSingInOver: true });
        } else {
            this.setState({ isNameInputEmpty: true });
        }
    }

    _handleButtonColor() {
        if (/\S/.test(this.nameInput.value)) {
            this.setState({ isNameInputEmpty: false });
        } else {
            this.setState({ isNameInputEmpty: true });
        }
    }

    _handleSingOut() {
        this.props.userSignOut(this.props.activeUser.id, this.props.playerID);
    }

    render() {
        return (
        <div className="singing-overlay"
             style={ this.state.isSingInOver ? { display: 'none' }
             : { display: 'flex' } }>
                <div className="sing-in">
                    <input
                        type="text"
                        ref={ (instance) => { this.nameInput = instance; } }
                        placeholder="Name"
                        onChange={ () => this._handleButtonColor() }
                        className="sing-in-text"/>
                    <input
                        type="text"
                        ref={ (instance) => { this.emailInput = instance; } }
                        placeholder="E-mail"
                        onChange={ () => this._handleButtonColor() }
                        className="sing-in-text"/>
                    <button
                        className="sing-in-btn"
                        style={ this.state.isNameInputEmpty ? { background: '#a3a3a3', color: '#C1C1C1', cursor: 'default' } : null }
                        onClick={ () => this._handleSingIn() }>Sign In
                    </button>
            </div>
        </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.userReducer.toJS(),
        activeUser: selectActiveUser(state)
    };
};

SingIn.propTypes = {
    users: React.PropTypes.array,
    playerID: React.PropTypes.string,
    activeUser: React.PropTypes.string,
    setActiveUser: React.PropTypes.func,
    userSignOut: React.PropTypes.func,
    userSignIn: React.PropTypes.func

};

export default connect(mapStateToProps, { setActiveUser, userSignIn, userSignOut })(SingIn);
