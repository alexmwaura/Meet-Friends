import {
  SET_GOOGLE_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_PRIVATE_CHANNEL,
  SET_CURRENT_CHANNEL,
} from "../store/types";
const initialState = {
  authenticated: false,
  authenticatedUser: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};



