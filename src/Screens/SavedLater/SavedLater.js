import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Component/Header/Header';
import {Rating} from '@rneui/themed';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ButtonDark from '../../Component/Common/ButtonDark';

export default function SavedLater({navigation}) {
  return (
    <View style={styles.container}>
      <Header title="Saved Later" navigation={navigation} icon="arrow" />
      <View style={{paddingHorizontal: 20, paddingBottom: 70}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              color: '#5A5A5F',
              fontSize: 18,
              fontFamily: 'Roboto-Regular',
              fontWeight: 'bold',
              marginTop: 20,
            }}>
            Saved for later(1 item)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              paddingBottom: 30,
              borderBottomColor: '#4B4B52',
              marginTop: 20,
            }}>
            <View>
              <Image
                source={require('../../Assets/tshirt.png')}
                resizeMode="cover"
                style={{width: 90, height: 120}}
              />
            </View>
            <View style={{marginLeft: 15, flex: 1}}>
              <Text
                style={{
                  color: '#5A5A5F',
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                }}>
                RUNNING SPEED-O-NICK
              </Text>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 14,
                  fontFamily: 'Roboto-Regular',
                  marginTop: 0,
                }}>
                aed98
              </Text>
              <View
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../Assets/star.png')}
                  resizeMode="cover"
                  style={{width: 20, height: 20, marginRight: 5}}
                />
                <Image
                  source={require('../../Assets/star.png')}
                  resizeMode="cover"
                  style={{width: 20, height: 20, marginRight: 5}}
                />
                <Image
                  source={require('../../Assets/star.png')}
                  resizeMode="cover"
                  style={{width: 20, height: 20, marginRight: 5}}
                />
                <Image
                  source={require('../../Assets/star.png')}
                  resizeMode="cover"
                  style={{width: 20, height: 20, marginRight: 5}}
                />
                <Image
                  source={require('../../Assets/star.png')}
                  resizeMode="cover"
                  style={{width: 20, height: 20}}
                />
              </View>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#4B4B52',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 15,
                  paddingVertical: 2,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: '#4B4B52',
                    fontSize: 12,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  Small
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: '#4B4B52',
                  fontSize: 12,
                  fontFamily: 'Roboto-Regular',
                  marginTop: 15,
                  flexWrap: 'wrap',
                }}>
                Run your daily miles in absolute comfort with the Reebok
                Speed-O-Nick Shoes.{' '}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#4B4B52',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 15,
                    paddingVertical: 9,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      color: '#4B4B52',
                      fontSize: 12,
                      fontFamily: 'Roboto-Regular',
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: '#000',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontFamily: 'Roboto-Regular',
                    }}>
                    Move to cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
