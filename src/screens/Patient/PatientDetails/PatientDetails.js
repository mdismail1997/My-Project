import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Card,
  Title,
} from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import RadioSelector from '../../../components/Chip';
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from '../../../components/React-Native-Multi-Select';
import DropDownPicker from 'react-native-dropdown-picker';
import { Thanku } from '../../../components/Popupmessage/Thanku';
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
export const PatientDetails = (props) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [mobno, setMobno] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
  const [open, setOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState({});
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const [allergy, setAllergy] = useState([]);
  const [otherallergy, setOtherallergy] = useState('');
  const [medicine, setMedicine] = useState([]);
  const [othermed, setOthermed] = useState('');
  const [othermedical, setOthermedical] = useState('');
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [feet, setFeet] = useState('0');
  const [inch, setInch] = useState('0');
  const [weight, setWeight] = useState([]);
  const [problem, setProblem] = useState('');
  const [bloodgroup, setBloodgroup] = useState([]);
  const [bloodsugar, setBloodsugar] = useState([]);
  const [items, setItems] = useState([
    { label: 'A+', value: 'A+' },
    { label: 'B+', value: 'B+' },
    { label: 'AB+', value: 'AB+' },
    { label: 'O+', value: 'O+' },
    { label: 'A-', value: 'A-' },
    { label: 'B-', value: 'B-' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O-', value: 'O-' },
  ]);
  useEffect(() => {
    getdata();
    getextradetails();
    getallergy();
    getmedicine();
  }, []);
  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  const chipData = ['19+', '25+', '30+', '40+', '10+', '50+', '60+', '70+'];
  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.profileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setMobno(response.data.response?.phone ?? '');
        setGender(response.data.response.gender);
        setAge(response.data.response.age);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getextradetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);

    let token = usertoken;
    console.log('token123=', token);
    console.log('user id =====>>>>', user_id);
    const data = {
      user_id: user_id,
    };
    setLoding(true);
    await Apis.addheightdetails(data)

      .then((response) => {
        console.log('details======>', response.data.response);
        setFeet(response.data.response.feet);
        setInch(response.data.response.inch);
        setWeight(response.data.response.weight);
        setBloodgroup(response.data.response.blood_gr);
        setBloodsugar(response.data.response.blood_suger_level);
        setLoding(false);
      })

      .catch((error) => {
        console.error(error.response.data.errors);
      });
  };
  const getallergy = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    setLoding(true);
    await Apis.getallergy(token)

      .then((response) => {
        console.log('allergy======>', response.data.response);
        setAllergy(response.data.response);
        getAllergydetails();
        setLoding(false);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getmedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getmedication(token)

      .then((response) => {
        console.log('medication======>', response.data.response);
        setMedicine(response.data.response);
        getmedicationdetails();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getAllergydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.allergydetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['allergy']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getmedicationdetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.medicinedetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['medicine']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const UpdateBooking = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
      problem: problem,
      name: name,
      phone: mobno,
      age: age,
      gender: gender,
      weight: weight,
      feet: feet,
      inch: inch,
      blood_gr: bloodgroup,
      blood_suger_level: bloodsugar,
      allergy: selectedItems['allergy']?.toString(),
      medications: selectedItems['medicine']?.toString(),
    };
    console.log('data--------', data);

    await Apis.bookingupdate(data)

      .then((response) => {
        console.warn(response.data);
        console.log('bid---->', props.route.params?.bookingid);
        SetIsModalVisible(true);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  // if (isModalVisible === false) {
  //   props.navigation.replace('Appointment');
  // }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Patient Details" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView>
        <TextInput
          label="Full Name*"
          mode="outlined"
          //change placeholder
          placeholder="Enter Your full Name"
          // change color code
          selectionColor="black"
          outlineColor="black"
          activeOutlineColor="black"
          value={name}
          onChangeText={(text) => setName(text)}
          style={{ marginHorizontal: '7%', marginBottom: 10, marginTop: 30 }}
        />
        <TextInput
          label="Age"
          value={age}
          onChangeText={(text) => setAge(text)}
          mode="outlined"
          //change placeholder
          placeholder=""
          // change color code
          selectionColor="black"
          outlineColor="black"
          activeOutlineColor="black"
          style={{ marginHorizontal: '8%', marginBottom: 10 }}
          keyboardType="number-pad"
        />

        <TextInput
          label="Phone Number**"
          mode="outlined"
          value={mobno.toString()}
          onChangeText={(text) => setMobno(text)}
          // change color code
          selectionColor="black"
          outlineColor="black"
          activeOutlineColor="black"
          style={{ marginHorizontal: '7%', marginBottom: 10, marginTop: '5%' }}
        />
        <TextInput
          label="Gender*"
          mode="outlined"
          value={gender}
          onChangeText={(text) => setGender(text)}
          // change color code
          selectionColor="black"
          outlineColor="black"
          activeOutlineColor="black"
          style={{ marginHorizontal: '7%', marginBottom: 10 }}
        />

        <View>
          <Title style={{ marginVertical: 5, marginLeft: 15 }}>Allergy</Title>
          <Card style={{ borderRadius: 15, marginHorizontal: 20 }}>
            <Card.Content>
              <MultiSelect
                items={allergy}
                uniqueKey="id"
                // onToggleList={getallergy}
                selectedItems={selectedItems['allergy']}
                onSelectedItemsChange={(item) =>
                  onSelectedItemsChange('allergy', item)
                }
              />
              {selectedItems['allergy']?.some(
                (element) => mapObject(allergy)[element] === 'Others'
              ) && (
                <TextInput
                  mode="outlined"
                  label="Add Your HIstory"
                  value={otherallergy}
                  onChangeText={(text) => {
                    if (text.length < 20) {
                      setOtherallergy(text);
                    }
                  }}
                  placeholder=""
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
                  }}
                />
              )}
            </Card.Content>
          </Card>
        </View>

        <Title style={{ marginVertical: 5, marginLeft: 15 }}>Height</Title>
        <View style={{ flexDirection: 'row', width: '90%', marginLeft: 15 }}>
          <TextInput
            mode="outlined"
            label=" Feet"
            // maxLength={5}
            value={feet}
            onChangeText={(Text) => {
              console.log('text==============>', Text);
              let cngfeet = Text;
              if (Text) {
                cngfeet = Number.parseInt(Text).toString();
              }

              setFeet(cngfeet);
            }}
            type="text"
            keyboardType="number-pad"
            placeholder=""
            right={<TextInput.Affix text="ft" />}
            outlineColor="#fff"
            // keyboardType="decimal-pad"
            style={{
              borderRadius: 50,
              elevation: 0,
              marginHorizontal: 15,
              backgroundColor: '#fff',
              width: '43%',
              // marginTop: 10,
            }}
          />
          <TextInput
            mode="outlined"
            label="inch"
            // maxLength={5}
            value={inch}
            onChangeText={(Text) => {
              let cnginch = Text;
              if (Text) {
                cnginch = Number.parseInt(Text).toString();
              }

              setInch(cnginch);
            }}
            // type="number"
            keyboardType="number-pad"
            placeholder=""
            right={<TextInput.Affix text="in" />}
            outlineColor="#fff"
            style={{
              borderRadius: 50,
              elevation: 0,
              width: '43%',
              backgroundColor: '#fff',
              // marginTop: 10,
            }}
          />
        </View>
        <Title style={{ marginVertical: 5, fontsize: 5, marginLeft: 15 }}>
          Weight
        </Title>
        <TextInput
          mode="outlined"
          // maxLength={5}
          value={weight}
          onChangeText={(text) => setWeight(text)}
          // type="number"
          keyboardType="number-pad"
          right={<TextInput.Affix text="lbs" />}
          placeholder=""
          outlineColor="#fff"
          style={{
            borderRadius: 50,
            elevation: 0,
            marginHorizontal: 15,
            backgroundColor: '#fff',
            // marginTop: 10,
          }}
        />
        <Title style={{ marginVertical: 5, marginLeft: 15 }}>Blood Group</Title>

        <DropDownPicker
          open={open}
          value={bloodgroup}
          items={items}
          setOpen={setOpen}
          setValue={setBloodgroup}
          placeholder="Blood Group"
          setItems={setItems}
          autoScroll={true}
          flatListProps={{
            decelerationRate: 'fast',
          }}
          maxHeight={500}
          // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
          labelStyle={{
            width: '85%',
          }}
          containerStyle={{
            marginHorizontal: '6%',

            marginTop: 3,
            width: '86%',
          }}
        />

        <Title style={{ marginVertical: 5, marginLeft: 15 }}>Blood Sugar</Title>
        <TextInput
          mode="outlined"
          label="Blood Sugar"
          maxLength={5}
          value={bloodsugar}
          onChangeText={(text) => setBloodsugar(text)}
          // type="number"
          // keyboardType="number-pad"
          placeholder=""
          outlineColor="#fff"
          style={{
            borderRadius: 50,
            elevation: 0,
            marginHorizontal: 15,
            backgroundColor: '#fff',
            width: '85%',
            alignSelf: 'center',
            // marginTop: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            marginHorizontal: '7%',
            width: '100%',
          }}
        >
          <Text style={{ color: '#000', fontSize: 15, width: '80%' }}>
            Are You Taking Any Medications?
          </Text>
          <TouchableOpacity style={{ width: '10%' }}>
            <Image
              source={require('../../../Assets/plus.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Title style={{ marginVertical: 5, marginLeft: 15 }}>Medicine</Title>
          <Card style={{ borderRadius: 15, marginHorizontal: 20 }}>
            <Card.Content>
              <MultiSelect
                items={medicine}
                uniqueKey="id"
                // onToggleList={getmedicine}
                selectedItems={selectedItems['medicine']}
                onSelectedItemsChange={(item) =>
                  onSelectedItemsChange('medicine', item)
                }
              />
              {selectedItems['medicine']?.some(
                (element) => mapObject(medicine)[element] === 'Others'
              ) && (
                <TextInput
                  mode="outlined"
                  value={othermed}
                  onChangeText={(text) => setOthermed(text)}
                  label="Add Your HIstory"
                  placeholder=""
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
                  }}
                />
              )}
            </Card.Content>
          </Card>
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 20, height: 50 }}>
          <TextInput
            mode="outlined"
            label="Write Your Problem*"
            placeholder="Tell doctor about your problem"
            style={{ marginBottom: 10, height: 80 }}
            multiline={true}
            value={problem}
            onChangeText={(text) => setProblem(text)}
          />
        </View>
        <View
          style={{
            marginTop: 60,
            width: '80%',
            height: 55,
            // change BorderColor
            borderColor: '#fff',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 90,
            backgroundColor: '#2173A8',
          }}
          activeOpacity={0.7}
        >
          <TouchableOpacity
            onPress={() => UpdateBooking(props.route.params?.bookingid)}
          >
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 53,
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: 18,
                fontFamily: 'Rubik',
                letterSpacing: 0.4,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Thanku
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',

    alignSelf: 'center',
    elevation: 5,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    width: '90%',
    marginBottom: 10,
  },
  app: {
    marginHorizontal: 20,

    maxWidth: 800,
    flexDirection: 'row',
    marginTop: 20,
  },
});
