// import React, {useState} from 'react';
// import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
// import {useTheme, Avatar, Title, Drawer} from 'react-native-paper';
// import {DrawerContentScrollView} from '@react-navigation/drawer';

// import {AuthContext} from '../components/context';
// import {calcH, calcW, fSize, STORAGE_KEY} from '../../utils/constants/common';
// import strings from '../components/lng/LocalizedStrings';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {createGet} from '../../utils/constants/API/ServerRequest';
// import * as commonUrl from '../../utils/constants/API/commonUrl';
// import DrawerData from '../../conts/Data.js';

// import * as icons from '../../conts/icons.js';
// import COLORS from '../../conts/colors.js';
// import {FONTS} from '../../conts/theme.js';
// import Separator from '../components/Separator.js';
// import AppImage from '../components/AppImage.js';

// export function DrawerContent(props) {
//   const [active, setActive] = React.useState('');
//   const paperTheme = useTheme();
//   const {signOut, toggleTheme} = React.useContext(AuthContext);
//   const [name, setName] = useState('');
//   const [profileImg, setProfileImg] = useState('');
//   const [customerId, setCustomerId] = useState('');
//   const [userData, setUserData] = useState({});

//   React.useEffect(() => {
//     getUserDetails();
//   }, []);

//   // const getUserDetails = async () => {
//   //   try {
//   //     let result = await createGet({
//   //       tokenType: 'self',
//   //       url: commonUrl.customerDetails,
//   //     });
//   //     if (result) {
//   //       console.log('Profile data ==> ', result.data);
//   //       //setCustomerId(result.data?.id);
//   //       setName(result.data?.firstname);
//   //       result.data?.custom_attributes.map(item => {
//   //         if (item?.attribute_code == 'avatar') {
//   //           setProfileImg(item?.value);
//   //         }
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.log('Profile error ==> ', error);
//   //   }
//   // };

//   const getUserDetails = async () => {
//     const data = JSON.parse(
//       await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_DETAILS),
//     );
//     setUserData(data);
//     //console.log('data---', data);
//   };

//   console.log('userData', userData);
//   const onPress = item => {
//     if (item.id !== 'logout') {
//       props.navigation.navigate(item.route);
//       props.navigation.closeDrawer();
//     }
//     if (item.id === 'password') {
//       props.navigation.navigate(item.route, {customerId: userData?.id});
//       props.navigation.closeDrawer();
//     } else {
//       // write logout logic here
//       signOut();
//     }
//     setActive(item.id);
//   };

//   const renderItemIcon = item => (
//     <Avatar.Icon
//       icon={item.iconUri}
//       size={calcW(0.09)}
//       //color={active === item.id ? COLORS.white : COLORS.black}
//       style={{
//         backgroundColor: COLORS.header_color,
//         //left: calcW(0.03),
//         //borderWidth: active === item.id ? 0 : 0.5,
//       }}
//     />
//   );

//   const renderDrawerItem = item => {
//     return (
//       <Drawer.Item
//         icon={() => renderItemIcon(item)}
//         style={{
//           flex: 1,
//           backgroundColor: COLORS.header_color,
//           //width: '100%',
//           //borderWidth: 1,
//           //left: calcW(0.03),
//         }}
//         theme={{
//           colors: {
//             //primary: COLORS.white,
//           },
//         }}
//         key={item.id}
//         //labelStyle={styles.label}
//         label={
//           <View>
//             <Text style={[{color: COLORS.white, ...FONTS.WorkSans_reg}]}>
//               {item.label}
//             </Text>
//           </View>
//         }
//         active={active === item.id}
//         onPress={() => onPress(item)}
//       />
//     );
//   };

