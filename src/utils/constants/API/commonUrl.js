//Live URL
//export const BASE_URL = 'https://traders-platform.com/rest/V1/';
//STAGING_URL
export const BASE_URL =
  // 'https://magento.mydevfactory.com/backup_tradersplatform/rest/V1/';
  'https://traders-platform.com/rest/V1/';
//ADD PRODUCTS URL NEEDS TO CHANGE

//Live URL
//export const BASE_URL_PROFILE_PICTURE = 'https://traders-platform.com';
//STAGING_URL
export const BASE_URL_PROFILE_PICTURE =
  // 'https://magento.mydevfactory.com/backup_tradersplatform';
  'https://traders-platform.com/';

// export default {
//   registartion_STAGING: STAGING_URL + 'customers',
//   generateToken_STAGING: STAGING_URL + 'integration/customer/token',
//   forgot_password_STAGING: STAGING_URL + 'customers/password/',
//   customerDetails_STAGING: STAGING_URL + 'customers/me',
//   changePassword_STAGING: STAGING_URL + 'customers/me/password?customerId',
//   productlist_STAGING: STAGING_URL + 'products?searchCriteria=',
//   productSearch_STAGING: `${STAGING_URL}products/`,
//   addProduct_STAGING: STAGING_URL + 'products',
//   resetPassword_STAGING: `${STAGING_URL}customers/resetPassword`,
//   getOrderList_STAGING: `${STAGING_URL}orders?searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=`,
//   getSingleOrder_STAGING: `${STAGING_URL}orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=`,
// };

export const registartion = BASE_URL + 'customers';
export const SocialLogin = `${BASE_URL}registration`;
export const oneClickSocialLogin = `${BASE_URL}mpapi/customer/login`;
export const isSeller = `${BASE_URL}getselleremail`;
export const LoginWithSocial = `${BASE_URL}customers`;
export const generateToken = BASE_URL + 'integration/customer/token';
export const forgot_password = BASE_URL + 'customers/password/';
export const customerDetails = BASE_URL + 'customers/me';
export const changePassword = BASE_URL + 'customers/me/password?customerId';
export const productlist = BASE_URL + 'products?searchCriteria';

export const categories = `${BASE_URL}categories`;

export const activeProductList = `${BASE_URL}products?searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=1&searchCriteria[currentPage]=`;
export const inActiveProductList = `${BASE_URL}products?searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=2&searchCriteria[currentPage]=`;

export const productSearch = `${BASE_URL}products/`;
//Product list paginations
// //https://traders-platform.com/rest/all/V1/products?searchCriteria[currentPage]=3&searchCriteria[pageSize]=20
export const addProduct = BASE_URL + 'products';
export const assignSeller = `${BASE_URL}mpapi/sellers/me/assigproduct`;
export const addConfigProduct = `${BASE_URL}mpapi/sellers/me/configurableproduct`;

//export const addProduct = `https://magento.mydevfactory.com/backup_tradersplatform/rest/default/V1/products`;
export const resetPassword = `${BASE_URL}customers/resetPassword`;

//orders
export const getOrderList = `${BASE_URL}orders?searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=`;
export const getSingleOrder = `${BASE_URL}orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=`;
export const sellerOrders = `${BASE_URL}mpapi/sellers/me/orders?seller_id=`;

//getSellerOrders
export const getSellerOrders = `${BASE_URL}mpapi/sellers/me/productlist?seller_id=`;
export const getSellerOrderDetails = `${BASE_URL}orders/`;
//orderList
//https://traders-platform.com/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=000000093
//SingleOrder
//https://traders-platform.com/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=shanu.dhali@brainiuminfotech.com
//review
export const getProductReview = `${BASE_URL}products/`;
//color
export const getColors = `${BASE_URL}product/attribute/swatch?attributecode=color`;
export const getSizes = `${BASE_URL}products/attributes/size/options`;

//seller
//checkIfSeller
export const checkSellerValid = `${BASE_URL}sellerinfo`;

//PaymentDetails
export const customerCount = `${BASE_URL}mpapi/sellers/me/dashsellercustomerlist`;
export const dueWithdraw = `${BASE_URL}mpapi/sellers/me/transactionList`;
export const withdrawHistory = `${BASE_URL}mpapi/sellers/me/transactionhistory`;
export const orderRecieve = `${BASE_URL}mpapi/sellers/me/sellercustomerlist`;
export const vendorDetails = `${BASE_URL}mpapi/sellers/me/sellerinfo`;
export const sellerVerify = `${BASE_URL}mpapi/sellers/me/sellerverify`;
export const vendorCustomerAssign = `${BASE_URL}mpapi/sellers/me/becomeseller`;

export const TERMS_AND_CONDITIONS = `${BASE_URL}cmsPage/9`;
export const getSplashDescription = `${BASE_URL}cmsBlock/`;
