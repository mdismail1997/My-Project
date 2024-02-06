import {
  getCategoryList,
  getExpertiseApi,
  getRecentJobs,
  getSubCategoryList,
  getAllUsers,
} from '../../Services/ApiService';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_FAILED,
  CATEGORY_LIST_SUCCESS,
  GET_EXPERTISE,
  GET_EXPERTISE_FAILED,
  GET_EXPERTISE_SUCCESS,
  RECENT_JOB,
  RECENT_JOB_FAILED,
  RECENT_JOB_SUCCESS,
  SUB_CATEGORY_LIST,
  SUB_CATEGORY_LIST_FAILED,
  SUB_CATEGORY_LIST_SUCCESS,
  GET_ALL_USERS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_SUCCESS,
  LOCATION_CHANGE,
  POSITION_CHANGE
} from './types';

// Get category list
export const getCategoryListAction = () => {
  return async dispatch => {
    dispatch({type: CATEGORY_LIST, isLoading: true});
    try {
      const response = await getCategoryList();
      if (response.success) {
        onCategoryListSuccess(dispatch, response);
      } else {
        onCategoryListFailed(dispatch, response);
      }
    } catch (error) {
      onCategoryListFailed(dispatch, error);
    }
  };
};

const onCategoryListSuccess = (dispatch, response) => {
  dispatch({
    type: CATEGORY_LIST_SUCCESS,
    isLoading: false,
    payload: response,
  });
};
const onCategoryListFailed = (dispatch, response) => {
  dispatch({
    type: CATEGORY_LIST_FAILED,
    isLoading: false,
    payload: response,
  });
};

// Get Sub category list Action
export const getSubCategoryListAction = catId => {
  return async dispatch => {
    dispatch({type: SUB_CATEGORY_LIST, isLoading: true});
    try {
      const response = await getSubCategoryList(catId);

      if (response.success) {
        onSubCategoryListSuccess(dispatch, response);
      } else {
        onSubCategoryListFailed(dispatch, response);
      }
    } catch (error) {
      onCategoryListFailed(dispatch, error);
    }
  };
};

const onSubCategoryListSuccess = (dispatch, response) => {
  dispatch({
    type: SUB_CATEGORY_LIST_SUCCESS,
    isLoading: false,
    payload: response,
  });
};

const onSubCategoryListFailed = (dispatch, response) => {
  dispatch({
    type: SUB_CATEGORY_LIST_FAILED,
    isLoading: false,
    payload: response,
  });
};

// Get recent job list
export const getRecentJobListAction = () => {
  return async dispatch => {
    dispatch({type: RECENT_JOB, isLoading: true});
    try {
      const response = await getRecentJobs();
      if (response.success) {
        onRecentJobSuccess(dispatch, response);
      } else {
        onRecentJobFailed(dispatch, response);
      }
    } catch (error) {
      onRecentJobFailed(dispatch, error);
    }
  };
};

const onRecentJobSuccess = (dispatch, response) => {
  dispatch({
    type: RECENT_JOB_SUCCESS,
    payload: response,
    isLoading: false,
  });
};
const onRecentJobFailed = (dispatch, response) => {
  dispatch({
    type: RECENT_JOB_FAILED,
    payload: response,
    isLoading: false,
  });
};

// get expertise action
export const getExpertiseAction = () => {
  return async dispatch => {
    dispatch({type: GET_EXPERTISE, isLoading: true});
    try {
      const response = await getExpertiseApi();
      if (response.success) {
        onExpertiseSuccess(dispatch, response);
      } else {
        onExpertiseFailed(dispatch, response);
      }
    } catch (error) {
      onExpertiseFailed(dispatch, error);
    }
  };
};

const onExpertiseSuccess = (dispatch, response) => {
  dispatch({
    type: GET_EXPERTISE_SUCCESS,
    isLoading: false,
    payload: response,
  });
};
const onExpertiseFailed = (dispatch, response) => {
  dispatch({
    type: GET_EXPERTISE_FAILED,
    isLoading: false,
    payload: response,
  });
};

export const getAllUsersAction = () => {
  return async dispatch => {
    dispatch({type: GET_ALL_USERS, isLoading: true});
    try {
      const response = await getAllUsers();
      console.log("GET SUGGEST FRIEND____________",response)
      if (response.success) {
        dispatch({type: GET_ALL_USERS, isLoading: true,});
        getAllUsersSuccess(dispatch, response);
      } else {
        getAllUsersFailed(dispatch, response);
      }
    } catch (error) {
      getAllUsersFailed(dispatch, error);
    }
  };
};

const getAllUsersSuccess = (dispatch, response) => {
  dispatch({
    type: GET_ALL_USERS_SUCCESS,
    isLoading: false,
    payload: response,
  });
};
const getAllUsersFailed = (dispatch, response) => {
  dispatch({
    type: GET_ALL_USERS_FAILED,
    isLoading: false,
    payload: response,
  });
};

export const changeLocation =(location)=>{
  return async dispatch => {
  dispatch({
    type: LOCATION_CHANGE,
    payload: location,
  });
}
}

export const positionChange =(location)=>{
  return async dispatch => {
  dispatch({
    type: POSITION_CHANGE,
    payload: location,
  });
}
}