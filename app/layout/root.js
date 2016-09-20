export default class Root extends React.Component {

    static get propTypes() {
        return {
            children: React.PropTypes.object
        };
    }

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}
