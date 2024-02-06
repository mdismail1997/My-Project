import axios from 'axios';
import React from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Button,
  Heading,
  Input,
  Slide,
  Stack,
  Text,
  Alert,
  Spinner,
  Center,
} from 'native-base';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../asserts/colors.js/colors';
import {Chip} from '../../Components/Chip';
import {BASE_URL} from '../../utils/Api/apiName';
import {TransactionCard} from '../../Components/TransactionCard';
import {calcH, calcW} from '../../utils/comon';
import {RFValue} from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud'

const tabContent = ['Withdraw', 'Withdrawal history', 'Transaction history'];

export function Payout({navigation}) {
  const {width} = useWindowDimensions();

  const timeout = React.useRef(null);
  const [selectedItem, setSelectedItem] = React.useState(tabContent[0]);
  const [amount, setAmount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [driverData, setDriverData] = React.useState();
  const [listWithdrawals, setListWithdrawals] = React.useState();
  const [listTransactions, setListTransactions] = React.useState();
  const [errorData, setErrorData] = React.useState({
    isOpenTop: false,
    message: '',
    status: 'error',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (errorData.isOpenTop) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setErrorData({isOpenTop: false, message: '', status: 'error'});
      }, 3000);
    }
  }, [errorData.isOpenTop]);

  React.useEffect(() => {
    getAllList();
  }, []);

  const handleSelect = async value => {
    setSelectedItem(value);
    if (value === tabContent[1]) {
      await fetchListWithdrawalsData();
    } else if (value === tabContent[2]) {
      await fetchListTransactionsData();
    } else {
      await getAllList();
    }
  };

  const getAllList = async () => {
    try {
      const userId = JSON.parse(await AsyncStorage.getItem('userID'));
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', userId, token);
      const response = await axios({
        url: `${BASE_URL}driverInfo/${userId}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('DriverData', response.data);
      setDriverData(response.data);
    } catch (error) {
      console.error(error.response);
      setErrorData({
        isOpenTop: true,
        message: error.response.data.error,
        status: 'error',
      });
    }
  };

  const fetchListWithdrawalsData = async () => {
    try {
      setIsLoading(true);
      const userId = JSON.parse(await AsyncStorage.getItem('userID'));
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', token);
      const response = await axios({
        url: `${BASE_URL}listWithdrawals/${userId}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('listWithdrawals', response.data);
      setListWithdrawals(response.data.driver_withdrawal_data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(JSON.stringify(error.response));
      setErrorData({
        isOpenTop: true,
        message: error.response.data.message? error.response.data.message : error.response.data.error,
        status: 'error',
      });
    }
  };

  const fetchListTransactionsData = async () => {
    try {
      setIsLoading(true);
      const userId = JSON.parse(await AsyncStorage.getItem('userID'));
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', token);
      const response = await axios({
        url: `${BASE_URL}listTransactions/${userId}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('listTransactions', response.data.driver_transactions_data);
      setListTransactions(response.data.driver_transactions_data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error.response.data.error);
      setErrorData({
        isOpenTop: true,
        message: error.response.data.message? error.response.data.message : error.response.data.error,
        status: 'error',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const userId = JSON.parse(await AsyncStorage.getItem('userID'));
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      
      console.log('{token}', token, data);
      if(Number(amount) <= 0 ){
        setErrorData({
          isOpenTop: true,
          message: "Please enter a valid amount",
          status: 'error',
        });
        setIsSubmitting(false);
        return false
      }
      Hud.showHud()
      const data = {user_id: userId, request_amount: Number(amount)};
      const response = await axios({
        url: 'https://kabou.us/api/driver/withdrawal/request',
        method: 'POST',
        data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
     
      console.log(response.data);
    Hud.hideHud()
      setErrorData({
        isOpenTop: true,
        message: response.data.message,
        status: 'success',
      });
      setIsSubmitting(false);
      setAmount('')
    } catch (error) {
      Hud.hideHud()
   setAmount('')
      setIsSubmitting(false);
      console.error(error.response.data);
      
      setErrorData({
        isOpenTop: true,
        message: error.response.data.error,
        status: 'error',
      });
      
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleSelect(selectedItem);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={{padding: 5, flex: 1, backgroundColor: 'white'}}>
      <Slide in={errorData.isOpenTop} placement="top" duration={1000}>
        <Alert
          justifyContent="center"
          status={errorData.status}
          safeAreaTop={8}>
          <Alert.Icon />
          <Text color="error.600" fontWeight="medium">
            {errorData.message}
          </Text>
        </Alert>
      </Slide>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{marginBottom: 10}}
          onPress={() => navigation.goBack()}>
          <IconAntDesign
            color={colors.textHeader}
            size={24}
            name={'arrowleft'}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>Payment</Text>
      </View>
      <View style={{padding: 8}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              width: width - 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {tabContent.map(el => (
              <Chip
                key={el}
                title={el}
                value={el}
                selected={selectedItem}
                onPress={handleSelect}
                _text={{
                  style: {
                    color: colors.textHeader,
                  },
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }>
        {isLoading && (
          <Center width="full" height="full">
            <Spinner size={'lg'} />
          </Center>
        )}
        {selectedItem === tabContent[0] && (
          <Stack height="full" justifyContent="center">
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text textAlign="center" fontSize="xl">
                <Heading>Total rides: </Heading>
                {driverData ? driverData.total_rides : 0}
              </Text>
              <Text textAlign="center" fontSize="xl">
                <Heading>Available amount: </Heading>
                {driverData ? driverData.driver_data[0].balance : 0.0} $
              </Text>
            </View>
            <Stack space={3} flex={2} padding={Platform.OS === 'ios' ? 2 : 0}>
              <Input
                placeholder="Enter amount"
               value={amount}
                onChangeText={val => setAmount(val)}
                InputRightElement={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 5,
                    }}>
                    <Text style={{fontSize: 20, width: 20}}>$</Text>
                  </View>
                }
              />
              <Button
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isLoadingText="Submitting">
                Submit
              </Button>
            </Stack>
          </Stack>
        )}
        {selectedItem === tabContent[1] && (
          <Stack flex={1} marginY="3" padding={1}>
            {listWithdrawals?.map(item => (
              <TransactionCard
                key={item.id}
                amount={item.request_amount}
                date={item.updated_at}
                status={item.statut === 'FAILED' ? 'CANCELLED' : item.statut}
              />
            ))}
          </Stack>
        )}
        {selectedItem === tabContent[2] && (
          <Stack flex={1} marginY="3">
            {listTransactions?.map((el, i) => (
              <TransactionCard
                key={i}
                title="Withdraw"
                amount={el.amount}
                date={el.updated_at}
                status="PAID"
              />
            ))}
          </Stack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  instruction: {
    left: calcW(0.035),
    fontSize: RFValue(18),
    fontWeight: '700',
    color: colors.textHeader,
  },
});
