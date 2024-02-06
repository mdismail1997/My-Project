import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type RootTabParamList = {
  Home: undefined;
  Request: undefined;
  Search: undefined;
  History: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  NotFound: undefined;
  Intro: undefined;
  LogIn: undefined;
  SignUp: undefined;
  ResetPass: undefined;
  VerifyScreen: undefined;
  SettingScreen: undefined;
  SeletType: undefined;
  BeforeLogin: undefined;
  RequestScreen: undefined;
  Acceptreq: undefined;
  Voicecall: undefined;
  Prescription: undefined;
  EditProfile: undefined;
  AccountDetails: undefined;
  Chat: undefined;
  ChngMedicine: undefined;
  ReqChngMedicine: undefined;
  Schedule: undefined;
  Chip: undefined;
  EditSchedule: undefined;
  PatientTabNavigator: undefined;
  Profile: undefined;
  PatientProfile: undefined;
  Notification: undefined;
  PatientEditProfile: undefined;
  PatientDetails: undefined;
  Appointment: undefined;
  BookAppointment: undefined;
  Payment: undefined;
  MyAppointment: undefined;
  PatientVoicecall: undefined;
  PatientPrescription: {
    bookingid: number;
  };
  PatientChngMed: undefined;
  Favourite: undefined;
  PrescriptionList: undefined;
  Review: undefined;
  VoiceCallEnd: undefined;
  SelectGender: undefined;
  SelectYear: undefined;
  Chatting: undefined;
  ChatMessage: {
    doctor_id: number;
    patient_id: number;
    booking_id: number;
    profile_Pic: string;
    endTime: number;
  };
  SelectFemale: undefined;
  SelectCause: undefined;
  AddReport: undefined;
  FellingNow: undefined;
  Diagnosis: undefined;
  SelectZone: undefined;
  SugestDoctor: undefined;
  ProceedAppoin: undefined;
  CompleteAppoin: undefined;
  Overview: undefined;
  PatientOverview: undefined;
  SelectScreen: undefined;
  DoctorProfile: undefined;
  OtpVerify: undefined;
  OtpReset: undefined;
  PatientAccount: undefined;
  Slot: undefined;
  Timing: undefined;
  AddPrice: undefined;
  Booking: undefined;
  PatientSearch: undefined;
  Completed: undefined;
  Request: undefined;
  Rejected: undefined;
  Startchat: undefined;
  CompletedList: undefined;
  CompletedChat: undefined;
  DoctorChat: undefined;
  VideoCall: undefined;
  Dashboard: NavigatorScreenParams<RootTabParamList> | undefined;
  Video: undefined;
  Order: undefined;
  Orderlist: undefined;
  PatientChart: undefined;
  BodyParts: undefined;
  QuickVerify: undefined;
  QuickOtp: undefined;
  SelectRegisterGender: undefined;
  AddHeight: undefined;
  ShowHeight: undefined;
  AddMode: undefined;
  AddDetails: undefined;
  ProblemList: undefined;
  SymptomsList: undefined;
  LocationList: undefined;
  WornsedList: undefined;
  ImproveList: undefined;
  OtherSymptomList: undefined;
  PatientInformation: undefined;
  DoctorFavourite: undefined;
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  GoSettings: undefined;
  QuickVisitData: undefined;
  ShowQuickVisitData: undefined;
  TermsAndCondition: undefined;
  Voice: undefined;
  SkillListing: undefined;
  StripPayment: undefined;
  BeforeConsult: undefined;
  ShowAccountDetails: undefined;
  BeforeDiagnosis: undefined;
  PaymentSuccess: undefined;
  ShowReview: undefined;
  DoctorProfile2: undefined;
  NoteList: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    StackScreenProps<RootStackParamList>
  >;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
