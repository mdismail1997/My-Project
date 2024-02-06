import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {HeaderComponent} from '../../components';
import {Images} from '../../assets/image';
import {getHeight, getWidth} from '../../global/common';
import { calcH, calcW, STYLES } from '../../utils/constants/common';
const FriendRequest = ({navigation}) => {
  const [data, setData] = useState([
    {
      id: 1,
      frdName: 'Delandro Doe',
    },
    {
      id: 2,
      frdName: 'Martin Doe',
    },
    {
      id: 3,
      frdName: 'Ratan Tata',
    },
    {
      id: 4,
      frdName: 'Gautan Adani',
    },
    {
      id: 5,
      frdName: 'Narendra Modi',
    },
  ]);
  return (
    <View style={{flex: 1}}>
      <HeaderComponent navigation={navigation} />
      <ScrollView>
        <TouchableOpacity>
        <Text style={styles.frdreqtxt}>Friend List</Text>
        <Image source={Images.searchIcon} style={styles.searchIcon}/>
        </TouchableOpacity>
        
        {data.map(item => (
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 15,
                marginTop: 20,
              }}>
              <Image source={Images.profilePic} style={styles.profilepic} />

              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <Text style={styles.name}>{item.frdName}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.buttons}>
                    <Text style={{color: '#000', fontWeight: '500'}}>
                      Accept
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttons, {backgroundColor: 'red'}]}>
                    <Text style={{color: '#fff', fontWeight: '500'}}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{marginTop: 20}} />
            <View style={{borderBottomWidth: 0.5, borderColor: 'silver'}} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
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
    left:calcW(0.7),
    marginTop: calcW(0.06),
   
},
  profilepic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  name: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  email: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '400',
    color: 'silver',
    marginTop: 4,
  },
  buttons: {
    marginLeft: getWidth(10),
    backgroundColor: 'silver',
    color: '#000',
    borderRadius: 20,
    marginTop: getHeight(10),
    height: getHeight(30),
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
