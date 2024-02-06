import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Alert,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import styles from './style';

import {
  calcH,
  calcW,
  fSize,
  IMAGE_PATH,
  STORAGE_KEY,
  STYLES,
} from '../../../utils/constants/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import strings from '../../components/lng/LocalizedStrings';

import BottomSheet from 'reanimated-bottom-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import {createGet, createPut} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import mmkv from '../../../utils/constants/mmkv/index.js';

import NewPickerComponent from '../../components/NewPickerComponent';
import {
  CategoryPlaceholder,
  SubCategoryPlaceholder,
} from '../AddScreen/index.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';

import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import RenderHtml from 'react-native-render-html';
import {ScreenWidth} from '@rneui/base';
import {ScrollView} from 'react-native-gesture-handler';
import {FONTS} from '../../../conts/theme.js';
import {onlyNumbersRegex, priceRegex} from '../AddScreen2/index.js';
import CustomErrorText from '../../components/CustomText.js';

function EditProduct({navigation, route}) {
  const [productId, setProductId] = useState('');
  const [category, setCategory] = useState('');
  const [categoryIndx, setCategoryIndx] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [imgs, setImgs] = useState([]);
  const [updateImg, setUpdateImg] = useState([]);
  const [editimgs, setEditImgs] = useState([]);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [maxOrder, setMaxOrder] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [sku, setSku] = useState(false);
  const [review, setReview] = useState([]);
  const [editable, setEditable] = useState(true);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});

  const categoriesData = mmkv.get(STORAGE_KEY.CATEGORY);
  const allColors = mmkv.get(STORAGE_KEY.COLORS);
  const allSizes = mmkv.get(STORAGE_KEY.SIZES);
  const totalImgCount = editimgs?.length + imgs?.length;

  useEffect(() => {
    if (route?.params?.from == 'Home') {
      setEditable(false);
    }
  }, []);

  console.log('description', description.includes('<p>'));

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'richTextUpdate',
      dataListener => {
        if (dataListener) {
          setDescription(dataListener);
        }
      },
    );
    productDetails();
    getReview();

    return () => {
      listener.remove();
    };
  }, []);

  const sheetRef = useRef(null);
  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();

  const handleModalClick = () => {
    Keyboard.dismiss();
    setModal(!modal);
    modal ? sheetRef.current.snapTo(2) : sheetRef.current.snapTo(0);
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const productImg = type => {
    if (totalImgCount > 5) {
      Toast.show({
        text1: `You can upload only six images.`,
        type: 'error',
        position: 'bottom',
      });
      return null;
    }
    ImageCropPicker.openPicker({
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        let libImage = image.map((vals, i) => {
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
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
              name: name,
            },
          };
        });

        setImgs([...imgs, ...libImage]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reviewUrl = `${commonUrl.getProductReview}${route?.params?.sku}/reviews`;

  const getReview = async () => {
    setLoading(true);
    try {
      let result1 = await createGet({
        tokenType: 'admin',
        url: reviewUrl,
      });
      if (result1.status === 200) {
        setReview(result1.data);
      }
    } catch (error) {
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
    }
  };

  const productDetails = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: `${commonUrl.addProduct}/${route?.params?.sku}`,
      });
      console.warn("dataaaaaaaaaaa",result.data)
      if (result?.data) {
        if (result?.data.type_id === 'configurable') setEditable(false);
        let imgs = result?.data?.media_gallery_entries.map((vals, i) => {
          return vals?.file;
        });

        setEditImgs(imgs);
        setProductId(result?.data?.id);

        result?.data?.extension_attributes?.category_links.map((item, i) => {
          if (categoriesData != null) {
            categoriesData?.map(cats => {
              if (item.category_id == cats.value) {
                setCategory(item.category_id);
                if (cats.children_data != undefined) {
                  result?.data?.extension_attributes?.category_links.filter(
                    FilterItems => {
                      if (FilterItems.category_id != item.category_id) {
                        setSubCategory(FilterItems.category_id);
                      }
                    },
                  );
                }
              }
            });
          }
        });
        setName(result?.data?.name.trim());
        setSku(result?.data?.sku);
        result?.data?.custom_attributes.map(items => {
          if (items?.attribute_code == 'description') {
            setDescription(items?.value);
          }
          if (items?.attribute_code == 'color') {
            setColor(items?.value);
          }
          if (items?.attribute_code == 'size') {
            setSize(items?.value);
          }
          if (items?.attribute_code == 'special_price') {
            try {
              setSpecialPrice(Number(items?.value).toFixed(2));
            } catch (error) {
              Toast.show({
                text1: `${`Error setting special price`}`,
                type: 'error',
                position: 'bottom',
              });
            }
          }
          if (items?.attribute_code == 'mp_product_cart_limit') {
            setMaxOrder(items?.value);
          }
        });
        setPrice(result?.data?.price.toFixed(2).toString());
        setQuantity(
          result?.data?.extension_attributes?.stock_item?.qty.toString(),
        );

        setUpdateImg(result?.data?.media_gallery_entries);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = index => {
    const newarr = imgs.filter((img, i) => i != index);
    setImgs([...newarr]);
  };

  const updateProduct = async () => {
    setLoading(true);
    let category_ids = subcategory == '' ? [category] : [category, subcategory];
    let categorylink =
      subcategory == ''
        ? [
            {
              position: 0,
              category_id: category,
            },
          ]
        : [
            {
              position: 0,
              category_id: category,
            },
            {
              position: 0,
              category_id: subcategory,
            },
          ];
    let data1 =
      imgs.length == 0
        ? {
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
                  value: category_ids,
                },
                {
                  attribute_code: 'color',
                  value: color,
                },
                {
                  attribute_code: 'size',
                  value: size,
                },
                {
                  attribute_code: 'description',
                  value: description,
                },
                {
                  attribute_code: 'mp_product_cart_limit',
                  value: maxOrder,
                },
                {
                  attribute_code: 'special_price',
                  value: specialPrice,
                },
              ],
              extension_attributes: {
                category_links: categorylink,
                stock_item: {
                  qty: quantity,
                  is_in_stock: true,
                },
              },
            },
          }
        : {
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
                  value: category_ids,
                },
                {
                  attribute_code: 'color',
                  value: color,
                },
                {
                  attribute_code: 'size',
                  value: size,
                },
                {
                  attribute_code: 'description',
                  value: description,
                },
                {
                  attribute_code: 'mp_product_cart_limit',
                  value: '50',
                },
                {
                  attribute_code: 'special_price',
                  value: '90',
                },
              ],
              media_gallery_entries: imgs.concat(updateImg),
              extension_attributes: {
                category_links: categorylink,
                stock_item: {
                  qty: quantity,
                  is_in_stock: true,
                },
              },
            },
          };
    console.log('Send Data ==> ', data1);
    try {
      let result = await createPut({
        tokenType: 'admin',
        url: `${commonUrl.addProduct}/${route?.params?.sku}`,
        body: data1,
      });
      if (result) {
        setLoading(false);
        console.log('edit product response ==> ', result);
        Alert.alert('Edit Product', 'Product edited successfully.', [
          {text: 'Cancel'},
          {text: 'OK', onPress: () => navigation.navigate('home')},
        ]);
      }
    } catch (error) {
      setLoading(false);
      console.log('edit error ==> ', error);
      Alert.alert(
        'Edit Product Error',
        'Product edited failed. Please try again.',
        [{text: 'Cancel'}, {text: 'OK'}],
      );
    }
  };

  console.log('price', price);

  const validations = () => {
    let isValid = true;
    if (category == '') {
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
    } else if (description == '') {
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
    } else if (!priceRegex.test(specialPrice) || Number(specialPrice) < 0) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product special price.`,
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
    } else if (quantity == '') {
      isValid = false;
      Toast.show({
        text1: `Please enter product quantities.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (
      Number(quantity) <= 0 ||
      !onlyNumbersRegex.test(Number(quantity))
    ) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product quantity.`,
        type: 'error',
        position: 'bottom',
      });
    } else if (
      Number(maxOrder) < 0 ||
      !onlyNumbersRegex.test(Number(maxOrder))
    ) {
      isValid = false;
      Toast.show({
        text1: `Please enter a valid product max order number.`,
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
      updateProduct();
    }
  };

  const categoryDropDown = () => {
    return (
      <View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: '#4B4B52',
            marginBottom: 10,
            height: calcH(0.065),
          }}>
          <NewPickerComponent
            value={Number(category)}
            onValueChange={setCategory}
            items={categoriesData.map(item => ({
              label: item.label,
              value: item.value,
            }))}
            key={(i, index) => `${i}-${index}`}
            placeholder={CategoryPlaceholder}
          />
        </View>
        {categoriesData?.map(cats => {
          //console.log('cats.value', cats.value);
          if (cats.value === category) {
            return (
              <View
                key={i => `${i}-${cats.value}`}
                style={{
                  borderWidth: 0.5,
                  borderColor: '#4B4B52',
                  marginBottom: 10,
                  height: calcH(0.065),
                }}>
                <NewPickerComponent
                  value={Number(subcategory)}
                  onValueChange={setSubCategory}
                  items={cats.children_data}
                  //key={i => `${i}-${cats.value}`}
                  key={(i, index) => `${i}-${index}`}
                  placeholder={SubCategoryPlaceholder}
                />
              </View>
            );
          } else return null;
        })}
      </View>
    );
  };

  const RichText = useRef();

  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {
      console.log(
        'Toolbar click, selected items (insert end callback):',
        items,
      );
    });
  }

  const renderContent = () => {
    if (description) {
      return (
        <ScrollView>
          <View style={styles.bottomSheet}>
            <TouchableOpacity onPress={handleModalClick}>
              <View style={styles.headerDot} />
            </TouchableOpacity>
            <View style={{marginHorizontal: 5}}>
              <Text style={styles.text}>Editor</Text>
              <RichEditor
                disabled={editable ? false : true}
                //containerStyle={styles.editor}
                containerStyle={{height: calcH(0.06)}}
                ref={RichText}
                style={styles.rich}
                placeholder={'Start Writing Here'}
                initialContentHTML={description}
                onChange={text => setDescription(text)}
                editorInitializedCallback={editorInitializedCallback}
                useContainer={false}
              />
              <RichToolbar
                style={[styles.richBar]}
                editor={RichText}
                disabled={false}
                iconTint={'grey'}
                selectedIconTint={'pink'}
                disabledIconTint={'purple'}
                iconSize={25}
                // actions={[
                //   ...defaultActions,
                //   actions.setStrikethrough,
                //   actions.heading1,
                // ]}
              />

              <Text style={styles.text}>Result</Text>
              <View style={{flex: 1, borderWidth: 0.2}}>
                <ScrollView>
                  <RenderHtml
                    contentWidth={ScreenWidth}
                    source={{html: description}}
                    tagsStyles={{
                      body: {
                        whiteSpace: 'normal',
                        color: 'black',
                        fontSize: fSize(20),
                        //borderWidth: 1,
                      },
                      a: {
                        color: COLORS.white,
                        textDecorationLine: 'none',
                        fontSize: fSize(13),
                        fontFamily: 'Montserrat-Bold',
                        //lineHeight: 23,
                        //marginBottom: 16,
                      },
                      p: {
                        fontFamily: 'Montserrat-Regular**',
                        //lineHeight: 23,
                        color: COLORS.white,
                        fontSize: fSize(13),
                        // marginBottom: 16,
                      },
                      img: {display: 'none'},
                    }}
                  />
                  <View style={{height: calcH(0.15)}} />
                </ScrollView>
              </View>
            </View>
            <View style={{height: calcH(0.1)}} />
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View>
        <Loader visible={loading} />
        <View style={{paddingTop: calcH(0.01), paddingHorizontal: calcW(0.06)}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag">
            <View style={{marginVertical: calcW(0.02)}}>
              <View style={styles.imageIcons}>
                {editimgs.map((val, i) => (
                  <FastImage
                    key={i}
                    style={{
                      width: 41,
                      height: 41,
                      resizeMode: 'cover',
                      marginRight: 5,
                    }}
                    source={{
                      uri: `${IMAGE_PATH.PRODUCT_PATH}${val}`,
                    }}
                  />
                ))}
                {imgs.map((val, i) => {
                  return (
                    <TouchableOpacity key={i} onPress={() => removeImage(i)}>
                      <FastImage
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
                  );
                })}
                {totalImgCount < 6 && (
                  <TouchableOpacity
                    onPress={productImg}
                    style={styles.iconsPad}>
                    <MaterialCommunityIcons
                      name="image-plus"
                      color={'#948e8e'}
                      size={calcH(0.03)}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {categoryDropDown()}
              <TextInput
                style={styles.textInput1}
                placeholderTextColor="#4B4B52"
                onChangeText={e => setName(e)}
                value={name}
                placeholder="Product Title"
                editable={editable}
                returnKeyType="next"
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  if (editable) navigation.navigate('EditTag', {description});
                  else handleModalClick();
                }}>
                <View>
                  <View
                    style={{
                      borderWidth: 0.8,
                      borderColor: '#4B4B52',
                      paddingHorizontal: calcW(0.03),
                      color: '#4B4B52',
                      marginBottom: 10,
                      height: calcH(0.065),
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <ScrollView
                      contentContainerStyle={{
                        justifyContent: description.includes('<p>')
                          ? 'flex-start'
                          : 'center',
                        flex: 1,
                      }}>
                      <RenderHtml
                        contentWidth={ScreenWidth}
                        source={{html: description}}
                        tagsStyles={{
                          body: {
                            whiteSpace: 'normal',
                            color: 'black',
                            fontSize: fSize(13),
                          },
                          a: {
                            color: COLORS.black,
                            textDecorationLine: 'none',
                            fontSize: fSize(12),
                            fontFamily: 'Montserrat-Bold',
                          },
                          p: {
                            fontFamily: 'Montserrat-Regular**',
                            color: COLORS.black,
                            fontSize: fSize(12),
                          },
                          img: {display: 'none'},
                        }}
                      />
                    </ScrollView>
                    <View
                      style={{
                        justifyContent: 'center',
                      }}>
                      <MaterialIcons
                        name="expand-more"
                        color={COLORS.black}
                        size={calcH(0.03)}
                      />
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
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
                placeholder="Price"
                keyboardType="number-pad"
                editable={editable}
                ref={ref_input3}
                onFocus={() => handleError(false, 'price')}
                onBlur={() => {
                  priceRegex.test(price)
                    ? handleError(false, 'price')
                    : handleError(true, 'price');
                }}
                returnKeyType="next"
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
                editable={editable}
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
                placeholder="Quantity"
                keyboardType="number-pad"
                editable={editable}
                ref={ref_input4}
                returnKeyType="next"
                onFocus={() => handleError(false, 'quantity')}
                onEndEditing={() => {
                  onlyNumbersRegex.test(quantity)
                    ? handleError(false, 'quantity')
                    : handleError(true, 'quantity');
                }}
                onSubmitEditing={() => ref_input5.current.focus()}
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
                editable={editable}
                onFocus={() => handleError(false, 'maxOrder')}
                onEndEditing={() => {
                  onlyNumbersRegex.test(maxOrder)
                    ? handleError(false, 'maxOrder')
                    : handleError(true, 'maxOrder');
                }}
                placeholder="Max Order"
                keyboardType="number-pad"
                ref={ref_input5}
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
                          {borderWidth: size == sizes.value ? 2 : 0.8},
                        ]}>
                        <Text style={{color: COLORS.Profile_font_color}}>
                          {sizes.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
              <View style={{marginVertical: calcH(0.02)}}>
                {editable && (
                  <Button
                    title="Edit Product"
                    bgColor={COLORS.BlackTie}
                    height={40}
                    fontSize={16}
                    onPress={validations}
                    containerStyle={{
                      marginVertical: 1,
                      marginBottom: calcH(0.015),
                    }}
                  />
                )}
                <Button
                  title={`${review?.length} ${strings.REVIEWS}`}
                  bgColor={COLORS.BlackTie}
                  height={40}
                  fontSize={16}
                  onPress={() =>
                    navigation.navigate('RatingScreen', {
                      review: review,
                      productId,
                      name,
                      editimgs,
                    })
                  }
                  containerStyle={{
                    marginVertical: 1,
                    marginBottom: calcH(0.015),
                  }}
                />
                {route?.params?.from === 'Home' ? (
                  <View>
                    <Text
                      style={{...FONTS.Montserrat_med, fontSize: fSize(13)}}>
                      {strings.NOTE_EDIT_PRODUCT_FROM_HOME}
                    </Text>
                  </View>
                ) : null}
                {route?.params?.from !== 'Home' && editable === false ? (
                  <View>
                    <Text
                      style={{
                        ...FONTS.Montserrat_med,
                        fontSize: fSize(13),
                        marginBottom: calcH(0.02),
                      }}>
                      {strings.NOTE_NOTE_EDIT_PRODUCT_CONFIGURABLE}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={{height: calcH(0.07)}} />
            </View>
          </ScrollView>
        </View>
        <BottomSheet
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={true}
          ref={sheetRef}
          snapPoints={
            Platform.OS === 'ios'
              ? [calcH(0.89), calcH(0.4), 0]
              : [calcH(0.85), calcH(0.45), 0]
          }
          borderRadius={10}
          renderContent={renderContent}
          initialSnap={2}
          onCloseEnd={() => {
            Keyboard.dismiss();
            setModal(false);
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

export default EditProduct;
