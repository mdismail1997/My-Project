import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React from 'react';

import {SearchBox} from '../../components/index.js';
import strings from '../../components/lng/LocalizedStrings.js';
import Loader from '../../components/Loader.js';
import styles from './style.js';
import PaymentCard from '../../components/PaymentCard.js';
import icons from '../../../conts/icons.js';
import {
  calcH,
  calcW,
  fSize,
  STORAGE_KEY,
} from '../../../utils/constants/common.js';
import Separator from '../../components/Separator.js';
import ProductCard from '../../components/ProductCard.js';
import MoneyCard from '../../components/MoneyCard.js';
import {
  createGet,
  createpost,
} from '../../../utils/constants/API/ServerRequest.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import Toast from 'react-native-toast-message';
import mmkv from '../../../utils/constants/mmkv/index.js';
import COLORS from '../../../conts/colors.js';
import {date} from '../RatingScreen/index.js';

const arr = [
  {
    Total_customers: 0,
    This_month_customer_count: 0,
    Last_month_customer_count: 0,
  },
];

const PaymentDetails = () => {
  const [loading, setLoading] = React.useState(false);
  const [customerNumber, setCustomerNumber] = React.useState(arr);
  const [txnInfo, setTxnInfo] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [withDraw, setWithDraw] = React.useState([]);
  const [searchedProd, setSearchedProd] = React.useState([]);

  const customerDetails = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

  const sendData = {
    sellerId: {
      seller_id: customerDetails?.id,
    },
  };

  React.useEffect(() => {
    customerCount();
    TxnList();
    WithdrawHistory();
  }, []);

  const customerCount = async () => {
    setLoading(true);
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.customerCount}`,
        body: sendData,
      });
      if (result.status === 200) {
        setCustomerNumber(result.data);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
      Toast.show({
        text1: `${error}`,
        type: 'error',
        position: 'bottom',
      });
    }
  };

  const TxnList = async () => {
    setLoading(true);
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.dueWithdraw}`,
        body: {
          sellerid: {
            seller_id: customerDetails?.id,
          },
        },
      });
      if (result.status === 200) {
        setTxnInfo(result?.data);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
      Toast.show({
        text1: `${error}`,
        type: 'error',
        position: 'bottom',
      });
    }
  };

  const WithdrawHistory = async () => {
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.withdrawHistory}`,
        body: {
          sellerid: {
            seller_id: customerDetails?.id,
          },
        },
      });
      if (result.status === 200) {
        setWithDraw(result?.data);
        setSearchedProd(result?.data);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
      Toast.show({
        text1: `${error}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('withDraw', withDraw);

  const TextComponent = ({Title, info}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>{Title}</Text>
        <Text style={[styles.text, {color: COLORS.blue}]}>{info}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (search.length > 0) {
      const searchedTxn = withDraw.filter(product =>
        product.transaction_id.toLowerCase().includes(search.toLowerCase()),
      );
      setSearchedProd(searchedTxn);
    } else {
      setSearchedProd(withDraw);
    }
  }, [search]);
  console.log('searchedProd', searchedProd);

  const actual_seller_amount =
    txnInfo[0]?.sellerAmountArr[0]?.actual_seller_amount;

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {loading && <Loader visible={loading} />}
        <View style={styles.subContainer}>
          <SearchBox
            placeholder={`${strings.SEARCH_BY} ID...`}
            icon="search"
            keyboardType="web-search"
            value={search}
            onChangeText={setSearch}
          />
          {search.length < 1 && (
            <>
              <PaymentCard
                source={icons.total_txn}
                firstText={`${strings.TOTAL_TRANSACTION}`}
                totalAmount={
                  actual_seller_amount
                    ? Number(actual_seller_amount).toFixed(2)
                    : 0
                }
              />
              <View style={styles.cardContainer}>
                <PaymentCard
                  source={icons.wallet_due}
                  firstText={`${strings.DUE_AMOUNT}`}
                  width="49%"
                  textStle={styles.marginLeft}
                  imageStyle={styles.mainImage}
                  text={styles.textFont}
                  totalAmount={`${parseFloat(txnInfo[0]?.totalremain).toFixed(
                    2,
                  )}`}
                />
                <PaymentCard
                  source={icons.wallet_recieved}
                  firstText={`${strings.Receive_Amount}`}
                  width="49%"
                  textStle={styles.marginLeft}
                  text={styles.textFont}
                  imageStyle={styles.secondaryImage}
                  totalAmount={`${parseFloat(txnInfo[0]?.totalreceived).toFixed(
                    2,
                  )}`}
                />
              </View>
              <View
                style={{
                  borderWidth: 1,
                  paddingVertical: calcH(0.01),
                  paddingLeft: calcH(0.01),
                }}>
                <TextComponent
                  Title={`${strings.Total_Customer}: `}
                  info={`${customerNumber[0]?.Total_customers}`}
                />
                <TextComponent
                  Title={`${strings.Customer_This_Month}: `}
                  info={`${customerNumber[0]?.This_month_customer_count}`}
                />
                <TextComponent
                  Title={`${strings.Customer_Last_Month}: `}
                  info={`${customerNumber[0]?.Last_month_customer_count}`}
                />
              </View>
            </>
          )}
          <View style={{marginVertical: 10}}>
            <Text style={{fontSize: fSize(16), fontWeight: '600'}}>
              {`${strings.Recent_Received}`}
            </Text>
            <Separator padding={5} />
          </View>

          {searchedProd?.map((info, index) => {
            console.log('info', info);
            return (
              <View style={{marginBottom: calcH(0.01)}}>
                <MoneyCard
                  key={`${info.entity_id}${index}`}
                  cost={Number(info.transaction_amount).toFixed(2)}
                  date={date(info.created_at)}
                  orderNumber={info.transaction_id}
                />
              </View>
            );
          })}
          <View style={{marginBottom: calcH(0.1)}} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default PaymentDetails;
