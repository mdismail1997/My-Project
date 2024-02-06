import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { IntroScreen } from '../screens';
import { RootStackParamList } from '../types';
import { LoginScreen } from '../screens/LoginScreen/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen/Signup';
import { ResetpassScreen } from '../screens/ResetPassword/ResetPass';
import { VerifyScreen } from '../screens/VerifyScreen/VefifyScreen';
import { SettingScreen } from '../screens/SettingScreen/Setting';
// import { SelectScreen } from '../screens/SelectType/SelectType';
import { BeforeLogin } from '../screens/BeforeLogin/BeforeLogin';
import { MyBottomTabs } from './TabNavigator';
import { RequestScreen } from '../screens/Request/Request';
import { Acceptreq } from '../screens/Acceptreq/Acceptreq';
import { Voicecall } from '../screens/Voicecall/Voicecall';
import { Prescription } from '../screens/Prescription/Prescription';
import { EditProfile } from '../screens/EditProfile/EditProfile';
import { AccountDetails } from '../screens/Account/AccountDetails';
import { Chat } from '../screens/ChatConsultation/Chat';
import { ReqChngMedicine } from '../screens/ReqChangeMedicine/ReqCngMedicine';
import { ChngMedicine } from '../screens/ChngMedicine/ChngMedicine';
import { Schedule } from '../screens/ScheduleTime/Schedule';
import { EditSchedule } from '../screens/ScheduleTime/EditSchedule';
import { MyTabs } from './PatientTabNavigator';
import { Profile } from '../screens/Profile/Profile';
import { PatientProfile } from '../screens/Patient/PatientProfile/PatientProfile';
import { Notification } from '../screens/Patient/Notification/Notification';
import { PatientEditProfile } from '../screens/Patient/PatientEditProfile/PatientEditProfile';
import InspectionCost from '../screens/Patient/BookAppintment/BookAppoin';
import { PaymentSuccess } from '../screens/Patient/Payment/Payment';
import MyAppointment from '../screens/Patient/MyAppointment/MyAppointment';
import { PatientVoicecall } from '../screens/Patient/PaitientVoiceCall/PatientVoicecall';
import { PatientPrescription } from '../screens/Patient/PatientPrescription/PatientPrescription';
import { PatientChngMed } from '../screens/Patient/PatientChngMed/PatientChngMed';
import { Favourite } from '../screens/Patient/Favourite/Favoutite';
import { PrescriptionList } from '../screens/Patient/PrescriptionList/PrescriptionList';
import { Review } from '../screens/Patient/Review/Review';
import { VoiceCallEnd } from '../screens/Patient/VoiceCallEnd/VoiceCallEnd';
import { SelectGender } from '../screens/QuickVisit/SelectGender/SelectGender';
import { SelectYear } from '../screens/QuickVisit/SelectYear/SelectYear';
import { Chatting } from '../screens/QuickVisit/Chat/Chat';
import { SelectFemale } from '../screens/QuickVisit/SelectYear/SelectFemale';
import { SelectCause } from '../screens/QuickVisit/SelectCaused/SelectCause';
import { AddReport } from '../screens/QuickVisit/AddReport/AddReport';
import { FellingNow } from '../screens/QuickVisit/FelllingNow/FellingNow';
import { Diagnosis } from '../screens/QuickVisit/Diagnosis/Diagnosis';
import { SelectZone } from '../screens/QuickVisit/SelectZone/SelectZone';
import { SuggestDoctor } from '../screens/QuickVisit/SugestDoctor/SugestDoctor';
import { ProceedAppoin } from '../screens/QuickVisit/ProceedAppoinment/ProceedAppoin';
import { CompleteAppoin } from '../screens/QuickVisit/CompleteAppoin/CompleteAppoin';
import { Overview } from '../screens/PatientOverview/Overview';
import { SelectScreen } from '../screens/SelectType/SelectType';
import { PatientOverview } from '../screens/Patient/PatientaddOverview/Overview';
import { DoctorProfile } from '../screens/DoctorProfile/DoctorProfile';
import { OtpVerify } from '../screens/OtpVerification/OtpVerification';
import { OtpResetPass } from '../screens/Otpresetpassword/Otpresetpassword';
import { PatientAccount } from '../screens/Patient/PatientAccount/PatientAccount';
import { Slot } from '../screens/SeeSlot/SeeSlot';
import { Timing } from '../screens/Timings/Timings';
import { AddPrice } from '../screens/AddPrice/AddPrice';
import Booking from '../screens/Patient/StartBooking/StartBooking';
import { PatientSearch } from '../screens/Patient/PatientSearch/PatientSearch';
import { PatientDetails } from '../screens/Patient/PatientDetails/PatientDetails';
import { Appointment } from '../screens/Patient/Appointment/Appointment';
import { Completed } from '../screens/Competed/Completed';
import { Befrereq } from '../screens/Beforerequest/Beforereq';
import { Rejected } from '../screens/Rejected/Rejected';
import ChatScreen from '../screens/Chat/Chat';
import StartChat from '../screens/Patient/SrartChat/StartChat';
import { CompletedList } from '../screens/Patient/Completedlist/Completedlist';
import CompletedChat from '../screens/Patient/Completechat/CompletedChat';
import DoctorChat from '../screens/CompleteChatDoctor/DoctorChat';
import { VideoCall } from '../screens/Videocall/Videocall';
import { Video } from '../screens/ChatConsultation/Video';
import { Order } from '../screens/Order/Order';
import { OrderList } from '../screens/Patient/OrderList/OrderList';
import { PatientChart } from '../screens/Patient/Patient Chart/PatientChart';

