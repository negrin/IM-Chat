export default class Layout extends React.Component {

    static get propTypes() {
        return {
            children: React.PropTypes.object
        };
    }

    render() {
        return (
            <div>
                <div className="top-menu">
                    <h1>ReflectMeter Version 1.0</h1>
                </div>
                { this.props.children }
            </div>
        );
    }
}
