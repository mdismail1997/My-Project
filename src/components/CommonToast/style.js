import { StyleSheet, Platform, Dimensions } from 'react-native';
var deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Rubik',
    color: 'white',
    fontSize: 14,
    flex: 1,
    paddingTop: Platform.select({
      ios: deviceHeight == 812 ? 30 : 20,
      android: 20,
    }),
    marginRight: 8,
    ...Platform.select({
      ios: { paddingTop: 34 },
      android: {},
    }),
  },
  actionBtn: {
    fontFamily: 'Rubik',
    color: 'white',
    fontSize: 13,
    padding: 8,
    paddingTop: Platform.select({
      ios: deviceHeight == 812 ? 30 : 20,
      android: 20,
    }),
  },
});
