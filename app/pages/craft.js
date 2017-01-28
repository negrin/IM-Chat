class Craft extends React.Component {

    randomString() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    _generateUID() {
        return `${ this.randomString() }${ this.randomString() }`;
    }

    render() {
        return (
            <div className="craft-page">
                <div className="craft-page-button-con">
                    <button
                        type="button"
                        className="craft-page-button"
                        onClick={ () => window.location.href = this._generateUID() }>
                        Craft Player
                    </button>
                </div>
            </div>

        );
    }
}

export default Craft;
