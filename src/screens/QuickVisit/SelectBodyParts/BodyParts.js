import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Body from 'react-native-body-highlighter';
import {
  Button,
  IconButton,
  RadioButton,
  Switch,
  Text,
  Title,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';

export const SelectBodyParts = (props) => {
  const [loading, setLoding] = React.useState(false);
  const [selectedPart, setSelectedPart] = React.useState([]);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [isModal, setIsModal] = React.useState(false);
  const [isSlug, setIsSlug] = React.useState();
  const [catid, setCatid] = React.useState();
  const [isPartsModal, setIsPartsModal] = React.useState(false);
  const [isSubCatModal, setIsSubCatModal] = React.useState(false);
  const [isDiagnosis, setIsDianosis] = React.useState(false);
  const [alldata, setAllData] = React.useState([]);
  const [diagnosisdata, setDiagnosisData] = React.useState([]);
  const [checked, setChecked] = React.useState();
  const [subcat, setSubCat] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [zone, setZone] = React.useState('');
  const [id, setId] = React.useState();
  const [diagnosis, setDiagnosis] = React.useState('');
  const [side, setSide] = React.useState('');
  const [isCatModal, setIsCatModal] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const handlePress = (data) => {
    console.warn('data', data);
    setSelectedPart([{ slug: data.slug, intensity: 1 }]);
    //  Alert.alert(`you select: ${data.slug}`);
    setIsSlug(data.slug);
    setCatid(data.id);
    setIsModal(true);
    console.log(isSlug);
  };
  useEffect(() => {
    console.log(props.route.params?.height);
    console.log(props.route.params?.weight);
    console.log(props.route.params?.userid);
  }, [
    props.route.params?.height,
    props.route.params?.weight,
    props.route.params?.userid,
  ]);
  const Subcategory = async () => {
    const data = {
      cat_id: catid,
    };

    setLoding(true);
    await Apis.getsubcategory(data)

      .then((response) => {
        console.warn(response.data);
        setAllData(response.data.response);
        setIsModal(false);
        setIsPartsModal(true);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const Diagnosis = async () => {
    const data = {
      diogonosis: position,
      part: subcat,
    };

    setLoding(true);
    await Apis.diagnosis(data)

      .then((response) => {
        console.warn(response.data);
        setDiagnosisData(response.data.response.diagnosis.split(','));
        setDiagnosis(response.data.response.diagnosis);
        setZone(response.data.response.color);
        setSide(response.data.side);
        // console.log('lkkklppp===' ,diagnosisdata)

        setIsSubCatModal(false);
        setIsDianosis(true);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  // let diagnosis=  diagnosisdata.split(',')
  console.log(side);
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <Text>Front</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        <Text>Back</Text>
      </View>
      {isSwitchOn ? (
        <Body
          onMusclePress={handlePress}
          zoomOnPress={false}
          scale={2.5}
          backOnly
          data={selectedPart}
        />
      ) : (
        <Body
          onMusclePress={handlePress}
          zoomOnPress={false}
          scale={2.5}
          frontOnly
          data={selectedPart}
        />
      )}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 80,
            padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 200,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setIsModal(false);
            }}
          />
          {/* <View style={{flexDirection:'row'}}> */}
          <Text
            style={{
              //  color: '#333333',
              marginLeft: 20,
              marginTop: 10,
              // width: '68%',
              alignSelf: 'flex-start',
              color: '#2173A8',
            }}
          >
            <Text style={{}}> You experiencing pain in </Text>
            {isSlug}?
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              justifyContent: 'space-between',
              alignSelf: 'center',
              //marginRight: 30,
              flexDirection: 'row',
              marginTop: 30,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => Subcategory()}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Yes
            </Button>
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => {
                setIsModal(false);
              }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
              style={{ marginLeft: 20 }}
            >
              No
            </Button>
          </View>
          {/* </View> */}
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isPartsModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            // justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 300,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setIsPartsModal(false);
            }}
          />
          <ImageBackground
            source={require('../../../Assets/abdomen.png')}
            style={{
              alignItems: 'center',
              backgroundColor: '#f5ebf4',
              // justifyContent: 'center',
              marginTop: 10,
              width: 280,
              alignSelf: 'center',
              elevation: 5,
              borderRadius: 55,
              height: 200,
            }}
          >
            <Title style={{ textAlign: 'center' }}> Choose From Below</Title>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {alldata.map((el, i) => (
                <TouchableOpacity
                  onPress={
                    () => {
                      setIsPartsModal(false);
                      setIsSubCatModal(true);
                      setSubCat(el.sub_cat);
                      setPosition(el.position);
                      setId(el.id);
                      console.log(el.sub_cat);
                    }

                    // props.navigation.navigate(
                    //   'SelectCause',

                    //   {
                    //     subcat: el.sub_cat,
                    //     slug: isSlug,
                    //     subcatid: el.id,
                    //     userid: props.route.params?.userid,
                    //   },
                    //   setIsPartsModal('false')
                    // )
                  }
                >
                  <Text
                    style={{
                      width: 80,
                      // borderColor: 'blue',
                      // borderWidth: 1,
                      textAlign: 'center',
                      marginLeft: 10,
                      marginVertical: 5,
                    }}
                  >
                    {' '}
                    {el.sub_cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ImageBackground>
          {/* </View> */}
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isSubCatModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 80,
            padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 200,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setIsSubCatModal(false);
            }}
          />
          {/* <View style={{flexDirection:'row'}}> */}
          <Text
            style={{
              //  color: '#333333',
              marginLeft: 20,
              marginTop: 10,
              // width: '68%',
              // alignSelf: 'flex-start',
              color: '#2173A8',
            }}
          >
            {/* {subcat=== 'Left iliac region' ||'Right iliac region' || 'Hypogastric region'?
            <Text style={{textAlign:'center'}}> You Select Lower Abdomen </Text>
            
         
          :null
            }
            {subcat=== 'Right hypochondriac region' ||'Epigastric Region' || 'Left hypochondriac region'?
            <Text style={{textAlign:'center'}}> You Select Upper Abdomen </Text>
            
         
          :null
            }
            {subcat=== "Right Lumbar Region" ||"Umbilical region" || "Left Lumbar Region"?
            <Text style={{textAlign:'center'}}> You Select Middle Abdomen </Text>
            
         
          :null
            } */}
            <Text style={{ textAlign: 'center' }}> You Select </Text>
            {subcat}
            <Text style={{ textAlign: 'center' }}> Of </Text> {position}
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              justifyContent: 'space-between',
              alignSelf: 'center',
              //marginRight: 30,
              flexDirection: 'row',
              marginTop: 30,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => {
                Diagnosis();
              }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Yes
            </Button>
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => {
                setIsSubCatModal(false);
              }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
              style={{ marginLeft: 20 }}
            >
              No
            </Button>
          </View>
          {/* </View> */}
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isDiagnosis}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            // justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 500,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setIsCatModal(false);
            }}
          />

          <Title style={{ textAlign: 'center' }}> Choose From Below</Title>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
          >
            {/* <Title style={{ textAlign: 'center' }}> Choose From Below</Title> */}
            <ScrollView contentContainerStyle={{ marginBottom: 10 }}>
              {diagnosisdata.map((el, i) => (
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  // onPress={() =>
                  //   props.navigation.navigate('SelectCause', {
                  //     subcat: el.sub_cat,
                  //   })
                  // }
                  onPress={
                    () => {
                      setIsDianosis(false), setIsCatModal(true);
                    }
                    //   props.navigation.navigate(
                    //   'AddReport',

                    //   {
                    //     subcat: subcat,
                    //     slug: isSlug,
                    //     subcatid:id,
                    //     userid: props.route.params?.userid,
                    //     zone:zone,
                    //     diagnosis:diagnosis
                    //   },

                    //   // props.navigation.navigate('AddReport', {
                    //   //   symptom: alldata.symptoms,
                    //   //   subcat: props.route.params?.subcat,
                    //   //   slug: props.route.params?.slug,
                    //   //   symptomid: selectedItems['alldata'],
                    //   //   userid: props.route.params?.userid,
                    //   // });
                    //   setIsDianosis('false')
                    // )
                  }
                  labelStyle={{ color: '#fff', fontSize: 10 }}
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                    width: 250,
                  }}
                >
                  {el + '(' + side + ')'}
                </Button>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isCatModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            // justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 500,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setIsCatModal(false);
            }}
          />

          <Title style={{ textAlign: 'center' }}> Choose From Below</Title>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
          >
            {/* <Title style={{ textAlign: 'center' }}> Choose From Below</Title> */}
            <ScrollView contentContainerStyle={{ marginBottom: 10 }}>
              <Button
                mode="contained"
                color="#2173A8"
                uppercase={false}
                // onPress={() =>
                //   props.navigation.navigate('SelectCause', {
                //     subcat: el.sub_cat,
                //   })
                // }
                onPress={() =>
                  props.navigation.navigate(
                    'AddReport',

                    {
                      subcat: subcat,
                      slug: isSlug,
                      subcatid: id,
                      userid: props.route.params?.userid,
                      zone: zone,
                      diagnosis: diagnosis,
                    },

                    // props.navigation.navigate('AddReport', {
                    //   symptom: alldata.symptoms,
                    //   subcat: props.route.params?.subcat,
                    //   slug: props.route.params?.slug,
                    //   symptomid: selectedItems['alldata'],
                    //   userid: props.route.params?.userid,
                    // });
                    setIsCatModal('false')
                  )
                }
                labelStyle={{ color: '#fff', fontSize: 10 }}
                style={{ marginHorizontal: 10, marginVertical: 10, width: 250 }}
              >
                Pyelonephritis
              </Button>
              <Button
                mode="contained"
                color="#2173A8"
                uppercase={false}
                // onPress={() =>
                //   props.navigation.navigate('SelectCause', {
                //     subcat: el.sub_cat,
                //   })
                // }
                onPress={() =>
                  props.navigation.navigate(
                    'AddReport',

                    {
                      subcat: subcat,
                      slug: isSlug,
                      subcatid: id,
                      userid: props.route.params?.userid,
                      zone: zone,
                      diagnosis: diagnosis,
                    },

                    // props.navigation.navigate('AddReport', {
                    //   symptom: alldata.symptoms,
                    //   subcat: props.route.params?.subcat,
                    //   slug: props.route.params?.slug,
                    //   symptomid: selectedItems['alldata'],
                    //   userid: props.route.params?.userid,
                    // });
                    setIsCatModal('false')
                  )
                }
                labelStyle={{ color: '#fff', fontSize: 10 }}
                style={{ marginHorizontal: 10, marginVertical: 10, width: 250 }}
              >
                Endometritis(W)
              </Button>
              <Button
                mode="contained"
                color="#2173A8"
                uppercase={false}
                // onPress={() =>
                //   props.navigation.navigate('SelectCause', {
                //     subcat: el.sub_cat,
                //   })
                // }
                onPress={() =>
                  props.navigation.navigate(
                    'AddReport',

                    {
                      subcat: subcat,
                      slug: isSlug,
                      subcatid: id,
                      userid: props.route.params?.userid,
                      zone: zone,
                      diagnosis: diagnosis,
                    },

                    // props.navigation.navigate('AddReport', {
                    //   symptom: alldata.symptoms,
                    //   subcat: props.route.params?.subcat,
                    //   slug: props.route.params?.slug,
                    //   symptomid: selectedItems['alldata'],
                    //   userid: props.route.params?.userid,
                    // });
                    setIsCatModal('false')
                  )
                }
                labelStyle={{ color: '#fff', fontSize: 10 }}
                style={{ marginHorizontal: 10, marginVertical: 10, width: 250 }}
              >
                Diverticulosis
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
