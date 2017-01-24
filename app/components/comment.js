import Gravatar from 'react-gravatar';

class Commment extends React.Component {

    _handleBRintext() {
        const text = this.props.comment.text;
        const rows = text.split(/\r?\n/g);

        return rows.map((row, i) => {
            if (i === rows.length - 1) {
                return row;
            }
            return [
                row,
                <br/>
            ];
        });
    }

    render() {
        return (
            <div className="comment">
                <div className="comment-info">
                    <Gravatar
                        className="comment-user-icon"
                        email={ this.props.comment.name } />
                    <div className="comment-date">
                        { this.props.comment.date }
                    </div>

                </div>
                <div className="arrow-left"></div>
                <div className="comment-body">
                    <div className="comment-username">
                        { this.props.comment.name }
                    </div>
                    <div className="comment-text">
                        { this._handleBRintext() }
                    </div>
                </div>
            </div>
        );
    }
}

Commment.propTypes = {
    comment: React.PropTypes.object
};

export default Commment;
