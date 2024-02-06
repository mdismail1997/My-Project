import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {useTheme, Avatar, Title, Drawer} from 'react-native-paper';
import {
  DrawerContentScrollView,
  useDrawerStatus,
  DrawerItem,
} from '@react-navigation/drawer';

import {AuthContext} from '../components/context';
import {
  calcH,
  calcW,
  fSize,
  IMAGE_PATH,
  STORAGE_KEY,
} from '../../utils/constants/common';
import strings from '../components/lng/LocalizedStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createGet} from '../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../utils/constants/API/commonUrl';
import DrawerData from '../../conts/Data.js';

import icons from '../../conts/icons.js';
import COLORS from '../../conts/colors.js';
import {FONTS} from '../../conts/theme.js';
import Separator from '../components/Separator.js';
import AppImage from '../components/AppImage.js';
import storage from '../../utils/constants/storage.js';
import HeaderIcon from '../components/HeaderIcon.js';
import {getLng} from '../components/lng/changeLng.js';
import {I18nManager} from 'react-native';
import {Alert} from 'react-native';
import Loader from '../components/Loader';

import axios from 'axios';

export const capitalizeFirstLetter = string => {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
};

export function DrawerContent(props) {
  const [active, setActive] = React.useState('');
  const paperTheme = useTheme();
  const {signOut, toggleTheme} = React.useContext(AuthContext);
  //const [name, setName] = useState('');
  //const [profileImg, setProfileImg] = useState('');
  //const [customerId, setCustomerId] = useState('');
  // const [userData, setUserData] = useState({
  //   name: '',
  //   profilePicture: '',
  // });
  const [loading, setLoading] = React.useState(false);
  const [profileid, setProfileId] = React.useState("");

  console.log("========profileid============>",profileid)

  React.useEffect(() => {
    selectedLng();
  }, []);

  const selectedLng = async () => {
    const lngData = getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true);
    }
    console.log('selected Language data==>>>', lngData);
    //setLoading(false);
  };

  const isDrawerOpen = useDrawerStatus() === 'open';

 

  const onPress = item => {
    console.log("item",item)
    if (item.id == 'logout') {
      
      Alert.alert('', `${strings.ARE_YOU_SURE_YOU_WANT_TO_LOGOUT}`, [
        {
          text: `${strings.CANCEL}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: `${strings.OK}`, onPress: () => 
         //signOut();
        logout2(),
      },
      ]);
    }else if(item.id == 'DeleteAccount'){
      Alert.alert('', `${strings.ARE_YOU_SURE_YOU_WANT_TO_Delete}`, [
        {
          text: `${strings.CANCEL}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: `${strings.OK}`, onPress: () => 
         //signOut();
        deleteProfile(),
      },
      ]);
    }
   
    else {
      props.navigation.navigate(item.route);
      props.navigation.closeDrawer();
    
     
    }
    setActive(item.id);
  };
