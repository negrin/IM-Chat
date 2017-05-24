import moment from 'moment';

const DateMarker = (props) => {
    const text = moment(props.date, 'YYYY/MM/DD').calendar(null, {
        sameDay: '[Today] DD/MM',
        nextDay: '[Tomorrow] DD/MM',
        nextWeek: 'dddd DD/MM',
        lastDay: '[Yesterday] DD/MM',
        lastWeek: '[Last] dddd DD/MM',
        sameElse: 'DD/MM/YYYY'
    });

    return (
        <div className="date-marker">
            <span>
                { text }
            </span>
        </div>
    );
};

DateMarker.propTypes = {
    date: React.PropTypes.string.isRequired
};

export default DateMarker;
