import {StyleSheet} from 'react-native';

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
  editIconContainer: {
    height: 43,
    width: 43,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
    alignSelf: 'center',
    top: -46,
    left: 56,
  },
  usernameText: {
    fontSize: 18,
    lineHeight: 21,
    marginTop: 34,
    textAlign: 'center',
    fontWeight: '700',
    color: '#000',
  },
  memberText: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginTop: 3,
  },
  quoteContainer: {
    marginTop: 26,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  quote: {
    fontSize: 12,
    marginTop: 6,
    color: '#737373',
  },
  quoteAuthor: {
    fontSize: 12,
    lineHeight: 16,
    color: '#333333',
  },
  jobTypeContainer: {
    marginTop: 22,
    height: 52,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  jobType: {
    width: '50%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 14,
    color: '#000',
  },
  currentJobType: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentJobTypeTitle: {fontSize: 14, color: '#000', fontWeight: '700'},
});
