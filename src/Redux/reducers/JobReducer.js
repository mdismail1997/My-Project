import {
  APPLIED_JOB,
  APPLIED_JOB_FAILED,
  APPLIED_JOB_SUCCESS,
  OFFERED_JOB,
  OFFERED_JOB_SUCCESS,
  OFFERED_JOB_FAILED,
  APPROVED_JOB,
  APPROVED_JOB_SUCCESS,
  APPROVED_JOB_FAILED,
  ACCEPTED_JOB,
  ACCEPTED_JOB_SUCCESS,
  ACCEPTED_JOB_FAILED,
  APPLY_JOB,
  APPLY_JOB_FAILED,
  APPLY_JOB_MESSAGE,
  APPLY_JOB_SUCCESS,
  APPROVE_JOB,
  APPROVE_JOB_FAILED,
  APPROVE_JOB_MESSAGE,
  APPROVE_JOB_SUCCESS,
  START_JOB,
  START_JOB_SUCCESS,
  START_JOB_FAILED,
  START_JOB_MESSAGE,
  ACCEPTAPPROVE_JOB,
  ACCEPTAPPROVE_JOB_SUCCESS,
  ACCEPTAPPROVE_JOB_FAILED,
  ACCEPTAPPROVE_JOB_MESSAGE,
  CLEAR_JOB_MESSAGE,
  CREATE_JOB,
  CREATE_JOB_FAILED,
  CREATE_JOB_SUCCESS,
  GET_ALL_JOB,
  GET_ALL_JOB_FAILED,
  GET_ALL_JOB_SUCCESS,
  GET_JOB_DETAILS,
  GET_JOB_DETAILS_FAILED,
  GET_JOB_DETAILS_SUCCESS,
  GET_JOB_SEARCH,
  GET_JOB_SEARCH_FAILED,
  GET_JOB_SEARCH_SUCCESS,
  NOTIFICATION_LIST,
  NOTIFICATION_LIST_FAILED,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_READ,
  NOTIFICATION_READ_FAILED,
  NOTIFICATION_READ_SUCCESS,
  RECEIVED_JOB,
  RECEIVED_JOB_FAILED,
  RECEIVED_JOB_SUCCESS,
  DENIED_JOB,
  DENIED_JOB_SUCCESS,
  DENIED_JOB_FAILED,
  CARD_DETAILS,
  CARD_DETAILS_SUCCESS,
  CARD_DETAILS_FAILED,
  BANK_DETAILS,
  BANK_DETAILS_SUCCESS,
  BANK_DETAILS_FAILED,
  JOB_WORKED,
  JOB_WORKED_SUCCESS,
  JOB_WORKED_FAILED,
  JOB_CREATED,
  JOB_CREATED_SUCCESS,
  JOB_CREATED_FAILED,
  SAVE_BANK_DETAILS,
  SAVE_BANK_DETAILS_SUCCESS,
  SAVE_BANK_DETAILS_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
  isLoading: false,
  userData: [],
  createMessage: '',
  applyMessage: '',
  approveMessage: '',
  changePasswordMessage: '',
  changePasswordSuccess: false,
  acceptapproveMessage:'',
  cardData:'',
  bankData:'',
  workedData:'',
  createdData:'',
  bankDetailsSaveStatus: '',
  bankMessage:'',
  
};

