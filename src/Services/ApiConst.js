export const BASE_URL = 'https://nodeserver.mydevfactory.com:6098/api/';
export const SOCKET_URL = 'https://nodeserver.mydevfactory.com:6098';

export const AUTH_URL = {
  login: 'users/user_login',
  signup: 'users/user_signup_app',
  forgotPassword: 'users/forgot-pass',
  verifyOtp: 'users/verify-otp/',
  resendOtp: 'users/resend-otp/',
  changePassword: 'users/change-my-password',
 // getAllUsers: 'users/newAllUsers',
 getAllUsers: 'users/allUsers',
 
  friends: 'users/friends',
  logout: 'users/logout',
};

export const HOME_URL = {
  category: 'jobs/categorylist',
  recentJobs: 'jobs/recentJobs',
  expertise: 'users/expertList',
  subCategory: 'jobs/subcategorylist/',
};

export const PROFILE_URL = {
  getProfile: 'users/get-your-profile',
  updateProfile: 'users/update-profile-app',
  addFriend: 'users/addFriend/',
  requestFriend: 'users/friendRequests',
  acceptRequest: 'users/acceptFriendRequest/',
  rejectRequest: 'users/rejectFriendRequest/'
};

export const JOB_URL = {
  createJob: 'jobs/create-web-job',
  getAlljob: 'jobs/get-all-jobs-user',
  getJObDetails: 'jobs/get-job-details-web/',
  applyJob: 'jobs/applyJob/',
  appliedJob: 'jobs/appliedApplications',
  receivedJob: 'jobs/receivedApplications',
  approveJob: 'jobs/change-job-offer-status/',
  notificationList: 'jobs/notificationlist/',
  notificationRead: 'jobs/notificationread/',
  jobSearch: 'jobs/allJobList?',

  
  offeredJob: 'jobs/receivedJobOffers',
  acceptedJob: 'jobs/get-accepted-job-applicant',
  acceptapproveJob: 'jobs/applicationApproval/',
  deniedJob: 'jobs/rejectJobOfferList',

  approvedJob: 'jobs/get-approved-list-by-employeer',
  jobStart :'jobs/start-job/',


  cardDetails:'bank/get_strip_customer_details',
  bankDetailsSave: 'bank/update_bank_details',
  bankDetails:'bank/get_strip_bank_details/',

  jobWorked:'jobs/get-my-worked-job',
  JobCreated :'jobs/getAllJobsByUserId',


};

export const CHAT_URL = {
  createChat: 'chat/createChat',
  sendMessage: 'chat/sendMessage',
  getChatHistory: 'chat/chatHistory',
  getChat: 'chat/chat/',
};
