import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {ScreenScrollComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {calcH, calcW} from '../../utils/comon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function Notification({navigation}) {
  const [notification, setNotification] = React.useState();

  const fetchNotification = async () => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      const tokenUser = token.data.data.token;
      const url = `https://kabou.us/api/rider/notification/${token.data.data.rider.id}`;

      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + tokenUser,
        },
      });
      console.log(
        'token_select_car',
        token.data.data.rider.id,
        url,
        response.data,
      );
      setNotification(response.data.notification_data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.arrowIcon}
              source={require('../../../assets/images/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.instruction}>Notifications</Text>
        </View>
        <View style={styles.lowerContainer}>
          {notification ? (
            notification.length === 0 ? (
              <Text>No notification found.</Text>
            ) : (
              <View style={{height: '90%'}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {notification?.map((el, i) => (
                    <View key={i} style={styles.readContainer}>
                      <View style={styles.contentBox}>
                        <View style={styles.bellTime}>
                          <Image
                            style={styles.bellIcon}
                            source={require('../../../assets/images/blue_bell.png')}
                          />
                          <Text style={styles.commonText}>Booking</Text>
                          <Text style={styles.timeText}>
                            {moment(el.created_at).fromNow()}
                          </Text>
                        </View>
                        <View style={styles.notifyHeader}>
                          <Text style={styles.notifytitle}>{el.title}</Text>
                          <Text style={styles.notifybody}>
                            {el.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )
          ) : (
            <Text>No notification found.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  lowerContainer: {
    // position: 'relative',
    height: calcH(0.95),
  },
  readContainer: {
    //  position: 'absolute',
    width: calcW(0.9),
    height: calcH(0.15),
    backgroundColor: colors.buttonAnothercolor,
    justifyContent: 'center',
    borderRadius: calcW(0.01),
    marginBottom: 10,
  },
  contentBox: {
    width: calcW(0.8),
    height: calcH(0.1),
    //  backgroundColor: colors.primary,
    left: calcW(0.05),
    //alignItems: 'center'
  },
  bellTime: {
    flexDirection: 'row',
  },
  commonText: {
    // marginBottom: calcH(0.04),
    left: calcW(0.02),
    fontWeight: '500',
    color: colors.buttonColor,
    fontSize: 12,
  },
  timeText: {
    left: calcW(0.46),
    fontWeight: '500',
    color: '#787878',
    fontSize: 12,
    paddingHorizontal: 5,
  },

  notifyHeader: {},
  notifytitle: {
    fontWeight: '500',
    color: '#121212',
    fontSize: 16,
  },
  notifybody: {
    fontWeight: '400',
    color: '#4E4D4D',
    fontSize: 12,
  },
  bellIcon: {
    // marginTop: calcH(0.01),
    width: calcW(0.035),
    height: calcW(0.035),
  },
});
