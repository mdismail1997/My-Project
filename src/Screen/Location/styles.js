import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderColor: '#737373',
    borderWidth: 1,
    marginHorizontal: 20,
    height: 52,
    marginTop: 20,
    // position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    width: '90%',
  },
  locationTextInput: {height: 30, padding: -5, color: '#000', fontSize: 14},
});
