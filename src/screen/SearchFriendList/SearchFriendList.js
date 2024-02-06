import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {HeaderComponent} from '../../components';
import {Images} from '../../assets/image';
import {getHeight, getWidth} from '../../global/common';
import Modal from 'react-native-modal';
import { calcH, calcW, STYLES } from '../../utils/constants/common';
const SearchFriendList = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  return (
    <View style={{flex: 1}}>
      <HeaderComponent navigation={navigation} />
      <ScrollView>
        <TouchableOpacity>
        <Text style={styles.frdreqtxt}>Searched Friend List</Text>
        <Image source={Images.searchIcon} style={styles.searchIcon}/>

        </TouchableOpacity>
       
        {/* {data.map(item => ( */}
        <View style={styles.mainview}>
          <Image source={Images.profilePic} style={styles.profilepic} />

          <Text style={styles.name}>Delandro</Text>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
            style={[styles.buttons, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff', fontWeight: '500'}}>Add Friend</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}} />
        <View style={{borderBottomWidth: 0.5, borderColor: 'silver'}} />
        {/* ))} */}

        <View style={styles.mainview}>
          <Image source={Images.profilePic} style={styles.profilepic} />

          <Text style={styles.name}>Delandro</Text>
          <TouchableOpacity
            onPress={() => {
              toggleModal1();
            }}
            style={[
              styles.buttons,
              {backgroundColor: '#fff', flexDirection: 'row'},
            ]}>
            <Image
              style={{
                marginRight: getWidth(6),
                height: getHeight(12),
                width: getWidth(12),
              }}
              source={Images.tick}
            />
            <Text style={{color: 'green', fontWeight: '800'}}>
              Already Friend
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}} />
        <View style={{borderBottomWidth: 0.5, borderColor: 'silver'}} />

        <View style={styles.mainview}>
          <Image source={Images.profilePic} style={styles.profilepic} />

          <Text style={styles.name}>Delandro</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Click');
            }}
            style={styles.buttons}>
            <Text style={{color: '#000', fontWeight: '500'}}>Request Sent</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}} />
        <View style={{borderBottomWidth: 0.5, borderColor: 'silver'}} />

        <View style={styles.mainview}>
          <Image source={Images.profilePic} style={styles.profilepic} />

          <Text style={styles.name}>Delandro</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Click');
            }}
            style={styles.buttons}>
            <Text style={{color: '#000', fontWeight: '500'}}>Add Friend</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}} />
        <View style={{borderBottomWidth: 0.5, borderColor: 'silver'}} />

        <Modal isVisible={isModalVisible}>
          <View style={styles.modal}>
            <Text style={styles.txt}>Rejected</Text>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Image style={styles.crossimage} source={Images.cross} />
            </TouchableOpacity>
            <Text style={styles.oho}>Oho!</Text>
            <Text style={styles.reason}>not interested right now.</Text>
            <TouchableOpacity
              onPress={() => toggleModal()}
              style={styles.button}>
              <Text style={{color: '#fff', alignSelf: 'center'}}>Ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={isModalVisible1}>
          <View style={styles.modal}>
            <Text style={styles.txt}>Rejected</Text>
            <TouchableOpacity onPress={() => toggleModal1()}>
              <Image style={styles.crossimage} source={Images.cross} />
            </TouchableOpacity>
            <Text style={styles.oho}>Thanks!</Text>
            <Text style={styles.reason}>for your friendship...</Text>
            <TouchableOpacity
              onPress={() => toggleModal1()}
              style={styles.button}>
              <Text style={{color: '#fff', alignSelf: 'center'}}>Ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default SearchFriendList;

const styles = StyleSheet.create({
  mainview: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  frdreqtxt: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
    marginTop: getHeight(24),
  },
  searchIcon: {
    position: 'absolute',
    width: calcW(0.05),
    height: calcW(0.05),
    left:calcW(0.8),
    marginTop: calcW(0.07),
   
},
  profilepic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: getHeight(35),
    marginRight: getWidth(60),
  },
  email: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '400',
    color: 'silver',
    marginTop: 4,
  },
  buttons: {
    backgroundColor: 'silver',
    color: '#000',
    borderRadius: 20,
    height: getHeight(30),
    width: getWidth(110),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getHeight(35),
  },
  modal: {
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 30,
    paddingBottom: getHeight(35),
  },
  txt: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: getHeight(20),
  },
  crossimage: {
    height: getHeight(25),
    width: getWidth(25),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginRight: getWidth(20),
    bottom: 18,
  },
  oho: {
    marginTop: getHeight(35),
    fontWeight: 'bold',
    fontSize: 35,
    alignSelf: 'center',
    color: '#000',
  },
  reason: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  button: {
    marginTop: getHeight(30),
    alignSelf: 'center',
    backgroundColor: 'red',
    width: getWidth(100),
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 6,
  },
});
