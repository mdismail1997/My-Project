 import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "https://nodeserver.mydevfactory.com:3310/"
 const register = baseUrl + "register";
 const login = baseUrl + "login";
 const Forgot_password = baseUrl + "forgot";
// const imgUrl = baseUrl + 'userProfile/'

// const storeData = async (key, value) => {
//     console.log("Storing ", key)
//     console.log("storing value: ",value)
//     try {
//         let data = await AsyncStorage.setItem(key, value)
//         return data
//     } catch (e) {
//         // saving error
//     }
// }

// const getData = async (key) => {
//     try {
//       let value = await AsyncStorage.getItem(key)
      
//       if(value !== null) {
//         // value previously stored
//         console.log('value: ', value)
//         return JSON.parse(value)
//       } else return "Value not set for " + key + " in localstorage"
//     } catch(e) {
//       // error reading value
//     }
//   }

//   const clearAsyncStore = async () => {
//       await AsyncStorage.clear(()=> {
//           console.log("All data cleared! Logout pls")
//       })

//   }

// const registerUser = (userData) => {
//     let data = { ...userData };
//     console.log("userType 111111: ", data)
    
    
//     // console.log("userType: ", data)
//     return data
// }

export {
    //registerUser,
    baseUrl,
    register,
    login,
    Forgot_password,
    //imgUrl,
    //storeData,
    //getData,
    //clearAsyncStore,
}