import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {BASE_URL_PROFILE_PICTURE} from './API/commonUrl.js';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const fSize = size => RFValue(size);

export const calcH = heightInPixel => {
  return screenHeight * heightInPixel;
};

export const calcW = widthInPixel => {
  return screenWidth * widthInPixel;
};

export const STYLES = {
  PRIMARY_COLOR: '#000000', //black
  ORDER_COLOR: '#4F4F54',
  HEADER_COLOR: '#47474B', //
  SUB_HEADER_COLOR: '#828287',
  SECONDARY_COLOR: '#FF141D', // red
  THIRD_COLOR: '#FFFFFF', // white
  FOUR_COLO: '#F2F2F2', // gray
  FIVE_COLOR: '#191919',
  SIX_COLOR: '#555555',
  SIVEN_COLOR: '#4b4b52', //Dark Gray
  EIGHT_COLOR: '#C0C0C0', //Silver (W3C)
};

export const STORAGE_KEY = {
  CUSTOMER_TOKEN: 'vendorToken',
  CUSTOMER_ID: 'vendorID',
  CUSTOMER_DETAILS: 'vendorDetails',
  CATEGORY: 'category',
  COLORS: 'colors',
  SIZES: 'sizes',
  isSeller: 'isSeller',
  isUploaded: 'isUploaded',
  // QUOTE_ID: 'quote_id'
};

export const API_TOKEN = {
  ACCESS_TOKEN:'xdd48grne8e5keewy39cncxue0w0nhb4',
  //ACCESS_TOKEN: 'rnjnvbweyckmjboqxfm7zpsqarkar0op',
};

export const IMAGE_PATH = {
  //CUSTOMER_PROFILE_PATH: `${BASE_URL_PROFILE_PICTURE}/pub/media/customer`,
  CUSTOMER_PROFILE_PATH: `https://traders-platform.com/pub/media/customer`,
  PRODUCT_PATH: `${BASE_URL_PROFILE_PICTURE}/pub/media/catalog/product`,
  VENDOR_DETAILS: `https://traders-platform.com/pub/media/avatar/`,
};
//uae regex
export const phoneRegExp =
  /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;

// normal 10digit regex
// /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const passwordRegExp =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// export const businessURLRegExp =
//   /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const businessURLRegExp =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
