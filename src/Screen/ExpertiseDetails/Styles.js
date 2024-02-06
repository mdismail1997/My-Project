import {StyleSheet} from 'react-native';
import {COLORS} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileImgContainer: {
    height: 140,
    width: 140,
    borderRadius: 140,
    borderWidth: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  usernameText: {
    fontSize: 18,
    lineHeight: 21,
    marginTop: 34,
    textAlign: 'center',
    fontWeight: '700',
    color: '#000',
  },
  buttonContainer: {
    borderColor: '#000',
    borderWidth: 0,
    marginTop: hp(18),
    flexDirection: 'row',
  },
  buttonStyle: {
    width: '40%',
  },
  jobItemContainer: {
    // width: '80%',
    flex: 0.5,
    margin: hp(16)
    // marginLeft: wp(35),
  },
  dayStyle: {
    backgroundColor: COLORS.YELLOW_GREEN,
    width: wp(100),
    marginLeft: wp(180),
  },
});
