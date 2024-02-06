import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  calcH,
  calcW,
  cardButtonHeight,
} from '../../utils/comon';
import {RFValue} from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-datepicker';
import IconMaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {ImagePickerModal} from './../../Components/image-picker-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Header from '../../Header/Header';

const TollScreen = ({navigation}) => {
  const [date, setDate] = React.useState(new Date());
  //const [addMore, setAddMore] = useState(false)
  const [tollamount, setTollamount] = useState('');

  const [filePathCarSideBack, setFilePathCarSideBack] = useState(null);

  const [visibleCarSideBack, setVisibleCarSideBack] = useState(null);
  const [tolladd, setTolladd] = useState([]);

  const tollAddMore = () => {
    const arr = [];
    var toll = arr.push({
      image: filePathCarSideBack.assets[0].uri,
      amount: tollamount,
    });
    console.log('Arrrrrrrrrrrrrr', arr);
    //setTolladd(arr)
    //  const pro = [...tolladd]
    setTolladd([...tolladd, arr]);
    console.log('Tolladd', tolladd);
  };

  const onCameraPressCarSideBack = React.useCallback(() => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        console.log('', response);
        setVisibleCarSideBack(false);
        setFilePathCarSideBack(source);
      }
    });
  }, []);

  //////////////////////////////////////////////////////////////////

  const onImageLibraryPressCarSideBack = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data4====>',
          response,
        );
        setVisibleCarSideBack(false);
        setFilePathCarSideBack(source);
      }
    });
  }, []);
  const addMore = () => {};
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header navigation={navigation} />
      {/* <ScrollView> */}
      <View style={styles.topContainer}>
        {/* <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={styles.arrowIcon}
                source={require('../../asserts/back_arrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.instruction}>Add Toll Receipt</Text>
          </View> */}
        <View style={styles.secondContainer}>
          <Text style={styles.textHeader}>Add Toll Receipt Price</Text>
          <Text>Upload your toll receipt photo for verification</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.inputBox}>
              <TextInput style={styles.textInput} />
              <DatePicker
                style={styles.datePickerStyle}
                date={date}
                mode="date"
                placeholder="select date"
                format="DD/MM/YYYY"
                minDate="01-01-1900"
                maxDate={date}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: -5,
                    top: 4,
                    marginLeft: 0,
                    tintColor: '#4d4d4d',
                  },
                  dateInput: {
                    borderColor: 'gray',
                    alignItems: 'flex-start',
                    borderWidth: 0,
                    borderBottomWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 17,
                    // color: 'gray',
                  },
                  dateText: {
                    fontSize: 17,
                  },
                  datePickerCon: {
                    backgroundColor: '#00a3ff',
                  },
                }}
                onDateChange={date => {
                  setDate(date);
                }}
              />
            </View>
            <FlatList
              style={{flex: 1}}
              data={tolladd}
              renderItem={({item, index}) => {
                return (
                  <View>
                    {console.log('item==================', item)}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={styles.rowChildView}>
                        <View style={styles.subcontainer}>
                          {filePathCarSideBack ? (
                            <Image
                              source={{uri: item[0].image}}
                              style={{
                                width: 45,
                                height: 45,
                                borderRadius: 45 / 2,
                              }}></Image>
                          ) : (
                            <IconMaterialCommunityIcons
                              color={'#909090'}
                              size={24}
                              name={'upload'}
                            />
                          )}
                        </View>

                        <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                          image file to upload
                        </Text>
                        <ImagePickerModal
                          isVisible={visibleCarSideBack}
                          onClose={() => setVisibleCarSideBack(false)}
                          onImageLibraryPress={onImageLibraryPressCarSideBack}
                          onCameraPress={onCameraPressCarSideBack}
                        />

                        <TouchableOpacity
                          style={{
                            width: '100%',
                          }}
                          onPress={() => setVisibleCarSideBack(true)}>
                          <View style={styles.buttonStyle}>
                            <Text style={styles.buttonTextStyle}>
                              Select File
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={{
                        borderColor: colors.inActiveBorder,
                        borderWidth: 1,
                        marginTop: calcH(0.04),
                        width: calcW(0.9),
                        borderRadius: 25,
                        marginBottom: calcH(0.05),
                        //padding: allPadding
                      }}>
                      {item[0].amount}
                    </Text>
                    {/* <TextInput
                style={{
                    borderColor: colors.inActiveBorder,
                    borderWidth: 1,
                    marginTop: calcH(0.04),
                    width: calcW(0.9),
                    borderRadius: 25,
                    marginBottom: calcH(0.05)
                    //padding: allPadding
                }}
                value={item.amount}
                // onChangeText={(text)=> setTollamount(text)}
                // placeholder=' Toll amount'
                /> */}
                  </View>
                );
              }}
            />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.rowChildView}>
                <View style={styles.subcontainer}>
                  {filePathCarSideBack ? (
                    <Image
                      source={{uri: filePathCarSideBack.assets[0].uri}}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 45 / 2,
                      }}
                      resizeMode={'contain'}></Image>
                  ) : (
                    <IconMaterialCommunityIcons
                      color={'#909090'}
                      size={24}
                      name={'upload'}
                    />
                  )}
                </View>

                <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                  Image file to upload
                </Text>
                <ImagePickerModal
                  isVisible={visibleCarSideBack}
                  onClose={() => setVisibleCarSideBack(false)}
                  onImageLibraryPress={onImageLibraryPressCarSideBack}
                  onCameraPress={onCameraPressCarSideBack}
                />

                <TouchableOpacity
                  style={{
                    width: '100%',
                  }}
                  onPress={() => setVisibleCarSideBack(true)}>
                  <View style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>Select File</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={{
                borderColor: colors.inActiveBorder,
                flex: Platform.OS === 'ios' ? 0.7 : null,
                borderWidth: 1,
                marginTop: calcH(0.04),
                width: calcW(0.9),
                borderRadius: 25,
                //padding: allPadding
              }}
              value={tollamount}
              onChangeText={text => setTollamount(text)}
              placeholder=" Toll amount"
            />
          </View>
        </View>
        <View style={styles.thirdContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => tollAddMore()}>
            <Image
              source={require('../../asserts/add.png')}
              style={styles.addnew}
              resizeMode={'contain'}
            />
            <Text>Add more</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{width: '100%'}}
          onPress={() => Alert.alert('Toll update successfully')}>
          <View
            style={{
              width: calcW(0.9),
              backgroundColor: colors.buttonColor,
              height: calcH(0.07),
              borderRadius: allRadius,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: calcW(0.2),
            }}>
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default TollScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: allPadding,
    flex: 1,
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
    fontSize: RFValue(20),
    fontWeight: '500',
    color: colors.textHeader,
  },
  secondContainer: {
    //padding: allPadding,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: calcW(0.9),
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    paddingVertical: allPadding,
  },
  textHeader: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    marginBottom: calcH(0.02),
    color: '#000',
  },
  inputBox: {
    flexDirection: 'row',
    borderColor: '#000',
    borderWidth: 0,
    width: calcW(1.0),
    height: calcH(0.15),
    justifyContent: 'space-between',
    alignItems: 'center',
    //marginBottom: calcH(0.0),
    padding: allPadding,
  },
  textInput: {
    fontSize: 12,
    //flex: 1,
    //paddingLeft: calcW(0.03),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    width: calcW(0.35),
    height: calcH(0.08),
    borderRadius: allRadius,
    color: '#000',
  },
  datePickerStyle: {
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    width: calcW(0.5),
    height: calcH(0.08),
    borderRadius: 25,
    paddingHorizontal: allPadding,
  },
  rowChildView: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    //padding: allPadding,
    //marginHorizontal: 10,
    paddingStart: allPadding,
  },
  subText: {
    fontSize: 14,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
    padding: allPadding,
  },
  subcontainer: {
    backgroundColor: '#E9E9E9',
    borderRadius: 25,
    height: 40,
    width: 40,
    //left: calcW(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
  },
  buttonStyle: {
    width: calcW(0.3),
    backgroundColor: colors.buttonColor,
    height: cardButtonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcW(0.01),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: colors.white,
    // marginVertical: 10,
  },
  thirdContainer: {
    backgroundColor: colors.buttonAnothercolor,
    height: calcH(0.07),
    width: calcW(0.9),
    marginTop: calcH(0.02),
    padding: allPadding,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addnew: {
    width: calcW(0.09),
    height: calcH(0.05),
    tintColor: '#808080',
    marginRight: calcW(0.02),
  },
});
