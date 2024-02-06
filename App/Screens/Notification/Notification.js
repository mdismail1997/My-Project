import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {getApicall, postApiCall} from '../../Services/Network';

const {width, height} = Dimensions.get('window');

const Notification = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getNotificationApi();
    });
    return unsubscribe;
  }, []);

  const [data, setData] = useState([]);
  const date = new Date();

  const getNotificationApi = async () => {
    Hud.showHud();
    await getApicall('notificationlist', {}, {})
      .then(response => {
        Hud.hideHud();

        //console.log('=======>', response.data.data);
        if (response.status == 200) {
          setData(response.data.data);
          updateNotificationStatus();
        } else {
          Hud.hideHud();
          console.log('error in Notification Api');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error in response for header==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request for header==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  const updateNotificationStatus = async () => {
    await postApiCall('newnotificationupdate', {}, {})
      .then(response => {
        console.log('====>response==>', response.data);
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          console.log('error in response==>', error.response.data);

          Toast.show({
            type: 'error',
            text1: 'Socket Error',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error in Request in the Login page===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error in Setting in the Login page==>', error.message);
        }
      });
  };

  const timeDate = time => {
    //console.log('====>', date);
    var temp = JSON.stringify(date).substring(1, 11);
    // console.log('Initial Date==>', temp);
    //var newDate = temp.split('-').reverse().join('-');
    //console.log('-newDate-->', newDate);
    //console.log('----Api time---->', time);
    var subDate = time.substring(0, 10);
    //console.log('==subDate==>', subDate);

    if (subDate == temp) {
      //console.log('subTime==>', subDate);
      var subTime = time.substring(11, 16);
      //console.log('==subTime==>', subTime);
      return subTime;
    } else {
      //console.log('subDate==>', subDate);
      return subDate;
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.9,
          marginTop: height * 0.03,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
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

        <View>
          <Text
            style={{
              color: '#000',
              fontWeight: '500',
              fontSize: RFValue(22),
              //fontFamily: 'Roboto-Medium',
            }}>
            Notifications
          </Text>
        </View>

        <View />
      </View>

      {data.length == 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: '#769292',
              //fontFamily: 'Rubik',
              fontWeight: 'normal',
            }}>
            No Notification
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#ffffff',
            width: width * 0.9,
          }}>
          <View style={{marginBottom: height * 0.14}}>
            {data.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    paddingBottom: 15,
                    borderBottomWidth: 0.5,
                    borderColor: '#566690',
                    padding: 5,
                    // backgroundColor: 'red',
                  }}>
                  <View style={styles.division}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#151143',
                        fontSize: RFValue(15),
                        //fontFamily: 'Roboto-Medium',
                        fontWeight: '500',
                        width: '75%',
                      }}>
                      {/* Great! You have a answer... */}

                      {item.message}
                    </Text>
                    <Text
                      style={{
                        color: '#151143',
                        fontWeight: '600',
                        //fontFamily: 'Roboto-Medium',
                        fontSize: RFValue(13),
                      }}>
                      {timeDate(item.date)}
                    </Text>
                  </View>

                  {/* <TouchableOpacity>
                    <Text
                      style={{
                        marginTop: 10,
                        color: '#7B7B7B',
                        fontSize: RFValue(15),
                        //fontFamily: 'Roboto-Light',
                        fontWeight: '300',
                      }}>
                      View here
                    </Text>
                  </TouchableOpacity> */}
                </View>
              );
            })}

            {/* <View style={styles.division}>
              <View style={{marginBottom: 20}}>
                <Text
                  style={{
                    color: '#151143',
                    fontSize: RFValue(18),
                    //fontFamily: 'Roboto-Medium',
                    fontWeight: '500',
                  }}>
                  You’re invited to chat & call with...
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      color: '#7B7B7B',
                      fontSize: RFValue(18),
                      //fontFamily: 'Roboto-Light',
                      fontWeight: '300',
                    }}>
                    View here
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text>5:20 pm</Text>
              </View>
            </View> */}
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  division: {
    marginTop: height * 0.03,
    width: width * 0.85,
    //paddingHorizontal: 10,
    //height: 70,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',

    //alignSelf: 'center',
    // marginBottom: 20,
  },
});
