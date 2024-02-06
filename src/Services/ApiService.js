/**
 * API services file
 */
import React, { useContext } from 'react';
import ProfileContext from './ProfileProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, View, Text } from 'react-native';
import { getUserToken } from '../utils/DataStore';

import {
  AUTH_URL,
  BASE_URL,
  CHAT_URL,
  HOME_URL,
  JOB_URL,
  PROFILE_URL,
} from './ApiConst';

// MAP API KEY
const MAP_API_KEY = 'AIzaSyBgKrxFqmVtcFtiPBFcN1kHQW93iPL355A';
const getToken = async () => {
  let data = await getUserToken();
  console.log('token key', data);
  return data;
};

// Common Header
const headers = {
  'Content-Type': 'application/json',
};
// Instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers,
  timeout: 30000,
});

// Login API
export const loginAPI = async requestBody => {
  try {
    const res = await axiosInstance.post(AUTH_URL.login, requestBody);
    return res.data;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};
export const ChangePasswordAPI = async requestBody => {
  try {
    const res = await axiosInstance.post(AUTH_URL.changePassword, requestBody, {
      headers: {
        headers,
        'x-access-token': await getToken(),
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// Signup API
export const signUpAPI = async requestBody => {
  try {
    const res = await axiosInstance.post(AUTH_URL.signup, requestBody);

    return res.data;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

// Verify OTP
export const verifyOtpAPI = async (otp, userId) => {
  try {
    const res = await axiosInstance.get(
      AUTH_URL.verifyOtp + otp + '/' + userId,
    );
    return res.data;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

// Resend OTP
export const resendOtpAPI = async userId => {
  try {
    const res = await axiosInstance.get(AUTH_URL.resendOtp + userId);
    return res.data;
  } catch (error) {
    return error;
  }
};

// Forgot password
export const forgotPasswordAPI = async requestBody => {
  try {
    const res = await axiosInstance.post(AUTH_URL.forgotPassword, requestBody);
    return res.data;
  } catch (error) {
    return error;
  }
};
// ChangePassword

// Category List
export const getCategoryList = async () => {
  try {
    const res = await axiosInstance.get(HOME_URL.category);
    return res.data;
  } catch (error) {
    return error;
  }
};

// Sub category list
export const getSubCategoryList = async catId => {
  try {
    const res = await axiosInstance.get(HOME_URL.subCategory + catId);
    return res.data;
  } catch (error) {
    return error;
  }
};

// Recent job API
export const getRecentJobs = async () => {
  try {
    const res = await axiosInstance.get(HOME_URL.recentJobs);
    return res.data;
  } catch (error) {
    return error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const res = await axiosInstance.get(PROFILE_URL.getProfile, {
      headers: {
        ...headers,
        'x-access-token': await getToken(),
      },
    });

    return res.data;
  } catch (error) {
    console.log('api error: ', error);
    return error;
  }
};

export const getFriendList = async () => {
  try {
    const res = await axiosInstance.get(AUTH_URL.friends, {
      headers: {
        ...headers,
        'x-access-token': await getToken(),
      },
    });
    console.log("friendList", res.data);
    return res.data;
  } catch (error) {
    console.log('api error: ', error);
    return error;
  }
};

export const friendRequest = async () => {
  try {
    const res = await axiosInstance.get(PROFILE_URL.requestFriend, {
      headers: {
        ...headers,
        'x-access-token': await getToken(),
      },
    });
    console.log("friendRequest", res.data);
    return res.data;
  } catch (error) {
    console.log('api error: ', error);
    return error;
  }
};

export const acceptFriend = async (id) => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.patch(PROFILE_URL.acceptRequest + id);
    console.log("friendRequest accept", res.data);
    return res.data;
  } catch (error) {
    console.log('api error accept: ', error);
    return error;
  }
};

export const rejectFriend = async (id) => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.patch(PROFILE_URL.rejectRequest + id);
    console.log("friendRequest reject", res.data);
    return res.data;
  } catch (error) {
    console.log('api error reject: ', error);
    return error;
  }
};

export const inviteFriend = async (id) => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.patch(PROFILE_URL.addFriend + id);
    console.log("friendList", res.data);
    return res.data;
  } catch (error) {
    console.log('api error: ', JSON.stringify(error));
    return error;
  }
};

export const updateUserProfile = async requestBody => {
  try {
    const res = await axiosInstance.put(
      PROFILE_URL.updateProfile,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      },
    );
    console.log('res ', res.data);

    return res.data;
  } catch (error) {
    console.log('API error ', error);
    return error;
  }
};

// Get expertise list
export const getExpertiseApi = async () => {
  try {
    const res = await axiosInstance.get(HOME_URL.expertise, {
      ...headers,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get(AUTH_URL.getAllUsers, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('All users', res.data);
    return res.data;
  } catch (error) {
    console.error('all users error', error);
    return error;
  }
};

export const createJobs = async requestBody => {
  try {
    const res = await axiosInstance.post(JOB_URL.createJob, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('res Create', res.data);
    // Alert.alert(res.data.message);
    return res.data;
  } catch (error) {
    console.log('API error ', error);
    return error;
  }
};
export const applyJob = async (id, requestBody) => {
  try {
    const res = await axiosInstance.post(JOB_URL.applyJob + id, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('apply Job', res.data);
    return res.data;
  } catch (error) {
    console.log('Apply error', JSON.stringify(error));
    return error;
  }
};

export const appliedJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.appliedJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('Applied job', res.data);
    return res.data;
  } catch (error) {
    console.log('Applied error', error);
    return error;
  }
};


export const offeredJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.offeredJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('Offered Job', res.data);
    return res.data;
  } catch (error) {
    console.log('Offered Job error', error);
    return error;
  }
};

export const approvedJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.approvedJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('Approved Job', res.data);
    return res.data;
  } catch (error) {
    console.log('ApprovedJob error', error);
    return error;
  }
};







export const startJob = async (id) => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.patch(JOB_URL.jobStart + id);
    console.log('Start job', res.data);
    return res.data;
  } catch (error) {
    console.log('start job error', JSON.stringify(error));
    return error;
  }
};









