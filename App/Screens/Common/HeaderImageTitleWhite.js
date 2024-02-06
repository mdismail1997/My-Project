import React, {useState, useContext, useEffect} from 'react';
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
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const HeaderImageTitleWhite = props => {
  const [unreadNotification, setUnreadNotification] = useState(false);
  const notificationContext = useContext(NotificationContext);

  const {profileContextData} = useContext(ProfileContext);

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
          //console.log('==>Notification===>', res.data.success);
          //  setStatus(res.data);
          setUnreadNotification(res.data.success);
          if (!res.data.success) {
            notificationContext.updateNotficationStatus('N');
          } else {
            notificationContext.updateNotficationStatus('Y');
          }
        } else {
          //Hud.hideHud();

          //  setStatus(res.data);
          setUnreadNotification(res.data.success);
          notificationContext.updateNotficationStatus('N');
        }
      })
      .catch(error => {
        //Hud.hideHud();
        console.error(error);
      });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        width: width * 0.87,
        justifyContent: 'space-between',
        marginTop: height * 0.01,
        //backgroundColor: 'blue',
        alignItems: 'center',
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
            //source={require('../../Assets/Images/Img.png')}
            style={{height: '100%', width: '100%', borderRadius: 100}}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: RFValue(25),
            fontWeight: '500',
            //fontFamily: 'Roboto-Medium',
            color: '#000',
          }}>
          {props.title}
        </Text>
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

export default HeaderImageTitleWhite;

const styles = StyleSheet.create({});
