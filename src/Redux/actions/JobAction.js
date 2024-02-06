import {
  appliedJob,
  offeredJob,
  approvedJob,
  acceptedJob,
  deniedJob,
  applyJob,
  approveJob,
  acceptapproveJob,
  createJobs,
  getAllJobApi,
  getJobDetails,
  getJobSearch,
  notificationList,
  notificationRead,
  receivedJob,
  getcardDetails,
  getbankDetails,
  workedJob,
  bankDetailsApi,
  createdJob,
  startJob,
} from '../../Services/ApiService';
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
  DENIED_JOB,
  DENIED_JOB_SUCCESS,
  DENIED_JOB_FAILED,
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
} from './types';

export const createJobAction = data => {
  return async dispatch => {
    dispatch({type: CREATE_JOB, isLoading: true});
    try {
      const response = await createJobs(data);
      if (response.success) {
        onCreateJobSuccess(dispatch, response);
      } else {
        onCreateJobFailed(dispatch, response);
      }
    } catch (error) {
      onCreateJobFailed(dispatch, error);
    }
  };
};

const onCreateJobSuccess = (dispatch, response) => {
  dispatch({
    type: CREATE_JOB_SUCCESS,
    createMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};
const onCreateJobFailed = (dispatch, response) => {
  dispatch({
    type: CREATE_JOB_FAILED,
    createMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};
export const clearCreateJobMessageAction = () => {
  return async dispatch => {
    dispatch({type: CLEAR_JOB_MESSAGE, createMessage: ''});
  };
};

export const applyJobAction = (id, data) => {
  return async dispatch => {
    dispatch({type: APPLY_JOB, isLoading: true});
    try {
      const response = await applyJob(id, data);
      if (response.success) {
        onApplyJobSuccess(dispatch, response);
      } else {
        onApplyJobFailed(dispatch, response);
      }
    } catch (error) {
      onApplyJobFailed(dispatch, error);
    }
  };
};
const onApplyJobSuccess = (dispatch, response) => {
  dispatch({
    type: APPLY_JOB_SUCCESS,
    applyMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};
const onApplyJobFailed = (dispatch, response) => {
  dispatch({
    type: APPLY_JOB_FAILED,
    applyMessage: response.message,
    userData: response.data,
    isLoading: false,
  });
};
export const clearApplyJobMessageAction = () => {
  return async dispatch => {
    dispatch({type: APPLY_JOB_MESSAGE, applyMessage: ''});
  };
};

export const appliedJobAction = () => {
  return async dispatch => {
    dispatch({type: APPLIED_JOB, isLoading: true});
    try {
      const response = await appliedJob();
      if (response.success) {
        onAppliedJobSuccess(dispatch, response);
      } else {
        onAppliedJobFailed(dispatch, response);
      }
    } catch (error) {
      onAppliedJobFailed(dispatch, error);
    }
  };
};

const onAppliedJobSuccess = (dispatch, response) => {
  dispatch({
    type: APPLIED_JOB_SUCCESS,
    appliedData: response.data,
    isLoading: false,
  });
};
const onAppliedJobFailed = (dispatch, response) => {
  dispatch({
    type: APPLIED_JOB_FAILED,
    appliedData: response.data,
    isLoading: false,
  });
};





export const offeredJobAction = () => {
  return async dispatch => {
    dispatch({type: OFFERED_JOB, isLoading: true});
    try {
      const response = await offeredJob();
      if (response.success) {
        onOfferedJobSuccess(dispatch, response);
      } else {
        onOfferedJobFailed(dispatch, response);
      }
    } catch (error) {
      onOfferedJobFailed(dispatch, error);
    }
  };
};

const onOfferedJobSuccess = (dispatch, response) => {
  dispatch({
    type: OFFERED_JOB_SUCCESS,
    offeredData: response.data,
    isLoading: false,
  });
};
const onOfferedJobFailed = (dispatch, response) => {
  dispatch({
    type: OFFERED_JOB_FAILED,
    offeredData: response.data,
    isLoading: false,
  });
};



export const approvedJobAction = () => {
  return async dispatch => {
    dispatch({type: APPROVED_JOB, isLoading: true});
    try {
      const response = await approvedJob();
      if (response.success) {
        onApprovedJobSuccess(dispatch, response);
      } else {
        onApprovedJobFailed(dispatch, response);
      }
    } catch (error) {
      onApprovedJobFailed(dispatch, error);
    }
  };
};

const onApprovedJobSuccess = (dispatch, response) => {
  dispatch({
    type: APPROVED_JOB_SUCCESS,
    approvedData: response.data,
    isLoading: false,
  });
};
const onApprovedJobFailed = (dispatch, response) => {
  dispatch({
    type: APPROVED_JOB_FAILED,
    approvedData: response.data,
    isLoading: false,
  });
};









export const acceptedJobAction = () => {
  return async dispatch => {
    dispatch({type: ACCEPTED_JOB, isLoading: true});
    try {
      const response = await acceptedJob();
      if (response.success) {
        onAcceptedJobSuccess(dispatch, response);
      } else {
        onAcceptedJobFailed(dispatch, response);
      }
    } catch (error) {
      onAcceptedJobFailed(dispatch, error);
    }
  };
};

const onAcceptedJobSuccess = (dispatch, response) => {
  dispatch({
    type: ACCEPTED_JOB_SUCCESS,
    acceptedData: response.data,
    isLoading: false,
  });
};
const onAcceptedJobFailed = (dispatch, response) => {
  dispatch({
    type: ACCEPTED_JOB_FAILED,
    acceptedData: response.data,
    isLoading: false,
  });
};








export const receivedJobAction = () => {
  return async dispatch => {
    dispatch({type: RECEIVED_JOB, isLoading: true});
    try {
      const response = await receivedJob();
      if (response.success) {
        onReceivedJobSuccess(dispatch, response);
      } else {
        onReceivedJobFailed(dispatch, response);
      }
    } catch (error) {
      onReceivedJobFailed(dispatch, error);
    }
  };
};

const onReceivedJobSuccess = (dispatch, response) => {
  dispatch({
    type: RECEIVED_JOB_SUCCESS,
    receivedData: response.data,
    isLoading: false,
  });
};
const onReceivedJobFailed = (dispatch, response) => {
  dispatch({
    type: RECEIVED_JOB_FAILED,
    receivedData: response.data,
    isLoading: false,
  });
};





export const workedJobAction = () => {
  return async dispatch => {
    dispatch({type: JOB_WORKED, isLoading: true});
    try {
      const response = await workedJob();
      if (response.success) {
        onWorkedJobSuccess(dispatch, response);
      } else {
        onWorkedJobFailed(dispatch, response);
      }
    } catch (error) {
      onWorkedJobFailed(dispatch, error);
    }
  };
};

const onWorkedJobSuccess = (dispatch, response) => {
  dispatch({
    type: JOB_WORKED_SUCCESS,
    workedData: response.data,
    isLoading: false,
  });
};
const onWorkedJobFailed = (dispatch, response) => {
  dispatch({
    type: JOB_WORKED_FAILED,
    workedData: response.data,
    isLoading: false,
  });
};




export const createdJobAction = () => {
  return async dispatch => {
    dispatch({type: JOB_CREATED, isLoading: true});
    try {
      const response = await createdJob();
      if (response.success) {
        onCreatedJobSuccess(dispatch, response);
      } else {
        onCreatedJobFailed(dispatch, response);
      }
    } catch (error) {
      onCreatedJobFailed(dispatch, error);
    }
  };
};

const onCreatedJobSuccess = (dispatch, response) => {
  dispatch({
    type: JOB_CREATED_SUCCESS,
    createdData: response.data,
    isLoading: false,
  });
};
const onCreatedJobFailed = (dispatch, response) => {
  dispatch({
    type: JOB_CREATED_FAILED,
    createdData: response.data,
    isLoading: false,
  });
};








export const cardDetailsAction = () => {
  return async dispatch => {
    dispatch({type: CARD_DETAILS, isLoading: true});
    try {
      const response = await getcardDetails();
      if (response.success) {
        console.log("7777777777",response)
        onCardSuccess(dispatch, response);
      } else {
        onCardFailed(dispatch, response);
        console.log("Failed 7777777777",response)
      }
    } catch (error) {
      onCardFailed(dispatch, error);
      console.log("error 7777777777",error)
    }
  };
};

const onCardSuccess = (dispatch, response) => {
  dispatch({
    type: CARD_DETAILS_SUCCESS,
    cardData: response.data,
    isLoading: false,
  });
};
const onCardFailed = (dispatch, response) => {
  dispatch({
    type: CARD_DETAILS_FAILED,
    cardData: response.data,
    isLoading: false,
  });
};






export const bankDetailsAction = () => {
  return async dispatch => {
    dispatch({type: BANK_DETAILS, isLoading: true});
    try {
      const response = await getbankDetails();
      if (response.success) {
         console.log("BANK DETAILS",response)
        onBankSuccess(dispatch, response);
      } else {
        onBankFailed(dispatch, response);
         console.log("BANK DETAILS2",response)
      }
    } catch (error) {
      onBankFailed(dispatch, error);
       console.log("BANK DETAILS3",error)
    }
  };
};

const onBankSuccess = (dispatch, response) => {
  dispatch({
    type: BANK_DETAILS_SUCCESS,
    bankData: response.data,
    isLoading: false,
  });
};
const onBankFailed = (dispatch, response) => {
  dispatch({
    type: BANK_DETAILS_FAILED,
    bankData: response.data,
    isLoading: false,
  });
};





export const bankDetailsSaveAction = data => {
  return async dispatch => {
    dispatch({type: SAVE_BANK_DETAILS, isLoading: true});
    try {
      const response = await bankDetailsApi(data);
      if (response.success) {
        console.log("rrrrresssssssssspo",response)
        onbankDetailsSaveActionSuccess(dispatch, response);
      } else {
        onbankDetailsSaveActionFailed(dispatch, response);
      }
    } catch (error) {
      onbankDetailsSaveActionFailed(dispatch, error);
    }
  };
};

const onbankDetailsSaveActionSuccess = (dispatch, response) => {
  dispatch({
    type: SAVE_BANK_DETAILS_SUCCESS,
    bankDetailsSaveStatus: response.data,
    bankMessage: data.bankMessage,
    isLoading: false,
  });
};

const onbankDetailsSaveActionFailed = (dispatch, response) => {
  dispatch({
    type: SAVE_BANK_DETAILS_FAILED,
    bankDetailsSaveStatus: response.data,
    bankMessage: data.bankMessage,
    isLoading: false,
  });
};









export const deniedJobAction = () => {
  return async dispatch => {
    dispatch({type: DENIED_JOB, isLoading: true});
    try {
      const response = await deniedJob();
      if (response.success) {
        ondeniedJobSuccess(dispatch, response);
      } else {
        ondeniedJobFailed(dispatch, response);
      }
    } catch (error) {
      ondeniedJobFailed(dispatch, error);
    }
  };
};

const ondeniedJobSuccess = (dispatch, response) => {
  dispatch({
    type: DENIED_JOB_SUCCESS,
    deniedData: response.data,
    isLoading: false,
  });
};
const ondeniedJobFailed = (dispatch, response) => {
  dispatch({
    type: DENIED_JOB_FAILED,
    deniedData: response.data,
    isLoading: false,
  });
};



export const approveJobAction = (id, status) => {
  return async dispatch => {
    dispatch({type: APPROVE_JOB, isLoading: true});
    try {
      const response = await approveJob(id, status);
      if (response.success) {
        onApproveJobSuccess(dispatch, response);
      } else {
        onApproveJobFailed(dispatch, response);
      }
    } catch (error) {
      onApproveJobFailed(dispatch, error);
    }
  };
};

const onApproveJobSuccess = (dispatch, response) => {
  dispatch({
    type: APPROVE_JOB_SUCCESS,
    approveData: response.data,
    approveMessage: response.message,
    isLoading: false,
  });
};
const onApproveJobFailed = (dispatch, response) => {
  dispatch({
    type: APPROVE_JOB_FAILED,
    approveData: response.data,
    approveMessage: response.message,
    isLoading: false,
  });
};
export const clearApproveJobMessageAction = () => {
  return async dispatch => {
    dispatch({type: APPROVE_JOB_MESSAGE, approveMessage: ''});
  };
};




export const acceptapproveJobAction = (id, status) => {
  return async dispatch => {
    dispatch({type: ACCEPTAPPROVE_JOB, isLoading: true});
    try {
      const response = await acceptapproveJob(id, status);
      if (response.success) {
        onacceptApproveJobSuccess(dispatch, response);
      } else {
        onacceptApproveJobFailed(dispatch, response);
      }
    } catch (error) {
      onacceptApproveJobFailed(dispatch, error);
    }
  };
};

const onacceptApproveJobSuccess = (dispatch, response) => {
  dispatch({
    type: ACCEPTAPPROVE_JOB_SUCCESS,
    acceptapproveData: response.data,
    acceptapproveMessage: response.message,
    isLoading: false,
  });
};
const onacceptApproveJobFailed = (dispatch, response) => {
  dispatch({
    type: ACCEPTAPPROVE_JOB_FAILED,
    acceptapproveData: response.data,
    acceptapproveMessage: response.message,
    isLoading: false,
  });
};
export const clearacceptApproveJobMessageAction = () => {
  return async dispatch => {
    dispatch({type: ACCEPTAPPROVE_JOB_MESSAGE, acceptapproveMessage: ''});
  };
};




export const startJobAction = (id) => {
  return async dispatch => {
    dispatch({type: START_JOB, isLoading: true});
    try {
      const response = await startJob(id);
      if (response.success) {
        startJobSuccess(dispatch, response);
      } else {
        startJobFailed(dispatch, response);
      }
    } catch (error) {
      startJobFailed(dispatch, error);
    }
  };
};

const startJobSuccess = (dispatch, response) => {
  dispatch({
    type: START_JOB_SUCCESS,
    startjobData: response.data,
    startjobMessage: response.message,
    isLoading: false,
  });
};
const startJobFailed = (dispatch, response) => {
  dispatch({
    type: START_JOB_FAILED,
    startjobData: response.data,
    startjobMessage: response.message,
    isLoading: false,
  });
};
export const startJobMessageAction = () => {
  return async dispatch => {
    dispatch({type: START_JOB_MESSAGE, startjobMessage: ''});
  };
};







export const getAlljobAction = () => {
  return async dispatch => {
    dispatch({type: GET_ALL_JOB, isLoading: true});
    const response = await getAllJobApi();
    try {
      if (response.success) {
        getAllJobSuccess(dispatch, response);
      } else {
        getAlljobFailed(dispatch, response);
      }
    } catch (error) {
      getAlljobFailed(dispatch, error);
    }
  };
};

const getAllJobSuccess = (dispatch, response) => {
  dispatch({
    type: GET_ALL_JOB_SUCCESS,
    isLoading: false,
    userData: response,
  });
};

const getAlljobFailed = (dispatch, response) => {
  dispatch({
    type: GET_ALL_JOB_FAILED,
    isLoading: false,
    userData: response,
  });
};

export const getjobSearchAction = (data) => {
  // console.log("777777777777777777777777777777777",data)
  return async dispatch => {
    dispatch({type: GET_JOB_SEARCH, isLoading: true});
    const response = await getJobSearch(data);
    try {
      if (response.success) {
        getJobSearchSuccess(dispatch, response);
      } else {
        getjobSearchFailed(dispatch, response);
      }
    } catch (error) {
      getjobSearchFailed(dispatch, error);
    }
  };
};

const getJobSearchSuccess = (dispatch, response) => {
  dispatch({
    type: GET_JOB_SEARCH_SUCCESS,
    isLoading: false,
    jobSearch: response,
  });
};

const getjobSearchFailed = (dispatch, response) => {
  dispatch({
    type: GET_JOB_SEARCH_FAILED,
    isLoading: false,
    jobSearch: response,
  });
};

export const getJobDetailsAction = id => {
  return async dispatch => {
    dispatch({type: GET_JOB_DETAILS, isLoading: true});
    const response = await getJobDetails(id);
    try {
      if (response.success) {
        getJobDetailsSuccess(dispatch, response);
      } else {
        getjobDetailsFailed(dispatch, response);
      }
    } catch (error) {
      getjobDetailsFailed(dispatch, error);
    }
  };
};

const getJobDetailsSuccess = (dispatch, response) => {
  dispatch({
    type: GET_JOB_DETAILS_SUCCESS,
    isLoading: false,
    userData: response,
  });
};

const getjobDetailsFailed = (dispatch, response) => {
  dispatch({
    type: GET_JOB_DETAILS_FAILED,
    isLoading: false,
    userData: response,
  });
};

export const notificationReadAction = data => {
return async dispatch => {
  dispatch({type: NOTIFICATION_READ, isLoading: true})
  try {
    const response = await notificationRead(data)
    if(response.success){
      onnotificationReadSuccess(dispatch, response)
    }else{
      onnotificationReadFailed(dispatch, response)
    }
  } catch (error) {
    onnotificationReadFailed(dispatch, error)
  }
}
}

const onnotificationReadSuccess = (dispatch, response) => {
  dispatch({
    type: NOTIFICATION_READ_SUCCESS,
    notificationread: response,
    isLoading: false,
  })
}

const onnotificationReadFailed = (dispatch, response) => {
  dispatch({
    type: NOTIFICATION_READ_FAILED,
    notificationread: response,
    isLoading: false
  })
}

export const notificationListAction = data => {
  return async dispatch => {
    dispatch({type: NOTIFICATION_LIST, isLoading: true})
    try {
      const response = await notificationList(data)
      if(response.success){
        onnotificationListSuccess(dispatch, response)
      }else{
        onnotificationListFailed(dispatch, response)
      }
    } catch (error) {
      onnotificationListFailed(dispatch, error)
    }
  }
  }
  
  const onnotificationListSuccess = (dispatch, response) => {
    dispatch({
      type: NOTIFICATION_LIST_SUCCESS,
      notificationList: response,
      isLoading: false,
    })
  }
  
  const onnotificationListFailed = (dispatch, response) => {
    dispatch({
      type: NOTIFICATION_LIST_FAILED,
      notificationList: response,
      isLoading: false
    })
  }