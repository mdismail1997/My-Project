import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  Image,
  BackHandler,
  Alert,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
} from "react-native";
import styles from "./style";
import { STYLES, calcH, calcW } from "../../utils/constants/common";
import { Screen, InputComponent, HeaderComponent } from "../../components";
import ScrollView from "react-native-gesture-handler";
import * as webService from "../../Services/webService";
import axios from "axios";
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import DatePicker from "react-native-datepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images } from "../../assets/image/index";
function AccountScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [userid, setUserId] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [interest, setInterest] = useState("");
  const [disliking, setDisliking] = useState("");
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [userProfile, setUserProfile] = useState("");

  React.useEffect(() => {
    //getProfileData();
  }, []);
 

  return (
    <Screen>
      <View style={styles.topContainer}>
        <HeaderComponent navigation={navigation} />

        <View style={styles.lineStyle} />

        <View style={styles.profileView}>
       
          <Image source={{ uri: Images.MyProfile }} 
          style={styles.profileImg} />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: calcW(0.04),
              top: calcH(0.13),
            }}
          >
            <View style={styles.editBtn}>
              <Image
                style={styles.editIcon}
                source={Images.Pencil}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.pageTitle}>
          <Text style={styles.subheader}>My Profile</Text>
        </View>

        <View style={styles.formContainer}>
          <InputComponent
            placeholder="Name *"
            image={Images.ArrowRight}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <InputComponent
            placeholder="Email *"
            editable={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <InputComponent
            placeholder="Password *"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <InputComponent
            placeholder="Confirm Password *"
            secureTextEntry={true}
            value={cpassword}
            onChangeText={(text) => setCpassword(text)}
          />
          <InputComponent
            placeholder="Address *"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
          <DatePicker
            style={styles.datePickerStyle}
            date={dob}
            mode="date"
            placeholder="Dob(DD/MM/YYYY)"
            format="DD/MM/YYYY"
            minDate="01-01-1900"
            maxDate="01-01-2000"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                right: -5,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderColor: "gray",
                alignItems: "flex-start",
                borderWidth: 0,
                borderBottomWidth: 1,
              },
              placeholderText: {
                fontSize: 14,
                color: "gray",
              },
              dateText: {
                fontSize: 14,
              },
            }}
            onDateChange={(date) => {
              setDob(date);
            }}
          />
          <InputComponent
            placeholder="Phone Number *"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
          <InputComponent
            placeholder="Gender *"
            value={gender}
            onChangeText={(text) => setGender(text)}
          />

          <InputComponent
            placeholder="Hobbies"
            value={hobbies}
            onChangeText={(text) => setHobbies(text)}
          />
          <InputComponent
            placeholder="Interest"
            value={interest}
            onChangeText={(text) => setInterest(text)}
          />
          <InputComponent
            placeholder="Disliking"
            value={disliking}
            onChangeText={(text) => setDisliking(text)}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubContainer}
              onPress={() => {
                navigation.navigate('DrawerNavigation')
                //updateUser();
              }}
            >
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

export default AccountScreen;
