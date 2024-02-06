import {
  ACCEPT_FRIEND,
  ACCEPT_FRIEND_FAILED,
  ACCEPT_FRIEND_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_SUCCESS,
  CLEAR_UPDATE_MESSAGE,
  CREATE_CHAT,
  CREATE_CHAT_FAILED,
  CREATE_CHAT_SUCCESS,
  GET_CHAT,
  GET_CHATHISTORY,
  GET_CHATHISTORY_FAILED,
  GET_CHATHISTORY_SUCCESS,
  GET_CHAT_FAILED,
  GET_CHAT_SUCCESS,
  GET_FRIENDLIST,
  GET_FRIENDLIST_FAILED,
  GET_FRIENDLIST_SUCCESS,
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAILED,
  GET_USER_PROFILE_SUCCESS,
  INVITE_FRIEND,
  INVITE_FRIEND_FAILED,
  INVITE_FRIEND_SUCCESS,
  REJECT_FRIEND,
  REJECT_FRIEND_FAILED,
  REJECT_FRIEND_SUCCESS,
  REQUEST_FRIEND,
  REQUEST_FRIEND_FAILED,
  REQUEST_FRIEND_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  isLoading: false,
  userData: [],
  updateMessage: '',
  rejectMessage: '',
  changePasswordMessage: '',
  changePasswordSuccess: false,
};

export default ProfileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {...state, isLoading: action.isLoading};
    case GET_USER_PROFILE_SUCCESS:
      return {...state, isLoading: action.isLoading, userData: action.userData};
    case GET_USER_PROFILE_FAILED:
      return {...state, isLoading: action.isLoading, userData: action.userData};
      case GET_FRIENDLIST:
      return {...state, isLoading: action.isLoading};
    case GET_FRIENDLIST_SUCCESS:
      return {...state, isLoading: action.isLoading, friendList: action.friendList};
    case GET_FRIENDLIST_FAILED:
      return {...state, isLoading: action.isLoading, friendList: action.friendList};
      case REQUEST_FRIEND:
      return {...state, isLoading: action.isLoading};
    case REQUEST_FRIEND_SUCCESS:
      return {...state, isLoading: action.isLoading, friendRequest: action.friendRequest};
    case REQUEST_FRIEND_FAILED:
      return {...state, isLoading: action.isLoading, friendRequest: action.friendRequest};
      case INVITE_FRIEND:
      return {...state, isLoading: action.isLoading};
    case INVITE_FRIEND_SUCCESS:
      return {...state, isLoading: action.isLoading, inviteFriend: action.inviteFriend, rejectMessage: action.rejectMessage};
    case INVITE_FRIEND_FAILED:
      return {...state, isLoading: action.isLoading, inviteFriend: action.inviteFriend, rejectMessage: action.rejectMessage};
      case ACCEPT_FRIEND:
        return {...state, isLoading: action.isLoading};
      case ACCEPT_FRIEND_SUCCESS:
        return {...state, isLoading: action.isLoading, acceptFriend: action.acceptFriend,  rejectMessage: action.rejectMessage};
      case ACCEPT_FRIEND_FAILED:
        return {...state, isLoading: action.isLoading, acceptFriend: action.acceptFriend,  rejectMessage: action.rejectMessage};
        case REJECT_FRIEND:
          return {...state, isLoading: action.isLoading};
        case REJECT_FRIEND_SUCCESS:
          return {...state, isLoading: action.isLoading, rejectFriend: action.rejectFriend, rejectMessage: action.rejectMessage};
        case REJECT_FRIEND_FAILED:
          return {...state, isLoading: action.isLoading, rejectFriend: action.rejectFriend,  rejectMessage: action.rejectMessage};
        case UPDATE_PROFILE:
      return {...state, isLoading: action.isLoading};
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        updateMessage: action.updateMessage,
      };
    case UPDATE_PROFILE_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        updateMessage: action.updateMessage,
      };
    case CLEAR_UPDATE_MESSAGE:
      return {...state, updateMessage: action.updateMessage};
    case CHANGE_PASSWORD:
      return {...state, isLoading: action.isLoading};
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordMessage: action.changeMessage,
        changePasswordSuccess: action.changePasswordSuccess,
        isLoading: action.isLoading,
      };
    case CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        changePasswordMessage: action.changeMessage,
        changePasswordSuccess: action.changePasswordSuccess,
        isLoading: action.isLoading,
      };
      case GET_CHATHISTORY:
      return {...state, isLoading: action.isLoading};
    case GET_CHATHISTORY_SUCCESS:
      return {...state, isLoading: action.isLoading, chatHistory: action.chatHistory};
    case GET_CHATHISTORY_FAILED:
      return {...state, isLoading: action.isLoading, chatHistory: action.chatHistory};
      case CREATE_CHAT:
      return {...state, isLoading: action.isLoading};
    case CREATE_CHAT_SUCCESS:
      return {...state, isLoading: action.isLoading, createChat: action.createChat};
    case CREATE_CHAT_FAILED:
      return {...state, isLoading: action.isLoading, createChat: action.createChat};
      case GET_CHAT:
      return {...state, isLoading: action.isLoading};
    case GET_CHAT_SUCCESS:
      return {...state, isLoading: action.isLoading, chat: action.chat};
    case GET_CHAT_FAILED:
      return {...state, isLoading: action.isLoading, chat: action.chat};
    default:
      return {...state};
  }
};
