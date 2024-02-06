import React, {Component} from 'react';
import {View, Button, Alert} from 'react-native';

// Modal imports
import Modal from 'react-native-modal';

class BaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  toggleModal = async state => {
    let status = this.state.isModalVisible;
    this.setState({isModalVisible: state}, () => {
      status = this.state.isModalVisible;
    });
    return status;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isModalVisible !== this.state.isModalVisible) {
      this.props.onStatusChange?.(this.state.isModalVisible);
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        // onBackdropPress={() => this.setState({ isModalVisible: false })}

        animationIn="zoomIn"
        animationOut="zoomOut">
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          {this.props.children}
          <Button
            // onPress={() => {
            //   this.setState({isModalVisible: false});
            // }}
            onPress={()=> Alert.alert(
              'Update Location Settings',
              'Allow us to access your location all the time so we can provide personal recommendations',
              [
                {
                  text: 'No thanks',
                 
                },
                {
                  text: 'Update Settings',
                onPress: () => this.setState({isModalVisible: false}),
              },

              ],
            )}
            title="Accept"
          />
        </View>
      </Modal>
    );
  }
}

export default BaseModal;
