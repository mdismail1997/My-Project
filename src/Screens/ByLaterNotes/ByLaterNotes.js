import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { deleteRequest, GetRequest, PostRequest } from '../../Services/ApiFunctions';
import Header from '../../Component/Header/Header';
import strings from '../../Component/lng/LocalizedStrings';
import Loader from '../../Component/Common/Lodar'
import Device, { isTablet } from 'react-native-device-info';
const { width, height } = Dimensions.get('window');
const ByLaterNotes = props => {
  // State variables
  const [buyLaterList, setBuyLaterList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState('');

  useEffect(() => {
    getBuyLaterItems();
  }, []);

  const getBuyLaterItems = () => {
    setLoader(true)
    GetRequest('mpSaveCart/mine/products', {}, {}, 'self')
      .then(res => {
        console.warn("item", res.total_count)
        setCount(res.total_count)
        setBuyLaterList(res);
        setLoader(false)
      })
      .catch(error => {
        console.log('Buy later error: ', error);
        setLoader(false)
      });

  };

  const renderEmptyCart = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 100,
        }}>
        <Image
          source={require('../../Assets/STrolly.png')}
          style={{ height: 100, width: 100 }}
        />
        <Text
          style={{
            fontSize: 18,
            color: '#000',
            fontWeight: 'bold',
            marginTop: 40,
          }}>
          {strings.CART_EMPTY}
        </Text>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('DashBoard');
          }}>
          <View
            style={{
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              marginVertical: 40,
              paddingVertical: 15,
              paddingHorizontal: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Roboto-Regular',
                fontWeight: 'bold',
              }}>
              {strings.START_SHOPPING}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const restoreItem = token => {
    setLoader(true)
    PostRequest(
      'mpSaveCart/mine/products/restore?token=' + token,
      {},
      {},
      'self',
    )
      .then(res => {
        if (res === true) {
          getBuyLaterItems()
          setLoader(false)
        }
      })
      .catch(error => {
        console.log('restore item error: ', error);
        setLoader(false)
      });

  };

  const deleteItem = (token) => {


    Alert.alert(strings.DELETE_CONFIRM, '', [
      { text: strings.CANCEL },
      {
        text: strings.OK,
        onPress: () => {


          setLoader(true)
          deleteRequest('mpSaveCart/mine/products/' + token, 'self')
            .then(res => {
              // console.log('Delete item res: ', res)
              if (res === true) {
                getBuyLaterItems()
                setLoader(false)
              }
            })
            .catch(error => {
              console.log('Delete item error: ', error)
              setLoader(false)


            });
        },
      },
    ])
  };

  const renderList = () => {
    return (
      <>
        <View>
          <Text style={{ marginHorizontal: 25, fontSize: 16, color: '#000', marginTop: 15, }}>
            {count} ITEMS
          </Text>
        </View>





        <FlatList
          data={buyLaterList?.items}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomWidth: 0.5,
                  paddingBottom: 15,
                }}>
                <View style={{ marginLeft: 20 }}>
                  <Image
                    source={{
                      uri: item?.image_url
                        ? item?.image_url
                        : `https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg`,
                    }}
                    resizeMode="contain"
                    style={{
                      width: isTablet == true ? width / 5 : width / 4,
                      height: isTablet == true ? height / 8 : height / 7,
                      borderRadius: 5,
                    }} />
                </View>

                <View style={{ marginLeft: 20 }}>
                  <Text
                    style={{
                      color: '#5A5A5F',
                      fontSize: isTablet == true ? 17 : 16,
                      fontFamily: 'Roboto-bold',
                      width: isTablet == true ? width / 1.5 : width / 2,
                    }}
                    numberOfLines={2}>
                    {item.product_name}
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 14,
                      fontFamily: 'Roboto-Bold',
                      marginTop: 5,
                    }}>
                    {item.price}
                  </Text>
                  {/* <Text
          style={{
            color: '#000000',
            fontSize: 14,
            fontFamily: 'Roboto-Regular',
            marginTop: 5,
          }}>
          {`${strings.QUANTITY2}: ${item.price}`}
        </Text> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 12,
                    }}>
                    <TouchableOpacity>
                      <Text
                        onPress={() => restoreItem(item.token)}
                        style={{
                          color: '#ef7b4a',
                          fontSize: 14,
                          fontFamily: 'Roboto-Regular',
                        }}>
                        Restore
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        deleteItem(item.token);
                      }}>
                      <Text
                        style={{
                          color: '#df6175',
                          fontSize: 14,
                          fontFamily: 'Roboto-Regular',
                          marginLeft: 10,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>



              </View>
            );
          }}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false} />
      </>





    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Buy Later"
        navigation={props.navigation}
        icon="arrowleft"
      />


      {buyLaterList.total_count == 0 ? renderEmptyCart() : renderList()}


      {loader && <Loader />}
    </View>
  );
};

export default ByLaterNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
