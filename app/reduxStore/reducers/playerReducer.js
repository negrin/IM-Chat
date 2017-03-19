import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    playlist: [],
    currentPlayedIndex: null,
    playerID: null
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

        case 'UPDATE_VIDEO_INFO': {
            const playlist2 = state.toJS().playlist;
            const currentPlayedIndex = state.toJS().currentPlayedIndex;
            const playlistID = playlist2.findIndex((video) => video.videoUId === action.payload.videoUId);
            const timeArray = action.payload.videoDuration.match(/(\d+)/g);
            const duration = timeArray.join(':');

            playlist2[playlistID].videoName = action.payload.videoName;
            playlist2[playlistID].videoDuration = duration;
            return Immutable.fromJS({ playlist: playlist2, currentPlayedIndex });
        }

        case 'GET_PLAYER_ID': {
            let playerID = state.toJS().playerID;

            playerID = action.payload;
            return Immutable.fromJS({ playerID });
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
