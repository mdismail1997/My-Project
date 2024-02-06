import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { styles } from './styles';
import { Header } from '../../components/Header/Header';
import { Bubble, GiftedChat, Send, Time } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { COLORS } from '../../utils/Const';
import database from '@react-native-firebase/database';
import ProfileContext from '../../Services/ProfileProvider';
import { useDispatch, useSelector } from 'react-redux';
import { getChatAction } from '../../Redux/actions/ProfileAction';

import { io } from "socket.io-client";
import { SOCKET_URL } from '../../Services/ApiConst';
import { retrieveData } from '../../utils/AsyncStore';
import { getApiCall, postApiCall } from '../../utils/Network';
import { getChat } from '../../Services/ApiService';
//const SOCKET_URL = 'https://nodeserver.mydevfactory.com:6098';


const ChatScreen = props => {
  const [messages, setMessages] = useState([]);
  const [userid, setuserId] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [name, setname] = useState('');
  const [socketData, setSocketData] = useState('');
  const [receiverid, setReceiverId] = useState('');
  const detailsview = props.route.params.details;
  const chatId = props.route.params.chat_id;


  console.log('details555555555555555555555555555', userid, name);

  useEffect(() => {

    getData()

  }, [props.route.params.chat_id])


  const getData = async () => {
    await getApiCall(`chat/chat/${props.route.params.chat_id}`)
      .then(response => {
        console.log('response', response.data.data.messages.length)
        if(response.data.data.user._id==userid){
          setReceiverId(response.data.data.remoteUser._id)
        }else{
          setReceiverId(response.data.data.user._id)
        }
        var tempArr = []
        response.data.data.messages.map(item => {
          // console.log("==========>", item.receiver)
          // console.log("====+++++======>", item.sender)
          // if(item.sender._id==userid){
          //   let temp={
          //     _id: item._id,
          //     avatar: profileImage,
          //     user: {
          //       _id: userid,
          //       name: name,
          //       avatar: profileImage,
          //     },
          //     text: item.text,
          //     createdAt:item.time,
          //   }
          //   tempArr.push(temp)
          // }else{
          //   let temp={
          //     _id: item._id,
          //     avatar: profileImage,
          //     user: {
          //       _id: response.data.data.user._id,
          //       name:  response.data.data.user.firstname+" "+response.data.data.user.lastname,
          //       avatar: response.data.data.user.profileimage==null?profileImage:response.data.data.user.profileimage,
          //     },
          //     text: item.text,
          //     createdAt:item.time,
          //   }
          //   tempArr.push(temp) 
          // }
          let temp = {
            _id: item._id,
            avatar: item.receiver?.profileimage == (null || undefined ||'') ? profileImage : item.receiver?.profileimage,
            user: {
              _id: item.sender?._id,
              name: item.sender?.firstname + " " + item.sender?.lastname,
              avatar: item.sender?.profileimage == (null || undefined ||'') ? profileImage : item.sender?.profileimage,
            },
            text: item.text,
            createdAt: item.time,
          }
          tempArr.push(temp)
        })
        tempArr.reverse()
        setMessages(tempArr)
        //console.log("=====tempArr=====>", tempArr)
      })
      .catch(error => {
        console.log('error', error)
      })
  }







  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', () => {
      getToken();
    });
    return createjobDetails;
  }, []);

  useEffect(() => {
    createSocket()
  }, [])



  const createSocket = async () => {

    var usertoken = await retrieveData('USER_TOKEN');
    console.warn('TOKENNNNNNNNNNNNN', usertoken);
    try {


      if (usertoken != null && usertoken != '' && usertoken != 'null') {
        const socket = io(SOCKET_URL, {
          //  transports: ['websocket'],
          query: { token: usertoken },
          connected: true
        })


        console.log("initializing socket========", socket)



        socket.on('connect', (data) => {
          console.log("==========SOCKET CONNECTED==========", socket.connected);
          setSocketData(socket);
          console.log("==========SOCKET HISTORY==========", socket);

          socket.on('message',message=>{
            //Alert.alert("data")
           console.log('******mesage====>', message)
           let temp = {
            _id: message.chatId,
            avatar: profileImage,
            user: {
              _id: message.sender?._id,
              name: message.sender?.firstname + " " + message.sender?.lastname,
              avatar: message.sender?.profileimage == (null || undefined ||'') ? profileImage : message.sender?.profileimage,
            },
            text: message.text,
            createdAt: message.time,
          }
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [temp]),
          )
          })
        })
        socket.on('error', (data) => {
          console.log("SOCKET ERROR", data)
        })
        // socket.on('message', message => {
        //   Alert.alert("data1")
        //   console.log('******mesage====>', message)
        // })
      }

    } catch (error) {
      console.log("Error in socket! not initialized", error);
    }

  }







  const getToken = async () => {
    let data = JSON.parse(await AsyncStorage.getItem('USER'));
    console.log('token key', data.data);
    setuserId(data.data._id);
    setProfileImage(data.data.profileimage);
    setname(data.data.firstname);
    return data;
  };





  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        //alwaysRenderAvatar={true}
        wrapperStyle={{
          right: {
            //backgroundColor: '#E92D87',
            backgroundColor: COLORS.YELLOW_GREEN,
          },
          left: {
            backgroundColor: '#F1F3F6',
          },
        }}
        textStyle={{
          right: {
            color: '#151143',
          },
          left: {
            color: '#151143',
          },
        }}
      />
    );
  };
  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            //style={{marginBottom: 5, marginRight: 5}}
            style={{ alignSelf: 'center', marginRight: 8 }}
            size={42}
            color={COLORS.YELLOW_GREEN}
          />
        </View>
      </Send>
    );
  };

  const renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: '#7B7B7B',
          },
          right: {
            color: '#7B7B7B',
          },
        }}
      />
    );
  };



  const onSend = useCallback((message = []) => {
    console.log('userid=============', message);
    const messageData = {
      chatId: props.route.params.chat_id,
      sender: userid,
      receiver: receiverid,
      text: message[0].text,
      time: message[0].createdAt
    }
    sendTextApi(messageData, message)
    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, message),
    // )
  })




  const sendTextApi = async (msgData, message) => {

    console.log('messagesss====>', msgData)
    await postApiCall('chat/sendMessageMobile', msgData, {})
      .then(response => {
         console.log("=============>", response.data)
        if (response.status == 200) {
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, message),
          )
        }

      })
      .catch(error => {
        console.log('error============', error)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title={detailsview?.firstname} avatar avatarImage={{ uri: detailsview?.profileimage }} />
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: userid,
          name: name,
          avatar: profileImage,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        renderTime={renderTime}
        showUserAvatar={true}
        showAvatarForEveryMessage={true}
        textInputStyle={{ color: '#151143' }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;







// import { View, Text } from 'react-native'
// import React, {useState, useEffect, useCallback} from 'react'
// import socketService from '../../utils/socketService'

// const ChatScreen = () => {


// useEffect(() => {
//     socketService.initializeSocket()
// }, [])



//   return (
//     <View>
//       <Text>ChatScreen</Text>
//     </View>
//   )
// }

// export default ChatScreen