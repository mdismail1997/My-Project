import * as React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  TextInput,
  Title,
} from 'react-native-paper';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {Header} from '../Header/Header';
import FIcon from 'react-native-vector-icons/dist/Fontisto';
import CustomButton from '../CustomButton';

const MyComponent = props => {
  const [visible, setVisible] = React.useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(!visible);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Title>Job Application</Title>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <TextInput
                mode="outlined"
                label="Job Title"
                placeholder="Job Title"
                style={[styles.inputStyle]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={props.jobTitle}
                editable={false}
              />
              <TextInput
                mode="outlined"
                label="Category"
                placeholder="Category"
                style={[styles.inputStyle]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={props.category}
                editable={false}
              />
              {props.subcategory ? (
                <TextInput
                  mode="outlined"
                  label="SubCategory"
                  placeholder="SubCategory"
                  style={[styles.inputStyle]}
                  outlineColor={COLORS.NICKEL}
                  activeOutlineColor={COLORS.NICKEL}
                  value={props.subC}
                />
              ) : null}

              <TextInput
                mode="outlined"
                label="Expected Salary"
                placeholder="Salary"
                style={[styles.inputStyle]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={props.salary}
                // onChangeText={props.onChangeTextSal}
                // onBlur={props.onBlurSal}
                left={<TextInput.Affix text="$" />}
                editable={false}
              />
              <TextInput
                placeholder="Start Date"
                style={styles.inputStyle}
                label="Date of Joining (Expected)"
                mode="outlined"
                value={props.joinDate}
                onPressIn={props.OnPressDate}
                right={
                  <TextInput.Icon
                    name={() => (
                      <FIcon
                        name={'date'}
                        color={COLORS.NICKEL}
                        size={wp(20)}
                      />
                    )}
                  />
                }
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                editable={false}
              />
              <TextInput
                mode="outlined"
                label="Description"
                placeholder="Description"
                style={[styles.inputStyle, {height: hp(120)}]}
                outlineColor={COLORS.NICKEL}
                activeOutlineColor={COLORS.NICKEL}
                value={props.description}
                onChangeText={props.onChangeTextDes}
                multiline={true}
                editable={false}
                // numberOfLines={2}
              />
              {/* <View
                style={{
                  borderColor: COLORS.NICKEL,
                  borderWidth: 1,
                  marginTop: hp(15),
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 6,
                }}>
                <TouchableOpacity
                  style={{
                    width: '30%',
                    backgroundColor: COLORS.SILVER_SAND,
                    padding: 12,
                    marginRight: wp(12),
                    borderRadius: 6,
                  }}
                  onPress={props.onPressResume}>
                  <Text style={{color: COLORS.BLACK}}>Choose File</Text>
                </TouchableOpacity>
                <Text numberOfLines={1} style={{width: '40%'}}>
                  {props.imageText}
                </Text>
              </View> */}
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  style={{
                    marginTop: hp(16),
                    marginHorizontal: wp(1),
                    marginBottom: hp(6),
                    width: wp(75),
                    backgroundColor: COLORS.YELLOW_GREEN,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 12,
                  }}
                  onPress={props.onPressB}>
                  <Text style={{color: COLORS.WHITE}}>Apply</Text>
                </TouchableOpacity>
                <CustomButton
                  title={'Close'}
                  buttonStyle={{
                    marginTop: hp(16),
                    marginHorizontal: wp(1),
                    marginBottom: hp(6),
                    width: wp(75),
                    backgroundColor: COLORS.NICKEL,
                  }}
                  onPress={() => hideModal()}
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,
  },
});

export default MyComponent;
