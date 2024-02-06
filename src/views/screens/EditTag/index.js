import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useRef} from 'react';

import Loader from '../../components/Loader.js';
import strings from '../../components/lng/LocalizedStrings.js';
import {calcH, calcW} from '../../../utils/constants/common.js';

import styles from './style.js';

import {
  actions,
  defaultActions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import RenderHtml from 'react-native-render-html';
import {ScreenWidth} from '@rneui/base';
import COLORS from '../../../conts/colors.js';
import {Button} from 'react-native-paper';
import {DeviceEventEmitter} from 'react-native';

const EditTag = ({route, navigation}) => {
  const [loading, setLoading] = React.useState(true);
  const [description, setDescription] = React.useState('');
  console.log('description', description);

  React.useEffect(() => {
    const {description} = route.params;
    if (description) {
      setDescription(description);
    }
    setLoading(false);
  }, []);

  const RichText = useRef(); //reference to the RichEditor component

  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {
      console.log(
        'Toolbar click, selected items (insert end callback):',
        items,
      );
    });
  }

  const renderContent = () => {
    if (description) {
      return (
        <ScrollView style={{flex: 1}}>
          <View style={styles.bottomSheet}>
            <View style={{flex: 1, marginHorizontal: 5}}>
              <Text style={styles.text}>Editor</Text>
              <RichEditor
                disabled={false}
                containerStyle={styles.editor}
                ref={RichText}
                style={styles.rich}
                placeholder={'Start Writing Here'}
                initialContentHTML={description}
                onChange={text => setDescription(text)}
                editorInitializedCallback={editorInitializedCallback}
              />
              <RichToolbar
                style={[styles.richBar]}
                editor={RichText}
                disabled={false}
                iconTint={COLORS.BlackTie}
                selectedIconTint={'pink'}
                disabledIconTint={'purple'}
                iconSize={calcH(0.025)}
                actions={[
                  ...defaultActions,
                  actions.setStrikethrough,
                  actions.heading1,
                ]}
                iconMap={{
                  [actions.heading1]: ({tintColor}) => (
                    <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
                  ),
                }}
              />
              <Text style={styles.text}>Result</Text>
              <View
                style={{
                  flex: 1,
                  borderWidth: 0.2,
                }}>
                <ScrollView>
                  <View style={{marginHorizontal: 5}}>
                    <RenderHtml
                      contentWidth={ScreenWidth}
                      source={{html: description}}
                      tagsStyles={{
                        body: {
                          whiteSpace: 'normal',
                          color: 'black',
                          fontSize: 25,
                        },
                        a: {
                          color: COLORS.white,
                          textDecorationLine: 'none',
                          fontSize: 16,
                          fontFamily: 'Montserrat-Bold',
                        },
                        p: {
                          fontFamily: 'Montserrat-Regular**',

                          color: COLORS.white,
                          fontSize: 16,
                        },
                        img: {display: 'none'},
                      }}
                    />
                  </View>
                </ScrollView>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  top: 20,
                }}>
                <Button
                  color={COLORS.header_color}
                  icon="check"
                  mode="contained"
                  onPress={() => {
                    DeviceEventEmitter.emit('richTextUpdate', description);
                    navigation.goBack();
                  }}>
                  Submit
                </Button>
                <Button
                  color={COLORS.header_color}
                  icon="close"
                  mode="contained"
                  onPress={() => navigation.goBack()}>
                  Cancel
                </Button>
              </View>
            </View>

            <View style={{height: calcH(0.1)}} />
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <>
      {loading && <Loader visible={loading} />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{flex: 1}}>{renderContent()}</SafeAreaView>
      </ScrollView>
    </>
  );
};

export default EditTag;
