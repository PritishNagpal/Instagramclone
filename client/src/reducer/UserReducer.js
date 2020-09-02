
const initialState = null;

const reducer = (state=initialState,action) => {
    if(action.type === 'USER'){
        return action.payload;
    }
    if(action.type === 'CLEAR'){
        return null
    }
    if(action.type === 'UPDATE'){
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if(action.type === 'UPDATE_PIC'){
        return{
            ...state,
            profilePic: action.payload.profilePic
        }
    }
    return state;
}

export default reducer;