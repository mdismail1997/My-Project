import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import NotificationContext from '../../Services/Notification/NotificationContext';
import Hud from './Hud';

const {width, height} = Dimensions.get('window');
import {ProfileContext} from '../../Services/ProfileProvider';

const Header = props => {
  const {profileContextData} = useContext(ProfileContext);
  const notificationContext = useContext(NotificationContext);

  const [unreadNotification, setUnreadNotification] = useState(false);

  useEffect(() => {
    getNotificationStatus();

    const unsubscribe = props.navProps.addListener('focus', async () => {
      getNotificationStatus();
    });
    return unsubscribe;
  }, []);

  const getNotificationStatus = async () => {
    // Hud.showHud();
    await getApicall('newnotification', {}, {})
      .then(async res => {
        if (res.status == 200) {
          // Hud.hideHud();
          // console.log('==>Notification===>', res.data.success);
          //  setStatus(res.data);
          setUnreadNotification(res.data.success);
          if (!res.data.success) {
            notificationContext.updateNotficationStatus('N');
          } else {
            notificationContext.updateNotficationStatus('Y');
          }
        } else {
          //Hud.hideHud();
          console.log(res.message);
          //  setStatus(res.data);
          setUnreadNotification(res.data.success);
          notificationContext.updateNotficationStatus('N');
        }
      })
      .catch(error => {
        // Hud.hideHud();
        console.error('Notification Status error==>', error);
      });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        width: width * 0.87,
        justifyContent: 'space-between',
        marginTop: height * 0.01,
        alignSelf: 'center',
      }}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            props.navProps.openDrawer();
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            marginLeft: '2%',
            //marginLeft: 10,
            //marginHorizontal: '5%',
            alignItems: 'center',
            //backgroundColor:'red'
          }}>
          <Image
            source={{uri: profileContextData.profile_image}}
            style={{height: '100%', width: '100%', borderRadius: 100}}
            //source={require('../../Assets/Images/Img.png')}

            resizeMode="cover"
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: width * 0.01,
            marginTop: height * 0.011,
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: RFValue(15),
              color: '#7B7B7B',
              ////fontFamily: 'Rubik',
              //fontWeight: '500',
              letterSpacing: 0.4,
            }}>
            Hi,
          </Text>
          <Text
            style={{
              fontSize: RFValue(20),
              color: '#000',
              //fontFamily: 'Roboto-Medium',
              fontWeight: '500',
              //fontWeight: 'bold',
              letterSpacing: 0.4,
            }}>
            {profileContextData.name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          props.navProps.navigate('Notification');
        }}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            height: height * 0.05,
            width: width * 0.06,
            marginHorizontal: '5%',
          }}>
          {/* <Image
            source={require('../../Assets/Icon/Notification.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          /> */}
          {unreadNotification == true ||
          notificationContext.usernotificationstatus == 'Y' ? (
            <Image
              source={require('../../Assets/Icon/Notification.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../Assets/Icon/noti.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
