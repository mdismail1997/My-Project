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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  createpost,
  createPut,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import mmkv from '../../../utils/constants/mmkv/index.js';
import Toast from 'react-native-toast-message';
import NewPickerComponent from '../../components/NewPickerComponent.js';
import {
  CategoryPlaceholder,
  placeholder,
  SubCategoryPlaceholder,
} from '../AddScreen/index.js';
import CustomErrorText from '../../components/CustomText.js';

export const onlyNumbersRegex = /^[0-9\s]*$/;
export const priceRegex = /^\d{0,8}(\.\d{1,2})?$/;

function AddProductScreen2({navigation}) {
  const [category, setCategory] = useState('');
  const [categoryIndx, setCategoryIndx] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [imgs, setImgs] = useState([]);
  const [selectColor, setSelectColor] = useState([]);
  const [selectColorValue, setSelectColorValue] = useState([]);
  const [size, setSize] = useState([]);
  const [sizeValue, setSizeValue] = useState([]);
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
            image_data: vals.data,
            type: vals.mime,
          };
        });
        //setImgs(imgs);
        setImgs([...imgs, ...libImage]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  let alphabets = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  let first = alphabets[Math.floor(Math.random() * alphabets.length)];
  let second = alphabets[Math.floor(Math.random() * alphabets.length)];
  let third = alphabets[Math.floor(Math.random() * alphabets.length)];

  const createBulkProducts = () => {
    const productData = [];
    for (let color of selectColor) {
      for (let s of size) {
        const data = {
          seller_id: customerDetails?.id,
          SaleWeight: 2,
          sku: (
            name +
            Math.floor(1000 + Math.random() * 9000) +
            first +
            second +
            third +
            s +
            color
          ).replaceAll(' ', '_'),
          ItemName: `${name} ${color} ${s}`,
          Price: price,
          color: Number(color),

          size: Number(s),

          product_images: ImageBase64Data,
          qty: quantity,
          description: discription,
          categories: `${category.toString()},${subcategory.toString()}`,

          special_price: specialPrice,
          ...(maxOrder && {mp_product_cart_limit: maxOrder}),
        };

        productData.push(data);
      }
    }

    return productData;
  };

  const ImageBase64Data = imgs.map(item => {
    return Object.assign({image_data: item.image_data});
  });

  const addProduct = async () => {
    setLoading(true);

    const productsData = createBulkProducts();
    const data = {
      data: {
        products_data: productsData,
        configurable_product_data: {
          seller_id: customerDetails?.id,
          SaleWeight: 2,
          sku: (
            name +
            Math.floor(1000 + Math.random() * 9000) +
            first +
            second +
            third +
            'config'
          ).replaceAll(' ', '_'),
          ItemName: name,
          categories: `${category.toString()},${subcategory.toString()}`,
          Price: price,
          color: 'Yes',
          size: 'Yes',
          child_sku: productsData.map(item => item.sku).join(),
          product_images: ImageBase64Data,
          qty: quantity,
          description: discription,
        },
      },
    };

    console.log('send data>>', data);
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.addConfigProduct}`,
        body: data,
      });

      if (result.status === 200) {
        console.log('add product responce ==> ', result.data);
      }
    } catch (error) {
      setLoading(false);
      console.log('addproduct error ==> ', error);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
      Toast.show({
        text1: `Product added successfully`,
        type: 'success',
        position: 'bottom',
      });
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
    } else if (!priceRegex.test(price) || Number(price) < 0) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (price.length > 0 && Number(price) <= Number(specialPrice)) {
      isValid = false;
      Toast.show({
        text1: `Special price cant be more than equal to price.`,
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
    } else if (quantity == '') {
      isValid = false;
      Toast.show({
        text1: `Please enter product quantities.`,
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
    } else if (!onlyNumbersRegex.test(quantity)) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product quantity.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (!onlyNumbersRegex.test(maxOrder)) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product max Order number.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (Number(quantity) < 0) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product price.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (selectColor[0] == '') {
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
    }
    if (isValid) {
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
                      uri: `data:${val?.type};base64,${val?.image_data}`,
                    }}
                  />
                </TouchableOpacity>
              ))}
              {imgs.length < 6 && (
                <TouchableOpacity
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
              <NewPickerComponent
                value={category}
                onValueChange={setCategory}
                items={categoriesData}
                placeholder={CategoryPlaceholder}
              />
            </View>

            {categoriesData?.map(cats => {
              if (cats.value == category) {
                return (
                  <View
                    key={(i, index) => `${i}${index}`}
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
                      key={(i, index) => `${i}${index}-${subcategory}`}
                      placeholder={SubCategoryPlaceholder}
                    />
                  </View>
                );
              }
            })}

            <TextInput
              style={[
                styles.textInput1,
                {
                  borderColor: errors?.name === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setName(e)}
              value={name}
              placeholder={`${strings.PRODUCT_TITLE}`}
              returnKeyType="next"
              onSubmitEditing={() => ref_input2.current.focus()}
            />

            <TextInput
              style={[
                styles.textInput1,
                {
                  borderColor: errors?.discription === true ? 'red' : '#4B4B52',
                },
              ]}
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
                styles.textInput1,
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
                styles.textInput1,
                {
                  borderColor:
                    errors?.specialPrice === true ? 'red' : '#4B4B52',
                },
              ]}
              placeholderTextColor="#4B4B52"
              onChangeText={e => setSpecialPrice(e)}
              value={specialPrice}
              placeholder={`${strings.Special_Price}`}
              keyboardType="number-pad"
              ref={ref_input4}
              returnKeyType="next"
              onFocus={() => handleError(false, 'specialPrice')}
              onEndEditing={() => {
                priceRegex.test(specialPrice)
                  ? handleError(false, 'specialPrice')
                  : handleError(true, 'specialPrice');
              }}
              onSubmitEditing={() => ref_input5.current.focus()}
            />
            {errors?.specialPrice && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_SPECIAL_PRICE}`}
              />
            )}
            <TextInput
              style={[
                styles.textInput1,
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
              returnKeyType="next"
              onFocus={() => handleError(false, 'quantity')}
              onEndEditing={() => {
                onlyNumbersRegex.test(quantity)
                  ? handleError(false, 'quantity')
                  : handleError(true, 'quantity');
              }}
              onSubmitEditing={() => ref_input6.current.focus()}
            />
            {errors?.quantity && (
              <CustomErrorText
                error={`${strings.PLEASE_ENTER_A_VALID_QUANTITY}`}
              />
            )}
            <TextInput
              style={[
                styles.textInput1,
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
                      onPress={() => {
                        setSelectColor(prevState => {
                          if (prevState.includes(colors.value)) {
                            return prevState.filter(
                              item => item !== colors.value,
                            );
                          } else {
                            return [...prevState, colors.value];
                          }
                        });
                        // setSelectColorValue(prevState => {
                        //   if (prevState.includes(colors.label)) {
                        //     return prevState.filter(
                        //       item => item !== colors.label,
                        //     );
                        //   } else {
                        //     return [...prevState, colors.label];
                        //   }
                        // });
                      }}
                      style={[
                        styles.colorsIcons,
                        selectColor.includes(colors.value)
                          ? {borderWidth: 1, padding: 1}
                          : {borderWidth: 0, padding: 0},
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
                      onPress={() => {
                        setSize(prevState => {
                          if (prevState.includes(sizes.value)) {
                            return prevState.filter(
                              item => item !== sizes.value,
                            );
                          } else {
                            return [...prevState, sizes.value];
                          }
                        });
                        // setSizeValue(prevState => {
                        //   if (prevState.includes(sizes.label)) {
                        //     return prevState.filter(
                        //       item => item !== sizes.label,
                        //     );
                        //   } else {
                        //     return [...prevState, sizes.label];
                        //   }
                        // });
                      }}
                      key={i}
                      style={[
                        styles.sizesIcons,
                        {borderWidth: size.includes(sizes.value) ? 2 : 0.8},
                        size.includes(sizes.value)
                          ? {borderWidth: 2, padding: 1}
                          : {borderWidth: 0.8, padding: 1},
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

export default AddProductScreen2;
