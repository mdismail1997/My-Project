import {
  acceptFriend,
  ChangePasswordAPI,
  chatHistory,
  createChat,
  friendRequest,
  getChat,
  getFriendList,
  getUserProfile,
  inviteFriend,
  rejectFriend,
  updateUserProfile,
} from '../../Services/ApiService';
import {
  ACCEPT_FRIEND,
  ACCEPT_FRIEND_FAILED,
  ACCEPT_FRIEND_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_SUCCESS,
  CLEAR_REJECT_MESSAGE,
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
  UPDATE_PROFILE_SUCCESS,
} from './types';

// Get user profile
export const getUserProfileAction = () => {
  return async dispatch => {
    dispatch({type: GET_USER_PROFILE, isLoading: true});
    const response = await getUserProfile();
    try {
      if (response.success) {
        getUserProfileSuccess(dispatch, response);
      } else {
        getUserProfileFailed(dispatch, response);
      }
    } catch (error) {
      getUserProfileFailed(dispatch, error);
    }
  };
};

const getUserProfileSuccess = (dispatch, response) => {
  dispatch({
    type: GET_USER_PROFILE_SUCCESS,
    isLoading: false,
    userData: response,
  });
};

const getUserProfileFailed = (dispatch, response) => {
  dispatch({
    type: GET_USER_PROFILE_FAILED,
    isLoading: false,
    userData: response,
  });
};

// Update user profile
export const updateProfileAction = data => {
  return async dispatch => {
    dispatch({type: UPDATE_PROFILE, isLoading: true});
    try {
      const response = await updateUserProfile(data);
      if (response.success) {
        onUpdateSuccess(dispatch, response);
      } else {
        onUpdateFailed(dispatch, response);
      }
    } catch (error) {
      onUpdateFailed(dispatch, error);
    }
  };
};

const onUpdateSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_PROFILE_SUCCESS,
    updateMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};