const deleteProfile = async()=>{

    setLoading(true);
    let AccessToken = 'xdd48grne8e5keewy39cncxue0w0nhb4';
    console.log("iddddddddddd",profileid)
    await axios({
      method: 'delete',
      url: `https://traders-platform.com/rest/V1/customers/${profileid}`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(async(res) => {
        setLoading(false);
        console.warn("Delete Account Sussesfuly", res.data);
       // props.navigation.navigate('signin');
        //await AsyncStorage.removeItem('traderToken');

        Alert.alert('','Account Delete Successfully', [
          { text: '' },
          {
            text: strings.OK
          },
        ])
        signOut();
        //setData(res.data.items);
      })
      .catch(error => {
        this.setState({ loder: false });
        console.log('Error error=> ', error.response.message);
      });

   
  




}

  const logout2 = async () => {
    console.warn("Logout")
     setLoading(true);
     setTimeout(async () => {
  
      setLoading(true);
      // props.navigation.navigate('LoginScreen');
      // await AsyncStorage.removeItem('traderToken');
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      // await AsyncStorage.removeItem('traderToken');
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      signOut()
    }, 2000);
    // setTimeout(async () => {
    //   setLoading(false);
    //   // props.navigation.navigate('LoginScreen');
    //   await AsyncStorage.removeItem('traderToken');
    //   //await GoogleSignin.revokeAccess();
    //   //await GoogleSignin.signOut();
    //   //signOut()
    // }, 2000);

  };



  const renderItemIcon = item => (
    <Avatar.Icon
      icon={item.iconUri}
      size={calcH(0.05)}
      // size={calcW(0.09)}
      //color={active === item.id ? COLORS.white : COLORS.black}
      style={{
        backgroundColor: COLORS.header_color,
        //left: calcW(0.03),
        //borderWidth: active === item.id ? 0 : 0.5,
      }}
    />
  );

  const renderDrawerItem = item => {
    const getString = item => {
      if (item.label == 'Home') return strings.HOME;
      if (item.label == 'Profile') return strings.PROFILE;
      if (item.label == 'Change Password') return strings.CHANGE_PASSWORD;
      if (item.label == 'Order List') return strings.ORDER_LIST;
      if (item.label == 'Product List') return strings.PRODUCT_LIST;
      if (item.label == 'My Payment Details') return strings.MY_PAYMENT_DETAILS;
      if (item.label == 'Delete Account') return strings.Delete_Account;
      if (item.label == 'Sign Out') return strings.SIGN_OUT;
    };
    return (
      <DrawerItem
        icon={() => renderItemIcon(item)}
        style={{
          flex: 1,
          backgroundColor: COLORS.header_color,
          width: '100%',
          //borderWidth: 1,
          right: calcW(0.03),
        }}
        labelStyle={{
          color: COLORS.white,
          ...FONTS.WorkSans_reg,
          fontSize: fSize(10),
        }}
        theme={{
          colors: {
            //primary: COLORS.white,
          },
        }}
        key={item.id}
        //labelStyle={styles.label}
        label={getString(item)}
        active={active === item.id}
        onPress={() => onPress(item)}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.header_color}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={[styles.userInfoSection]}>
            <TouchableWithoutFeedback
              onPress={() => props.navigation.navigate('Profile')}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: calcH(0.05),
                  //borderWidth: 1,
                  left: calcW(0.03),
                }}>
                
                <HeaderIcon isSingleIcon={true}  setProfileId={setProfileId} profileid={profileid}/>
                
              </View>
            </TouchableWithoutFeedback>
            {/* <View style={{marginTop: calcW(0.05), marginRight: calcW(0.03)}}>
              <View style={{flex: 1, height: 1, backgroundColor: '#616163'}} />
            </View> */}

            <Separator width="90%" />
          </View>

          <View style={styles.drawerSection}>
        
            {DrawerData.map(item => {
              return renderDrawerItem(item);
            })}
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label={`${strings.HOME}`}
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="square-edit-outline" color={color} size={size} />
              )}
              label={strings.PROFILE}
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="key-outline" color={color} size={size} />
              )}
              label={strings.CHANGE_PASSWORD}
              onPress={() => {
                props.navigation.navigate('ChangePassword');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Entypo name="bell" color={color} size={size} />
              )}
              label="Notifications"
              onPress={() => {
                props.navigation.navigate('ExploreScreen');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Fontisto name="preview" color={color} size={size} />
              )}
              label="Review"
              onPress={() => {
                props.navigation.navigate('To Do List');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <AntDesign name="addfile" color={color} size={size} />
              )}
              label="Add Product"
              onPress={() => {
                props.navigation.navigate('addProduct');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Ionicons name="exit-outline" color={color} size={size} />
              )}
              label={strings.LOGOUT}
              onPress={() => {
                signOut();
              }}
            />
            <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                name="settings-outline"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        />
            <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                name="account-check-outline"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        /> */}
          </View>
          <Loader visible={loading} />
        </View>
      </DrawerContentScrollView>
     
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    //paddingLeft: 20,
  },
  title: {
    fontSize: fSize(18),
    // marginTop: 3,
    // fontWeight: 'bold',
    ...FONTS.WorkSans_reg,
    color: COLORS.white,

    textAlign: 'center',
  },
  greetingContainer: {
    marginLeft: calcW(0.05),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
    marginleft:20,
    width:'100%',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
