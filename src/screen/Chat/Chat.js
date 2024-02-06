import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {HeaderComponent} from '../../components';
import {Images} from '../../assets/image';
import {getHeight, getWidth} from '../../global/common';
import moment from 'moment';

const Chat = ({navigation}) => {
  const [time, setTime] = useState(new Date());
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const sendComment = () => {
    if (comment.length === 0) {
      return;
    }
    const temp_comment = {
      userMsg: comment,
      chatTime: moment(time).format('h:mm A'),
    };
    setComment('');
    setComments(old_comments => [...old_comments, temp_comment]);
    Keyboard.dismiss();
  };

  return (
    <View style={{flex: 1}}>
      <HeaderComponent navigation={navigation} />
      <View style={{marginTop: 20}} />
      <View style={{borderBottomWidth: 1, borderColor: 'silver'}} />

      <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 20}}>
        <Image source={Images.profilePic} style={styles.profilepic} />

        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={styles.name}>Troy Johnson</Text>
          <Text style={styles.email}>Customer Champ</Text>
        </View>
      </View>
      <View style={{marginTop: 20}} />
      <View style={{borderBottomWidth: 1, borderColor: 'silver'}} />
      <ScrollView>
        <View style={styles.firstview}>
          <Text style={{margin: 10, fontSize: 15}}>
            Hey there! you can begin by asking your question below...
          </Text>
        </View>
        <Text
          style={[
            styles.time,
            {alignSelf: 'flex-start', marginLeft: getWidth(20)},
          ]}>
          Today, 8:14pm
        </Text>

        <View style={styles.secondview}>
          <View>
            <Text style={{margin: 10, fontSize: 15}}>
              Hello! I just received the kit for my new bike.
            </Text>
          </View>
        </View>
        <Text style={styles.time}>Today, 8:14pm</Text>

        <View style={styles.secondview}>
          <View>
            <Text style={{margin: 10, fontSize: 15}}>
              I'm a bit confuse on the break assembly.
            </Text>
          </View>
        </View>
        <Text style={styles.time}>Today, 8:17pm</Text>
        {comments.map((item, index) => (
          <>
            <View style={styles.secondview}>
              <View>
                <Text style={{margin: 10, fontSize: 15}}>{item.userMsg}</Text>
              </View>
            </View>
            <Text style={styles.time}>{item.chatTime}</Text>
          </>
        ))}
        <View style={{paddingBottom: getHeight(60)}} />
      </ScrollView>

      <View style={styles.inputview}>
        <TextInput
          placeholder="Type something..."
          onChangeText={setComment}
          value={comment}
          returnKeyType="done"
          style={styles.input}
        />
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => Alert.alert('Click')}>
            <Image style={{height: 20, width: 20}} source={Images.smile} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Click')}>
            <Image
              style={{height: 20, width: 20, marginLeft: 10}}
              source={Images.attached}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sendComment()}>
            <Image
              style={{
                height: 25,
                width: 25,
                marginLeft: 10,
                resizeMode: 'contain',
              }}
              source={Images.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  profilepic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  name: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  email: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '400',
    color: 'silver',
    marginTop: 4,
  },
  input: {
    marginLeft: 8,
    width: '70%',
  },
  firstview: {
    backgroundColor: '#e1e1e1',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: getHeight(2),
    alignSelf: 'flex-start',
    marginHorizontal: getWidth(15),
    marginTop: getHeight(20),
  },
  secondview: {
    flexDirection: 'row-reverse',
    backgroundColor: 'silver',
    borderRadius: 32,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
    marginHorizontal: getWidth(15),
    marginTop: getHeight(20),
    paddingVertical: getHeight(2),
  },
  inputview: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    elevation: 10,
  },
  time: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: getWidth(20),
  },
});