import { QuickVerify } from '../screens/QuickVisit/QuickVerify/QuickVerify';
import { QuickOtp } from '../screens/QuickVisit/QuickOtp/QuickOtp';
import { SelectRegisterGender } from '../screens/QuickVisit/SelectGender/SelectRegisterGender';
import { AddHeight } from '../screens/QuickVisit/AddHeight/AddHeight';
import { ShowHeight } from '../screens/QuickVisit/ShowHeight/ShowHeight';
import { AddMode } from '../screens/QuickVisit/AddMode/AddMode';
import { AddDetails } from '../screens/QuickVisit/AddExtraDetails/AddDetails';
import { ProblemList } from '../screens/QuickVisit/ProblemList/ProblemList';
import { SymptomsList } from '../screens/QuickVisit/SymptomsList/SymptomsList';
import { LocationList } from '../screens/QuickVisit/LocatonList/LocationList';
import { WornsedList } from '../screens/QuickVisit/WornsedList/WornsedList';
import { ImproveList } from '../screens/QuickVisit/ImproveList/ImproveList';
import { OtherSymptomList } from '../screens/QuickVisit/OtherSymptom/OtherSymptom';
import PatientInformation from '../screens/Patient/PatientInformation/PatientInformation';
import { DoctorFavourite } from '../screens/DFavouriteList/DFavouritelist';
import { AboutUs } from '../screens/AboutUs/AboutUs';
import { PrivacyPolicy } from '../screens/PrivacyPolicy/PrivacyPolicy';
import { GoSettings } from '../screens/GoSettings/GoSettings';
import { QuickVisitData } from '../screens/QuickVisitData/QuickVisitdata';
import { ShowQuickVisitData } from '../screens/ShowQuickVisitData/ShowQuickVisitData';
import { TermsAndCondition } from '../screens/TermsAndCon/TermsAnsCon';
import { Voice } from '../screens/ChatConsultation/Voice';
import { SkillListing } from '../screens/Patient/SkillListing/SkillListing';
import { StripPayment } from '../screens/Payment/Payment';
import BeforeConsult from '../screens/QuickVisit/BeforeConsult/BeforeConsult';
import { ShowAccountDetails } from '../screens/Account/ShowAccountDetails';
import BeforeDiagnosis from '../screens/QuickVisit/BeforeDiagnosis/BeforeDiagnosis';
import { ShowReview } from '../screens/Patient/ShowReview/ShowReview';
import { DoctorProfile2 } from '../screens/DoctorProfile/DoctorProfile2';
import { NoteList } from '../screens/NoteList/NoteList';
interface RootNavigatorProps {
  isLogin: Record<string, unknown>;
}

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC<RootNavigatorProps> = ({ isLogin }) => {
  return (
    <Stack.Navigator
      initialRouteName={
        isLogin.isLogIn
          ? isLogin.role === 'Doctor'
            ? 'Dashboard'
            : 'PatientTabNavigator'
          : 'Intro'
      }
    >
      {/* <Stack.Screen
        name="BeforeLogin"
        component={SelectScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Intro"
        component={BeforeLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectScreen"
        component={SelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPass"
        component={ResetpassScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyScreen"
        component={VerifyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientAccount"
        component={PatientAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={MyBottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientTabNavigator"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Request"
        component={Befrereq}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Acceptreq"
        component={Acceptreq}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Voicecall"
        component={Voicecall}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Prescription"
        component={PatientPrescription}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Video"
        component={Video}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReqChngMedicine"
        component={ReqChngMedicine}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChngMedicine"
        component={ChngMedicine}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Schedule"
        component={Schedule}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditSchedule"
        component={EditSchedule}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientProfile"
        component={PatientProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientEditProfile"
        component={PatientEditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={InspectionCost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyAppointment"
        component={MyAppointment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientVoicecall"
        component={PatientVoicecall}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientPrescription"
        component={Prescription}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientChngMed"
        component={PatientChngMed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favourite"
        component={Favourite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrescriptionList"
        component={PrescriptionList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VoiceCallEnd"
        component={VoiceCallEnd}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectGender"
        component={SelectGender}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectYear"
        component={SelectYear}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectFemale"
        component={SelectFemale}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectCause"
        component={SelectCause}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddReport"
        component={AddReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FellingNow"
        component={FellingNow}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Diagnosis"
        component={Diagnosis}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectZone"
        component={SelectZone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SugestDoctor"
        component={SuggestDoctor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProceedAppoin"
        component={ProceedAppoin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompleteAppoin"
        component={CompleteAppoin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Overview"
        component={Overview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientOverview"
        component={PatientOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorProfile"
        component={DoctorProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerify"
        component={OtpVerify}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OtpReset"
        component={OtpResetPass}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Slot"
        component={Slot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Timing"
        component={Timing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPrice"
        component={AddPrice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientSearch"
        component={PatientSearch}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Completed"
        component={Completed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Rejected"
        component={Rejected}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatMessage"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Startchat"
        component={StartChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompletedList"
        component={CompletedList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompletedChat"
        component={CompletedChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorChat"
        component={DoctorChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orderlist"
        component={OrderList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientChart"
        component={PatientChart}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="BodyParts"
        component={SelectBodyParts}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="ProblemList"
        component={ProblemList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SymptomsList"
        component={SymptomsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuickVerify"
        component={QuickVerify}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuickOtp"
        component={QuickOtp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectRegisterGender"
        component={SelectRegisterGender}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddHeight"
        component={AddHeight}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowHeight"
        component={ShowHeight}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMode"
        component={AddMode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddDetails"
        component={AddDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LocationList"
        component={LocationList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WornsedList"
        component={WornsedList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImproveList"
        component={ImproveList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtherSymptomList"
        component={OtherSymptomList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientInformation"
        component={PatientInformation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorFavourite"
        component={DoctorFavourite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GoSettings"
        component={GoSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuickVisitData"
        component={QuickVisitData}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowQuickVisitData"
        component={ShowQuickVisitData}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Voice"
        component={Voice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SkillListing"
        component={SkillListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StripPayment"
        component={StripPayment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BeforeConsult"
        component={BeforeConsult}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowAccountDetails"
        component={ShowAccountDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BeforeDiagnosis"
        component={BeforeDiagnosis}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowReview"
        component={ShowReview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorProfile2"
        component={DoctorProfile2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NoteList"
        component={NoteList}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
