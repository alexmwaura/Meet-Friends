import {
  SET_GOOGLE_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_PRIVATE_CHANNEL,
  SET_CURRENT_CHANNEL,
  SET_CURRENT_USER,
  SET_USER_POST,
  SET_COLORS
} from "../store/types";
const initialState = {
  authenticated: false,
  authenticatedUser: null,
  currentUser: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      }

    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        authenticatedUser: action.payload,
      };
    case SET_UNAUTHENTICATED:
      return { ...initialState };
    case SET_GOOGLE_USER:
      return { ...state, authenticated: true, ...action.payload };
    default:
      return state;
  }
};

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPost: null,
};

export const currentChannelReducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return { ...state, currentChannel: action.payload.currentChannel };
    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };
    case SET_USER_POST: 
      return {
        ...state,
        userPost: action.payload
      }  
    default:
      return state;
  }
};


const initialColorState = {
   primaryColor: "#193b4d",
    secondaryColor: "#19394d"
}
export const setColorsReducers = (state=initialColorState,action) => {
  switch (action.type) {
    case SET_COLORS:
      return{
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor

      }
    default:
      return state  
  }
}
