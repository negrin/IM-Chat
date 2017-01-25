/*eslint-disable*/
import Gravatar from 'react-gravatar';

class User extends React.Component {

    constructor() {
        super();
        this.state = {
            dots: ''
        };
    }

    componentDidMount() {
        this._renderThreeDots();
    }

    componentWillUnmount() {
        if (this.threeDots) {
            clearInterval(this.threeDots);
        }
    }

    _renderThreeDots() {
        this.threeDots = setInterval(() => {
            this.setState({ dots: this.state.dots + '.' });
            if (this.state.dots === '....') {
                this.setState({ dots: '' });
            }
        }, 700);
    }

    render() {
        return (
            <div className="user">
                <Gravatar className="user-icon" email={ this.props.user.name } />
                <div className="user-info">
                    <div className="user-name">{ this.props.user.name }</div>
                    { this.props.user.isTyping ? <div className="user-typing">typing{ this.state.dots }</div> : null }
                </div>
            </div>
        );
    }
}

User.propTypes = {
    user: React.PropTypes.object
};

export default User;
/*eslint-enable*/
