import { View, Text, ScrollView, StyleSheet, Dimensions, Image, FlatList, BackHandler, Alert,I18nManager } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../Component/Header/Header';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';

const { width, height } = Dimensions.get('window');

export default function FAQ(props) {

  useEffect(() => {
    setLoder(true)
    profileData()
    selectedLng()
  }, []);

  const [loder, setLoder] = useState(false);
  const [data, setdata] = useState('');
  const [showAns, setShowAns] = useState('')
  const [ss, setS] = useState(false)
  const [myid, setMyId] = useState(false)
  
  const selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    // setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }



 const profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(response => {
        // info(response.addresses[0].customer_id);
        // setMyId(response.addresses[0].customer_id)
        info(response.id);
        setMyId(response.id)
       
        console.log('Profile responce => ', response);
        // this.setState({ name: res?.firstname });
        // res?.custom_attributes?.map(item => {
        //   if (item?.attribute_code == 'avatar') {
        //     this.setState({ image: item?.value });
        //   }
        // });
      })
      .catch(error => {
        console.log('Profile error => ', error);
      });
  };

  const info = (myid) => {
    // console.warn("jjjjjjjjjjjjjjjjjjjjjjj",myid)
    GetRequest(`cs/faq?customer_id=${myid}`, {}, {}, "self")
      .then(response => {
        setLoder(false)
        console.warn('fbdskj', response)
        setdata(response)
      })
      .catch(error => {
        console.log("info error => ", error)
      })
  }

  const renderItem = ({ item, index }) => {
    // console.warn('item', item)
    return (
      <View style={[{
        marginTop: width / 9,

      }, index == 0 && { marginTop: 0 }]}>
        <Text numberOfLines={2} style={{
          fontSize: 16, fontWeight: 'bold', color: '#000',
          borderBottomWidth: 0.2,
          paddingBottom: 7
        }}>{item?.groupname.toUpperCase()}</Text>

        <FlatList
          data={item.faq_data}
          // horizontal
          keyExtractor={(item, index) => item.id}
          renderItem={(item) => renderItem2(item)}
          scrollEnabled={true}

        />
      </View>
    )
  }

  const ShowAns = (ans) => {
    setShowAns(ans)
    setS(!ss)
  }

  const renderItem2 = (item) => {
    // console.warn('item', item)
    return (
      <View style={{
        // marginTop: 5,
        // borderBottomWidth: 0.2,
        // paddingBottom: 7
      }}>
        <TouchableOpacity onPress={() => { ShowAns(item.item.content) }}>
          <Text numberOfLines={2} style={{
            fontSize: 13, fontWeight: 'bold', paddingVertical: 10, borderWidth: 0.2, marginTop: 10, paddingLeft: 5, backgroundColor: '#d9d9d9', color: '#000'
          }}>
            {item?.item?.title}

          </Text>
        </TouchableOpacity>
        {showAns == item.item.content && ss == true ? <Text style={{ borderWidth: 0.2, padding: 10, color: '#000' }}>{item.item.content}</Text>
          : null}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title={strings.FAQ} navigation={props.navigation} icon="arrowleft" />
      <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <FlatList
          data={data}
          // horizontal
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => renderItem({ item, index })}
          scrollEnabled={true}

        />
      </ScrollView>
      {loder && <Loder />}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
