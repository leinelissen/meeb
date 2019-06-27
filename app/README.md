# Meeb Apps
The digital Meeb ecosystem consists of two types of apps: the *dashboard* and the *remote*. The former provides for a shared screen indicating home statuses, while the latter provides for setting personal preferences for the indoor climate.

## Installing and running
Both applications are built using the [React Native](https://facebook.github.io/react-native/) stack, which allows for building native applications using plain old JavaScript. Additionally, we rely on [Expo](https://expo.io) as an additional layer to smooth things over in terms of push notifications and other things that are hard to do in native platforms.

The two apps are built using the exact same technologies, so the installation process is nearly the same. The only difference is that the Dashboard runs on a slightly older version of Expo in order to support iOS 9.

The only requirements is that [NodeJS](https://nodejs.org/en/) is installed on the particular system, as well as either [XCode](https://developer.apple.com/xcode/) or [Android Studio](https://developer.android.com/studio) if want to run the resulting app in a simulator.

1. Clone the repositories
2. Go to the folder for the particular app using your favorite terminal app. (We recommend [Hyper](https://hyper.is) because of JavaScript...)
3. Run `npm install`
4. Go into the `src` folder
5. Copy the `env.example.js` file and rename it to `env.js`: `cp env.example.js env.js`
6. Put the right environment variables into the `env.js` file
7. Go back to the app directory
8. Run `npm start`