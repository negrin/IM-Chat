import Immutable from 'immutable';

const initialUsers = Immutable.fromJS([]);

const buildUser = (data) => {
    return data;
};

const buildList = (data) => {
    return data.slice();
};

export default function (state = initialUsers, action = {}) {

    switch (action.type) {
        case 'ADD_USER':
            const user = action.payload;
            const addIdx = state.findIndex((v) => v.get('id') === action.payload.id);

            if (addIdx !== -1) {
                return state.update(addIdx, (user_obj) => user_obj.merge(user));
            }
            return state.push(Immutable.fromJS(buildUser(user)));
        case 'REMOVE_USER':
            const user_id = action.payload;

            return state.delete(state.findIndex((v) => v.id === user_id));
        case 'UPDATE_USER':
            const { user_id: update_user_id, user: update_user } = action.payload;
            const updateIdx = state.findIndex((v) => v.get('id') === update_user_id);

            if (updateIdx !== -1) {
                return state.update(updateIdx, (user_obj) => user_obj.merge(update_user));
            }
            break;
        case 'SYNC_USERS':
            return Immutable.fromJS(buildList(action.payload.users));
        default:
            break;
    }

    return state;
}
