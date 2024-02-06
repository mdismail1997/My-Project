import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { Text, TextInput, Button, Modal, Portal } from 'react-native-paper';
import { Header4 } from '../../components/Header/Header';
export const ReqChngMedicine = (props) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const setData = () => {
    props.navigation.navigate('ChngMedicine'), setVisible(false);
  };
  const setmodal = () => {
    setVisible(false);
  };
  const data = [
    {
      id: 1,
      img: require('../../Assets/chngmedicine.png'),
      title: 'Diamox - ',
      description: ' 30 days course',
    },
    {
      id: 2,
      img: require('../../Assets/chngmedicine.png'),
      title: 'Ilube -  ',
      description: '07 days course',
    },
  ];
  const renderdata = ({ item, index }) => {
    return (
      <View style={styles.view}>
        <Text
          style={{
            color: '#000',
            marginLeft: 20,
            marginTop: 20,
            fontSize: 15,
            position: 'absolute',
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 90,
            marginTop: 26,
            fontSize: 10,
          }}
        >
          {item.description}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{
              width: 20,
              height: 22,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: -60,
              marginLeft: 300,
            }}
            source={item.img}
          />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header4 title="Request change of Medicine" navProps={props.navigation} />
      <ScrollView style={{ marginBottom: 20, backgroundColor: '#fff' }}>
        <View style={styles.checkborder}>
          <Image
            style={styles.img}
            source={require('../../Assets/luhina.png')}
          />

          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: 5,
              position: 'absolute',
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Luhani Lk.
          </Text>
          <Text style={{ color: '#333333', marginLeft: 100, marginTop: 30 }}>
            30 may, 2022
          </Text>
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: -10,
            }}
          >
            Monday, 09.00AM - 10.00AM
          </Text>
        </View>

        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          chief complaint
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
          }}
        >
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Patient Information
        </Text>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Name
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}Luhani Lk.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Age
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}29+
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Request change of Medicine List
        </Text>
        <FlatList
          style={{ marginBottom: 20 }}
          data={data}
          renderItem={renderdata}
          keyExtractor={(item, index) => item.id}
        />

        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Medicine List
        </Text>
        <View style={styles.view}>
          <Text
            style={{
              color: '#000',
              marginLeft: 20,
              marginTop: 20,
              fontSize: 15,
              position: 'absolute',
            }}
          >
            Diamox -
          </Text>
          <Text
            style={{
              color: '#737373',
              marginLeft: 90,
              marginTop: 26,
              fontSize: 10,
            }}
          >
            30 days crores
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 30,
            marginTop: 20,
            borderRadius: 10,
            marginBottom: 30,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            icon={require('../../Assets/chngmicon.png')}
            onPress={showModal}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Change Medicine
          </Button>
        </View>
        <View style={{ width: '100%' }}>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} transparent={true}>
              <Pressable onPress={setData}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: 260,
                    width: '70%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 10,
                    marginTop: -50,
                  }}
                >
                  <TouchableOpacity onPress={setmodal}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        alignSelf: 'flex-end',
                        marginTop: -40,
                        marginRight: 10,
                      }}
                      source={require('../../Assets/modalcross.png')}
                    />
                  </TouchableOpacity>
                  <Text style={{ color: '#000', marginLeft: 20, fontSize: 15 }}>
                    Diamox -
                  </Text>
                  <Text
                    style={{
                      color: '#737373',
                      marginLeft: 90,
                      marginTop: -16,
                      fontSize: 10,
                    }}
                  >
                    30 days crores
                  </Text>
                  <Text style={styles.modaltext}>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </Text>
                </View>
              </Pressable>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',

    alignSelf: 'center',
    height: 90,
    marginTop: 20,
    width: '90%',
  },
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

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 15,
  },
});