//   const capitalizeFirstLetter = string => {
//     return string?.charAt(0)?.toUpperCase() + string?.slice(1);
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: COLORS.header_color}}>
//       <DrawerContentScrollView {...props}>
//         <View style={styles.drawerContent}>
//           <View style={[styles.userInfoSection]}>
//             <TouchableWithoutFeedback
//               onPress={() => props.navigation.navigate('Profile')}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   marginTop: calcH(0.05),
//                   //borderWidth: 1,
//                   left: calcW(0.03),
//                 }}>
//                 {profileImg == '' ? (
//                   // <Icon name="home-outline" color="#fff" size={20} />
//                   <AppImage source={icons.user} size={calcH(0.05)} />
//                 ) : (
//                   <Avatar.Image
//                     source={{
//                       uri: `https://traders-platform.com/pub/media/customer${profileImg}`,
//                     }}
//                     size={calcH(0.06)}
//                   />
//                 )}
//                 <View style={styles.greetingContainer}>
//                   <Text style={styles.title}>
//                     {strings.HI},{' '}
//                     {`${capitalizeFirstLetter(userData?.firstname)}`}
//                   </Text>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//             {/* <View style={{marginTop: calcW(0.05), marginRight: calcW(0.03)}}>
//               <View style={{flex: 1, height: 1, backgroundColor: '#616163'}} />
//             </View> */}

//             <Separator width="90%" />
//           </View>

//           <View style={styles.drawerSection}>
//             {DrawerData.map(item => {
//               return renderDrawerItem(item);
//             })}
//             {/* <DrawerItem
//               icon={({color, size}) => (
//                 <Icon name="home-outline" color={color} size={size} />
//               )}
//               label={`${strings.HOME}`}
//               onPress={() => {
//                 props.navigation.navigate('Home');
//               }}
//             />
//             <DrawerItem
//               icon={({color, size}) => (
//                 <Icon name="square-edit-outline" color={color} size={size} />
//               )}
//               label={strings.PROFILE}
//               onPress={() => {
//                 props.navigation.navigate('Profile');
//               }}
//             />
//             <DrawerItem
//               icon={({color, size}) => (
//                 <Icon name="key-outline" color={color} size={size} />
//               )}
//               label={strings.CHANGE_PASSWORD}
//               onPress={() => {
//                 props.navigation.navigate('ChangePassword');
//               }}
//             />

//             <DrawerItem
//               icon={({color, size}) => (
//                 <Entypo name="bell" color={color} size={size} />
//               )}
//               label="Notifications"
//               onPress={() => {
//                 props.navigation.navigate('ExploreScreen');
//               }}
//             />

//             <DrawerItem
//               icon={({color, size}) => (
//                 <Fontisto name="preview" color={color} size={size} />
//               )}
//               label="Review"
//               onPress={() => {
//                 props.navigation.navigate('To Do List');
//               }}
//             />

//             <DrawerItem
//               icon={({color, size}) => (
//                 <AntDesign name="addfile" color={color} size={size} />
//               )}
//               label="Add Product"
//               onPress={() => {
//                 props.navigation.navigate('addProduct');
//               }}
//             />

//             <DrawerItem
//               icon={({color, size}) => (
//                 <Ionicons name="exit-outline" color={color} size={size} />
//               )}
//               label={strings.LOGOUT}
//               onPress={() => {
//                 signOut();
//               }}
//             />
//             <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="settings-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Settings"
//                             onPress={() => {props.navigation.navigate('SettingsScreen')}}
//                         />
//             <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="account-check-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Support"
//                             onPress={() => {props.navigation.navigate('SupportScreen')}}
//                         /> */}
//           </View>
//         </View>
//       </DrawerContentScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContent: {
//     flex: 1,
//   },
//   userInfoSection: {
//     //paddingLeft: 20,
//   },
//   title: {
//     fontSize: fSize(18),
//     // marginTop: 3,
//     // fontWeight: 'bold',
//     ...FONTS.WorkSans_reg,
//     color: COLORS.white,

//     textAlign: 'center',
//   },
//   greetingContainer: {
//     marginLeft: calcW(0.05),
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 14,
//   },
//   row: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   section: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   paragraph: {
//     fontWeight: 'bold',
//     marginRight: 3,
//   },
//   drawerSection: {
//     marginTop: 15,
//   },
//   bottomDrawerSection: {
//     marginBottom: 15,
//     borderTopColor: '#f4f4f4',
//     borderTopWidth: 1,
//   },
//   preference: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
// });
