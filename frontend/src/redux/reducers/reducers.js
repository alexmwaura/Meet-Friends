import {SET_GOOGLE_USER,SET_AUTHENTICATED,SET_UNAUTHENTICATED,SET_USER, SET_CURRENT_CHANNEL} from "../store/types"
const initialState = {
    authenticated: false,
    authenticatedUser: null,
    currentUser: null
}

export const userReducer = (state = initialState,action) => {
    switch(action.type){
        case SET_AUTHENTICATED:return{...state,authenticated:true,authenticatedUser: action.payload}
        case SET_USER: return{ ...state,currentUser: action.payload}
        case SET_UNAUTHENTICATED:return {...state }
        case SET_GOOGLE_USER:return{...state,authenticated:true,...action.payload}
        default: return state

    }

}


const initialChannelState = {
    currentChannel: null,
}

export const currentChannelReducer =(state = initialChannelState, action) => {
    switch(action.type){
        case SET_CURRENT_CHANNEL: return{...state,currentChannel: action.payload.currentChannel}
        default: return state
    }
}





