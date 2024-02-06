const createConnection = async () => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let UToken = JSON.parse(usertoken);
    console.warn('TOKENNNNNNNNNNNNN', UToken);

    if (UToken != null && UToken != '' && UToken != 'null') {
      const socket1 = io(SOCKET_URL, {
        query: { token: UToken, forceNew: true },
      });
      console.warn('socket1', socket1);

      if (socket1 != null) {
        console.warn('OKKKKK');
        socket1.on('connected', (data) => {
          console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

          if (socket1.connected) {
            setSocket(socket1);
            console.warn('hihi', socket1.connected);
            socket1.on('admin_approve', (data) => {
              console.warn('pause job reason approval status =====>>>', data);
              if (data.admin_approval_status === 1) {
                setAdminConfirm(data.admin_approval_status);
                queryServiceDetails();
                backButtonHendle();
              } else {
                setAdminConfirm(0);
              }
            });
            socket1.on('pause_reason', (data) => {
              console.warn('pause job reason =====>>>', data);
              // setPaymentStatus(data.confirm_status);
              queryServiceDetails();
              if (data.confirm_status === 1) {
                // setPaymentStatus(data.confirm_status);
                setPartsConfirmStatus(data.confirm_status);
                queryServiceDetails();
                // setDisableResume(false);
                // setPause(false);
                // setConfirmStatus(data.confirm_status);
                // getUpdateJobDetails();
                // backButtonHendle();
              } else {
                setPartsConfirmStatus(0);
              }
            });

            socket1.on('query_extra_time', (data) => {
              console.warn('query_extra_time data =====>>>', data);
              if (data.extra_day_confirm_status === 1) {
                setExtraDayConfirmStatus(data.extra_day_confirm_status);
                queryServiceDetails();
              } else {
                setExtraDayConfirmStatus(0);
                queryServiceDetails();
              }
            });

            socket1.on('rejected', (data) => {
              console.warn('pause job reason reject status =====>>>', data);
              if (data.extra_part_confirm_status === 2) {
                queryServiceDetails();
                backButtonHendle();
                setPartsConfirmStatus(data.extra_part_confirm_status);
              } else {
                setPartsConfirmStatus(0);
              }
            });
          } else {
            console.warn('ggg');
          }
        });
      }
    }
  };

  const disconnect_socket = async () => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let UToken = JSON.parse(usertoken);
    console.warn('TOKENNNNNNNNNNNNN', UToken);
    console.warn('socket', socket);

    if (UToken != null && UToken != '' && UToken != 'null') {
      const socket1 = io(SOCKET_URL, {
        query: { token: UToken, forceNew: true },
      });
      if (socket1 != null) {
        console.warn('OKKKKK');
        socket1.on('connected', (data) => {
          console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

          if (socket1.connected) {
            socket1.disconnect();
            console.warn('hihi', socket1.connected);
          }
        });
      }
      props.navigation.replace('QueryBookings');
    }
  };