export const acceptedJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.acceptedJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('accepted Job', res.data);
    return res.data;
  } catch (error) {
    console.log('accepted Job error', error);
    return error;
  }
};



export const deniedJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.deniedJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('Denied Job', res.data);
    return res.data;
  } catch (error) {
    console.log('denied Job error', error);
    return error;
  }
};






export const receivedJob = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.receivedJob, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('Received job', res.data);
    return res.data;
  } catch (error) {
    console.log('Received error', error);
    return error;
  }
};

export const approveJob = async (id, status) => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.patch(JOB_URL.approveJob + id + '/' + status);
    console.log('approve job', res.data);
    return res.data;
  } catch (error) {
    console.log('approve error', JSON.stringify(error));
    return error;
  }
};


export const acceptapproveJob = async (id, status) => {
  //console.log("?????????????????????",id)
   // console.log("?????????????????????",status)
    const log = await axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
      timeout: 30000,
    });
    try {
      const res = await log.patch(JOB_URL.acceptapproveJob + id + '/' + status);
      console.log('acceptapprove job', res.data);
      return res.data;
    } catch (error) {
      console.log('acceptapprove error', JSON.stringify(error));
      return error;
    }
  };





  export const workedJob = async () => {
    try {
      const res = await axiosInstance.get(JOB_URL.jobWorked, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      });
      console.log('Worked job', res.data);
      return res.data;
    } catch (error) {
      console.log('Worked error', error);
      return error;
    }
  };



  export const createdJob = async () => {
    try {
      const res = await axiosInstance.get(JOB_URL.JobCreated, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      });
      console.log('Created job>>>', res.data);
      return res.data;
    } catch (error) {
      console.log('Created job error>>>', error);
      return error;
    }
  };





  export const getcardDetails = async () => {
    try {
      const res = await axiosInstance.get(JOB_URL.cardDetails, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      });
      console.log('Card Details', res.data);
      return res.data;
    } catch (error) {
      console.log('Card Details', error);
      return error;
    }
  };





  export const getbankDetails = async () => {
    try {
      const res = await axiosInstance.get(JOB_URL.bankDetails, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      });
      console.log('Bank Details', res.data);
      return res.data;
    } catch (error) {
      console.log('Bank Details', error);
      return error;
    }
  };




  export const bankDetailsApi = async requestBody => {
    try {
      const res = await axiosInstance.post(JOB_URL.bankDetailsSave, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': await getToken(),
        },
      });
      console.log('res Save bank details', res.data);
      // Alert.alert(res.data.message);
      return res.data;
    } catch (error) {
      console.log('Save bank details API error ', error);
      return error;
    }
  };








