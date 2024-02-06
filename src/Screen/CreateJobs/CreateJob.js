import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  FlatList,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { Header } from '../../components/Header/Header';
import { styles } from './styles';
import ActIcon from 'react-native-vector-icons/dist/AntDesign';
import {
  Button,
  Checkbox,
  Chip,
  List,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY, google_api_key } from '../../utils/Const';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/dist/Fontisto';
import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import {
  DateTimePicker,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import ImagePickerComp from '../../components/ImagePicker';
import CustomButton from '../../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { getSubCategoryListAction, getAllUsersAction } from '../../Redux/actions/HomeAction';
import { createJobs, getSubCategoryList, getAllUsers } from '../../Services/ApiService';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../../components/Loader';
import {
  clearCreateJobMessageAction,
  createJobAction,
} from '../../Redux/actions/JobAction';
import DialogAlert from '../../components/DialogAlert/DialogAlert';
import moment from 'moment';
import ImagePickerVideo from '../../components/ImagePicker/videoIndex';
import RNFS from 'react-native-fs';


const CreateJobs = props => {


  const [isVisible, setIsVisible] = useState(false);
  const [multipleImage, setMultipleImage] = useState(false);
  const [multipleVideo, setMultipleVideo] = useState(false);
  const [jobMultiple, setJobMultiple] = useState([]);
  const [jobMultiplee, setJobMultiplee] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [jobImage, setJobImage] = useState();
  const [jobVideo, setJobVideo] = useState();
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState();
  const [state, setstate] = useState();
  const [country, setcountry] = useState();
  const [zipcode, setZipcode] = useState();
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [checked, unchecked] = useState(false);
  const [select, setSelect] = useState('');
  const [date, setDate] = useState(new Date());
  const [endtime, setEndtime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [choose, setchoose] = useState({ name: 'Select Category', id: '' });
  const [expanded, setExpanded] = React.useState(true);
  const [subcategory, setSubcategory] = useState([]);
  const [check, setCheck] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [emailId, setEmailid] = useState('');
  const [searchText, setSearchText] = useState('')
  const [data, setdata] = useState();
  const [modal, setModal] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [chooseSubCategory, setChooseSubcategory] = useState({
    name: 'Select sub category',
    id: '',
  });
  const [expandedSubCategory, setExpandedSubcategory] = React.useState(true);
  const [checkedPrice, setCheckedPrice] = React.useState('first');
  const [range, setRange] = useState({ min: 0, max: 0 });
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [selectmore, setSelectmore] = useState(false);
  const [addEmail, setaddEmail] = useState([]);


  const [inviteIndex, setinviteIndex] = useState([]);


  const userData = useSelector(state => state.Job.userData);
  const isLoading = useSelector(state => state.Job.isLoading);
  const message = useSelector(state => state.Job.createMessage);
  const categoryList = useSelector(state => state.Home.categoryList);
  const subcategoryList = useSelector(state => state.Home.subCategoryList);
  const userList = useSelector(state => state.Home.userList);

  console.log("!!!!!!!@@@@@#####$$$$%%%%%%", userList.data);



  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(getAllUsersAction())
    // setTimeout(()=>{
    //   emailAdd()
    // },1000)

    // if(userList.length != 0){
    //   emailAdd()
    // }
  }, [])


  useEffect(() => {
    console.log('length ---------->', message);
    if (message.length > 0) {
      setModal(true);

    }
  }, [message]);

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', () => {
      setJobTitle('');
      setDescription('');
      setCity('');
      setstate('');
      setSelect('');
      setcountry('');
      setZipcode('');
      setLocation('');
      setAddress('');
      setProfileImage('');
      setJobImage([{ url: '' }]);
      setJobVideo([{ url: '' }]);
      setJobMultiple([]);
      setJobMultiplee([]);
      setPrice('');
      setchoose({ name: 'Select category', id: '' });
      setChooseSubcategory({ name: 'Select sub category', id: '' });
      setEmailid('');
      setSelectmore(false);
      unchecked(false);
      setCheck(false);
    });
    return createjobDetails;
  }, []);






  const selectJob = value => {
    // emailAdd()
    //console.log('<><><><><><><><><><><><><><><><><><><><><>', value);
    unchecked(!checked);

    setSelect(value);
    if (value === 'private') {
      showModal();
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);

    setDate(currentDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);

    setEndtime(selectedDate);
  };

  const showMode = currentMode => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: false,
        minimumDate: date,
        display: 'spinner',
      });
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showModeEnd = currentMode => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: endtime,
        onChange: onChangeEnd,
        mode: currentMode,
        is24Hour: false,
        minimumDate: date,
        display: 'spinner',
      });
      // for iOS, add a button that closes the picker
    }

    setMode(currentMode);
  };

  const onPressCreate = async () => {
    console.log('subcategory list', subcategoryList);
    let fixedPrice = {};
    if (checkedPrice === 'fixed') {
      fixedPrice = { type: 'fixed', fixed: price };
    } else if (checkedPrice !== 'fixed') {
      if (Number(minPrice) > Number(maxPrice)) {
        Alert.alert('Maximum price should be greater than the minimum price');
        return;
      } else {
        fixedPrice = { type: 'range', min: minPrice, max: maxPrice };
      }
    }
    if (date.getHours() > endtime.getHours()) {
      Alert.alert('End time should be greater than start time');
      return;
    }
    let arr = [];
    // jobImage.filter(val => {
    //   arr = val.data;
    // });
    const data = {
      address: address,
      category: choose.id,
      subcategories: [chooseSubCategory.id],
      city: city,
      country: country,
      date: selectmore === false ? date.toLocaleString() : '',
      description: description,
      endDate: selectmore === true ? endtime.toLocaleString() : '',
      end_time: `${endtime.getHours().toLocaleString()}:${endtime
        .getMinutes()
        .toLocaleString()}`,
      end_time_meridian: endtime.getHours() >= 12 ? 'PM' : 'AM',
      fixedPrice: '100',
      gallery: jobImage,
      group1: 'on',
      isJobMoreThanOneDay: selectmore === true ? true : false,
      jobImages: jobImage,
      job_type: select,
      latitude: location.lat,
      longitude: location.lng,
      price: fixedPrice,
      priceType: 'on',
      privateEmployees: select === 'private' ? addEmail : [],
      profileImage: profileImage,
      startDate: selectmore === true ? date.toLocaleString() : '',
      start_time: `${date.getHours().toLocaleString()}:${date
        .getMinutes()
        .toLocaleString()}`,
      start_time_meridian: date.getHours() >= 12 ? 'PM' : 'AM',
      state: state,
      title: jobTitle,
      video: jobVideo[0].url == "" ? "" : jobVideo,
      zipcode: zipcode,
    };
    //console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ', data);
    // console.log("jobv======", jobVideo[0].url);
    // console.log('job data', data.gallery);
    dispatch(createJobAction(data));
    // const res = await createJobs(data);
    // console.log('%%%%%%%%%%%%', res.success);
    // if (res.message.length > 1) {
    //   setModal(!modal);
    // }

  };

  const handlePress = async (item, id) => {
    setExpanded(!expanded);
    console.log('choose item', id);
    dispatch(getSubCategoryListAction(id));
    const response = await getSubCategoryList(id);
    if (response.success) {
      console.log('++++++++++++++++++++++', response);
      if (response.data.length > 0) {
        console.log('subcategorylist', response.data);
        setSubcategory(response.data);
        setCheck(true);
      }
    }

    setchoose({ name: item, id: id });
  };

  const handlePressSubCategory = (item, id) => {
    setExpandedSubcategory(!expandedSubCategory);
    setChooseSubcategory({ name: item, id: id });
  };

  const handleChange = (text) => {
    setSearchText(text)
  }

  const onShare = async () => {
    //console.log("???????????????????????????????????????????????",value);
    const url = userData.shareUrl.split('/')
    // console.log('///////////////////////',url[9])
    const val = url[9];
    try {
      const result = await Share.share({
        message: `https://nodeserver.mydevfactory.com/projects/tulika/Soumen/UverlistWebReact/#/JobDetails/${val}`
        // , url: `https://pixabay.com/photos/chain-link-fence-sunset-wire-72864/`

      });
      // console.log("123123123212232123321", result)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {

        } else {

        }
      } else if (result.action === Share.dismissedAction) {

      }
    } catch (error) {
      alert(error.message);
    }
    setModal(!modal);
    setProfileImage('');
    setJobImage(''),
      setJobVideo(''),
      setJobTitle(''),
      setchoose(''),
      setChooseSubcategory(''),
      setCheck(''),
      setDescription(''),
      setLocation(''),
      setPrice(''),
      unchecked(!checked),
      setCity('');
    setstate('');
    setcountry('');
    setZipcode('');
    setAddress('');
  };

  const clear = () => {
    dispatch(clearCreateJobMessageAction());
    setModal(!modal);
    setProfileImage('');
    setJobImage(''),
      setJobVideo(''),
      setJobTitle(''),
      setchoose(''),
      setChooseSubcategory(''),
      setCheck(''),
      setDescription(''),
      setLocation(''),
      setPrice(''),
      unchecked(!checked),
      setCity('');
    setstate('');
    setcountry('');
    setZipcode('');
    setAddress('');
  };




  const inviteFunc = (email, index) => {


    //console.log("=====>email====>",email);

    //setaddEmail([...addEmail,email])
    addEmail.push(email)

    console.log("====>", addEmail);
    setinviteIndex([...inviteIndex, index])

    //  console.log("INVITEINDEX____________",inviteIndex);


  }


  let selectPhoto = [];
  const multipleImagecomp = (
    <Modal transparent animationType="slide" visible={multipleImage}>
      <View style={styles.mImgcontainer}>
        <View style={[styles.itemContainer, { marginVertical: 4 }]}>
          <TouchableOpacity activeOpacity={0.8} style={{ width: '100%', alignItems: 'center' }} onPress={() => setMultipleImage(false)}>
            <Text style={[styles.textStyle, { color: COLORS.COQUELICOT }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openPicker({
                mediaType: 'photo',
                includeBase64: true,
                cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(res => {
                if (res.length >= 1) {
                  for (var i = 0; i < res.length; i += 1) {
                    selectPhoto.push({
                      url: `data:${res[i].mime};base64,` + res[i].data,
                    });
                    setJobMultiple(res);
                  }
                }
                setJobImage(selectPhoto);
                setMultipleImage(false);
              });
            }}
            activeOpacity={0.8}
            style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.textStyle}>Open Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openCamera({
                mediaType: 'photo',
                includeBase64: true,
                cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(res => {
                // onPressPicker(`data:${res.mime};base64,` + res.data);
                // if (selectMultiple) {
                //   data(pre => [...pre, res]);
                //   onPressPicker(`data:${res.mime};base64,` + res);
                // }
                setJobImage(pre => [
                  ...pre,
                  { url: `data:${res.mime};base64,` + res.data },
                ]);
                setJobMultiple(pre => [...pre, jobMultiple]);
                // console.log('************', res.);
                for (let i = 0; i < res.length; i++) { }
                setMultipleImage(false);
              });
            }}
            activeOpacity={0.8}
            style={{ width: '100%', alignItems: 'center' }}>
            <Text style={[styles.textStyle, { marginTop: hp(16) }]}>
              Open Camera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  console.log("========>>>>>", jobVideo)

  const multipleVideocomp = (
    <Modal transparent animationType="slide" visible={multipleVideo}>
      <View style={styles.mImgcontainer}>
        <View style={[styles.itemContainer, { marginVertical: 4 }]}>
          <TouchableOpacity activeOpacity={0.8} style={{ width: '100%', alignItems: 'center' }} onPress={() => setMultipleVideo(false)}>
            <Text style={[styles.textStyle, { color: COLORS.COQUELICOT }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openPicker({
                mediaType: 'video',
                includeBase64: true,
                // cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(data => {
                //console.log(">>>>>>>>>>>>>>>>>>>",data);

                RNFS.readFile(data[0].path, 'base64').then(res => {
                  setJobVideo(`data:${data[0].mime};base64,` + res,
                  );
                  setJobMultiplee([{
                    url: `data:${data[0].mime};base64,` + res,
                  }])
                })
                //console.log("========>>>>>", jobVideo)
                setJobMultiplee(data)
                setMultipleVideo(false);
              });
            }}
            activeOpacity={0.8}
            style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.textStyle}>Open Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openCamera({
                mediaType: 'video',
                //includeBase64: true,
                // cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(data => {
                //console.log(">>>>>>>>>>>>>>>>>>>",data);
                RNFS.readFile(data.path, 'base64').then(res => {
                  setJobVideo(`data:${data.mime};base64,` + res,
                  );
                  setJobMultiplee([{
                    url: `data:${data.mime};base64,` + res,
                  }])
                  //  console.log('BASE64convert=====>>>> ', res);

                })
                // console.log("========>>>>>", jobVideo)
                setMultipleVideo(false);
                setJobMultiplee(jobVideo)
              });
            }}
            activeOpacity={0.8}
            style={{ width: '100%', alignItems: 'center' }}>
            <Text style={[styles.textStyle, { marginTop: hp(16) }]}>
              Open Camera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );







  const renderItem = ({ item, index }) => (
    // <TouchableOpacity
    //   onPress={() =>
    //     props.navigation.navigate('ChatScreen', {details: item._id})
    //   }>

    <View style={styles.containerBank}>

      <View style={styles.viewcss}>

        <View style={{ ...styles.textviewcss }}>

          <Text style={styles.textcomoncss2}>{item?.email}</Text>
          <View style={{marginTop:wp(6)}}>
          <Text style={styles.textcomoncss3}>{item?.phone_number}</Text>
          </View>
        </View>

        {inviteIndex.includes(index) ?
          <CustomButton
            title={'Send'}
            buttonStyle={{
              width: wp(55),
              padding: 10,
              backgroundColor: COLORS.NICKEL,
            }}
            disabled={true}
          /> :

          <CustomButton
            title={"Invite"}
            buttonStyle={{
              // padding: 8,
              width: hp(55),
            }}


            onPress={() => { inviteFunc(item?.email, index) }}


          />

        }


      </View>
    </View>


  );






  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title={'Create a Job'} />
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
              resizeMode={'contain'}
              style={styles.profileImageStyle}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsVisible(true)}
            style={styles.editIconContainer}>
            <ActIcon name="plus" size={16} color="#8FCD2D" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // marginTop: hp(16),
            marginHorizontal: wp(20),
          }}>
          <Button
            icon="camera"
            mode="outlined"
            color={COLORS.NICKEL}
            style={styles.multipleImage}
            onPress={() => setMultipleImage(true)}>
            Select images (optional)
          </Button>
          {/* {console.log('&&&&&&&&&&', jobImage.length)}  */}

          {jobMultiple.length >= 1 ? (
            <FlatList
              nestedScrollEnabled={true}
              // horizontal={true}
              data={jobMultiple}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <Chip
                      icon="image"
                      style={styles.chip}
                      onPress={() => console.log('+++++++', item)}>
                      {`image${index}`}
                    </Chip>
                  </>
                );
              }}
            />
          ) : null}


          <Button
            icon="camera"
            mode="outlined"
            color={COLORS.NICKEL}
            style={styles.multipleImage}
            onPress={() => setMultipleVideo(true)}>
            Select video (optional)
          </Button>


          {jobMultiplee.length >= 1 ? (
            <FlatList
              nestedScrollEnabled={true}
              // horizontal={true}
              data={jobMultiplee}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <Chip
                      icon="image"
                      style={styles.chip}
                      onPress={() => console.log('+++++++', item)}>
                      {`video${index}`}
                    </Chip>
                  </>
                );
              }}
            />
          ) : null}

          <TextInput
            mode="outlined"
            required
            placeholder="Job Title"
            style={[styles.inputStyle, { marginTop: -15 }]}
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
            value={jobTitle}
            onChangeText={text => setJobTitle(text)}
          />
          <View style={styles.category}>
            <List.Accordion
              title={choose.name}
              id="1"
              expanded={!expanded}
              style={styles.categoryContainer}
              titleStyle={styles.textinputStyle}
              onPress={handlePress}>
              <FlatList
                style={{ flex: 1 }}
                nestedScrollEnabled={true}
                data={categoryList}
                renderItem={(item, index) => {
                  return (
                    <>
                      {/* {console.log('category item', item)} */}
                      <List.Item
                        title={item.item.name}
                        onPress={() =>
                          handlePress(item.item.name, item.item._id)
                        }
                      />
                    </>
                  );
                }}
              />
            </List.Accordion>
          </View>
          {check ? (
            <View style={styles.category}>
              <List.Accordion
                title={chooseSubCategory.name}
                id="1"
                expanded={!expandedSubCategory}
                style={styles.categoryContainer}
                titleStyle={styles.textinputStyle}
                onPress={handlePressSubCategory}>
                <FlatList
                  style={{ flex: 1 }}
                  nestedScrollEnabled={true}
                  data={subcategory}
                  renderItem={(item, index) => {
                    return (
                      <>
                        {console.log('category item', item)}
                        <List.Item
                          title={item.item.name}
                          onPress={() =>
                            handlePressSubCategory(
                              item.item.name,
                              item.item._id,
                            )
                          }
                        />
                      </>
                    );
                  }}
                />
              </List.Accordion>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                disabled={false}
                tintColors={{ true: COLORS.YELLOW_GREEN, false: 'black' }}
                status={
                  select === 'public' || select === 'social'
                    ? 'checked'
                    : 'unchecked'
                }
                value={select}
                onPress={newValue => selectJob('public')}
              // onValueChange={(newValue) => selectrejectReason(newValue, index)}
              />
              <Text>Public Job</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                disabled={false}
                tintColors={{ true: COLORS.YELLOW_GREEN, false: 'black' }}
                status={select === 'private' ? 'checked' : 'unchecked'}
                value={select}
                onPress={newValue => selectJob('private')}
              />
              <Text>Private job</Text>

            </View>

            <Modal transparent={true} visible={visible}>
              <View style={styles.centeredView}>
                <View style={styles.EmodalView}>
                  <TouchableOpacity
                    onPress={() => hideModal()}
                    style={{ left: wp(138), marginTop: hp(-40) }}>
                    <MIcon
                      name="close-circle"
                      color={COLORS.YELLOW_GREEN}
                      size={wp(28)}
                    />
                  </TouchableOpacity>
                  <Image
                    source={require('../../Assets/privateJob.png')}
                    resizeMode={'contain'}
                  />

                  <TextInput
                    mode="outlined"
                    placeholder="Enter User Email Id"
                    style={[styles.einputStyle, { width: wp(250) }]}
                    outlineColor={COLORS.NICKEL}
                    activeOutlineColor={COLORS.NICKEL}
                    value={searchText}
                    onChangeText={text => handleChange(text)}
                  />


                  {/* <CustomButton
                      title={'Add'}
                      buttonStyle={{
                        padding: 10,
                        width: wp(55),
                        marginTop: hp(20),
                      }}
                       onPress={() => [addMore(), setVisible(false)]}
                       onPress={() => addMore()}


                    /> */}


                  {userList.length != 0 && (
                    <>
                      {searchText != "" &&

                        <View style={{ marginTop: hp(8), height: 150, backgroundColor: '#f5f5f5', width: wp(275) }}>
                          {userList.data?.filter(
                            i => i.email.toLowerCase().includes(searchText.toLowerCase()),
                          ).length == 0
                            ? <>

                              <View style={styles.menviewcss}>
                                <View style={styles.viewcss}>

                                  <View style={styles.textviewcss}>

                                    <Text style={styles.textcomoncss2}>{searchText}</Text>
                                  </View>


                                  <CustomButton
                                    title={addEmail.includes(searchText) ? "Send" : "Invite"}

                                    buttonStyle={addEmail.includes(searchText) ? {

                                      padding: 10,
                                      width: wp(55),
                                      backgroundColor: COLORS.NICKEL,
                                    } : {
                                      padding: 10,
                                      width: wp(55),
                                    }}
                                    disabled={addEmail.includes(searchText) ? true : false}
                                    onPress={() => { inviteFunc(searchText) }}

                                  />


                                </View>
                              </View>
                            </> : <>

                              <FlatList
                                data={userList.data?.filter(
                                  i => i.email.toLowerCase().includes(searchText.toLowerCase()),
                                )}
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                              />
                            </>}
                        </View>}
                    </>

                  )}



                </View>
              </View>
            </Modal>
          </View>
          {select === 'public' || select === 'social' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                disabled={false}
                tintColors={{ true: COLORS.YELLOW_GREEN, false: 'black' }}
                status={select === 'social' ? 'checked' : 'unchecked'}
                value={select}
                onPress={newValue => selectJob('social')}
              // onValueChange={(newValue) => selectrejectReason(newValue, index)}
              />
              <Text>Share on social media</Text>
            </View>
          ) : null}


          <View style={{ backgroundColor: '#f5f5f5', width: '100%' }}>

            <FlatList
              data={addEmail}
              contentContainerStyle={{ flexGrow: 1 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View>
                    <View style={{ width: "100%", alignItems: "center", flexDirection: 'row', height: 50 }}>
                      <Image source={require("../../Assets/profilee.png")} style={{ width: 30, height: 30, resizeMode: "contain", borderRadius: 30, marginHorizontal: hp(10), borderWidth: 1, borderColor: COLORS.LAPSI_LAZULI }} />
                      <Text style={{ fontSize: hp(16) }}>{item}</Text>
                    </View>
                  </View>
                )
              }}
            />

          </View>





          <TextInput
            mode="outlined"
            placeholder="Description"
            style={[styles.inputStyle, { marginTop: 0, height: hp(120) }]}
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
            value={description}
            onChangeText={text => setDescription(text)}
            multiline={true}
          // numberOfLines={2}
          />
          <View style={{ marginTop: hp(12) }}>
            <Text style={styles.locationText}>Location</Text>
          </View>
          {/* <TextInput
            placeholder="Choose a Location From Map"
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
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            onPress={(data, details = null) => {
              console.log(details.address_components);
              details.address_components.map(res =>
                res.types[0] === 'administrative_area_level_1'
                  ? setstate(res.long_name)
                  : null,
              );
              details.address_components.map(res =>
                res.types[0] === 'country' ? setcountry(res.long_name) : null,
              );
              details.address_components.map(res =>
                res.types[0] === 'administrative_area_level_2'
                  ? setCity(res.long_name)
                  : null,
              );
              details.address_components.map(res =>
                res.types[0] === 'postal_code'
                  ? setZipcode(res.long_name)
                  : null,
              );
              console.log('lat&lng ===> ', details.geometry.location.lng);
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
          <TextInput
            mode="outlined"
            placeholder="Address"
            style={[styles.inputStyle, { marginTop: 0 }]}
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
            value={address}
            onChangeText={text => setAddress(text)}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              mode="outlined"
              placeholder="City"
              style={[styles.inputStyle, { width: wp(160) }]}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={city}
              onChangeText={text => setCity(text)}
            />
            {/* {console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$", location)} */}
            <TextInput
              mode="outlined"
              placeholder="State"
              style={[styles.inputStyle, { width: wp(160) }]}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={state}
              onChangeText={text => setstate(text)}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              mode="outlined"
              placeholder="Zipcode"
              style={[styles.inputStyle, { width: wp(160) }]}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={zipcode}
              onChangeText={text => setZipcode(text)}
            />
            <TextInput
              mode="outlined"
              placeholder="Country"
              style={[styles.inputStyle, { width: wp(160) }]}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={country}
              onChangeText={text => setcountry(text)}
            />
          </View>
          <View style={{ marginTop: hp(12) }}>
            <Text style={styles.locationText}>Pricing</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="first"
              color={COLORS.YELLOW_GREEN}
              status={checkedPrice === 'fixed' ? 'checked' : 'unchecked'}
              onPress={() => setCheckedPrice('fixed')}
            />
            <Text style={{ fontStyle: FONT_FAMILY.LATO_REGULAR }}>Fixed</Text>
            <RadioButton
              value="second"
              color={COLORS.YELLOW_GREEN}
              status={checkedPrice === 'range' ? 'checked' : 'unchecked'}
              onPress={() => setCheckedPrice('range')}

            />
            <Text style={{ fontStyle: FONT_FAMILY.LATO_REGULAR }}>Range</Text>
          </View>
          {checkedPrice === 'fixed' ? (
            <>
              <TextInput
                mode="outlined"
                placeholder="0.00"
                style={[styles.inputStyle]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={price}
                onChangeText={text => setPrice(text)}
                onBlur={text => setPrice(parseFloat(price).toFixed(2))}
                left={<TextInput.Affix text="$" />}
              />
            </>
          ) : (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                mode="outlined"
                placeholder="0.00"
                style={[styles.inputStyle, { width: wp(160) }]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={minPrice}
                onChangeText={text => setMinPrice(text)}
                onBlur={() => setMinPrice(parseFloat(minPrice).toFixed(2))}
                left={<TextInput.Affix text="$" />}
              />
              <TextInput
                mode="outlined"
                placeholder="0.00"
                style={[styles.inputStyle, { width: wp(160) }]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                // onEndEditing={(text)=> setRange({min: range.min, max: text})}
                // onBlur={()=> range.max === ""? }
                value={maxPrice}
                onChangeText={text => setMaxPrice(text)}
                onBlur={() => setMaxPrice(parseFloat(maxPrice).toFixed(2))}
                left={<TextInput.Affix text="$" />}
              />
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              disabled={false}
              tintColors={{ true: COLORS.YELLOW_GREEN, false: 'black' }}
              status={selectmore === true ? 'checked' : 'unchecked'}
              value={selectmore}
              onPress={newValue => setSelectmore(!selectmore)}
            // onValueChange={(newValue) => selectrejectReason(newValue, index)}
            />
            <Text>Click if job(s) is more then one day</Text>
          </View>
          <View style={{ marginTop: hp(12), marginBottom: hp(12) }}>
            <Text style={styles.locationText}>Date</Text>
          </View>
          {selectmore ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.locationText}>Start Date</Text>
                <TextInput
                  placeholder="Start Date"
                  style={[styles.inputStyle, { width: wp(160) }]}
                  mode="outlined"
                  value={moment(date).format('ddd MMMM DD, YYYY')}
                  onPressIn={() => showMode('date')}
                  right={
                    <TextInput.Icon
                      name={() => (
                        <FIcon
                          name={'date'}
                          color={COLORS.NICKEL}
                          size={wp(20)}
                        />
                      )}
                    />
                  }
                  outlineColor={COLORS.NICKEL}
                  activeOutlineColor={COLORS.NICKEL}
                />
              </View>
              <View>
                <Text style={styles.locationText}>End Date</Text>
                <TextInput
                  placeholder="End Date"
                  style={[styles.inputStyle, { width: wp(160) }]}
                  mode="outlined"
                  value={moment(endtime).format('ddd MMMM DD, YYYY')}
                  onPressIn={() => showModeEnd('date')}
                  right={
                    <TextInput.Icon
                      name={() => (
                        <FIcon
                          name={'date'}
                          color={COLORS.NICKEL}
                          size={wp(20)}
                        />
                      )}
                    />
                  }
                  outlineColor={COLORS.NICKEL}
                  activeOutlineColor={COLORS.NICKEL}
                />
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endtime}
                  mode={mode}
                  is24Hour={false}
                  onChange={onChangeEnd}
                  display="spinner"
                />
              )}
            </View>
          ) : (
            <TextInput
              placeholder="Start Date"
              style={styles.inputStyle}
              mode="outlined"
              value={moment(date).format('ddd MMMM DD, YYYY')}
              onPressIn={() => showMode('date')}

              right={
                <TextInput.Icon
                  name={() => (
                    <FIcon name={'date'} color={COLORS.NICKEL} size={wp(20)} />
                  )}
                />
              }
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
            />
          )}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              onChange={onChange}
              display="spinner"
            />
          )}
          <View style={{ marginTop: hp(12) }}>
            <Text style={styles.locationText}>Start Time</Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="11:00"
              style={[styles.inputStyle, { width: wp(70) }]}
              mode="outlined"
              value={moment(date).format('hh:mm ')}
              onPressIn={() => showMode('time')}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
            />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={false}
                onChange={onChange}
                display="spinner"
              />
            )}
            <TextInput
              placeholder="AM"
              style={[styles.inputStyle, { width: wp(55) }]}
              mode="outlined"
              value={date.getHours() >= 12 ? 'PM' : 'AM'}
              // onChangeText={(text)=> }
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
            // editable={true}
            />
            <Text
              style={{
                fontSize: wp(20),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                fontWeight: '700',
              }}>
              to
            </Text>
            <TextInput
              placeholder="11:00"
              style={[styles.inputStyle, { width: wp(70) }]}
              mode="outlined"
              value={moment(endtime).format('hh:mm ')}
              onPressIn={() => showModeEnd('time')}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
            />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endtime}
                mode={mode}
                is24Hour={false}
                onChange={onChangeEnd}
              />
            )}
            <TextInput
              placeholder="PM"
              style={[styles.inputStyle, { width: wp(58) }]}
              mode="outlined"
              value={endtime.getHours() >= 12 ? 'PM' : 'AM'}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
            />
          </View>
          <CustomButton
            title={'Create Job'}
            buttonStyle={{
              marginTop: hp(16),
              marginHorizontal: wp(1),
              marginBottom: hp(6),
            }}
            onPress={() => onPressCreate()}
          />
        </View>
      </ScrollView>
      <ImagePickerComp
        isVisible={isVisible}
        onPressCancel={() => setIsVisible(false)}
        onPressPicker={image => {
          [setProfileImage(image), setIsVisible(false)];
        }}
        onPressCamera={image => {
          [setProfileImage(image), setIsVisible(false)];
        }}
      />
      {/* <ImagePickerVideo
        isVisible={isVisibleVideo}
        includeBase64={true}

        onPressCancel={() => setIsVisibleVideo(false)}
        onPressPicker={video => {
          setIsVisibleVideo(false);
          // console.log("res video ---->" , video);
        }}
        onPressCamera={video => {
          setIsVisibleVideo(false);
        }}
      /> */}
      {/* <ImagePickerComp
        isVisible={multipleImage}
        onPressCancel={() => setMultipleImage(false)}
        onPressPicker={image => {
          [setJobImage([{url: image}]), setMultipleImage(false)];
        }}
        // onPressCamera={image => {
        //   [setJobImage(image), setMultipleImage(false)];
        // }}
        data={image => setJobMultiple(image)}
      /> */}
      {multipleImagecomp}
      {multipleVideocomp}
      {modal ? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          //   setModalVisible(!modalVisible);
          // }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image
                  source={require('../../Assets/logo1.png')}
                  resizeMode={'contain'}
                />
                <Text style={styles.modalText}>{message}</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <CustomButton
                    title="Ok"
                    onPress={() => (message === "Job Created Successfully!" && select == 'social' ? onShare() : message === "Job Created Successfully!" ? props.navigation.jumpTo('Home') : clear())}
                    //onPress={() => clear()}
                    //onPress={() => (select === 'social' ? onShare() : clear())}
                    buttonStyle={styles.button}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default CreateJobs;
