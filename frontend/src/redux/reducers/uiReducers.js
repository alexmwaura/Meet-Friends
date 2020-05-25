import {SET_ERRORS,CLEAR_ERRORS,LOADING_UI,STOP_LOADING_UI,FIRST_LOAD} from "../store/types"

const initialUi = {
    loading: false,
    firstLoad: "none",
    errors: null
}

export  default function (state=initialUi,action)  {
    switch(action.type){
        case SET_ERRORS: return {...state, loading:false,errors: action.payload}
        case CLEAR_ERRORS: return {...state, loading:false,errors: null}
        case LOADING_UI: return {...state, loading:true}
        case FIRST_LOAD: return {...state,firstLoad:action.payload}
        case STOP_LOADING_UI: return {...state, loading:false}
        default: return state
    }
}