import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import NotificationContext from '../../Services/Notification/NotificationContext';
import {getApicall} from '../../Services/Network';
import Hud from './Hud';

const {width, height} = Dimensions.get('window');

const HeaderwithTitle = props => {
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
    await getApicall('newnotification', {}, {})
      .then(async res => {
        if (res.status == 200) {
          Hud.hideHud();

          setUnreadNotification(res.data.success);
          if (!res.data.success) {
            notificationContext.updateNotficationStatus('N');
          } else {
            notificationContext.updateNotficationStatus('Y');
          }
        } else {
          Hud.hideHud();

          setUnreadNotification(res.data.success);
          notificationContext.updateNotficationStatus('N');
        }
      })
      .catch(error => {
        Hud.hideHud();
        console.error('Error in HeaderWithImageTitle page', error);
      });
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.87,
        marginTop: height * 0.03,
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <TouchableOpacity onPress={() => props.navProps.goBack()}>
        <Image
          source={require('../../Assets/Icon/back.png')}
          style={{
            height: 18,
            width: 10,
            tintColor: 'black',
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: '#151143',
          fontWeight: '500',
          fontSize: RFValue(22),
          //fontFamily: 'Roboto-Medium',
        }}>
        {props.title}
      </Text>

      <TouchableOpacity
        onPress={() => {
          props.navProps.navigate('Notification');
        }}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            height: height * 0.05,
            width: width * 0.06,
            //marginHorizontal: '5%',
          }}>
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

export default HeaderwithTitle;

const styles = StyleSheet.create({});