export const getAllJobApi = async () => {
  try {
    const res = await axiosInstance.get(JOB_URL.getAlljob, {
      headers: {
        ...headers,
        'x-access-token': await getToken(),
      },
    });
   // console.log('all job res', res);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getJobSearch = async (data) => {
  // console.log("????????????????",JOB_URL.jobSearch,`page=${data.page}&&limit=${data.limit}&&userId=${data.userId}&&distance=${data.distance}&&lat=${data.lat}&&long=${data.long}`)

  try {
    const res = await axiosInstance.get(JOB_URL.jobSearch + `page=${data.page}&limit=${data.limit}&userId=${data.userId}&distance=${data.distance}&lat=${data.lat}&long=${data.long}`, {
      headers: {
        ...headers,
        'x-access-token': await getToken(),
      },
    });
   // console.log('all job res', res.data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getJobDetails = async id => {
  try {
    const res = await axiosInstance.get(JOB_URL.getJObDetails + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('job details res', res);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const notificationList = async id => {
  try {
    const res = await axiosInstance.get(JOB_URL.notificationList + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    })
    console.log("Notification list", res.data);
    return res.data
  } catch (error) {
    return error
  }
}
export const notificationRead = async id => {
  try {
    const res = await axiosInstance.put(JOB_URL.notificationRead + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    })
    console.log("Notification read", res.data);
    return res.data
  } catch (error) {
    return error
  }
}

export const createChat = async requestBody => {
  try {
    const res = await axiosInstance.post(CHAT_URL.createChat, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('res Create message', res.data);
    return res.data;
  } catch (error) {
    console.log('res Create message error', error);
    return error;
  }
};

export const sendMessage = async data => {
  try {
    const res = await axiosInstance.post(CHAT_URL.sendMessage, data);
    console.log('res send Message', res);
    return res;
  } catch (error) {
    console.log('res Send message error', error);
    return error;
  }
};

export const chatHistory = async () => {
  try {
    const res = await axiosInstance.get(CHAT_URL.getChatHistory, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('res Chat history', res.data);
    return res.data;
  } catch (error) {
    console.log('res chat history error', error);
    return error;
  }
};

export const getChat = async chatId => {
  try {
    const res = await axiosInstance.get(CHAT_URL.getChat + chatId, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await getToken(),
      },
    });
    console.log('res chat', res);
    return res;
  } catch (error) {
    console.log('res Chat', error);
    return error;
  }
};
export const logoutAPI = async props => {
  const log = await axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': await getToken(),
    },
    timeout: 30000,
  });
  try {
    const res = await log.post(AUTH_URL.logout);

    console.log('response logout: ', res);

    AsyncStorage.clear();
    // profileContext.setIsLogin(false);
    // props.navigation.navigate('AuthStack', {
    //   screen: 'LogIn',
    // });
    // if (!Auth.loginSuccess) {
    //     props.navigation.navigate('LogIn');
    //     // setLogin();
    // }
    return res.data;
  } catch (error) {
    console.log('Error: ', JSON.stringify(error));

    return error;
  }
};
