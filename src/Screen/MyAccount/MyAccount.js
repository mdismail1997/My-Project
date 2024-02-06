import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageComponent,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from './styles';
import OctIcon from 'react-native-vector-icons/Octicons';
import { Header } from '../../components/Header/Header';
import { DEVICE_WIDTH, hp, wp } from '../../utils/ResponsiveLayout';
import { Chip, TextInput } from 'react-native-paper';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_FAMILY, google_api_key } from '../../utils/Const';
import CustomButton from '../../components/CustomButton';
import BankInfoCard from '../../components/BankInfoCard';
import BankInfoBank from '../../components/BankinfoBank';
import ImagePickerComp from '../../components/ImagePicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearUpdateMessageAction,
  getUserProfileAction,
  updateProfileAction,
} from '../../Redux/actions/ProfileAction';
import Loader from '../../components/Loader';
import { List, IconButton, Checkbox } from 'react-native-paper';
import { getSubCategoryListAction } from '../../Redux/actions/HomeAction';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { getSubCategoryList, updateUserProfile } from '../../Services/ApiService';
import { useReducer } from 'react';
import { userLogoutAction } from '../../Redux/actions/AuthAction';
import ProfileContext from '../../Services/ProfileProvider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DialogAlert from '../../components/DialogAlert/DialogAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cardDetailsAction, bankDetailsAction } from '../../Redux/actions/JobAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import { retrieveData } from '../../utils/AsyncStore';
import axios from 'axios';

import socketService from '../../utils/socketService'

