import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  HelperText,
} from 'react-native-paper';
import {Header} from '../../components/Header/Header';
import {heightPercentageToDP} from 'react-native-responsive-screen';
export const Recognition = props => {
  const Height = Dimensions.get('screen').height;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 10}}>
        <Header title="Recognition " navProps={props.navigation} />
        <Text style={styles.fontcomponetCSS}>
          We will{' '}
          <Text style={[styles.fontcomponetCSS, {color: '#8FCD2D'}]}>
            {' '}
            recognize
          </Text>
          <Text style={styles.fontcomponetCSS}> your face</Text>
        </Text>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Image
            source={require('../../Assets/scener.png')}
            style={styles.imagefingerCSS}
          />
        </View>

        <View
          style={{flexDirection: 'row', alignSelf: 'center', marginTop: 50}}>
          <View style={styles.backCSS}>
            <Text style={styles.tectnumberCSS}>1</Text>
          </View>
          <View style={[styles.lineCSS, {borderColor: '#8FCD2D'}]}></View>
          <View style={[styles.backCSS, {backgroundColor: '#D9D9D9'}]}>
            <Text style={[styles.tectnumberCSS, {color: '#000'}]}>2</Text>
          </View>
          <View style={styles.lineCSS}></View>
          <View style={[styles.backCSS, {backgroundColor: '#D9D9D9'}]}>
            <Text style={[styles.tectnumberCSS, {color: '#000'}]}>3</Text>
          </View>
        </View>

        <Text style={styles.pleasetextCSS}>
          Please wait and complete all three step{' '}
        </Text>
        <Text style={styles.textCSS}>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.textCSS}>layout.</Text>
        </TouchableOpacity>
        <View style={{marginHorizontal: 22}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            presentationStyle="fullScreen"
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalview}>
              <View style={styles.Modal2}>
                <Pressable>
                  <Image
                    source={require('../../Assets/NewProject1.png')}
                    style={styles.modalimg}
                  />
                  <Text style={[styles.textAva, {color: '#737373'}]}>
                    We will successfully recognize {'\n  '}your face
                  </Text>
                  <View
                    style={{marginTop: 40, width: '50%', alignSelf: 'center'}}>
                    <Button
                      style={{
                        fontSize: 32,
                        borderWidth: 3,
                        borderColor: '#8FCD2D',
                        borderRadius: 8,
                      }}
                      mode="contained"
                      color="#fff"
                      uppercase={false}
                      contentStyle={{height: 44}}
                      labelStyle={{color: '#8FCD2D'}}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      Continue
                    </Button>
                  </View>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  imagefingerCSS: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  fontcomponetCSS: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Lato',
    textAlign: 'center',
    marginTop: 60,
  },
  pleasetextCSS: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Lato',
    textAlign: 'center',
    marginTop: 50,
  },
  textCSS: {
    fontSize: 14,
    color: '#737373',
    fontWeight: '500',
    fontFamily: 'Lato',
    textAlign: 'center',
    marginTop: 20,
  },
  modalview: {
    flex: 1,
    justifyContent: 'center',
    bottom: 430,
  },
  Modal2: {
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 9,
  },
  modalimg: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100,
    width: 100,
    marginTop: 20,
  },

  textAva: {
    textAlign: 'center',
    color: '#ECF9FC',
    fontWeight: '500',
    fontSize: 14,
    marginTop: 12,
  },
  backCSS: {
    backgroundColor: '#8FCD2D',
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  tectnumberCSS: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  lineCSS: {
    borderBottomWidth: 3,
    borderColor: '#D9D9D9',
    width: '30%',
    alignSelf: 'center',
    borderWidth: 1.3,
  },
});
