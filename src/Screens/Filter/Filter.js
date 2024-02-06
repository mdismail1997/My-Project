import {
  View,
  Text,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../../Component/Header/Header';
import {Input} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loder from '../../Component/Common/Lodar';

export default function Filter(props) {
  const [search, setSearch] = useState('');
  const [loder, setLoder] = useState(false);

  useEffect(() => {
    console.log('props', props);

    setLoder(true);
    setTimeout(() => {
      setLoder(false);
    }, 3000);
  }, []);

  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      {loder && <Loder />}
      <Header title="Filter" navigation={props.navigation} icon="arrowleft" />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 16,
            marginTop: 15,
            color: '#5A5A5F',
            fontFamily: 'Roboto-Regular',
          }}>
          Price Range
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.button, {width: 100}]}>
            <Text style={styles.buttontext}>Min Price</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.button, {width: 100, marginLeft: 15}]}>
            <Text style={styles.buttontext}>Max Price</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 15,
            color: '#4B4B52',
            fontFamily: 'Roboto-Regular',
          }}>
          Color
        </Text>

        <View style={{flexDirection: 'row'}}>
          <Image
            source={require(`../../Assets/whiteCircle.png`)}
            style={{width: 18, marginTop: -4}}
            resizeMode="contain"
          />
          <Image
            source={require(`../../Assets/redfillCircle.png`)}
            style={{width: 18, marginLeft: 5}}
            resizeMode="contain"
          />
          <Image
            source={require(`../../Assets/greenCircle.png`)}
            style={{width: 18, marginLeft: 5}}
            resizeMode="contain"
          />
          <Image
            source={require(`../../Assets/blueCircle.png`)}
            style={{width: 18, marginLeft: 5, marginTop: -4}}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 16,
            marginTop: 0,
            color: '#4B4B52',
            fontFamily: 'Roboto-Regular',
          }}>
          Sizes
        </Text>

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              marginTop: 6,
              width: 28,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 13}}>
              XS
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 28,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 13}}>
              S
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 28,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 13}}>
              M
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 28,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 13}}>
              L
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
            marginTop: 15,
            color: '#4B4B52',
            fontFamily: 'Roboto-Regular',
          }}>
          Category
        </Text>

        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              All
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Clothes
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              All
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Sports
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Kids
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Women
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
            marginTop: 15,
            color: '#4B4B52',
            fontFamily: 'Roboto-Regular',
          }}>
          Brands
        </Text>

        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Nike
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Adidas
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Reebok
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Woodland
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Kering(PUMA)
            </Text>
          </View>
          <View
            style={{
              marginTop: 6,
              width: 90,
              height: 28,
              backgroundColor: 'rgba(196, 196, 196, 0.2)',
              justifyContent: 'center',
              marginLeft: 15,
            }}>
            <Text style={{alignSelf: 'center', color: '#4B4B52', fontSize: 11}}>
              Skechers
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
            marginTop: 20,
            color: '#4B4B52',
            fontFamily: 'Roboto-Regular',
          }}>
          Price Show
        </Text>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.button1, {width: '47%'}]}>
            <Text style={styles.buttontext1}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              styles.button1,
              {width: '47%', marginLeft: 20, backgroundColor: '#4B4B52'},
            ]}>
            <Text style={[styles.buttontext1, {color: '#fff'}]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 7,
    marginTop: 10,
    borderColor: '#4B4B52',
    borderWidth: 1,
    justifyContent: 'center',
  },
  buttontext: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    // textAlign: "center",
    marginLeft: 10,
  },
  button1: {
    paddingVertical: 13,
    marginTop: 10,
    borderColor: '#4B4B52',
    borderWidth: 1,
    justifyContent: 'center',
  },
  buttontext1: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});
