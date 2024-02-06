export const linking = {
  prefixes: ['kabou-rider://'],
  config: {
    screens: {
      mainNavigation: {
        path: 'main-navigation',
        screens: {
          driverView: 'driver-view',
          waitingScreen: 'waiting-screen',
        },
      },
    },
  },
};
