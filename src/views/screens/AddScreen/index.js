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
  TextInput,
  Platform,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import styles from './style';
import {
  API_TOKEN,
  calcH,
  calcW,
  STORAGE_KEY,
  STYLES,
} from '../../../utils/constants/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import strings from '../../components/lng/LocalizedStrings';

import ImageCropPicker from 'react-native-image-crop-picker';

import {
  createpost,
  createPut,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import mmkv from '../../../utils/constants/mmkv/index.js';
import Toast from 'react-native-toast-message';
import NewPickerComponent from '../../components/NewPickerComponent.js';
import {onlyNumbersRegex, priceRegex} from '../AddScreen2/index.js';
import CustomErrorText from '../../components/CustomText.js';

export const CategoryPlaceholder = {
  label: 'Select a category...',
  value: null,
  color: '#9EA0A4',
};

export const SubCategoryPlaceholder = {
  label: 'Select a Subcategory...',
  value: null,
  color: '#9EA0A4',
};

function AddProductScreen({navigation}) {
  const [category, setCategory] = useState('');
  const [categoryIndx, setCategoryIndx] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [imgs, setImgs] = useState([]);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [maxOrder, setMaxOrder] = useState('');
  const [discription, setDiscription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState('');

  const categoriesData = mmkv.get(STORAGE_KEY.CATEGORY);
  const allColors = mmkv.get(STORAGE_KEY.COLORS);
  const allSizes = mmkv.get(STORAGE_KEY.SIZES);
  const customerDetails = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const ref_input6 = useRef();

  const productImg = type => {
    ImageCropPicker.openPicker({
      includeBase64: true,
      multiple: true,
      mediaType: 'photo',
    })
      .then(image => {
        let libImage = image.map((vals, i) => {
          const imageUri = Platform.OS === 'ios' ? vals.sourceURL : vals.path;
          let x = imageUri.split('/');
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
              name: name.replace(/[( )]/g, ''),
            },
          };
        });

        setImgs([...imgs, ...libImage]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const addProduct = async () => {
    setLoading(true);
    let alphabets = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    let first = alphabets[Math.floor(Math.random() * alphabets.length)];
    let second = alphabets[Math.floor(Math.random() * alphabets.length)];
    let third = alphabets[Math.floor(Math.random() * alphabets.length)];
    let sku = (
      name +
      Math.floor(1000 + Math.random() * 9000) +
      first +
      second +
      third
    ).replaceAll(' ', '_');
    let category_ids = subcategory == '' ? [category] : [category, subcategory];
    let categorylink =
      subcategory == ''
        ? [
            {
              position: 0,
              category_id: category.toString(),
            },
          ]
        : [
            {
              position: 0,
              category_id: category.toString(),
            },
            {
              position: 0,
              category_id: subcategory.toString(),
            },
          ];

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
          color && {
            attribute_code: 'color',
            value: color,
          },
          size && {
            attribute_code: 'size',
            value: size,
          },
          {
            attribute_code: 'description',
            value: discription,
          },
          specialPrice && {
            attribute_code: 'special_price',
            value: specialPrice,
          },
          maxOrder && {
            attribute_code: 'mp_product_cart_limit',
            value: maxOrder,
          },
        ],
        media_gallery_entries: imgs,
        extension_attributes: {
          category_links: categorylink,
          stock_item: {
            qty: quantity,
            is_in_stock: true,
          },
        },
      },
    };

    console.log('Send Data ==> ', data);

    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.addProduct}`,
        body: data,
      });

      if (result) {
        console.log('add product responce ==> ', result.data);
      }
      const {id} = result.data;
      const assignSellerData = {
        data: {
          product_id: id,
          seller_id: customerDetails?.id,
        },
      };
      console.log('assignSellerData', assignSellerData);
      if (id != null) {
        let result2 = await createpost({
          tokenType: 'adminAdd',
          url: `${commonUrl.assignSeller}`,
          body: assignSellerData,
        });
        if (result2.status === 200) {
          Toast.show({
            text1: `Product added successfully`,
            type: 'success',
            position: 'bottom',
          });
        } else {
          Toast.show({
            text1: `Assign product to seller error`,
            type: 'error',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('addproduct error ==> ', error);
      Alert.alert('Add Product Error', `${error?.response?.data?.message}`, [
        {text: 'Cancel'},
        {text: 'OK'},
      ]);
    } finally {
      setLoading(false);
      navigation.navigate('home');
    }
  };

  const validations = () => {
    let isValid = true;
    if (imgs.length == 0) {
      isValid = false;
      Toast.show({
        text1: `Please select atleast one image.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (category == '') {
      isValid = false;
      Toast.show({
        text1: `Please select category.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (name == '') {
      isValid = false;
      Toast.show({
        text1: `Please enter product name.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (discription == '') {
      isValid = false;
      Toast.show({
        text1: `Please write the details about product.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (price == '') {
      isValid = false;
      Toast.show({
        text1: `Please enter product price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (Number(price) < 0 || !priceRegex.test(price)) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (!priceRegex.test(specialPrice)) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product special price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (Number(price) <= Number(specialPrice)) {
      isValid = false;
      Toast.show({
        text1: `Special price cant be more than equal to price`,
        type: 'error',
        position: 'bottom',
      });
    } else if (quantity == '') {
      isValid = false;
      Toast.show({
        text1: `Please enter product quantities.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (Number(quantity) < 1) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product quantity.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (Number(specialPrice) < 0) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product special price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (maxOrder.length > 0 && Number(quantity) < Number(maxOrder)) {
      isValid = false;
      Toast.show({
        text1: `Max order cant be greater than quantity.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (color == '') {
      isValid = false;
      Toast.show({
        text1: `Please select a color.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (size == '') {
      isValid = false;
      Toast.show({
        text1: `Please select a size.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (isValid) {
      addProduct();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const removeImage = index => {
    const newarr = imgs.filter((img, i) => i != index);
    setImgs([...newarr]);
  };

  //console.log('category', category);

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <View style={{paddingTop: calcH(0.01), paddingHorizontal: calcW(0.06)}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginVertical: calcW(0.02)}}>
            <View style={styles.imageIcons}>
              {imgs.map((val, i) => (
                <TouchableOpacity key={i} onPress={() => removeImage(i)}>
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
              {imgs.length < 6 && (
                <TouchableOpacity
                  //key={i}
                  onPress={() => productImg()}
                  style={styles.iconsPad}>
                  <MaterialCommunityIcons
                    name="image-plus"
                    color={'#948e8e'}
                    size={calcH(0.03)}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#4B4B52',
                marginBottom: 10,
                height: calcH(0.065),
              }}>
              {/* <Picker
                mode="dropdown"
                dropdownIconColor="#4B4B"
                dropdownIconRippleColor={COLORS.blue}
                style={{backgroundColor: COLORS.white}}
                selectedValue={parseInt(category, 10)}
                onValueChange={(item, i) => {
                  //console.log('debug: aa: ', item);
                  setCategory(item);
                }}>
                <Picker.Item
                  label="Product category"
                  value=""
                  style={{fontSize: 14, color: '#686870'}}
                />
                {categoriesData?.map((cats, i) => (
                  <Picker.Item
                    key={i}
                    //color={COLORS.black}
                    label={cats.name}
                    value={cats.id}
                    // style={{ fontSize: 14, color: '#4B4B52' }}
                    style={styles.pickerColor}
                  />
                ))}
              </Picker> */}
              <NewPickerComponent
                value={category}
                onValueChange={setCategory}
                items={categoriesData}
                //key={i => `${i}`}
                placeholder={CategoryPlaceholder}
              />
            </View>
            {/* <View
              style={{
                borderWidth: 0.5,
                borderColor: '#4B4B52',
                marginBottom: 10,
              }}>
              {categoriesData?.map(cats => {
                if (cats.value == category) {
                  return (
                    <NewPickerComponent
                      value={subcategory}
                      onValueChange={setSubCategory}
                      items={cats.children_data}
                      key={i => `${i}`}
                      placeholder={SubCategoryPlaceholder}
                    />
                  );
                }
              })}
            </View> */}
            {categoriesData?.map(cats => {
              console.log('cats.value', cats.value);
              if (cats.value == category) {
                return (
                  <View
                    key={(i, index) => `${i}${index}-`}
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#4B4B52',
                      marginBottom: 10,
                      height: calcH(0.065),
                    }}>
                    <NewPickerComponent
                      value={subcategory}
                      onValueChange={setSubCategory}
                      items={cats.children_data}
                      placeholder={SubCategoryPlaceholder}
                    />
                  </View>
                );
              } else return null;
            })}

            <TextInput
              style={styles.textInput}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setName(e)}
              value={name}
              placeholder={`${strings.PRODUCT_TITLE}`}
              returnKeyType="next"
              onSubmitEditing={() => ref_input2.current.focus()}
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setDiscription(e)}
              value={discription}
              placeholder={`${strings.DESCRIPTION}`}
              ref={ref_input2}
              returnKeyType="next"
              onSubmitEditing={() => ref_input3.current.focus()}
            />
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errors?.price === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setPrice(e)}
              value={price}
              placeholder={`${strings.Price}`}
              keyboardType="number-pad"
              ref={ref_input3}
              returnKeyType="next"
              onFocus={() => handleError(false, 'price')}
              onBlur={() => {
                priceRegex.test(price)
                  ? handleError(false, 'price')
                  : handleError(true, 'price');
              }}
              onSubmitEditing={() => ref_input4.current.focus()}
            />
            {errors?.price && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_PRICE}`}
              />
            )}
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor:
                    errors?.specialPrice === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setSpecialPrice(e)}
              value={specialPrice}
              placeholder={`${strings.Special_Price}`}
              onFocus={() => handleError(false, 'specialPrice')}
              onEndEditing={() => {
                priceRegex.test(specialPrice)
                  ? handleError(false, 'specialPrice')
                  : handleError(true, 'specialPrice');
              }}
              keyboardType="number-pad"
              ref={ref_input4}
              returnKeyType="next"
              onSubmitEditing={() => ref_input5.current.focus()}
            />
            {errors?.specialPrice && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_SPECIAL_PRICE}`}
              />
            )}
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errors?.quantity === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setQuantity(e)}
              value={quantity}
              placeholder={`${strings.QUANTITY}`}
              keyboardType="number-pad"
              ref={ref_input5}
              onFocus={() => handleError(false, 'quantity')}
              onEndEditing={() => {
                onlyNumbersRegex.test(quantity)
                  ? handleError(false, 'quantity')
                  : handleError(true, 'quantity');
              }}
              returnKeyType="next"
              onSubmitEditing={() => ref_input6.current.focus()}
            />
            {errors?.quantity && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_QUANTITY}`}
              />
            )}
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errors?.maxOrder === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setMaxOrder(e)}
              value={maxOrder}
              placeholder={`${strings.MAX_ORDER}`}
              keyboardType="number-pad"
              ref={ref_input6}
              onFocus={() => handleError(false, 'maxOrder')}
              onEndEditing={() => {
                onlyNumbersRegex.test(maxOrder)
                  ? handleError(false, 'maxOrder')
                  : handleError(true, 'maxOrder');
              }}
            />
            {errors?.maxOrder && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_MAX_ORDER}`}
              />
            )}
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
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {allSizes.map((sizes, i) => {
                if (sizes.value.length > 0) {
                  return (
                    <TouchableOpacity
                      onPress={() => setSize(sizes.value)}
                      key={i}
                      style={[
                        styles.sizesIcons,
                        {
                          borderWidth: size == sizes.value ? 2 : 0.8,
                        },
                      ]}>
                      <Text style={{color: COLORS.Profile_font_color}}>
                        {sizes.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
            <Button
              title={strings.CAP_ADD_PRODUCT}
              bgColor={COLORS.BlackTie}
              height={40}
              fontSize={16}
              onPress={validations}
            />

            <View style={{height: calcH(0.07)}} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AddProductScreen;
