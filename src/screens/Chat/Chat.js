import CountdownTimer from '../../components/Animation/Timer';
import {
  View, Text, Animated, Modal, TouchableOpacity, Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Linking,
} from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Exclamation from 'react-native-vector-icons/AntDesign'
import {
  Bubble,
  GiftedChat,
  Send,
  Time,
  Avatar,
  SystemMessage,
  IMessage,
  SendProps,
  Message,
} from 'react-native-gifted-chat';
import { Header4 } from '../../components/Header/Header';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SendIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';

const Chat = (props) => {
  const giftedChatRef = useRef(null);

  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [seconds, setSeconds] = useState(null)
  const [min, setMin] = useState(null)
  const [hour, setHour] = useState(null)
  const [animationValue, setAnimationValue] = useState(new Animated.Value(1))
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [visible, setVisible] = useState(false)
  const { width, height } = Dimensions.get('window');
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({})

  // useEffect(() => {
  //   var time = props.route.params.endTime
  //   var myTime = new Date().getTime()
  //   //  var reqTime = myTime.getSeconds()
  //   //  console.warn(reqTime)
  //   var requiredTime = time - myTime
  //   console.log(msToTime(requiredTime))
  //   var milliseconds = Math.floor((requiredTime % 1000) / 100);
  //   let second = Math.floor((requiredTime / 1000) % 60);
  //   let minutes = Math.floor((requiredTime / (1000 * 60)) % 60);
  //   let hours = Math.floor((requiredTime / (1000 * 60 * 60)) % 24);

  //   hours = (hours < 10) ? "0" + hours : hour;
  //   minutes = (minutes < 10) ? "0" + minutes : minutes;
  //   second = (second < 10) ? "0" + second : second;
  //   setHour(hours)
  //   setMin(minutes)
  //   //  setSeconds(min == 17 ? second : null)
  //   setSeconds(second)
  //   // if (requiredTime == 0) {
  //   //   docModal()
  //   // }
  // }, [seconds, hour, min])
  // function msToTime(duration) {
  //     var milliseconds = Math.floor((duration % 1000) / 100);
  //   let second = Math.floor((duration / 1000) % 60);
  //   let minutes = Math.floor((duration / (1000 * 60)) % 60);
  //   let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  //  hours = (hours < 10) ? "0" + hours : hour;
  //  minutes = (minutes < 10) ? "0" + minutes : minutes;
  //  second = (second < 10) ? "0" + second : second;
  //  setHour(hour)
  //  setMin(minutes)
  // //  setSeconds(min == 17 ? second : null)
  // setSeconds(second)
  //  return hours+ " hours " + ":" + minutes + " minutes "+  ":" + seconds+ " seconds "
  // }
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);

    if (seconds == 0) {
      //   docModal()
      clearInterval(interval);
    }

    return () => clearInterval(interval);

  }, [seconds, hour, min]);
  useEffect(() => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      // Animated.timing(animationValue, {
      //   toValue: 1.3,
      //   duration: 100,
      //   useNativeDriver: true,
      // }),
      Animated.timing(animationValue, {
        toValue: 1.0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [seconds]);
  useEffect(() => {
    let userdata = {
      "_id": props.route.params.sender_id,
      "avatar": props.route.params.sender_pic,
      "name": props.route.params.sender_name
    }
    setUserData(userdata)
    // console.warn("22222",props.route.params.chat_id)
    // console.warn("1111",userdata.avatar)
    const onChildAdd = database()
      .ref('/messages/' + props.route.params.chat_id)
      .on('child_added', snapshot => {
        //    console.log('A new node has been added', snapshot.val());
        var temp = snapshot.val();
        if (snapshot.val().createdAt != undefined) {
          temp.createdAt = JSON.parse(snapshot.val().createdAt);
        }

        setMessages(state => [temp, ...state]);
        // setMessages(state => [snapshot.val(), ...state]);
        // console.log('MESSAGES==>', messages);
      });
    return () => {
      database()
        .ref('/messages' + props.route.params.chat_id)
        .off('child_added', onChildAdd);

      // console.log('Last text send Api');
    };
  }, [props.route.params.chat_id]);
  const renderSend = props => {
    // console.log('send==', props)
    return (
      <Send {...props}>
        <View
          style={{
            width: 50,
            height: 40,
            //backgroundColor: '#2E4296',
            marginRight: 10,
            // borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth: 0.5,
            //  borderColor: '#E0E0E0',
          }}>
          {/* <MaterialCommunityIcons
              name="send-circle"
              //style={{marginBottom: 5, marginRight: 5}}
              style={{alignSelf: 'center', marginRight: 8}}
              size={42}
              color="#2E4296"
            /> */}
          <SendIcon
            name="send-circle"
            size={35}
            color="#2b68e6"
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      </Send>
    );
  };


  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        //alwaysRenderAvatar={true}
        wrapperStyle={{
          right: {
            //backgroundColor: '#2173A8',
            backgroundColor: '#2173A8',
            padding: 15,
            marginTop: 5,
            width: "75%"
          },
          left: {
            backgroundColor: '#E9F1F6',
            padding: 15,
            marginTop: 5
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#151143',
          },
        }}
      />
    );
  };


  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };
  // renderTime={(props) => (
  //   <View style={props.containerStyle}>
  //     <CText size={10} style={{marginHorizontal: 10, marginBottom: 5}} bold color={props.position === "left" ? 'gray' : 'white'}>
  //       {`${props.currentMessage.createdAt.toDate().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}
  //     </CText>
  //   </View>
  // )}
  // const renderTime = (props) => {
  //   console.warn('rendertime=====', props)
  //   return (
  //     <Text style={{ color: '#aaa', fontSize: 12 }}>
  //       {props.currentMessage.createdAt.toLocaleTimeString()}
  //     </Text>
  //   );
  // };
  // const renderTime = (props) => (
  //   // console.warn('rendertime=====', props);
  //   <Time
  //     {...props}
  //     timeTextStyle={{ left: { color: 'red' }, right: { color: 'red' } }}
  //   />
  // );
  // const renderTime = props => {
  //   console.log('time=====', props)
  //   return (
  //     <Text style={{ fontSize: 10, color: '#000' }}>
  //       {moment(props.currentMessage.createdAt).format('LT')}
  //     </Text>
  //   );
  // }
  //    return (
  // <Time {...props}><View style={{ backgroundColor: 'red', marginRight: 60 }}>
  //   <Text style={{ color: 'red', backgroundColor: 'blue' }}>{props.currentMessage.user.createdAt}</Text>
  // </View>
  // </Time>
  //  <Time
  //   {...props}

  //   timeTextStyle={{
  //     left: {
  //       color: '#3c3c434d',
  //       fontSize: 10,
  //       fontFamily: 'Rubik',
  //       textAlign: 'right', // or position: 'right'
  //     },
  //     right: { color: '#3c3c434d', fontSize: 10, fontFamily: 'Rubik' },
  //   }}
  // />
  // );
  // };
  const CustomAvatar = props => {
    console.warn(props)
    return (

      <View style={{ marginRight: 10 }}>
        {/* <Image
            source={{ uri: props.route.params.dimage }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          /> */}
      </View>
    );
  }
  function renderCustomView(props) {
    console.log('currentMessage', props)
    const { currentMessage } = props;
    return (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: '#fff' }}>
          {currentMessage?.createdAt?.toString()}
        </Text>
      </View>
    );
  }
  const renderAvatar = props => {
    // console.warn("8888888888888888",JSON.stringify(props.currentMessage.user.avatar))
    return (<View style={{ marginRight: 10 }}>
      <Image
        source={{ uri: props.currentMessage.user.avatar }}
        style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain", backgroundColor: "black" }}
      />
    </View>
    );
  }

  const onSend = useCallback((message = []) => {

    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, message),
    // );
    console.log('message====', message[0]);

    // message[0].text === '' || message[0].text == null ? null :

    let msgData = {
      // message[0].text != '' || message[0].text != null ?
      _id: message[0]._id,
      avatar: props.route.params.reciever_Pic,
      user: {
        "_id": props.route.params.sender_id,
        "avatar": props.route.params.sender_pic,
        "name": props.route.params.sender_name
      },
      text: message[0].text,
      // createdAt: JSON.stringify(message[0].createdAt),
      createdAt: JSON.stringify(new Date())
      //  : null
    }
    //: null
    console.warn('===msgData===>', msgData);
    const newReference = database()
      .ref('/messages/' + props.route.params.chat_id)
      .push();
    msgData._id = newReference.key;

    newReference.set(msgData).then(async () => {
      console.log('Message Data has been updated ');
    });
  }, []);

  const animatedStyle = {
    transform: [{ scale: animationValue }], fontSize: 20, color: "red"
  };
  const handleOpen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };


  const docModal = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header4
        title="Messaging"
        navProps={props.navigation}
        padding={0}
        margin={30}
        change={true}
      />
      <View style={{
        height: "90%",
        width: '100%',
        elevation: 2,
        paddingBottom: height * 0.03,
        marginTop: 10,
        borderTopColor: '#ddd',
        borderWidth: 1,
        marginTop: 15
      }}>
        <GiftedChat
          ref={giftedChatRef}
          messages={messages}
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onSend={(messages) => {

            //  console.log('time---', messages)
            messages[0].text === ''
              ? alert('It is not permitted to enter an empty message')
              : onSend(messages);
          }}
          user={userData}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
          scrollToBottom
          //   renderTime='true'
          scrollToBottomComponent={scrollToBottomComponent}

          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          // renderTime={renderTime}
          inverted={true}
          textInputStyle={{ color: '#000', }}
          messagesContainerStyle={{ backgroundColor: '#fff' }}
          renderAvatar={renderAvatar}
          renderAvatarOnTop={true}
        />
      </View>
      {/* { (seconds != null || seconds > 0) ?  */}
      <View style={{ alignSelf: "flex-end", position: "absolute", marginTop: 3, right: 15, alignItems: "center" }}>

        <CountdownTimer endTime={props.route.params.endTime} onFinish={docModal} />

      </View>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        // onRequestClose={onClose}
        onShow={handleOpen}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}
        // onPress={handleClose}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: "center", justifyContent: "center" }}>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
                backgroundColor: 'white',
                width: "90%",
                padding: 20,
                borderRadius: 10,
              }}
            >
              {props.route.params.role === "doctor" && <>
                <Image
                  source={require('../../Assets/doctorappicon2.png')}
                  style={{ width: 80, height: 80, borderRadius: 20, alignSelf: "center" }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
                  <Text style={{ alignSelf: "center", fontSize: 16, color: "red" }}>This session has ended</Text>
                  <Exclamation name="exclamation" size={25} color="red" />
                </View>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "85%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  onPress={() => {
                    props.navigation.replace('PatientPrescription', {
                      bookingid: props.route.params.booking_id
                    });
                  }}>
                  <Text style={{ color: "#000" }}>Generate Prescription</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "85%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  onPress={() => { props.navigation.replace('Dashboard'); }}>
                  <Text style={{ color: "#000" }}>Later</Text>
                </TouchableOpacity>
              </>
              }
              {props.route.params.role === "patient" && <>
                <Image
                  source={require('../../Assets/doctorappicon2.png')}
                  style={{ width: 80, height: 80, borderRadius: 20, alignSelf: "center" }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", }}>
                  <Text style={{ alignSelf: "center", fontSize: 16, color: "red", textAlign: "center", marginBottom: 3 }}>You have reached the end of your consultation time</Text>

                </View>

                <Text style={{ textAlign: "center" }}>When the Doctor generates your prescription, you will be able to see it in the Completed Bookings section</Text>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "40%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  onPress={() => { props.navigation.replace("PatientTabNavigator") }}>
                  <Text style={{ color: "#000", fontSize: 16 }}>Ok</Text>
                </TouchableOpacity>

              </>
              }
              {props.route.params.role === "chatPat" && <>
                <Image
                  source={require('../../Assets/doctorappicon2.png')}
                  style={{ width: 80, height: 80, borderRadius: 20, alignSelf: "center" }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", }}>
                  <Text style={{ alignSelf: "center", fontSize: 16, color: "red", textAlign: "center", marginBottom: 3 }}>You have reached the end of your consultation time.</Text>

                </View>
                {/* <Text style={{ textAlign: "center" }}>In case you have not yet registered, please Sign Up or Login in order to access your prescription.</Text> */}
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "40%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  //</> onPress={() => { props.navigation.replace('SelectScreen') }}>
                  onPress={() => { props.navigation.replace("PatientTabNavigator") }}>

                  <Text style={{ color: "#000", fontSize: 16 }}>Ok</Text>
                </TouchableOpacity>
              </>
              }
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  )
}

export default Chat