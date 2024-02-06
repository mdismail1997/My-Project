import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BeforeLogin from '../Screens/BeforeLogin/BeforeLogin';
import SelectLanguage from '../Screens/Language/SelectLanguage';
import Login from '../Screens/Login/Login';
import Splash from '../Screens/Splash/Splash';
import Registration from '../Screens/Registration/Registration';
import ForgotPassword from '../Screens/Password/ForgotPassword';
import DrawerNavigator from './DrawerNavigator';
import SearchScreen from '../Screens/SearchScreen/SearchScreen';
import ProductDetails from '../Screens/ProductDetails/ProductDetails';
import Filter from '../Screens/Filter/Filter';
import SavedLater from '../Screens/SavedLater/SavedLater';
import MyRewards from '../Screens/MyRewards/MyRewards';
import ShippingAddress from '../Screens/ShippingAddress/ShippingAddress';
import SelectPayment from '../Screens/SelectPayment/SelectPayment';
import AllCategory from '../Screens/AllCategory/AllCategory';
import CustomerReview from '../Screens/CustomerReview/CustomerReview';
import Payment from '../Screens/Payment/Payment';
import MyOrder from '../Screens/MyOrder/MyOrder';
import MyOrder2 from '../Screens/MyOrder2/MyOrder2';
import Wishlist from '../Screens/Wishlist/Wishlist';
import OrderSteps from '../Screens/OrderSteps/OrderSteps';
import SuccessScreen from '../Screens/SuccessScreen/SuccessScreen';
import PayCC from '../Screens/PayCC/PayCC';
import Fashion from '../Screens/ProductBar/Fashion';
import FlowersGifts from '../Screens/ProductBar/FlowersGifts';
import FoodNutrition from '../Screens/ProductBar/FoodNutrition';
import HealthBeauty from '../Screens/ProductBar/HealthBeauty';
import HomeKitchen from '../Screens/ProductBar/HomeKitchen';
import WatchesJewelery from '../Screens/ProductBar/WatchesJewelery';
import ContactUs from '../Screens/ContactUs/ContactUs';
import TC from '../Screens/TC/TC';
import FAQ from '../Screens/FAQ/FAQ';
import AboutUs from '../Screens/AboutUs/AboutUs';
import PrivacyP from '../Screens/PrivacyP/PrivacyP';
import Productslist from '../Component/Productslist/Productslist';
import AllTraders from '../Screens/AllTraders/AllTraders'
import TradersProduct from '../Screens/TradersProduct/TradersProduct';
import ProductsPage from '../Screens/ProductsPage/ProductsPage';
import TradersReviews from '../Screens/TradersReviews/TradersReviews';
import Refund from '../Screens/Refund/Refund'
import ShopingCart from '../Screens/ShopingCart/ShopingCart';
import ByLaterNotes from '../Screens/ByLaterNotes/ByLaterNotes';
import MyPayment from '../Screens/MyPayment/MyPayment';
import UpdateMobileNumber from '../Screens/UpdateMobileNumber/UpdateMobileNumber';
import StoreCreditRefund from '../Screens/StoreCreditRefund/StoreCreditRefund';
//import Login from '../Screens/Login';
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="splash">
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="beforelogin" component={BeforeLogin} />
      <Stack.Screen name="language" component={SelectLanguage} />
      <Stack.Screen name="signin" component={Login} />
      <Stack.Screen name="signup" component={Registration} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="drawer" component={DrawerNavigator} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="SavedLater" component={SavedLater} />
      <Stack.Screen name="MyRewards" component={MyRewards} />
      <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
      <Stack.Screen name="SelectPayment" component={SelectPayment} />
      <Stack.Screen name="AllCategory" component={AllCategory} />
      <Stack.Screen name="CustomerReview" component={CustomerReview} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="MyOrder" component={MyOrder} />
      <Stack.Screen name="MyOrder2" component={MyOrder2} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="OrderSteps" component={OrderSteps} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="PayCC" component={PayCC} />
      <Stack.Screen name="Fashion" component={Fashion} />
      <Stack.Screen name="FlowersGifts" component={FlowersGifts} />
      <Stack.Screen name="FoodNutrition" component={FoodNutrition} />
      <Stack.Screen name="HealthBeauty" component={HealthBeauty} />
      <Stack.Screen name="HomeKitchen" component={HomeKitchen} />
      <Stack.Screen name="WatchesJewelery" component={WatchesJewelery} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="TC" component={TC} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Productslist" component={Productslist} />
      <Stack.Screen name="PrivacyP" component={PrivacyP} />
      <Stack.Screen name="AllTraders" component={AllTraders} />
      <Stack.Screen name="TradersProduct" component={TradersProduct} />
      <Stack.Screen name="ProductsPage" component={ProductsPage} />
      <Stack.Screen name="TradersReviews" component={TradersReviews} />
      <Stack.Screen name="Refund" component={Refund} />
      <Stack.Screen name="ShopingCart" component={ShopingCart} />
      <Stack.Screen name="ByLaterNotes" component={ByLaterNotes} />
      <Stack.Screen name="MyPayment" component={MyPayment} />
      <Stack.Screen name="UpdateMobileNumber" component={UpdateMobileNumber} />
      <Stack.Screen name="StoreCreditRefund" component={StoreCreditRefund} />
      

    </Stack.Navigator>
  );
}

export default StackNavigator;