const MyAccount = props => {
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('');
  const [choose, setchoose] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [category, setCategory] = useState([{}]);
  const [categorylist, setcategoryList] = useState([]);
  const [chooseSubcategory, setChooseSubcategory] = useState([]);
  const [occupation, setOccupation] = useState([{}]);
  const [expandedSubcategory, setExpandedSubcategory] = React.useState(false);
  const [isExpertise, setIsExpertise] = useState(false);
  const [expectedCost, setExpectedCost] = useState({});
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [modal, setModal] = useState(false);

  const [modalVisible2, setModalVisible2] = useState(false);
  const [card, setCard] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [isDefault, setIsDefault] = useState(null);

  const messages = useSelector(state => state.Auth.logoutData);

  const categoryList = useSelector(state => state.Home.categoryList);
  const subcategoryList = useSelector(state => state.Home?.subCategoryList);
  const userData = useSelector(state => state.Profile?.userData);
  const isLoading = useSelector(state => state.Profile?.isLoading);
  const message = useSelector(state => state.Profile?.updateMessage);
  const Auth = useSelector(state => state.Auth);
  const cardData = useSelector(state => state.Job.cardData);
  const bankData = useSelector(state => state.Job.bankData);


  // console.log('**************BANK DATAAAAAAA***********', bankData.external_accounts?.data);


  const dispatch = useDispatch();

  const [ignore, forceUpdate] = useReducer(x => x + 1, 0);
  const profileContext = useContext(ProfileContext);

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(bankDetailsAction());
      dispatch(cardDetailsAction());

    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // useEffect(() => {
  //      dispatch(bankDetailsAction());
  // },[bankData]);
  // gender array
  const genderArr = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'Prefer not to say',
      value: 'prefer not to say',
    },
  ];

  // rate type array
  const typeArr = [
    {
      label: '/day',
      value: 'day',
    },
    {
      label: '/hour',
      value: 'hour',
    },
  ];

  useEffect(() => {
    console.log('length ', message.length);
    if (message.length > 0) {
      setModal(true);
    }
  }, [message]);

  useEffect(() => {

    if (userData?.data !== undefined) {
      setFirstName(userData?.data.firstname);
      setLastName(userData?.data.lastname);
      setEmail(userData?.data.email);
      setPhoneNo(userData?.data.phone_number);
      setGender(userData?.data.gender);
      setProfileImage(userData?.data.profileimage);
      setIsExpertise(userData?.data.isExpertise);
      setExpectedCost(userData?.data.expectedCost);
      setCategoryFromAPI();

     
    }
    // console.log(userData.data);
    console.log(
      '🚀 ~ file: MyAccount.js ~ line 116 ~ useEffect ~ userData',
      userData,
    );
    return () => null;
  }, [userData]);
  console.log("================>",userData?.data._id)
  const setCategoryFromAPI = async () => {
    const occ = userData?.data.occupation;
    let tempArr = [{}];
    let tempCat = category;
    let res = null;
    occ?.map(async (e, i) => {
      tempArr[i].category = e.category;
      tempArr[i].subcategories = e.subcategories;
      categoryList.map(cat => {
        if (cat._id == e.category) {
          console.log(cat);
          tempCat[i].category = cat;
        }
      });
      res = await getSubCategoryList(e.category);
      tempCat[i].subcategories = res?.data;
    });
    setTimeout(() => {
      setCategory(tempCat);
      setOccupation(tempArr);
    }, 500);

    forceUpdate();
    console.log(
      '🚀 ~ file: MyAccount.js ~ line 132 ~ setCategoryFromAPI ~ tempArr',
      tempCat,
    );
  };

  useEffect(() => {
    dispatch(getUserProfileAction());
    dispatch(cardDetailsAction());
    dispatch(bankDetailsAction());
    //console.log('myprofile List', categoryList);
    setcategoryList(categoryList);
  }, []);

  useEffect(() => {
    setChooseSubcategory(subcategoryList?.data);
  }, [subcategoryList]);
  useEffect(() => {
    if (isExpertise === false) {
      setExpectedCost({});
    }
  }, [isExpertise]);

  const addCategory = () => {
    const arr = [];
    // arr.push(categorylist.item)
    console.log('Arrrrrrrrrrrrrr', arr);

    setCategory([...category, {}]);
    setOccupation([...occupation, {}]);
    // category.push({});
    console.log('Tolladd', category);
    console.log('choosecategory', choose);
  };

  const deleteCategory = index => {
    const arr = category;
    console.log('index', index);
    console.log('Arrrrrrrrrrrrrr', arr);

    setCategory(category.splice(0, index));
    console.log('Tolladd', category);
  };

  const onPressUpdate = async () => {
    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone_number: phoneNo,
      latitude: location.lat,
      longitude: location.lng,
      address: address,
      profileimage: profileImage,
      gender: gender,
      occupation: occupation,
      isExpertise: isExpertise,
      expectedCost: expectedCost,
    };
    console.log('update profile', data);
    dispatch(updateProfileAction(data));
    const res = await updateUserProfile(data);
    console.log('%%%%%%%%%%%%', res.success);
    if (res.success === true) {
      setModal(!modal);
    }
  };
  const handlePress = item => {
    setExpanded(!expanded);
    // setchoose([])
    console.log('myprofile List', subcategoryList);
    setchoose([...choose, item]);
  };
  const handleSubCat = () => {
    setExpandedSubcategory(!expandedSubcategory);
  };
  const setData = () => {
    props.navigation.navigate('ChangePassword');
  };

  const logoutAPI = async => {
    //props.navigation.navigate('Step');

    setModalVisible2(true);

    dispatch(userLogoutAction());
    socketService.disconnect_socket()

    //  console.log("++++++++++",Auth.loginSuccess)
    //  if(!Auth.loginSuccess){
    //   props.navigation.navigate('Step')
    //  }
  };
  const onSelectCategory = async (item, index) => {
    let tempArr = category;
    let tempOccArr = occupation;
    tempArr[index].category = item;
    tempOccArr[index].category = item._id;

    dispatch(getSubCategoryListAction(item._id));
    const response = await getSubCategoryList(item._id);
    if (response.success) {
      console.log(response);
    }
    tempArr[index].subcategories = response?.data;

    console.log('tempArr ', JSON.stringify(tempArr));
    setCategory(tempArr);
    setOccupation(tempOccArr);
    forceUpdate();
  };

  const onSelectSubCategory = (item, index) => {
    let tempArr = category;
    let tempOccArr = occupation;

    if (tempOccArr[index].subcategories === undefined) {
      tempOccArr[index].subcategories = [];
    }
    if (tempOccArr[index].subcategories.includes(item._id)) {
      let itemIndex = tempOccArr[index].subcategories.indexOf(item._id);
      if (itemIndex > -1) {
        tempOccArr[index].subcategories.splice(itemIndex, 1);
      }
    } else {
      tempOccArr[index].subcategories.push(item._id);
    }
    setOccupation(tempOccArr);
    forceUpdate();

    console.log(
      '🚀 ~ file: MyAccount.js ~ line 223 ~ onSelectSubCategory ~ tempOccArr',
      tempOccArr,
    );
  };

  const getlogout = () => {
    dispatch(userLogoutAction());
    console.log('{{{{{{{{{', Auth.loginSuccess);
    if (!Auth.loginSuccess) {
      props.navigation.navigate('Step');
    }
  };


