import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import styles from './style';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import strings from '../../components/lng/LocalizedStrings';
import Categories from './Categories.json';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import mmkv from '../../utils/constants/mmkv/index.js';
import {STORAGE_KEY} from '../../utils/constants/common.js';

function AddProductScreen({navigation}) {
  const [images, setImages] = useState([1, 1, 1, 1, 1]);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const allColors = mmkv.get(STORAGE_KEY.COLORS);
  const allSizes = mmkv.get(STORAGE_KEY.SIZES);

  const productImg = type => {
    ImageCropPicker.openPicker({
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        console.log(image);
        let imgs = image.map((vals, i) => {
          let x = vals.path.split('/');
          let name = x[x.length - 1];
          return {
            media_type: 'image',
            label: "'.$imagePath.'",
            position: 0,
            disabled: false,
            types: i == 0 ? ['image', 'small_image', 'thumbnail'] : [],
            file: "'.$imagePath.'",
            content: {
              base64_encoded_data: vals.data,
              type: vals.mime,
              name: name,
            },
          };
        });
        setData({...data, media_gallery_entries: imgs});
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please enter password', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = () => {
    setLoading(true);
    //   setTimeout(async () => {
    //     setLoading(false);
    //     let userData = await AsyncStorage.getItem('userData');
    //     if (userData) {
    //       userData = JSON.parse(userData);
    //       if (
    //         inputs.email == userData.email &&
    //         inputs.password == userData.password
    //       ) {
    //         navigation.navigate('HomeScreen');
    //         AsyncStorage.setItem(
    //           'userData',
    //           JSON.stringify({...userData, loggedIn: true}),
    //         );
    //       } else {
    //         Alert.alert('Error', 'Invalid Details');
    //       }
    //     } else {
    //       Alert.alert('Error', 'User does not exist');
    //     }
    //   }, 3000);
  };

  const addProduct = () => {
    const numbers = '0123456789';
    const bigCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sku =
      name +
      numbers.charAt(Math.floor(Math.random() * 1000)) +
      bigCharacters.charAt(Math.floor(Math.random() * 1000));
    let category_ids = subcategory;

    let data = {
      product: {
        sku: sku,
        name: name,
        attribute_set_id: 4,
        price: price,
        status: 1,
        visibility: 4,
        type_id: 'simple',
        weight: '1',
        custom_attributes: [
          {
            attribute_code: 'category_ids',
            value: [category, subcategory],
          },
          {
            attribute_code: 'color',
            value: '5478',
          },
          {
            attribute_code: 'size',
            value: '5749',
          },
        ],
        media_gallery_entries: [],
        extension_attributes: {
          category_links: [
            {
              position: 0,
              category_id: '3',
            },
            {
              position: 0,
              category_id: '4',
            },
          ],
          stock_item: {
            qty: '10',
            is_in_stock: true,
          },
        },
      },
    };

    const handleOnchange = (text, input) => {
      setInputs(prevState => ({...prevState, [input]: text}));
    };

    const handleError = (error, input) => {
      setErrors(prevState => ({...prevState, [input]: error}));
    };

    // useEffect(() => {
    //   console.log("img id==>", categoryId)
    //   // data.media_gallery_entries.map(val => {
    //   //   console.log("data ==> ", val.content.name);
    //   // })
    // }, [categoryId])

    useEffect(() => {
      console.log('data ==>', data);
      console.log('subcategory ==>', subcategory);
      // data.media_gallery_entries.map(val => {
      //   console.log("data ==> ", val.content.name);
      // })
    }, [data]);

    // const images = new Array(6);

    return (
      <SafeAreaView style={styles.container}>
        <Loader visible={loading} />
        <View style={{paddingTop: calcH(0.01), paddingHorizontal: calcW(0.06)}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: calcW(0.02)}}>
              <View style={styles.imageIcons}>
                {data.media_gallery_entries.length == 0
                  ? images.map((val, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => productImg()}
                        style={styles.iconsPad}>
                        <MaterialCommunityIcons
                          name="image-plus"
                          color={'#948e8e'}
                          size={calcH(0.03)}
                        />
                      </TouchableOpacity>
                    ))
                  : data.media_gallery_entries.map((val, i) => (
                      <TouchableOpacity key={i} onPress={() => productImg()}>
                        <Image
                          style={{
                            width: 41,
                            height: 41,
                            resizeMode: 'cover',
                            marginRight: 5,
                          }}
                          source={{
                            uri: `data:${val?.content?.type};base64,${val?.content?.base64_encoded_data}`,
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                {/* <TouchableOpacity onPress={() => productImg()} style={styles.iconsPad}>
                <MaterialCommunityIcons
                  name='image-plus'
                  color={'#948e8e'}
                  size={calcH(0.03)}
                />
              </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => productImg()} style={styles.iconsPad}>
                <MaterialCommunityIcons
                  name='image-plus'
                  color={'#948e8e'}
                  size={calcH(0.03)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => productImg()} style={styles.iconsPad}>
                <MaterialCommunityIcons
                  name='image-plus'
                  color={'#948e8e'}
                  size={calcH(0.03)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => productImg()} style={styles.iconsPad}>
                <MaterialCommunityIcons
                  name='image-plus'
                  color={'#948e8e'}
                  size={calcH(0.03)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => productImg()} style={styles.iconsPad}>
                <MaterialCommunityIcons
                  name='image-plus'
                  color={'#948e8e'}
                  size={calcH(0.03)}
                />
              </TouchableOpacity> */}
              </View>
              {/* <View style={{}}>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker>
            </View> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#4B4B52',
                  marginBottom: 10,
                }}>
                <Picker
                  selectedValue={category}
                  onValueChange={(item, i) => {
                    setCategory(item);
                    setCategoryId(i);
                  }}>
                  <Picker.Item
                    label="Product category"
                    value=""
                    style={{fontSize: 14, color: '#4B4B52'}}
                  />
                  {Categories.map((cats, i) => (
                    <Picker.Item
                      key={i}
                      label={cats.name}
                      value={cats.id}
                      style={{fontSize: 14, color: '#4B4B52'}}
                    />
                  ))}
                </Picker>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#4B4B52',
                  marginBottom: 10,
                }}>
                <Picker
                  selectedValue={subcategory}
                  onValueChange={item => setSubCategory(item)}>
                  <Picker.Item
                    label="Product sub category"
                    value=""
                    style={{fontSize: 14, color: '#4B4B52'}}
                  />
                  {Categories.map(cats => {
                    if (cats.id == category) {
                      return (
                        cats.categories != undefined &&
                        cats.categories.map((item, i) => (
                          <Picker.Item
                            key={i}
                            label={item.name}
                            value={item.id}
                            style={{fontSize: 14, color: '#4B4B52'}}
                          />
                        ))
                      );
                    }
                  })}
                </Picker>
              </View>
              {/* <Input
              onChangeText={text => handleOnchange(text, 'productCategory')}
              onFocus={() => handleError(null, 'productCategory')}
              placeholder={strings.PRODUCT_CATEGORY}
              error={errors.productCategory}
              inputContainer={true}
            />


            <Input
              onChangeText={text => handleOnchange(text, 'productSubCategory')}
              onFocus={() => handleError(null, 'productSubCategory')}
              placeholder={strings.PRODUCT_SUB_CATEGORY}
              error={errors.productSubCategory}
              inputContainer={true}
            /> */}
              <Input
                onChangeText={text => setName(text)}
                // onFocus={() => handleError(null, 'title')}
                placeholder={strings.PRODUCT_TITLE}
                error={errors.title}
                inputContainer={true}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'description')}
                onFocus={() => handleError(null, 'description')}
                placeholder={strings.DESCRIPTIOn}
                error={errors.description}
                inputContainer={true}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'price')}
                onFocus={() => handleError(null, 'price')}
                placeholder={strings.PRICE}
                error={errors.price}
                inputContainer={true}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'qty')}
                onFocus={() => handleError(null, 'qty')}
                placeholder={strings.QUANTITY}
                error={errors.qty}
                inputContainer={true}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'maxOrder')}
                onFocus={() => handleError(null, 'maxOrder')}
                placeholder={strings.MAX_ORDER}
                error={errors.maxOrder}
                inputContainer={true}
              />
              <Text>{strings.COLOR}</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {allColors.map((colors, i) => {
                  if (colors.value.length > 0) {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => setColor(colors.value)}
                        style={[
                          styles.colorsIcons,
                          color == colors.value && {borderWidth: 1, padding: 1},
                          // ,colors.color == "white" && { borderWidth: 0.5,width:15,height:15 }
                        ]}>
                        <Fontisto
                          name="rectangle"
                          color={colors.hexcode}
                          size={calcH(0.02)}
                        />
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
              <Text>{strings.SIZE}</Text>
              <View style={styles.sizeMainContainer}>
                <TouchableOpacity style={styles.sizesIcons}>
                  <Text style={styles.sizeColor}>{strings.XS}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizesIcons}>
                  <Text style={styles.sizeColor}>{strings.S}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizesIcons}>
                  <Text style={styles.sizeColor}>{strings.M}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizesIcons}>
                  <Text style={styles.sizeColor}>{strings.L}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizesIcons}>
                  <Text style={styles.sizeColor}>{strings.XL}</Text>
                </TouchableOpacity>
              </View>
              <Button
                title={strings.CAP_ADD_PRODUCT}
                bgColor={COLORS.BlackTie}
                height={40}
                fontSize={16}
                onPress={validate}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
}

AddProductScreen;
