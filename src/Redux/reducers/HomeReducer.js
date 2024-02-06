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
} from '../actions/types';

const INITIAL_STATE = {
  isLoading: false,
  categoryList: [],
  recentJobs: [],
  expertiseList: [],
  subCategoryList: [],
  suggestData:[],
  userList:[],
  currentLocation: null,
  currentLatlng: ''
};

export default HomeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CATEGORY_LIST:
      return {...state, isLoading: action.isLoading};
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: action.payload.data,
        isLoading: action.isLoading,
      };
    case CATEGORY_LIST_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        categoryList: action.payload,
      };
    case RECENT_JOB:
      return {...state, isLoading: action.isLoading};
    case RECENT_JOB_SUCCESS:
      return {
        ...state,
        recentJobs: action.payload.data,
        isLoading: action.isLoading,
      };
    case RECENT_JOB_FAILED:
      return {
        ...state,
        recentJobs: action.payload.data,
        isLoading: action.isLoading,
      };
    case GET_EXPERTISE:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_EXPERTISE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        expertiseList: action.payload,
      };
    case GET_EXPERTISE_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        expertiseList: action.payload,
      };
    case SUB_CATEGORY_LIST:
      return {
        ...state,
        isLoading: action.isLoading,
        subCategoryList: action.payload,
      };
    case SUB_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        subCategoryList: action.payload,
      };
    case SUB_CATEGORY_LIST_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        subCategoryList: action.payload,
      };
    case GET_ALL_USERS:
      return {...state, isLoading: action.isLoading, payload: action.payload };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        userList: action.payload,
        isLoading: action.isLoading,
        payload: action.payload
      };
    case GET_ALL_USERS_FAILED:
      return {
        ...state,
        userList: action.payload,
        isLoading: action.isLoading,
        payload: action.payload
      };
      case LOCATION_CHANGE:
        return{
          ...state,
          currentLocation:action.payload,
        }
        case POSITION_CHANGE:
          return{
            ...state,
            currentLatlng:action.payload,
          }
    default:
      return {...state};
  }
};
