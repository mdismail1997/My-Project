import * as Keychain from 'react-native-keychain';

export const setUserToken = async (role: string, token: string) => {
  const setToken = await Keychain.setGenericPassword(role, token);
  if (setToken) {
    console.log('set token', setToken);
  } else {
    console.log('Token set failed');
  }
};

export const getUserToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      return credentials;
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

export const deleteUserToken = async () => {
  const isDeleted = await Keychain.resetGenericPassword();
  if (isDeleted) {
    console.log('Token deleted successfully');
  } else {
    console.log('Token deletion failed');
  }
};