const onUpdateFailed = (dispatch, response) => {
  dispatch({
    type: UPDATE_PROFILE_SUCCESS,
    updateMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};

export const clearUpdateMessageAction = () => {
  return async dispatch => {
    dispatch({type: CLEAR_UPDATE_MESSAGE, updateMessage: ''});
  };
};

// ChangePassword
export const userChangePasswordAction = data => {
  return async dispatch => {
    dispatch({type: CHANGE_PASSWORD, isLoading: true});
    try {
      const response = await ChangePasswordAPI(data);
      if (response.success) {
        onChangePasswordSuccess(dispatch, response);
      } else {
        onChangePasswordFailed(dispatch, response);
      }
    } catch (error) {
      onChangePasswordFailed(dispatch, error);
    }
  };
};

const onChangePasswordSuccess = (dispatch, response) => {
  dispatch({
    type: CHANGE_PASSWORD_SUCCESS,
    changePasswordMessage: response.message,
    isLoading: false,
    changePasswordSuccess: true,
  });
};
const onChangePasswordFailed = (dispatch, response) => {
  dispatch({
    type: CHANGE_PASSWORD_FAILED,
    changePasswordMessage: response.message,
    isLoading: false,
    changePasswordSuccess: false,
  });
};

export const getFriendListAction = () => {
  return async dispatch => {
    dispatch({type: GET_FRIENDLIST, isLoading: true});
    const response = await getFriendList();
    try {
      if (response.success) {
        getFriendListSuccess(dispatch, response);
      } else {
        getFriendListFailed(dispatch, response);
      }
    } catch (error) {
      getFriendListFailed(dispatch, error);
    }
  };
};

const getFriendListSuccess = (dispatch, response) => {
  dispatch({
    type: GET_FRIENDLIST_SUCCESS,
    isLoading: false,
    friendList: response,
  });
};

const getFriendListFailed = (dispatch, response) => {
  dispatch({
    type: GET_FRIENDLIST_FAILED,
    isLoading: false,
    friendList: response,
  });
};

export const inviteFriendAction = (data) => {
  return async dispatch => {
    dispatch({type: INVITE_FRIEND, isLoading: true});
    const response = await inviteFriend(data);
    try {
      if (response.success) {
        inviteFriendSuccess(dispatch, response);
      } else {
        inviteFriendFailed(dispatch, response);
      }
    } catch (error) {
      inviteFriendFailed(dispatch, error);
    }
  };
};

const inviteFriendSuccess = (dispatch, response) => {
  dispatch({
    type: INVITE_FRIEND_SUCCESS,
    isLoading: false,
    inviteFriend: response,
    rejectMessage: response.message
  });
};

const inviteFriendFailed = (dispatch, response) => {
  dispatch({
    type: INVITE_FRIEND_FAILED,
    isLoading: false,
    inviteFriend: response,
    rejectMessage: response.message
  });
};

export const friendRequestAction = () => {
  return async dispatch => {
    dispatch({type: REQUEST_FRIEND, isLoading: true});
    const response = await friendRequest();
    try {
      if (response.success) {
        friendRequestSuccess(dispatch, response);
      } else {
        friendRequestFailed(dispatch, response);
      }
    } catch (error) {
      friendRequestFailed(dispatch, error);
    }
  };
};

const friendRequestSuccess = (dispatch, response) => {
  dispatch({
    type: REQUEST_FRIEND_SUCCESS,
    isLoading: false,
    friendRequest: response,
  });
};

const friendRequestFailed = (dispatch, response) => {
  dispatch({
    type: REQUEST_FRIEND_FAILED,
    isLoading: false,
    friendRequest: response,
  });
};

export const acceptFriendAction = (data) => {
  return async dispatch => {
    dispatch({type: ACCEPT_FRIEND, isLoading: true});
    const response = await acceptFriend(data);
    try {
      if (response.success) {
        acceptfriendSuccess(dispatch, response);
      } else {
        acceptFriendFailed(dispatch, response);
      }
    } catch (error) {
      acceptFriendFailed(dispatch, error);
    }
  };
};

const acceptfriendSuccess = (dispatch, response) => {
  dispatch({
    type: ACCEPT_FRIEND_SUCCESS,
    isLoading: false,
    acceptFriend: response,
    rejectMessage: response.message
  });
};

const acceptFriendFailed = (dispatch, response) => {
  dispatch({
    type: ACCEPT_FRIEND_FAILED,
    isLoading: false,
    acceptFriend: response,
    rejectMessage: response.message
  });
};

export const rejectFriendAction = (data) => {
  return async dispatch => {
    dispatch({type: REJECT_FRIEND, isLoading: true});
    const response = await rejectFriend(data);
    try {
      if (response.success) {
        rejectfriendSuccess(dispatch, response);
      } else {
        rejectFriendFailed(dispatch, response);
      }
    } catch (error) {
      rejectFriendFailed(dispatch, error);
    }
  };
};

const rejectfriendSuccess = (dispatch, response) => {
  dispatch({
    type: REJECT_FRIEND_SUCCESS,
    isLoading: false,
    rejectFriend: response,
    rejectMessage: response.message
  });
};

const rejectFriendFailed = (dispatch, response) => {
  dispatch({
    type: REJECT_FRIEND_FAILED,
    isLoading: false,
    rejectFriend: response,
    rejectMessage: response.message
  });
};

export const clearRejectMessageAction = () => {
  return async dispatch => {
    dispatch({type: CLEAR_REJECT_MESSAGE, rejectMessage: ''});
  };
};

export const getChatHistoryAction = () => {
  return async dispatch => {
    dispatch({type: GET_CHATHISTORY, isLoading: true});
    const response = await chatHistory();
    try {
      if (response.success) {
        getchatHistorySuccess(dispatch, response);
      } else {
        getChatHistoryFailed(dispatch, response);
      }
    } catch (error) {
      getChatHistoryFailed(dispatch, error);
    }
  };
};

const getchatHistorySuccess = (dispatch, response) => {
  dispatch({
    type: GET_CHATHISTORY_SUCCESS,
    isLoading: false,
    chatHistory: response,
  });
};

const getChatHistoryFailed = (dispatch, response) => {
  dispatch({
    type: GET_CHATHISTORY_FAILED,
    isLoading: false,
    chatHistory: response,
  });
};

export const createChatAction = (data) => {
  return async dispatch => {
    dispatch({type: CREATE_CHAT, isLoading: true});
    const response = await createChat(data);
    try {
      if (response.success) {
        createChatSuccess(dispatch, response);
      } else {
        createChatFailed(dispatch, response);
      }
    } catch (error) {
      createChatFailed(dispatch, error);
    }
  };
};

const createChatSuccess = (dispatch, response) => {
  dispatch({
    type: CREATE_CHAT_SUCCESS,
    isLoading: false,
    createChat: response,
  });
};

const createChatFailed = (dispatch, response) => {
  dispatch({
    type: CREATE_CHAT_FAILED,
    isLoading: false,
    createChat: response,
  });
};

export const getChatAction = (data) => {
  return async dispatch => {
    dispatch({type: GET_CHAT, isLoading: true});
    const response = await getChat(data);
    try {
      if (response.success) {
       getChatSuccess(dispatch, response);
      } else {
        getChatFailed(dispatch, response);
      }
    } catch (error) {
      getChatFailed(dispatch, error);
    }
  };
};

const getChatSuccess = (dispatch, response) => {
  dispatch({
    type: GET_CHAT_SUCCESS,
    isLoading: false,
    chat: response,
  });
};

const getChatFailed = (dispatch, response) => {
  dispatch({
    type: GET_CHAT_FAILED,
    isLoading: false,
    chat: response,
  });
};