export default JobReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_JOB:
      return {...state, isLoading: action.isLoading};
    case CREATE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        createMessage: action.createMessage,
      };
    case CREATE_JOB_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        createMessage: action.createMessage,
      };
    case CLEAR_JOB_MESSAGE:
      return {...state, createMessage: action.createMessage};
    case APPLY_JOB:
      return {...state, isLoading: action.isLoading};
    case APPLY_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        applyMessage: action.applyMessage,
      };
    case APPLY_JOB_FAILED: {
      return {
        ...state,
        isLoading: action.isLoading,
        userData: action.userData,
        applyMessage: action.applyMessage,
      };
    }
    case APPLY_JOB_MESSAGE:
      return {...state, applyMessage: action.applyMessage};


      
    case APPLIED_JOB:
      return {...state, isLoading: action.isLoading};
    case APPLIED_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        appliedData: action.appliedData,
      };
    case APPLIED_JOB_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        appliedData: action.appliedData,
      };



      case OFFERED_JOB:
        return {...state, isLoading: action.isLoading};
      case OFFERED_JOB_SUCCESS:
        return {
          ...state,
          isLoading: action.isLoading,
          offeredData: action.offeredData,
        };
      case OFFERED_JOB_FAILED:
        return {
          ...state,
          isLoading: action.isLoading,
          offeredData: action.offeredData,
        };


        case APPROVED_JOB:
          return {...state, isLoading: action.isLoading};
        case APPROVED_JOB_SUCCESS:
          return {
            ...state,
            isLoading: action.isLoading,
            approvedData: action.approvedData,
          };
        case APPROVED_JOB_FAILED:
          return {
            ...state,
            isLoading: action.isLoading,
            approvedData: action.approvedData,
          };


          case START_JOB:
            return {...state, isLoading: action.isLoading};
          case START_JOB_SUCCESS:
            return {
              ...state,
              isLoading: action.isLoading,
              startjobData: action.startjobData,
              startjobMessage: action.startjobMessage,
            };
          case START_JOB_FAILED:
            return {
              ...state,
              isLoading: action.isLoading,
              startjobData: action.startjobData,
              startjobMessage: action.startjobMessage,
            };
          case APPROVE_JOB_MESSAGE:


        case ACCEPTED_JOB:
          return {...state, isLoading: action.isLoading};
        case ACCEPTED_JOB_SUCCESS:
          return {
            ...state,
            isLoading: action.isLoading,
            acceptedData: action.acceptedData,
          };
        case ACCEPTED_JOB_FAILED:
          return {
            ...state,
            isLoading: action.isLoading,
            acceptedData: action.acceptedData,
          };







    case RECEIVED_JOB:
      return {...state, isLoading: action.isLoading};
    case RECEIVED_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        receivedData: action.receivedData,
      };
    case RECEIVED_JOB_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        receivedData: action.receivedData,
      };




      case JOB_WORKED:
        return {...state, isLoading: action.isLoading};
      case JOB_WORKED_SUCCESS:
        return {
          ...state,
          isLoading: action.isLoading,
          workedData: action.workedData,
        };
      case JOB_WORKED_FAILED:
        return {
          ...state,
          isLoading: action.isLoading,
          workedData: action.workedData,
        };



        case JOB_CREATED:
          return {...state, isLoading: action.isLoading};
        case JOB_CREATED_SUCCESS:
          return {
            ...state,
            isLoading: action.isLoading,
            createdData: action.createdData,
          };
        case JOB_CREATED_FAILED:
          return {
            ...state,
            isLoading: action.isLoading,
            createdData: action.createdData,
          };



      case CARD_DETAILS:
        return {...state, isLoading: action.isLoading};
      case CARD_DETAILS_SUCCESS:
        return {
          ...state,
          isLoading: action.isLoading,
          cardData: action.cardData,
        };
      case CARD_DETAILS_FAILED:
        return {
          ...state,
          isLoading: action.isLoading,
          cardData: action.cardData,
        };






        case BANK_DETAILS:
          return {...state, isLoading: action.isLoading};
        case BANK_DETAILS_SUCCESS:
          return {
            ...state,
            isLoading: action.isLoading,
            bankData: action.bankData,
          };
        case BANK_DETAILS_FAILED:
          return {
            ...state,
            isLoading: action.isLoading,
            bankData: action.bankData,
          };








        case SAVE_BANK_DETAILS:
          return {...state, isLoading: action.isLoading};
        case SAVE_BANK_DETAILS_SUCCESS:
          return {
            ...state,
            isLoading: action.isLoading,
            bankDetailsSaveStatus: action.bankDetailsSaveStatus,
            bankMessage:action.bankMessage,
          };
        case SAVE_BANK_DETAILS_FAILED:
          return {
            ...state,
            isLoading: action.isLoading,
            bankDetailsSaveStatus: action.bankDetailsSaveStatus,
            bankMessage:action.bankMessage,
          };




      case DENIED_JOB:
        return {...state, isLoading: action.isLoading};
      case DENIED_JOB_SUCCESS:
        return {
          ...state,
          isLoading: action.isLoading,
          deniedData: action.deniedData,
        };
      case DENIED_JOB_FAILED:
        return {
          ...state,
          isLoading: action.isLoading,
          deniedData: action.deniedData,
        };






    case APPROVE_JOB:
      return {...state, isLoading: action.isLoading};
    case APPROVE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        approveData: action.approveData,
        approveMessage: action.approveMessage,
      };
    case APPROVE_JOB_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        approveData: action.approveData,
        approveMessage: action.approveMessage,
      };
    case APPROVE_JOB_MESSAGE:



    case ACCEPTAPPROVE_JOB:
      return {...state, isLoading: action.isLoading};
    case ACCEPTAPPROVE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        acceptapproveData: action.acceptapproveData,
        acceptapproveMessage: action.acceptapproveMessage,
      };
    case ACCEPTAPPROVE_JOB_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        acceptapproveData: action.acceptapproveData,
        acceptapproveMessage: action.acceptapproveMessage,
      };
    case ACCEPTAPPROVE_JOB_MESSAGE:



      return {...state, approveMessage: action.approveMessage};
    case GET_ALL_JOB:
      return {...state, isLoading: action.isLoading};
    case GET_ALL_JOB_SUCCESS:
      return {...state, isLoading: action.isLoading, userData: action.userData};
    case GET_ALL_JOB_FAILED:
      return {...state, isLoading: action.isLoading, userData: action.userData};
      case GET_JOB_SEARCH:
      return {...state, isLoading: action.isLoading};
    case GET_JOB_SEARCH_SUCCESS:
      return {...state, isLoading: action.isLoading, jobSearch: action.jobSearch};
    case GET_JOB_SEARCH_FAILED:
      return {...state, isLoading: action.isLoading, jobSearch: action.jobSearch};
    case GET_JOB_DETAILS:
      return {...state, isLoading: action.isLoading};
    case GET_JOB_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        jobDetails: action.payload,
      };
    case GET_JOB_DETAILS_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        jobDetails: action.payload,
      };
      case NOTIFICATION_READ: 
      return {...state, isLoading: action.isLoading}
      case NOTIFICATION_READ_SUCCESS: 
      return{
        ...state,
        isLoading: action.isLoading,
        notificationread: action.notificationread,
      }
      case NOTIFICATION_READ_FAILED:
        return{
          ...state,
          isLoading: action.isLoading,
          notificationread: action.notificationread
        }
        case NOTIFICATION_LIST: 
      return {...state, isLoading: action.isLoading}
      case NOTIFICATION_LIST_SUCCESS: 
      return{
        ...state,
        isLoading: action.isLoading,
        notificationList: action.notificationList,
      }
      case NOTIFICATION_LIST_FAILED:
        return{
          ...state,
          isLoading: action.isLoading,
          notificationList: action.notificationList
        }
    default:
      return {...state};
  }
};
