import axios from 'axios';
import { base_url } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserToken } from '../../storage';

const axiosInstance = axios.create({ baseURL: base_url });
axiosInstance.interceptors.request.use(async (request) => {
  const credential = await AsyncStorage.getItem('authtoken');
  console.log('auth_token======>', credential);
  const updatedHeaders = {
    Authorization: credential ?? '',
  };
  request.headers = updatedHeaders;
  return request;
});

const getuser = async () => await axiosInstance.get('api/roles');

const getsignup = async (data) =>
  await axiosInstance.post('api/register', data, {
    headers: { 'Content-Type': 'application/json' },
  });

const getlogin = async (data) =>
  await axiosInstance.post('api/login', data, {
    headers: { 'Content-Type': 'application/json' },
  });

const getotp = async (data) =>
  await axiosInstance.post('api/otp_chk', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const resendotp = async (data) =>
  await axiosInstance.post('api/resend_otp', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getotpreset = async (data) =>
  await axiosInstance.post('api/forgot_password_otp', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getprofileupdate = async (data) =>
  await axiosInstance.post('api/patient/profile_update', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

const profileData = async (data) =>
  await axiosInstance.post('api/patient/profile_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorprofileData = async (data) =>
  await axiosInstance.post('api/doctor/profile_details_doctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getroute = async (data) =>
  await axiosInstance.post('api/doctor/routes', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorspecilization = async (data) =>
  await axiosInstance.post('api/doctor/doctor_speciality', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const allergydetails = async (data) =>
  await axiosInstance.post('api/patient/patient_allergy', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const surgicalhistorydetails = async (data) =>
  await axiosInstance.post('api/patient/patient_surgical_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicalhistorydetails = async (data) =>
  await axiosInstance.post('api/patient/patient_medical_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const labresultdetails = async (data) =>
  await axiosInstance.post('api/patient/patient_lab_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const socialhistorydetails = async (data) =>
  await axiosInstance.post('api/patient/patient_social_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicinedetails = async (data) =>
  await axiosInstance.post('api/patient/patient_medication', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const addheightdetails = async (data) =>
  await axiosInstance.post('api/patient/patient_height_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorcertificate = async (data) =>
  await axiosInstance.post('api/doctor/doctor_certificates', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const labresultimages = async (data) =>
  await axiosInstance.post('api/patient/patient_lab_result_images', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const surgicalimages = async (data) =>
  await axiosInstance.post('api/patient/patient_surgical_images', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getallergy = async () =>
  await axiosInstance.get('api/patient/allergy', {
    headers: { 'Content-Type': 'application/json' },
  });
const getmedicalhistory = async () =>
  await axiosInstance.get('api/patient/medical_history', {
    headers: { 'Content-Type': 'application/json' },
  });
const getsurgicalhistory = async () =>
  await axiosInstance.get('api/patient/surgical_history', {
    headers: { 'Content-Type': 'application/json' },
  });
const getsocialhistory = async () =>
  await axiosInstance.get('api/patient/social_history', {
    headers: { 'Content-Type': 'application/json' },
  });
const getmedication = async () =>
  await axiosInstance.get('api/patient/medication', {
    headers: { 'Content-Type': 'application/json' },
  });
const getlabresult = async () =>
  await axiosInstance.get('api/patient/lab_history', {
    headers: { 'Content-Type': 'application/json' },
  });
const getskill = async () =>
  await axiosInstance.get('api/doctor/skill_specialization', {
    headers: { 'Content-Type': 'application/json' },
  });
const profileDetails = async (data) =>
  await axiosInstance.post('api/patient/profile_extra_details', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
const getdoctorprofileupdate = async (data) => {
  return await axiosInstance.post('api/doctor/profile_update_doctor', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
const logout = async () =>
  await axiosInstance.post('api/logout', {
    headers: { 'Content-Type': 'application/json' },
  });
const forgetPassword = async (data) =>
  await axiosInstance.post('api/forgot_password', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const resetPassword = async (data) =>
  await axiosInstance.post('api/reset_password', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicineadd = async (data) =>
  await axiosInstance.post('api/doctor/medicine_add', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const prescriptindetails = async (data) =>
  await axiosInstance.post('api/doctor/medicine_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctoravailability = async (data) =>
  await axiosInstance.post('api/doctor/availability', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilitydetails = async (data) =>
  await axiosInstance.post('api/doctor/availability_get', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilityupdate = async (data) =>
  await axiosInstance.post('api/doctor/availability_update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilitydelete = async (data) =>
  await axiosInstance.post('api/doctor/availability_delete', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const search = async (data) =>
  await axiosInstance.post('api/patient/doctor_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorprofile = async (data) =>
  await axiosInstance.post('api/patient/doctor_profile', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const timeslot = async (data) =>
  await axiosInstance.post('api/doctor/availability_time_slot', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getlocation = async (longitude, latitude) =>
  await axiosInstance.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4`,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
const locationsearch = async (data) =>
  await axiosInstance.post('api/patient/location_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorfeesupdate = async (data) =>
  await axiosInstance.post('api/doctor/fees_update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getfees = async (data) =>
  await axiosInstance.post('api/doctor/fees_get', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const feessearch = async (data) =>
  await axiosInstance.post('api/patient/price_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const appointmentbooking = async (data) =>
  await axiosInstance.post('api/patient/booking', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const perdoctorspeciality = async (data) =>
  await axiosInstance.post('api/patient/per_doc_spl', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookingupdate = async (data) =>
  await axiosInstance.post('api/patient/booking_patient_details_update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookinglist = async (data) =>
  await axiosInstance.post('api/doctor/booking_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookinglisthomepage = async (data) =>
  await axiosInstance.post('api/doctor/booking_list_home_page', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookingdetails = async (data) =>
  await axiosInstance.post('api/doctor/booking_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const accepted = async (data) =>
  await axiosInstance.post('api/doctor/booking_accepted', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const rejected = async (data) =>
  await axiosInstance.post('api/doctor/booking_rejected', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const acceptlist = async (data) =>
  await axiosInstance.post('api/doctor/booking_list_completed_doctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const rejectlist = async (data) =>
  await axiosInstance.post('api/doctor/booking_list_rejected', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const acceptbooking = async (data) =>
  await axiosInstance.post('api/patient/accepted_booking_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const generateprescription = async (data) =>
  await axiosInstance.post('api/doctor/generate_prescription', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const consultationsearch = async (data) =>
  await axiosInstance.post('api/patient/consultation_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const prescriptionlist = async (data) =>
  await axiosInstance.post('api/patient/prescription_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getprescription = async (data) =>
  await axiosInstance.post('api/doctor/prescription_view', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookingdetailspatient = async (data) =>
  await axiosInstance.post('api/patient/booking_details_patient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const completedlist = async (data) =>
  await axiosInstance.post('api/patient/completed_booking_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctordetailsforrating = async (data) =>
  await axiosInstance.post('api/patient/doctor_details_for_rating_page', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const ratingreview = async (data) =>
  await axiosInstance.post('api/patient/rating_review_post', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const ratingsearch = async (data) =>
  await axiosInstance.post('api/patient/rating_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const videocall = async (data) =>
  await axiosInstance.post('api/patient/generate_token_p', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const prescriptionmedicine = async (data) =>
  await axiosInstance.post('api/patient/prescription_medicines', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const chnagemedicine = async (data) =>
  await axiosInstance.post('api/patient/medicine_change', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const videocallend = async (data) =>
  await axiosInstance.post('api/patient/chat_end', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const specialistlist = async (data) =>
  await axiosInstance.post('api/patient/doctor_search_with_spl', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilitydate = async (data) =>
  await axiosInstance.post('api/doctor/availability_get_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilitydoctor = async (data) =>
  await axiosInstance.post('api/doctor/availability_time_slot_d', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilityam = async (data) =>
  await axiosInstance.post('api/doctor/availability_time_slot_am', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const availabilitypm = async (data) =>
  await axiosInstance.post('api/doctor/availability_time_slot_pm', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientmsghistory = async (data) =>
  await axiosInstance.post('api/patient/message_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientvideohistory = async (data) =>
  await axiosInstance.post('api/patient/video_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientvoicehistory = async (data) =>
  await axiosInstance.post('api/patient/audio_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctormsghistory = async (data) =>
  await axiosInstance.post('api/doctor/message_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorvideohistory = async (data) =>
  await axiosInstance.post('api/doctor/video_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorvoicehistory = async (data) =>
  await axiosInstance.post('api/doctor/audio_history', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const bookinglistwithtype = async (data) =>
  await axiosInstance.post('api/doctor/video_upcoming_booking_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const multipleavailability = async (data) =>
  await axiosInstance.post('api/doctor/add_multiple_avl', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const savenote = async (data) =>
  await axiosInstance.post('api/doctor/save_note', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getnote = async (data) =>
  await axiosInstance.post('api/doctor/get_note', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const generateorder = async (data) =>
  await axiosInstance.post('api/doctor/order', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const orderlist = async (data) =>
  await axiosInstance.post('api/patient/order_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const autosave = async (data) =>
  await axiosInstance.post('api/doctor/medicine_auto_save', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const backgetmedicine = async (data) =>
  await axiosInstance.post('api/doctor/medicine_get_by_id', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicinedelete = async (data) =>
  await axiosInstance.post('api/doctor/medicine_delete', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const orderautosave = async (data) =>
  await axiosInstance.post('api/doctor/order_auto_save', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getorder = async (data) =>
  await axiosInstance.post('api/doctor/chk_order_details_by_id', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const noteautosave = async (data) =>
  await axiosInstance.post('api/doctor/note_auto_save', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicineget = async (data) =>
  await axiosInstance.post('api/doctor/medicine_get', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicineupdate = async (data) =>
  await axiosInstance.post('api/doctor/medicine_update', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientcategory = async () =>
  await axiosInstance.get('api/patient/parent_category', {
    headers: { 'Content-Type': 'application/json' },
  });
const getsubcategory = async (data) =>
  await axiosInstance.post('api/patient/sub_category', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const symptom = async (data) =>
  await axiosInstance.post('api/patient/symptoms', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const soloution = async (data) =>
  await axiosInstance.post('api/patient/diagnosis', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const soloution2 = async (data) =>
  await axiosInstance.post('api/patient/diagnosis_2', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickverify = async (data) =>
  await axiosInstance.post('api/chk_email', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickotp = async (data) =>
  await axiosInstance.post('api/chk_otp_cbot', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const suggestdoctor = async (data) =>
  await axiosInstance.post('api/patient/suggest_doctors', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitslot = async (data) =>
  await axiosInstance.post('api/patient/slot_aval_for_doctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitdatasave = async (data) =>
  await axiosInstance.post('api/patient/quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitappoinment = async (data) =>
  await axiosInstance.post('api/doctor/urgent_booking_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const consultationfees = async (data) =>
  await axiosInstance.post('api/doctor/consultation_avl', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const diagnosis = async (data) =>
  await axiosInstance.post('api/patient/select_dio', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const problemsList = async (data) =>
  await axiosInstance.post('api/patient/problems', data, {
    headers: { 'Content-Type': 'application/json' },
  });

const symptomsList = async (data) =>
  await axiosInstance.post('api/patient/symptoms', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const othersdoctor = async (data) =>
  await axiosInstance.post('api/patient/other_doctors', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const symptompart = async (data) =>
  await axiosInstance.post('api/patient/symptoms_part', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const showquickvisitdata = async (data) =>
  await axiosInstance.post('api/patient/show_data_quick_visit', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorlist = async (data) =>
  await axiosInstance.post('api/patient/doctors_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const addfauvarite = async (data) =>
  await axiosInstance.post('api/patient/add_to_fav', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const checkfauvarite = async (data) =>
  await axiosInstance.post('api/patient/chk_fav', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const favouritelist = async (data) =>
  await axiosInstance.post('api/patient/list_of_fav_doctors', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientsearch = async (data) =>
  await axiosInstance.post('api/doctor/patient_search', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientdata = async (data) =>
  await axiosInstance.post('api/doctor/patient_by_id', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const addpatientfauvarite = async (data) =>
  await axiosInstance.post('api/doctor/add_to_fav_d', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const checkpatientfauvarite = async (data) =>
  await axiosInstance.post('api/doctor/chk_fav_d', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientfavouritelist = async (data) =>
  await axiosInstance.post('api/doctor/list_of_fav_patients', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const allergyqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/patient_allergy_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicalhistoryqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/medical_history_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const labresultqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/lab_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const labresultimgqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/lab_doc_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const surgicalqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/surgical_history_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const surgicalimgqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/surgical_doc_quick_chat', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const medicationqyickvisit = async (data) =>
  await axiosInstance.post('api/patient/medication_for_quick_chat_bot', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const notificationdoctor = async (data) =>
  await axiosInstance.post('api/patient/sendNotificationToDoctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const notificationpatient = async (data) =>
  await axiosInstance.post('api/patient/sendNotificationToPatient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const listnotificationpatient = async (data) =>
  await axiosInstance.post('api/patient/listOfNotificationForPatient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const listnotificationdoctor = async (data) =>
  await axiosInstance.post('api/doctor/listOfNotificationForDoctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const changepassword = async (data) =>
  await axiosInstance.post('api/user/change_password', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitrequestdata = async (data) =>
  await axiosInstance.post('api/doctor/quick_chat_list_upcoming', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitcompleteddata = async (data) =>
  await axiosInstance.post('api/doctor/quick_chat_completed_list', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitdatashow = async (data) =>
  await axiosInstance.post('api/doctor/booking_details_qc', data, {
    headers: { 'Content-Type': 'application/json' },
  });

const quickvisitquestion = async (data) =>
  await axiosInstance.post('api/patient/questions', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitnotification = async (data) =>
  await axiosInstance.post('api/user/sendNotificationToDoctorFromQc', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const voicecall = async () =>
  await axiosInstance.get('api/audioCallApi', {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitgenarateprescription = async (data) =>
  await axiosInstance.post('api/doctor/generate_prescription_non', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const pagecontent = async (data) =>
  await axiosInstance.post('api/page_content', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const skilllisting = async (data) =>
  await axiosInstance.post('api/patient/doctor_with_skill', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const cancelbooking = async (data) =>
  await axiosInstance.post('api/patient/cancel_booking', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const payment = async (data) =>
  await axiosInstance.post('api/patient/create_stripe_payment', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const listcarddetails = async (data) =>
  await axiosInstance.post('api/patient/list_of_account_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const addcard = async (data) =>
  await axiosInstance.post('api/patient/save_account_details', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const defaultcard = async (data) =>
  await axiosInstance.post('api/patient/set_account_default', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const getdefaultcard = async (data) =>
  await axiosInstance.post('api/patient/get_account_default', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickAppointment = async (data) =>
  await axiosInstance.post('api/upcoming_booking_list_qc', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const paynow = async (data) =>
  await axiosInstance.post('api/patient/pay_now', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const cardDelete = async (data) =>
  await axiosInstance.post('api/patient/delete_card', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const Paymentstatus = async (data) =>
  await axiosInstance.get('api/patient/payment_status_chk', {
    headers: { 'Content-Type': 'application/json' },
  });
const profilestatus = async (data) =>
  await axiosInstance.post('api/profile_update_or_not_status_chk', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const problemback = async (data) =>
  await axiosInstance.post('api/back_problems', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const unseenNotification = async (data) =>
  await axiosInstance.post('api/patient/unseenForPatient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const seenNotification = async (data) =>
  await axiosInstance.post('api/patient/seenForPatient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorunseenNotification = async (data) =>
  await axiosInstance.post('api/doctor/unseenForDoctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const doctorseenNotification = async (data) =>
  await axiosInstance.post('api/doctor/seenForDoctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const quickvisitnoneselect = async (data) =>
  await axiosInstance.post('api/next_button_selection', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const nextbuttonrestrict = async (data) =>
  await axiosInstance.post('api/next_button_restrict', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const showratingreview = async (data) =>
  await axiosInstance.post('api/doctor/list_of_rating_reviews', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientnotificationbeforestart = async (data) =>
  await axiosInstance.post(
    'api/patient/sendNotificationToPatientBooking',
    data,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
const doctornotificationbeforestart = async (data) =>
  await axiosInstance.post('api/doctor/sendNotificationToDoctorBooking', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const showmessagedoctor = async (data) =>
  await axiosInstance.post('api/doctor/show_msg_to_doctor', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const showmessagepatient = async (data) =>
  await axiosInstance.post('api/patient/show_msg_to_patient', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const showtype = async (data) =>
  await axiosInstance.post('api/patient/consultation_type', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const cardadd = async (data) =>
  await axiosInstance.post('api/patient/create_stripe_payment_add', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const patientsorting = async (data) =>
  await axiosInstance.post('api/patient/sorting', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const notelist = async (data) =>
  await axiosInstance.post('api/doctor/list_of_notes', data, {
    headers: { 'Content-Type': 'application/json' },
  });
const topdoctor = async () =>
  await axiosInstance.get('api/patient/top_doctors', {
    headers: { 'Content-Type': 'application/json' },

  });
export {
  topdoctor,
  notelist,
  patientsorting,
  cardadd,
  showtype,
  showmessagedoctor,
  showmessagepatient,
  doctornotificationbeforestart,
  patientnotificationbeforestart,
  showratingreview,
  nextbuttonrestrict,
  quickvisitnoneselect,
  doctorseenNotification,
  doctorunseenNotification,
  seenNotification,
  unseenNotification,
  problemback,
  profilestatus,
  Paymentstatus,
  cardDelete,
  paynow,
  quickAppointment,
  getdefaultcard,
  defaultcard,
  addcard,
  getuser,
  getsignup,
  getlogin,
  getotp,
  getprofileupdate,
  profileData,
  doctorprofileData,
  getallergy,
  getsurgicalhistory,
  getsocialhistory,
  getmedication,
  getlabresult,
  profileDetails,
  getmedicalhistory,
  getskill,
  getdoctorprofileupdate,
  doctorspecilization,
  doctorcertificate,
  allergydetails,
  surgicalhistorydetails,
  medicalhistorydetails,
  labresultdetails,
  socialhistorydetails,
  medicinedetails,
  labresultimages,
  surgicalimages,
  logout,
  addheightdetails,
  forgetPassword,
  getotpreset,
  resendotp,
  resetPassword,
  getroute,
  medicineadd,
  prescriptindetails,
  doctoravailability,
  availabilitydetails,
  availabilityupdate,
  availabilitydelete,
  search,
  doctorprofile,
  timeslot,
  getlocation,
  locationsearch,
  doctorfeesupdate,
  getfees,
  feessearch,
  appointmentbooking,
  perdoctorspeciality,
  bookingupdate,
  bookinglist,
  bookingdetails,
  accepted,
  rejected,
  acceptlist,
  rejectlist,
  acceptbooking,
  generateprescription,
  consultationsearch,
  prescriptionlist,
  getprescription,
  bookingdetailspatient,
  completedlist,
  doctordetailsforrating,
  ratingreview,
  ratingsearch,
  videocall,
  prescriptionmedicine,
  chnagemedicine,
  videocallend,
  specialistlist,
  availabilitydate,
  availabilitydoctor,
  availabilityam,
  availabilitypm,
  patientmsghistory,
  doctormsghistory,
  doctorvideohistory,
  patientvideohistory,
  bookinglistwithtype,
  multipleavailability,
  savenote,
  getnote,
  generateorder,
  orderlist,
  autosave,
  backgetmedicine,
  medicinedelete,
  orderautosave,
  getorder,
  noteautosave,
  medicineget,
  medicineupdate,
  patientcategory,
  getsubcategory,
  symptom,
  soloution,
  quickverify,
  quickotp,
  suggestdoctor,
  quickvisitslot,
  quickvisitdatasave,
  quickvisitappoinment,
  consultationfees,
  diagnosis,
  problemsList,
  symptomsList,
  othersdoctor,
  favouritelist,
  symptompart,
  soloution2,
  showquickvisitdata,
  doctorlist,
  addfauvarite,
  checkfauvarite,
  patientsearch,
  patientdata,
  addpatientfauvarite,
  checkpatientfauvarite,
  patientfavouritelist,
  allergyqyickvisit,
  medicalhistoryqyickvisit,
  labresultqyickvisit,
  labresultimgqyickvisit,
  surgicalqyickvisit,
  surgicalimgqyickvisit,
  medicationqyickvisit,
  notificationdoctor,
  notificationpatient,
  listnotificationpatient,
  listnotificationdoctor,
  changepassword,
  quickvisitrequestdata,
  quickvisitcompleteddata,
  quickvisitdatashow,
  quickvisitquestion,
  quickvisitnotification,
  voicecall,
  quickvisitgenarateprescription,
  pagecontent,
  patientvoicehistory,
  doctorvoicehistory,
  skilllisting,
  cancelbooking,
  bookinglisthomepage,
  payment,
  listcarddetails,
};
