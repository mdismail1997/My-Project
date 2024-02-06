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
  TouchableHighlight,
  FlatList,
} from 'react-native';
import styles from './style';
import {STYLES, calcH, calcW} from '../../utils/constants/common';
import ProgressBar from 'react-native-animated-progress';
import {Screen, InputComponent, HeaderComponent} from '../../components';
import ScrollView from 'react-native-gesture-handler';
import {Images} from '../../assets/image';
import {getHeight, getWidth} from '../../global/common';

function SearchRoomieScreen({route, navigation}) {
  const [text, onChangeText] = useState();
  const [withPet, setWithPet] = useState(true);
  const [withoutPet, setWithoutPet] = useState(false);

  const togglePet = () => {
    setWithPet(!withPet);
    setWithoutPet(!withoutPet);
  };
  return (
    <Screen>
      <View style={styles.topContainer}>
        <HeaderComponent title="" navigation={navigation} />
        <View style={styles.lineStyle} />

        <View style={styles.headerText}>
          <Text style={styles.subheader}>Search Roomie</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.totalAmount}>
            <View style={styles.iconContainer}>
              <Image style={styles.iconSize} source={Images.locationIcon} />
            </View>

            <Text style={styles.titleleft}>Location</Text>
            <Text style={styles.semiColon}> : </Text>
            <Text style={styles.titleright}>San Fancisco</Text>
          </View>
        </View>
        <View style={styles.dividerStyle} />
        <View style={styles.infoContainer}>
          <View style={styles.totalAmount}>
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconInterestSize}
                source={Images.InterstIcon}
              />
            </View>
            <Text style={styles.titleleft}>Interest In</Text>
            <Text style={styles.semiColon}> : </Text>
            <Text style={styles.titleright}>Cricket</Text>
          </View>
        </View>
        <View style={styles.dividerStyle} />
        <View style={styles.infoContainer}>
          <View style={styles.totalAmount}>
            <View style={styles.iconContainer}>
              <Image style={styles.iconMoneySize} source={Images.MoneyIcon} />
            </View>
            <Text style={styles.titleleft}>Budget</Text>
            <Text style={styles.semiColon}> : </Text>
            <Text style={styles.titleright}>$1000</Text>
          </View>
        </View>
        <View style={styles.dividerStyle} />
        <View style={styles.headersecondText}>
          <Text style={styles.subsecondheader}>PET PREFERENCE</Text>
        </View>
        <View style={styles.radioContainer}>
          <View style={styles.categoryRow1}>
            <View style={styles.catCard2}>
              <Text style={styles.cardText}>With pet</Text>
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

            <View style={styles.catCard2}>
              <Text style={styles.cardText}>Without pet</Text>
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
        <View style={styles.desContainer}>
          <TextInput
            style={styles.description}
            placeholder="Descriped if any specific health condition"
            onChangeText={onChangeText}
            value={text}
          />
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSubContainer}
            onPress={() => navigation.navigate('RoomListScreen')}>
            <Text style={styles.btnText}>Calculate Room Rent </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

export default SearchRoomieScreen;
