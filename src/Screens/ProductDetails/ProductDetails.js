import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Modal,
  Pressable,
  TextInput,
  I18nManager
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header/Header';
import { Rating, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonDark from '../../Component/Common/ButtonDark';
import ButtonWhite from '../../Component/Common/ButtonWhite';
import Feather from 'react-native-vector-icons/Feather';
import Loder from '../../Component/Common/Lodar';
import { PutRequest, GetRequest, PostRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const windowWidth = Dimensions.get('window').width;

export default function ProductDetails(props) {
  const [loder, setLoder] = useState(false);
  const [token, setToken] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  // const [image, setImage] = useState([]);
  const [name, setName] = useState('');
  const [size, setsize] = useState([
    { id: 0, size: 'Small' },
    { id: 1, size: 'Medium' },
    { id: 2, size: 'Large' },
  ]);
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [reviewLength, setreviewLength] = useState('');
  const [totalPer, settotalPer] = useState('');
  const [modalShow, setmodalShow] = useState(false);
  const [modalShow2, setmodalShow2] = useState(false);
  const [review1, setreview1] = useState('');
  const [review2, setreview2] = useState('');
  const [review3, setreview3] = useState('');
  const [review, setreview] = useState('');
  const [nickname, setnickname] = useState('');
  const [Summary, setsummary] = useState('');
  const [data, setdata] = useState('');
  const [data1, setdata1] = useState([]);
  const [wish, setwish] = useState(false);
  const [itemm, setitemm] = useState('');
  const [imm, setimm] = useState('');
  const [dess, setdess] = useState('');
  const [smallImg, setsmallImg] = useState('');
  const [smallImg2, setsmallImg2] = useState('');
  const [smallImg3, setsmallImg3] = useState('');
  const [price1, setPrice1] = useState('');
  const [chooseC, setchooseC] = useState('');
  const [chooseS, setchooseS] = useState('');
  const [active, setactive] = useState(0);
  const [loc, setloc] = useState('')
  const [ress, setRes] = useState([])

  const [optionID, setOptionID] = useState('')
  const [optionValue, setOptionValue] = useState('')

  const [options, setOption] = useState([])

  useEffect(() => {
    selectedLng();
    getReviews();
    wishlistList();
    //allProducts();
    // getLocation();
    // getDetails();

    // if (props.route.params.fromScreen) {
    setDescription(props.route.params.description); 
    // console.warn("image============",props.route.params.image)
    setImage(props.route.params.image);
    setName(props.route.params.name);
    setPrice(props.route.params.price);
    setSku(props.route.params.sku);
    // } else {
    //   setName(props.route.params.image.name);
    //   setPrice(props.route.params.image.price);
    //   setSku(props.route.params.image.sku);

    // {
    //   props.route.params.image.custom_attributes.map(item => {
    //     if (item.attribute_code == 'image') {
    //       setImage(item.value);
    //     }
    //   });
    // }
    // {
    //   props.route.params.image.custom_attributes.map(item => {
    //     if (item.attribute_code == 'meta_description') {
    //       setDescription(item.value);
    //     }
    //   });
    // }
    // }
    setLoder(true);
    // setTimeout(() => {
    //   setLoder(true);
    // }, 3000);

    const unsubscribe = props.navigation.addListener('focus', () => {
      selectedLng();
      getReviews();
      wishlistList();
      //allProducts();
      getLocation();
      // getDetails();

    });

    return unsubscribe;
  }, []);

  selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }

  const addToCart = async () => {
    if (colors?.length !== 0 && chooseC == '') {
        Alert.alert('', 'Please select suitable color', [
            { text: ' ' },
            { text: strings.OK },
          ]);
    } else if (sizes?.length !== 0 && chooseS == '') {
      Alert.alert('', 'Please select suitable size', [
        { text: ' ' },
        { text: strings.OK },
      ]);
    } 
    
    else {
      setLoder(true);
      const token = await AsyncStorage.getItem('cartToken');
      console.log("iiiiiiii",token)
      let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
      const data = {
        cartItem: {
          quote_id: token,
          sku: sku,
          qty: count,

          product_option:
          options.length !== 0 
            ? {
                extension_attributes: {
                  custom_options: [
                    {
                      option_id: optionID,
                      option_value: optionValue,
                    },
                  ],
                },
              }
            : colors.length !== 0 && sizes.length !== 0
            ? {
                extension_attributes: {
                  configurable_item_options: [
                    {
                      option_id: '93',
                      option_value: chooseC,
                    },
                    {
                      option_id: '142',
                      option_value: chooseS,
                    },
                  ],
                },
              }
            : sizes.length !== 0
            ? {
                extension_attributes: {
                  configurable_item_options: [
                    {
                      option_id: '93',
                      option_value: chooseC,
                    },
                  ],
                },
              }
            : colors.length !== 0
            ? {
                extension_attributes: {
                  configurable_item_options: [
                    {
                      option_id: '93',
                      option_value: chooseC,
                    },
                  ],
                },
              }
            : '',

          
        },
      };
      // console.log("iiiiiiiiiiiiiiiiiiii",data.cartItem.product_option.extension_attributes)
      console.log("iiiiiiiiiiiiiiiiiiii",data)
      // await PostRequest(`carts/${token}/items`, data, {}, 'admin')


      await axios({
        method: 'POST',
        url: `https://traders-platform.com/rest/V1/carts/${token}/items`,
        headers: {
          authorization: `Bearer ${Test_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: data,
      })
        .then(res => {
          setLoder(false);
          console.log('add to cart==================== ', res.data);
          setmodalShow2(!modalShow2);
          
          // Alert.alert(strings.ADDTOCART, res?.message, [
          //   { text: strings.CANCEL },
          //   { text: strings.OK },
          // ]);

          
        })
        .catch(error => {
          setLoder(false);
          console.log('Add to Cart error => ', error.response.data.message);
          if (error.response.data.message == 'The requested qty is not available' || error.response.data.message == 'Product that you are trying to add is not available.') {
            Alert.alert('','The requested quantity is not available', [
              { text: strings.CANCEL },
              { text: strings.OK, onPress :()=> {
                props.navigation.navigate('DashBoard')
              }},
            ])
          }
         
        });
    }
  };


  const ToCart = async () => {
   console.log("11111111111111")
      setLoder(true);
      const token = await AsyncStorage.getItem('cartToken');
      console.log("iiiiiiii",token)
      let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
      const data = {
        cartItem: {
          quote_id: token,
          sku: sku,
          qty: count,

          // product_option:'',

          
        },
      };
      // console.log("iiiiiiiiiiiiiiiiiiii",data.cartItem.product_option.extension_attributes)
      console.log("iiiiiiiiiiiiiiiiiiii",data)
      // await PostRequest(`carts/${token}/items`, data, {}, 'admin')

      console.log("222222222222")
      await axios({
        method: 'POST',
        url: `https://traders-platform.com/rest/V1/carts/${token}/items`,
        headers: {
          authorization: `Bearer ${Test_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: data,
      })
        .then(res => {
          console.log("333333333333333")
          setLoder(false);
          console.log('add to cart==================== ', res.data);
          setmodalShow2(!modalShow2);
          
          // Alert.alert(strings.ADDTOCART, res?.message, [
          //   { text: strings.CANCEL },
          //   { text: strings.OK },
          // ]);

          
        })
        .catch(error => {
          setLoder(false);
          console.log('Add to Cart error => ', error.response.data.message);
          if (error.response.data.message == 'Product that you are trying to add is not available.') {
            Alert.alert('','The requested quantity is not available', [
              { text: strings.CANCEL },
              { text: strings.OK, onPress :()=> {
                props.navigation.navigate('DashBoard')
              }},
            ])
          }
         
        });
  
  };

  getLocation = () => {
    GetRequest('location', undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.warn('Get location => ', res[0].current_code);
        setloc(res[0].current_code)
      })
      .catch(error => {
        setLoder(false);
        // console.warn('Get location error => ', error);
      });
  };

  const allProducts = () => {
    // setLoder(true)
    GetRequest('products?searchCriteria=', undefined, {}, 'admin')
      .then(res => {
        // setLoder(false);
        if (res.items) {
          // console.warn(res.items);
          setdata1(res.items);
          //setRes(res.items)
          // getDetails(res.items);


        }

        // console.log('Get All Products => ', res);
      })
      .catch(error => {
        setLoder(false);
        console.log('Get All Products error => ', error);
      });
  };

  wishlist = () => {
    // console.warn('sku', props.route.params.sku)
    setLoder(true);
    PutRequest(
      `wishlist/${props.route.params.sku}`,
      {},
      {},
      'self',
    )
      .then(res => {
        setLoder(false);
        // console.warn('wishlist responce => ', res);
        wishlistList();
        // alert('Product added to wishlist successfully')
      })
      .catch(error => {
        setLoder(false);
        console.warn('wishlist error => ', error.response);
      });
  };

  wishlistList = () => {
    setLoder(true);
    // console.warn('props.route.params.sku', props.route.params.sku)

    GetRequest('wishlist', undefined, {}, 'self')
      .then(response => {
        setLoder(false);
        // console.warn('wishlist list', response);
        response.items.map(i => {
          if (
            i.product.sku == props.route.params.sku
          ) {
            setwish(true);
            setitemm(i);
          }
        });
      })
      .catch(error => {
        setLoder(false);
        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert(strings.SESSION, '', [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                logout2();
              },
            },
          ])
        }
        // console.warn('wishlist list err', error.response);
      });
  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false)
      props.navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  const removeWish = async () => {
    setLoder(true);
    // console.warn('bvhsdo', itemm.id);
    let AccessToken = await AsyncStorage.getItem('traderToken');
    let headers =
      AccessToken == null
        ? {
          'Content-Type': 'application/json',
        }
        : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AccessToken}`,
        };
    axios
      .delete(
        `https://traders-platform.com/rest/V1/wishlist/${itemm.id}`,
        { headers },
      )
      .then(() => {
        setwish(false);
        setLoder(false);
      })
      .catch(error => {
        setLoder(false);
        // console.warn('There is an error!', error);
      });
  };

  const getDetails = (ressdata) => {
    // setLoder(true);
    // console.warn(
    //   'props.route.params.skuprops.route.params.sku',
    //   props.route.params.sku,
    // );
    GetRequest(
      `products/${props.route.params.sku}`,
      undefined,
      {},
      'admin',
    )
      .then(res => {      
        // setLoder(false);
        console.warn("Product details responce3333333333333333333 => ", res);
        let Arr = [];

        res.custom_attributes.map(i => {
          if (i.attribute_code == 'category_ids') {
            Arr.push(i.value);
          }
        });


        if (res.options.length !== 0) {
          // this.setState({
          //   optionID: res.options[0].option_id,
          // });
          setOptionID(res.options[0].option_id)
          res.options.map(i => {
            setOption(i.values)
            // this.setState({
            //   options: i.values,
            //   dropdownShow: true,
            // });
            // if (i.title == 'Color') {
            //     this.setState({
            //         options: i.values
            //     })
            // }
          });
        }

        

        let col = [];
        let siz = [];
        res.extension_attributes?.configurable_product_options?.map(item => {
          if (item.attribute_id == '93') {
            col.push(item.values);
          }

          if (item.attribute_id == '142') {
            siz.push(item.values);
          }

          // if (item.attribute_id == '179') {
          //     wts.push(item.values)
          // }
        });
        // console.warn('collllllllllllllll0', col);
        setColors(col);
        setSizes(siz);

        res.custom_attributes.map(item => {
          if (item.attribute_code == 'image') {
            // setState({
            //     image: item.value,
            // })
            setimm(item.value);
          }
        });
        res.custom_attributes.map(item => {
          if (item.attribute_code == 'description') {
            setdess(item.value);
            // setState({
            //     description: item.value,
            // })
          }
        });
        const images = [];
        res.media_gallery_entries.map((item, index) => {
          if (item.media_type == 'image') {
            images.push(item);
          }
        });

        // console.warn('images', images);
        if (images == '') {
          // console.warn(true)
        } else {
          setsmallImg(images[0].file);
          setsmallImg2(images.length <= 1 ? null : images[1].file);
          setsmallImg3(images.length <= 2 ? null : images[2].file);

          // setState({
          //     smallImg: images[0].file,
          //     smallImg2: images.length <= 1 ? null : images[1].file,
          //     smallImg3: images.length <= 2 ? null : images[2].file,
          // })
        }

        // setState({ data: res, price1: res.price })
        setdata(res);
        setPrice1(res.price);
        // console.warn('cart', state.data.id)

        let priceee = ''
        if (res.type_id == 'configurable') {

          ressdata.map(ids => {
            if (res.extension_attributes.configurable_product_links[0] == ids.id) {
              // console.warn('section', ids)
              priceee = ids.price
              setPrice1(priceee);

            }
          })


        }
        // console.warn('hfddddddddddddddddds', priceee, ressdata);
        // console.warn(res.custom_attribu)
      })

      .catch(error => {
        setLoder(false);
        // console.warn('Product details error => ', error.response);
      });
  };

  const getReviews = id => {
    if (modalShow) {
      setmodalShow(!modalShow);
    }
    setLoder(true);
    GetRequest(
      `products/${props.route.params.sku}/reviews`,
      undefined,
      {},
      'admin',
    )
      .then(res => {
        setLoder(false);
        // console.warn('review details responce => ', res);
        setreviewLength(res.length);
        if (res.length != 0) {
          let total = [];
          res.forEach(element => {
            let count = 0;
            let valueAdded = 0;

            for (let i = 0; i < element.ratings.length; i++) {
              count = parseInt(element.ratings[i].percent);
              valueAdded += count;
            }
            total.push(valueAdded);
          });
          let totalMarks = total.length * 300;
          let count1 = 0;
          let valueAdded1 = 0;
          for (let i = 0; i < total.length; i++) {
            count1 = parseInt(total[i]);
            valueAdded1 += count1;
          }
          let revierPer = ((5 * valueAdded1) / totalMarks).toFixed(1);
          settotalPer(revierPer);

          // console.warn('revierPer', revierPer);
        } else settotalPer(0);
      })
      .catch(error => {
        setLoder(false);
        // console.warn('getrevie details error => ', error);
      });
  };

  const renderItem = item => {
    return (
      <View
        style={{
          margin: 5,
          width: 50,
          height: 55,
          backgroundColor: '#4B4B52',
          justifyContent: 'center',
        }}>
        <Text style={{ color: '#ffffff', fontSize: 10, alignSelf: 'center' }}>
          {item.item.size}
        </Text>
      </View>
    );
  };

  ratingCompleted1 = rating => {
    setreview1(rating);
    // console.warn('Rating is:1 ', rating);
  };

  ratingCompleted2 = rating => {
    setreview2(rating);
    // console.warn('Rating is:2 ', rating);
  };

  ratingCompleted3 = rating => {
    setreview3(rating);
    // console.warn('Rating is:3 ', rating);
  };

  const addReview = async () => {
    // console.warn(
    //   'dfs',
    //   sku,
    //   review,
    //   nickname,
    //   review1,
    //   review2,
    //   review3,
    //   data.id,
    // );
    setLoder(true);
    const senddata = {
      review: {
        title: sku,
        detail: review,
        nickname: nickname,
        ratings: [
          {
            rating_name: 'Rating',
            value: 1,
          },
          {
            rating_name: 'Quality',
            value: review1,
          },
          {
            rating_name: 'Value',
            value: review2,
          },
          {
            rating_name: 'Price',
            value: review3,
          },
        ],
        review_entity: 'product',
        review_status: 1,
        entity_pk_value: data.id,
      },
    };

    // console.warn(data);

    await PostRequest(`reviews/`, senddata, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.warn('reviews ', res);
        if (res) {
          Alert.alert(strings.REVIEW_SUBMIT, '', [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => {
                props.navigation.navigate('CustomerReview', {
                  sku: props.route.params.sku,
                  totalPer: totalPer,
                  reviewLength: reviewLength,
                  itemid: props.route.params.sku,
                  id: data.id,
                });
              },
            },
          ]);
        } else {
          Alert.alert(strings.REVIEW_SUBMIT, res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        }
      })
      .catch(error => {
        // console.warn(error.response);
        setLoder(false);
        Alert.alert(strings.REVIEW_SUBMIT_FAILED, '', [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };
  // console.log("color",chooseC)
  selectClr = clr => {
    setchooseC(clr);
// console.log("kkkkkkkkk",chooseC)
    data1.map(item => {
      data.extension_attributes?.configurable_product_links?.map(val => {
        if (val == item.id) {
          item.custom_attributes?.map(clrr => {
            if (clrr.attribute_code == 'color') {
              if (clr == clrr.value) {
                item.custom_attributes?.map(i => {
                  if (i.attribute_code == 'image') {
                    setImage(i.value);
                  }
                });
                const images = [];

                item.media_gallery_entries.map((item, index) => {
                  if (item.media_type == 'image') {
                    images.push(item);
                  }
                });
                if (images == '') {
                } else {
                  setsmallImg(images[0].file);
                  setsmallImg2(images.length <= 1 ? null : images[1].file);
                  setsmallImg3(images.length <= 2 ? null : images[2].file);
                }
              }
            }
          });
        }
      });
    });
  };

  selectSize = size => {
    setchooseS(size);
    // console.warn(data1, data);
    data1.map(item => {
      data.extension_attributes?.configurable_product_links?.map(val => {
        if (val == item.id) {
          item.custom_attributes?.map(clrr => {
            if (clrr.attribute_code == 'size') {
              if (size == clrr.value) {
                // console.warn('clrr.valueclrr.value', item);
                setPrice1(item.price);
              }
            }
          });
        }
      });
    });
  };

  checkoutProcess = () => {
    setmodalShow2(!modalShow2);
    props.navigation.navigate('Cart');
  };


  const imgfunc=(image)=>{

    let url1='https://traders-platform.com/pub/media/catalog/product/'

    if(image.includes('https://') || image.includes('http://')){
      url1 =''
    }
// console.log("url1+image========>",url1+image)

    return url1+image
   
  }

  return (
    <View style={styles.container}>
      {loder && <Loder />}


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalShow}
        onRequestClose={() => setmodalShow(!modalShow)}>
        <View style={styles.centeredView}>
          <ScrollView>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => setmodalShow(!modalShow)}
                style={{ marginHorizontal: 10, alignSelf: 'flex-end' }}>
                <Feather name="x" color={'#000'} size={30} solid />
              </Pressable>
              <View style={{ alignItems: 'flex-start' }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {strings.YOUAREREVIEWING}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {props.route.params.sku}
                </Text>
                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.YOURRATING}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.QUANTITY}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={ratingCompleted1}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.VALUE}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={ratingCompleted2}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.PRICE}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={ratingCompleted3}
                    />
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.NICKNAME}
                </Text>
                <Input
                  value={nickname}
                  inputContainerStyle={{
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    borderWidth: 0.3,

                  }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    paddingVertical: -1,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => {
                    setnickname(e);
                  }}
                />

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.SUMMARY}
                </Text>
                <Input
                  value={Summary}
                  inputContainerStyle={{
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    borderWidth: 0.3,
                  }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    paddingVertical: -1,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => {
                    setsummary(e);
                  }}
                />

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.REVIEW2}
                </Text>
                {/* <Input
                                    inputContainerStyle={{ borderBottomWidth: 0.3, marginTop: 5, borderColor: "#676767", borderWidth: 0.3, height: 100 }}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    inputStyle={{ fontSize: 16, fontFamily: "Roboto-Regular", }}
                                    errorStyle={{ display: "none" }}
                                    onChangeText={(e) => { }}
                                /> */}
                <TextInput
                  value={review}
                  multiline={true}
                  numberOfLines={10}
                  onChangeText={text => setreview(text)}
                  style={{
                    textAlignVertical: "top",
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    color: '#000',
                    borderWidth: 0.3,
                    height: 100,
                    width: windowWidth - 90,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                />
                <TouchableOpacity
                  style={{ width: 150, alignSelf: 'center' }}
                  onPress={() => addReview()}>
                  <View
                    style={{
                      backgroundColor: '#676767',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginVertical: 10,
                      paddingVertical: 7,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontFamily: 'Roboto-Regular',
                        letterSpacing: 2,
                        fontWeight: 'bold',
                      }}>
                      {strings.SUBMITREVIEW}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalShow2}
        onRequestClose={() => setmodalShow2(!modalShow2)}

        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                color: '#5A5A5F',
                fontFamily: 'Roboto-Regular',
                fontWeight: 'bold',
              }}>
              {strings.ADDEDCART}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    color: '#5A5A5F',
                    fontFamily: 'Roboto-Regular',
                    width: 160,
                    fontWeight: '700',
                  }}>
                  {name}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#5A5A5F',
                    fontFamily: 'Roboto-Regular',
                    fontWeight: '700',
                  }}>
                  {strings.CARTTOTAL}
                </Text>
                <Text
                  style={{ color: '#000', fontSize: 14, alignSelf: 'flex-end' }}>
                  {strings.AED}{' '}
                  {price1 == ''
                    ? props.route.params.price
                    : price1
                  }
                  /-
                </Text>
              </View>
            </View>
            <Image
              source={{
                uri:  image ? imgfunc(image) : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
            
                // 
              }}


            
              style={{ width: 200, height: 200, alignSelf: 'center' }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => checkoutProcess()}
                style={styles.button2}>
                <Text style={[styles.buttontext2, { paddingHorizontal: 10 }]}>
                  {strings.CHECKOUT}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('DashBoard');
                }}
                style={styles.button2}>
                <Text style={[styles.buttontext2, { paddingHorizontal: 10 }]}>
                  {strings.CONTISHOPPING}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Header
        title={strings.PRODETAILS}
        navigation={props.navigation}
        icon="arrowleft"
      />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* <View style={{ borderBottomWidth: 1 }}> */}
        <Image
          source={{
           // uri:imgfunc(image),
           uri :  image ? imgfunc(image) : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
          }}
          style={{ width: width, height: height / 3, alignSelf: 'center', }}
          resizeMode='contain'
        />
        {/* </View> */}
        <View style={{ position: 'absolute', right: 0 }}>
          <TouchableOpacity
            onPress={() => {
              wish == true ? removeWish() : wishlist();
            }}
            style={{
              height: 40,
              width: 40,
              borderRadius: 30,
              backgroundColor: '#fff',
              marginTop: 30,
              elevation: 10,
              justifyContent: 'center',
              marginRight: 20,
            }}>
           
            {wish == true ? (
              <AntDesign
                name="heart"
                size={25}
                color={'#FDB833'}
                style={{ alignSelf: 'center' }}
              />
            ) : (
              <AntDesign
                name="hearto"
                size={25}
                color={'#808080'}
                style={{ alignSelf: 'center' }}
              />
            )}
          </TouchableOpacity>
         
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            width: width,
            height: height / 2,
            borderRadius: 50,
            position: 'absolute',
            marginTop: height / 3,
            paddingHorizontal: 15,
            paddingBottom: 0,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 20,
                    marginBottom: 10,
                    color: '#5A5A5F',
                    fontFamily: 'Roboto-Regular',
                    width: width / 1.5
                  }}>
                  {name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'row' }}>
                    {data1.weight ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#676767',
                          padding: 10,
                          borderRadius: 5,
                        }}>
                        <Text style={{ color: '#fff', fontSize: 20 }}>
                          {data1.weight} kg
                        </Text>
                        {/* <AntDesign style={{ color: '#FFF', fontSize: 14 }} name={'caretdown'} solid /> */}
                      </TouchableOpacity>
                    ) : null}
                    <Text style={{ color: '#000', fontSize: 20 }}>
                      {strings.AED}{' '}
                      {price1 == ''
                        ? props.route.params.price
                        :
                        price1}
                      /-
                    </Text>
                    
                  </View>
                  {/* <Text style={{ fontSize: 14, marginTop: 10, color: "#5A5A5F", fontFamily: "Roboto-Regular" }}>MRP:</Text>
                                    <Text style={{ fontSize: 14, marginTop: 10, color: "#5A5A5F", fontFamily: "Roboto-Regular", fontWeight: '800' }}> {price}</Text>
                                    <Text style={{ fontSize: 14, marginTop: 10, color: "#37E118", fontFamily: "Roboto-Regular", }}>  Save aed 98</Text> */}
                </View>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    onPress={() => {
                      setactive(0);
                    }}>
                    <Image
                      style={[styles.itemimg, { opacity: active == 0 ? 1 : 0.5 }]}
                      source={{
                        uri: `https://traders-platform.com/pub/media/catalog/product${smallImg}`,
                      }}
                    />
                  </TouchableOpacity>
                  {smallImg2 ? (
                    <TouchableOpacity onPress={() => setactive(1)}>
                      <Image
                        style={[
                          styles.itemimg,
                          { opacity: active == 1 ? 1 : 0.5 },
                        ]}
                        source={{
                          uri: `https://traders-platform.com/pub/media/catalog/product${smallImg2}`,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {smallImg3 ? (
                    <TouchableOpacity onPress={() => setactive(2)}>
                      <Image
                        style={[
                          styles.itemimg,
                          { opacity: active == 2 ? 1 : 0.5 },
                        ]}
                        source={{
                          uri: `https://traders-platform.com/pub/media/catalog/product${smallImg3}`,
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </ScrollView>
              </View>
            </View>
            {/* <Text style={{ fontSize: 14, color: "#5A5A5F", fontFamily: "Roboto-Regular" }}>aed98</Text> */}

            {/* <View style={{ flexDirection: 'row' }}>
                            <Image source={require(`../../Assets/star.png`)} style={{ width: 20 }} resizeMode='contain' />
                            <Image source={require(`../../Assets/star.png`)} style={{ width: 20, marginLeft: 5 }} resizeMode='contain' />
                            <Image source={require(`../../Assets/star.png`)} style={{ width: 20, marginLeft: 5 }} resizeMode='contain' />
                            <Image source={require(`../../Assets/star.png`)} style={{ width: 20, marginLeft: 5 }} resizeMode='contain' />
                            <Image source={require(`../../Assets/star2.png`)} style={{ marginTop: 6.5, width: 20, marginLeft: 5 }} resizeMode='contain' />
                        </View> */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <Rating
                type="custom"
                ratingColor="#e95f42"
                ratingBackgroundColor="#ddd"
                tintColor="#FFF"
                // fractions={1.1}
                startingValue={totalPer}
                imageSize={20}
                readonly
              />
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('CustomerReview', {
                    sku: props.route.params.sku,
                    totalPer: totalPer,
                    reviewLength: reviewLength,
                    id: data.id,
                    itemid: props.route.params.id,
                  });
                }}>
                {/* <TouchableOpacity>s */}
                {/* <Text style={{ color: '#e95f42', marginLeft: 10 }}>reviews</Text> */}
                <Text style={{ color: '#e95f42', marginLeft: 10 }}>
                  {reviewLength} {reviewLength == 1 ? strings.REVIEW : strings.REVIEWS}{' '}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setCount(count - 1);
                }}
                style={{
                  marginTop: 6,
                  width: 25,
                  height: 25,
                  backgroundColor: '#4B4B52',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require(`../../Assets/minus.png`)}
                  style={{ width: 13, alignSelf: 'center' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 6,
                  width: 25,
                  height: 25,
                  backgroundColor: '#4B4B52',
                  marginLeft: 5,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ alignSelf: 'center', color: '#ffffff', fontSize: 13 }}>
                  {count < 1 ? '1' : count}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setCount(count + 1);
                }}
                style={{
                  marginTop: 6,
                  width: 25,
                  height: 25,
                  backgroundColor: '#4B4B52',
                  marginLeft: 5,
                  justifyContent: 'center',
                }}>
                <Image
                  source={require(`../../Assets/plus.png`)}
                  style={{ width: 13, alignSelf: 'center' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {colors?.length !== 0 ? 
              <Text style={{marginTop: 6,
                color: '#4B4B52',fontSize:16,}}>Color</Text>
             :null
             }

            <FlatList
              data={colors[0]}
              keyExtractor={(item, index) => item.id}
              horizontal
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => selectClr(item.value_index)}>
                    <View
                      style={{
                        marginLeft: 5,
                        width: 30,
                        height: 30,
                        borderRadius: 150 / 2,
                        backgroundColor: item.value_hash,
                        borderColor:
                          chooseC == item.value_index ? 'red' : '#4B4B52',
                        borderWidth: 2,
                      }}></View>
                  </TouchableOpacity>
                );
              }}
              scrollEnabled={true}
            />

            {sizes?.length !== 0 ? 
              <Text style={{color:'#000',fontSize:16,marginTop: 5,}}>Size</Text>
             :null
             }
      

            <FlatList
              data={sizes[0]}
              keyExtractor={(item, index) => item.id}
              horizontal
              renderItem={({ item, index }) => {
                // console.warn('item', item);
                let size = '';
                if (item.value_index == '5758') {
                  size = 'XXL';
                } else if (item.value_index == '5594') {
                  size = 'XS';
                } else if (item.value_index == '5595') {
                  size = 'S';
                } else if (item.value_index == '5596') {
                  size = 'M';
                } else if (item.value_index == '5597') {
                  size = 'L';
                } else if (item.value_index == '5598') {
                  size = 'XL';
                } else if (item.value_index == '5599') {
                  size = '28';
                } else if (item.value_index == '5761') {
                  size = '30';
                } else if (item.value_index == '5762') {
                  size = '32';
                } else if (item.value_index == '5763') {
                  size = '34';
                } else if (item.value_index == '5746') {
                  size = '36';
                } else if (item.value_index == '5748') {
                  size = '38';
                } else if (item.value_index == '5727') {
                  size = '8';
                } else if (item.value_index == '5728') {
                  size = '7';
                } else if (item.value_index == '5730') {
                  size = '8';
                } else if (item.value_index == '5732') {
                  size = '9';
                } else if (item.value_index == '5734') {
                  size = '10';
                }
                return (
                  <TouchableOpacity
                    onPress={() => selectSize(item.value_index)}>
                    <View
                      style={{
                        marginTop: 10,
                        marginLeft: 5,
                        width: 40,
                        height: 40,
                        backgroundColor:
                          chooseS == item.value_index ? '#000' : '#fff',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 11,
                          color: chooseS == item.value_index ? '#fff' : '#000',
                        }}>
                        {item.value_label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              scrollEnabled={true}
            />

           

            <ButtonWhite
              handleClick={() => {
                //ToCart();
                addToCart();
              }}
              title={strings.ADDTOCART}
            />
            {/* <ButtonDark handleClick={() => { }} title="Buy Now" /> */}
            {/* <View style={{ flexDirection: 'row' }}>
                            <ScrollView horizontal> */}
            {description ?
              // <View
              //   onPress={() => { }}
              //   style={[styles.button, { width: 100, backgroundColor: '#4B4B52' }]}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18, }}>
                {strings.DESCRIPTIOn} :
              </Text>
              // </View>
              :
              null}
            {/* <TouchableOpacity onPress={() => { }} style={[styles.button, { width: 100, marginLeft: 5 }]}>
                                    <Text style={styles.buttontext}>Specification</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { }} style={[styles.button, { width: 150, marginLeft: 5 }]}>
                                    <Text style={styles.buttontext}>Cancellation Policy</Text>
                                </TouchableOpacity> */}
            {/* </ScrollView>
                        </View> */}

            <Text
              style={{
                fontSize: 13,
                color: '#4B4B52',
                fontFamily: 'Roboto-Regular',
                marginTop: 10,
              }}>
              {description}
            </Text>

            <TouchableOpacity
              style={{ width: 150, marginLeft: 0 }}
              onPress={() => setmodalShow(!modalShow)}>
              <View
                style={{
                  backgroundColor: '#676767',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginVertical: 10,
                  paddingVertical: 7,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    letterSpacing: 2,
                    fontWeight: 'bold',
                  }}>
                  {strings.SUBMITREVIEW}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 13,
    marginTop: 10,
    borderColor: '#4B4B52',
    borderWidth: 1,
    justifyContent: 'center',
  },
  buttontext: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  button2: {
    backgroundColor: '#4B4B52',
    paddingVertical: 9,
    // width: "100%",
    justifyContent: 'center',
    // marginVertical: 10,
    // marginTop: -30,
    borderRadius: 2,
  },
  buttontext2: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  headimg: {
    width: '100%',
    resizeMode: 'contain',
    height: 200,
    borderRadius: 5,
  },
  headitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1,
  },
  itemimg: {
    height: 50,
    width: 50,
    borderRadius: 5,
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: windowWidth - 50,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
