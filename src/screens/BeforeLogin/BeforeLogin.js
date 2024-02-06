import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RFValue } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');

export const BeforeLogin = ({ navigation }) => {
  useEffect(() => {
    _isUserLoggedin();
  }, []);
  const [loading, setLoding] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const _isUserLoggedin = async () => {
    setLoding(true);
    let token = await AsyncStorage.getItem('authtoken');
    let intro = await AsyncStorage.getItem('introscreen');
    console.log('token:::= ', token);
    let role = await AsyncStorage.getItem('role');
    console.log('role:::= ', intro);
    if (intro === 'true') {
      console.log('iiii===', intro)
      navigation.replace('SelectScreen')
    }
    else if (token == null || token == undefined || token == '') setLoding(false);
    else {
      try {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: role === 'Doctor' ? 'Dashboard' : 'PatientTabNavigator',
            },
          ],
        });
        setLoding(false);
      } catch (err) {
        console.log(err);
        setLoding(false);
      }
    }
  };
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const data = [
    {
      title: 'How it works',
      discription:
        'The Doctor app allows access to healthcare to everyone and everywhere in the world free of charge.',
      image: require('../../Assets/beforelogin1.png'),
    },
    {
      title: 'How it works',
      discription:
        'The Doctor app allows access to healthcare to everyone and everywhere in the world free of charge.',
      image: require('../../Assets/beforelogin2.png'),
    },
  ];

  return (
    <View style={styles.Container}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : (
        <ScrollView>
          <View style={{ marginHorizontal: 20 }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              ref={flatListRef}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                }
              )}
              pagingEnabled
              horizontal
              decelerationRate={'normal'}
              scrollEventThrottle={16}
              keyExtractor={(item, i) => i}
              renderItem={({ item }) => (
                <View style={{ width: width - 40, alignItems: 'center' }}>
                  <Image
                    source={item.image}
                    style={{
                      width: width - 40,
                      height: 300,
                      resizeMode: 'contain',
                      marginTop: 80,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 25,
                      fontFamily: 'Roboto-Bold',
                      color: '#000',
                      marginTop: 20,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      //  fontFamily: 'Roboto-Bold',
                      color: '#8D8C8C',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    {item.discription}
                  </Text>
                </View>
              )}
            />
            <ExpandingDot
              data={data}
              expandingDotWidth={20}
              scrollX={scrollX}
              inActiveDotOpacity={0.6}
              dotStyle={{
                width: 25,
                height: 6,
                borderRadius: 5,
              }}
              activeDotColor={'#2173A8'}
              inActiveDotColor={'#8D8C8C'}
              containerStyle={{
                bottom: 110,
                // left: width / 2 - 40,
              }}
            />

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 50,
              }}
            >

              <TouchableOpacity
                onPress={async () => {
                  navigation.navigate('SelectScreen');
                  if (checked === true) {
                    console.log('setvalue', checked);
                    await AsyncStorage.setItem('introscreen', JSON.stringify(checked));
                  }
                  else {
                    console.log('setvalue', checked);
                    await AsyncStorage.setItem('introscreen', '');
                  }
                }}
                style={{
                  borderWidth: 2,
                  borderRadius: 100,
                  // borderColor: '#fff',
                  paddingVertical: 15,
                  paddingHorizontal: 100,
                  marginBottom: 20,
                  alignItems: 'center',
                  marginTop: 10
                  // elevation: 5,
                }}
              >
                <Text style={{ fontSize: 20, color: '#000' }}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={async () => {
                setChecked(!checked);
                console.log(checked);

                console.log(checked);
              }}
              // color="red"
              uncheckedColor="black"
            />
            <Text style={{ fontSize: RFValue(14), color: '#000' }}>Don't show intro again?</Text>
          </View>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
