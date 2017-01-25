import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    playlist: [],
    currentPlayedIndex: null
});

export default function (state = initialState, action = {}) {

    switch (action.type) {
        case 'ADD_VIDEO': {
            const playlist = state.toJS().playlist;

            playlist.push(action.payload);

            // Auto select the added song if none was selected
            const currentPlayedIndex = state.toJS().currentPlayedIndex === null ? playlist.length - 1 : state.toJS().currentPlayedIndex;

            return Immutable.fromJS({ playlist, currentPlayedIndex });
        }
        case 'SELECT_NEXT_VIDEO': {
            const { playlist, currentPlayedIndex = -1 } = state.toJS();
            let newPlayedIndex = currentPlayedIndex + 1;

            if (newPlayedIndex >= playlist.length) {
                newPlayedIndex = playlist.length - 1;
            }

            return state.set('currentPlayedIndex', newPlayedIndex);
        }
        default:
            break;
    }

    return state;
}
