import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {STYLES, calcH, calcW} from '../../utils/constants/common';
import ProgressBar from 'react-native-animated-progress';
import {Screen, InputComponent, HeaderComponent} from '../../components';
import ScrollView from 'react-native-gesture-handler';
import {Images} from '../../assets/image';
import {getHeight, getWidth} from '../../global/common';

function SearchTrip({route, navigation}) {
  const [text, onChangeText] = useState();
  const [withPet, setWithPet] = useState(true);
  const [withoutPet, setWithoutPet] = useState(false);

  const togglePet = () => {
    setWithPet(!withPet);
    setWithoutPet(!withoutPet);
  };
  return (
    <>
      <Screen>
        <View style={styles.topContainer}>
          <HeaderComponent title="" navigation={navigation} />
          <View style={styles.lineStyle} />

          <View style={styles.headerText}>
            <Text style={styles.subheader}>Search Trip</Text>
          </View>

          <View style={styles.mainView}>
            <Image style={styles.iconSize} source={Images.locationIcon} />
            <Text
              style={{
                marginLeft: getWidth(14),
                color: '#000',
                fontWeight: '600',
              }}>
              Destination
            </Text>
            <Text style={{marginLeft: getWidth(10)}}>{':'}</Text>
            <Text style={{marginLeft: getWidth(18), fontWeight: '600'}}>
              Switzerland
            </Text>
          </View>
          <View style={styles.dividerStyle} />

          <View style={styles.mainView}>
            <Image style={styles.iconSize} source={Images.MoneyIcon} />
            <Text
              style={{
                marginLeft: getWidth(14),
                color: '#000',
                fontWeight: '600',
              }}>
              Budget
            </Text>
            <Text style={{marginLeft: getWidth(10)}}>{':'}</Text>
            <Text style={{marginLeft: getWidth(46), fontWeight: '600'}}>
              $4000
            </Text>
          </View>
          <View style={styles.dividerStyle} />

          <View>
            <View style={styles.categoryRow1}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: '600',
                  alignSelf: 'center',
                  position: 'relative',
                  right: 10,
                }}>
                Interested in Group
              </Text>
              <View style={styles.catCard2}>
                <Text style={styles.cardText}>Yes</Text>
                <TouchableOpacity onPress={() => togglePet()}>
                  <Image
                    style={{
                      marginLeft: getWidth(10),
                      height: getHeight(20),
                      width: getWidth(20),
                    }}
                    source={withPet ? Images.radio1 : Images.radio2}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.catCard2, {marginLeft: getWidth(12)}]}>
                <Text style={styles.cardText}>No</Text>
                <TouchableOpacity onPress={() => togglePet()}>
                  <Image
                    style={{
                      marginLeft: getWidth(10),
                      height: getHeight(20),
                      width: getWidth(20),
                    }}
                    source={withoutPet ? Images.radio1 : Images.radio2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Screen>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnSubContainer}
          onPress={() =>
           //Alert.alert('Click')
           navigation.navigate('TripListScreen')
          }
           >
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default SearchTrip;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
  },
  mainView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: getHeight(15),
    paddingBottom: getHeight(15),
  },
  lineStyle: {
    marginTop: calcH(0.005),
    width: calcW(1),
    borderWidth: calcW(0.002),
    borderColor: STYLES.FOUR_COLO,
  },
  headerText: {
    marginTop: calcH(0.035),
  },

  subheader: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'quicksand_semibold',
    color: '#000',
  },

  iconSize: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  dividerStyle: {
    width: '95%',
    borderWidth: calcW(0.002),
    borderColor: STYLES.FOUR_COLO,
  },

  categoryRow1: {
    // backgroundColor: STYLES.PRIMARY_COLOR,
    marginTop: getHeight(50),
    flexDirection: 'row',
  },
  catCard2: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: STYLES.FOUR_COLO,
    flexDirection: 'row',
    borderColor: '#e2e2e2',
    padding: 15,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    paddingBottom: getHeight(20),
  },
  btnSubContainer: {
    width: calcW(0.52),
    height: calcH(0.06),
    borderRadius: calcH(0.03),
    backgroundColor: STYLES.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    color: STYLES.THIRD_COLOR,
    fontWeight: '500',
    fontFamily: 'quicksand_medium',
  },
});
