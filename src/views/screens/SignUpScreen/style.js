import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import COLORS from '../../../conts/colors.js';
import {FONTS} from '../../../conts/theme.js';
import {fSize} from '../../../utils/constants/common.js';
import {calcH, calcW, STYLES} from '../../utils/constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    margin: 20,
    padding: 8,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  /* The content of the modal takes all the vertical space not used by the header. */
  modalContent: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
  },
  /* The header takes up all the vertical space not used by the close button. */
  modalHeaderContent: {
    flexGrow: 1,
  },
  modalHeaderCloseText: {
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  outsideModal: {
    backgroundColor: 'rgba(1, 1, 1, 0.2)',
    flex: 1,
  },
  headerText: {
    //margin: 6,
    fontSize: fSize(15),
    fontWeight: '500',
    ...FONTS.OpenSans_Reg,
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default styles;