// const setDefault =(index) => {
// setIsDefault([...isDefault, index])
// }


  const onDeleteBank = async (id) => {

    var userToken = await retrieveData('USER_TOKEN')

    setLoading(true)

    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/bank/delete_bank_account`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      data: {
        id:id

      }

    };

    axios(config)
      .then(async (response) => {
        // console.log(".....|||||.......", response)
        if (response.status == 200) {
          Alert.alert(response.data.message)
          setLoading(false)
          props.navigation.replace('Home')

        } else {
          Alert.alert("Fail to delete Bank account!")
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  const onDeleteCard = async () => {

    var userToken = await retrieveData('USER_TOKEN')

    setLoading(true)

    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/bank/delete_card/`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },

    };

    axios(config)
      .then(async (response) => {
        // console.log("............", response)
        if (response.status == 200) {
          Alert.alert("Card details deleted successfully!")
          setLoading(false)
          props.navigation.goBack()

        } else {
          Alert.alert("Fail to delete Card details!")
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

const setasDefault = async (id) => {
  setIsDefault(id)
  var userToken = await retrieveData('USER_TOKEN')

    // setLoading(true)

    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/bank/update-default-bank/`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      data: {
        id:id

      }

    };

    axios(config)
      .then(async (response) => {
         console.log(".....||||||.......", response.data)
        // if (response.status == 200) {
        //   Alert.alert("Card details deleted successfully!")
        //   setLoading(false)
        //   props.navigation.goBack()

        // } else {
        //   Alert.alert("Fail to delete Card details!")
        // }
      })
      .catch((error) => {
        console.log(error);
      });

}





  return (
    <SafeAreaView style={styles.container}>
      <Header
        {...props}
        title={'Account'}
        Icon={require('../../Assets/logout.png')}
        onpress={() => logoutAPI()}
      />
      {isLoading && <Loader />}
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <View>
          <View style={styles.profileImgContainer}>
            <Image
              source={
                profileImage !== ''
                  ? { uri: profileImage }
                  : require('../../Assets/userimage.png')
              }
              style={styles.profileImageStyle}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsVisible(true)}
            style={styles.editIconContainer}>
            <OctIcon name="pencil" size={16} color="#8FCD2D" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // marginTop: hp(16),
            marginHorizontal: wp(20),
          }}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={text => setFirstName(text)}
            style={[styles.inputStyle, { marginTop: 0 }]}
            mode="outlined"
            right={
              <TextInput.Icon
                name={() => (
                  <AntIcon name={'user'} color={COLORS.NICKEL} size={wp(20)} />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
            style={styles.inputStyle}
            mode="outlined"
            right={
              <TextInput.Icon
                name={() => (
                  <AntIcon name={'user'} color={COLORS.NICKEL} size={wp(20)} />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          />
          <TextInput
            placeholder="Email Id"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputStyle}
            mode="outlined"
            right={
              <TextInput.Icon
                name={() => (
                  <FontistoIcon
                    name={'email'}
                    color={COLORS.NICKEL}
                    size={wp(20)}
                  />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          />
          <TextInput
            placeholder="Phone No."
            value={phoneNo}
            onChangeText={text => setPhoneNo(text)}
            style={styles.inputStyle}
            mode="outlined"
            right={
              <TextInput.Icon
                name={() => (
                  <IonIcon
                    name={'call-outline'}
                    color={COLORS.NICKEL}
                    size={wp(20)}
                  />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          />

          <Dropdown
            value={gender}
            data={genderArr}
            labelField="label"
            valueField="value"
            selectedTextStyle={{ color: COLORS.BLACK }}
            placeholder={'Gender'}
            placeholderStyle={{ color: COLORS.NICKEL, fontSize: 16 }}
            style={{
              width: '100%',
              padding: 10,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: COLORS.NICKEL,
              marginTop: hp(16),
            }}
            itemTextStyle={{ color: COLORS.BLACK, fontSize: 16 }}
            itemContainerStyle={{ backgroundColor: '#fff' }}
            containerStyle={{ backgroundColor: '#fff' }}
            onChange={item => setGender(item.value)}
            renderRightIcon={() => (
              <MIcon name={'gender-male'} color={COLORS.NICKEL} size={wp(20)} />
            )}
          />
          {/* <TextInput
            placeholder="Location"
            style={styles.inputStyle}
            mode="outlined"
            right={
              <TextInput.Icon
                name={() => (
                  <MIcon
                    name={'crosshairs-gps'}
                    color={COLORS.NICKEL}
                    size={wp(20)}
                  />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          /> */}
          <GooglePlacesAutocomplete
            placeholder="Location"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            onPress={(data, details = null) => {
              console.log(data);
              setAddress(data.description);
              setLocation({
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              });
            }}
            styles={{
              textInput: {
                backgroundColor: COLORS.WHITE,
                marginTop: hp(16),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
                borderColor: COLORS.NICKEL,
                borderWidth: 1,
              },
            }}
            query={{
              key: google_api_key,
              language: 'en',
              types: 'address',
            }}
            debounce={300}
          />

          <View style={[styles.bankInfo, { marginTop: hp(16) }]}>
            <Text style={styles.bankInfoText}>{'Category'}</Text>
            <TouchableOpacity onPress={() => addCategory()}>
              <MIcon
                name="plus-circle"
                color={COLORS.YELLOW_GREEN}
                size={wp(28)}
              />
            </TouchableOpacity>
          </View>

          {category?.map((item, i) => {
            return (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: i > 0 ? 8 : 0,
                    // backgroundColor: 'red',
                  }}>
                  <Dropdown
                    value={category}
                    data={categoryList}
                    labelField="name"
                    valueField="name"
                    selectedTextStyle={{ color: COLORS.BLACK }}
                    placeholder="Category"
                    placeholderStyle={{ color: COLORS.NICKEL, fontSize: 16 }}
                    style={{
                      width: '90%',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.NICKEL,
                    }}
                    itemTextStyle={{ color: COLORS.BLACK, fontSize: 16 }}
                    itemContainerStyle={{ backgroundColor: '#fff' }}
                    containerStyle={{ backgroundColor: '#fff' }}
                    onChange={item => onSelectCategory(item, i)}
                  />

                  <IconButton
                    icon="delete"
                    size={25}
                    color={COLORS.COQUELICOT}
                    onPress={() => deleteCategory(category.length - 1)}
                  />
                </View>
                <View
                  style={{
                    // flexDirection: 'row',
                    marginTop: 8,
                  }}>
                  {category[i].subcategories &&
                    category[i].subcategories.length > 0 ? (
                    <FlatList
                      // style={{margin: hp(15)}}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={category[i]?.subcategories}
                      renderItem={(e, index) => {
                        return (
                          <Chip
                            style={{
                              marginLeft: 5,
                              backgroundColor: '#fff',
                              borderColor: COLORS.YELLOW_GREEN,
                              borderWidth: 1,
                              padding: 2,
                            }}
                            onPress={() => onSelectSubCategory(e, i)}
                            selected={
                              occupation[i].subcategories !== undefined &&
                                e._id === occupation[i].subcategories[index]
                                ? true
                                : false
                            }>
                            {e.item.name}
                          </Chip>
                        );
                      }}
                    />
                  ) : null}
                  {/* {category[i]?.subcategories &&
                    category[i]?.subcategories.length > 0 &&
                    category[i]?.subcategories.map((e, index) => {
                      return (
                        <Chip
                          style={{
                            marginLeft: index > 0 ? 6 : 0,
                            backgroundColor: '#fff',
                            borderColor: COLORS.YELLOW_GREEN,
                            borderWidth: 1,
                            padding: 2,
                          }}
                          onPress={() => onSelectSubCategory(e, i)}
                          selected={
                            occupation[i].subcategories != undefined &&
                            e._id === occupation[i].subcategories[index]
                              ? true
                              : false
                          }>
                          {e.name}
                        </Chip>
                      );
                    })} */}
                  {/* {console.log('subcat^^^^^^^^^^', category[i]?.subcategories)} */}
                </View>
              </View>
            );
          })}
          <View style={{ marginTop: hp(16) }}>
            {isExpertise && (
              <>
                <Text style={styles.bankInfoText}>{'Expected Cost ($)'}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    value={expectedCost.value}
                    placeholder="0.00"
                    style={[styles.inputStyle, { width: '65%', marginTop: 0 }]}
                    mode="outlined"
                    outlineColor={COLORS.NICKEL}
                    activeOutlineColor={COLORS.NICKEL}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      let tempObj = expectedCost;
                      tempObj.value = text;
                      tempObj.type = typeArr[0].value;
                      setExpectedCost(tempObj);
                    }}
                    left={<TextInput.Affix text="$" />}
                  />
                  <Dropdown
                    value={expectedCost != {} ? expectedCost.type : typeArr[0]}
                    data={typeArr}
                    labelField="label"
                    valueField="value"
                    selectedTextStyle={{ color: COLORS.BLACK }}
                    placeholder="Type"
                    placeholderStyle={{ color: COLORS.NICKEL, fontSize: 16 }}
                    style={{
                      width: '30%',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: COLORS.NICKEL,
                      marginTop: 6,
                    }}
                    itemTextStyle={{ color: COLORS.BLACK, fontSize: 16 }}
                    itemContainerStyle={{ backgroundColor: '#fff' }}
                    containerStyle={{ backgroundColor: '#fff' }}
                    onChange={item => {
                      let tempObj = expectedCost;
                      tempObj.type = item.value;
                      setExpectedCost(tempObj);
                    }}
                  />
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: 'red',
              }}>
              <Checkbox
                status={isExpertise ? 'checked' : 'unchecked'}
                onPress={() => setIsExpertise(!isExpertise)}
                color={COLORS.YELLOW_GREEN}
                style={{ backgroundColor: 'yellow' }}
              />
              <Text
                style={{
                  color: '#000',
                  fontSize: wp(14),
                  fontFamily: FONT_FAMILY.LATO_REGULAR,
                }}>
                Expertise
              </Text>
            </View>
          </View>
        </View>
        <CustomButton
          title={'Update'}
          buttonStyle={{
            marginTop: hp(16),
            marginHorizontal: wp(20),
          }}
          onPress={() => onPressUpdate()}
        />
        <View style={styles.bankContainer}>
          {/* <View style={styles.bankInfo}>
            <Text style={styles.bankInfoText}>{'Bank Information'}</Text>
            {!bankData ?
              <TouchableOpacity onPress={() =>
                props.navigation.navigate('BankAdd')
              }>
                <MIcon
                  name="plus-circle"
                  color={COLORS.YELLOW_GREEN}
                  size={wp(28)}
                />
              </TouchableOpacity> : null}
            {bankData ?
              <TouchableOpacity onPress={() => onDeleteBank()}>
                <MIcon
                  name="delete"
                  color={COLORS.COQUELICOT}
                  size={wp(28)}
                />
              </TouchableOpacity>
              : null}
          </View> */}





          <View style={styles.bankInfo}>
            <Text style={styles.bankInfoText}>{'Bank Information'}</Text>

            <TouchableOpacity onPress={() =>
              props.navigation.navigate('BankAdd')
            }>
              <MIcon
                name="plus-circle"
                color={COLORS.YELLOW_GREEN}
                size={wp(28)}
              />
            </TouchableOpacity>
          </View>


          {/* <BankInfoBank bank={bankData ? true : false} bankDetails={bankData} /> */}









          <FlatList
            style={{ flex: 1 }}
            nestedScrollEnabled={true}
            data={bankData}
            renderItem={(item, index) => {
              return (

                <View style={styles.containerBank}>
                  <View style={styles.containerBankname}>
                    <Text style={styles.containerName}>
                      <Icon
                        name="bank"
                        color={COLORS.LAPSI_LAZULI}
                        size={wp(30)}
                        style={styles.logoStyle}
                      />
                    </Text>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.accountNameText}>{item?.item?.account_holder_name}</Text>
                    {/* <Text style={styles.dateText}>{bankDetails?.legal_entity?.dob?.year}/{bankDetails?.legal_entity?.dob?.month}/{bankDetails?.legal_entity?.dob?.day}</Text> */}
                    <Text style={styles.accountText}>{item?.item?.bank_name}</Text>
                    <Text style={styles.accountNumberText}>*********{item?.item?.last4}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        //backgroundColor: 'red',
                      }}>
                      <Checkbox
                        status={isDefault === item.item.id ? 'checked' : 'unchecked'}
                        onPress={() => setasDefault(item.item.id)}
                        color={COLORS.YELLOW_GREEN}
                        style={{ backgroundColor: 'yellow' }}
                        
                      />
                      <Text
                        style={{
                          color: COLORS.LAPSI_LAZULI,
                          fontSize: wp(12),
                          fontFamily: FONT_FAMILY.LATO_REGULAR,
                        }}>
                        Set as Default
                      </Text>
                    </View>

                  </View>
                  <TouchableOpacity style={{ width: '45%', alignItems: 'flex-end' }} onPress={() => onDeleteBank(item.item.id)}>
                    <MIcon
                      name="delete"
                      color={COLORS.COQUELICOT}
                      size={wp(28)}
                    />
                  </TouchableOpacity>
                </View>

              );
            }}
          />



















          <View style={[styles.bankInfo, { marginTop: hp(30) }]}>
            <Text style={styles.bankInfoText}>{'Card Information'}</Text>
            {!cardData ?
              <TouchableOpacity onPress={() =>
                props.navigation.navigate('CardAdd')
              }>
                <MIcon
                  name="plus-circle"
                  color={COLORS.YELLOW_GREEN}
                  size={wp(28)}
                />

              </TouchableOpacity> : null}

            {cardData ?
              <TouchableOpacity onPress={() => onDeleteCard()}>
                <MIcon
                  name="delete"
                  color={COLORS.COQUELICOT}
                  size={wp(28)}
                />
              </TouchableOpacity> : null}

          </View>
          <BankInfoCard card={cardData ? true : false} cardDetails={cardData} />
        </View>
        <CustomButton
          title={'Change Password'}
          buttonStyle={{
            marginTop: hp(20),
            marginBottom: hp(6),
            marginHorizontal: wp(20),
          }}
          // onPress={() => onPressUpdate()}
          onPress={() => {
            setData();
          }}
        />
      </ScrollView>
      <ImagePickerComp
        isVisible={isVisible}
        onPressCancel={() => setIsVisible(false)}
        onPressPicker={image => setProfileImage(image)}
        onPressCamera={image => setProfileImage(image)}
      />
      {modal ? (
        <DialogAlert
          title={message}
          onpress={() => dispatch(clearUpdateMessageAction())}
        />
      ) : null}

      <Modal
        // animationType="slide"
        // transparent={true}
        // visible={modal}

        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}

      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require('../../Assets/logo1.png')}
              resizeMode={'contain'}
            />
            <Text style={styles.modalText}>{messages.message}</Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <CustomButton
                title="Ok"
                onPress={() => props.navigation.replace('LogIn')}
                buttonStyle={styles.button}
              />
            </View>
          </View>
        </View>
      </Modal>

      {Loading && <Loader />}
    </SafeAreaView>
  );
};

export default MyAccount;
