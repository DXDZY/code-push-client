/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import codePush from 'react-native-code-push';
import config from './config';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
class App extends Component<Props> {
  checkUpdate=()=>{
    codePush.checkForUpdate(config.deploymentKey).then((update)=>{
      if(!update||update.failedInstall){
        Alert.alert("提示","已是最新版本",[
          {
            text:'ok',
            onPress:()=>{
              console.log('click');
            }
          }
        ]);
      }else{
        codePush.sync(
          {
            deploymentKey: config.deploymentKey,
            updateDialog: {
              optionalIgnoreButtonLabel: '稍后',
              optionalInstallButtonLabel: '立即更新',
              optionalUpdateMessage: '有新版本了，是否更新？',
              title: '更新提示'
            },
            installMode: codePush.InstallMode.IMMEDIATE,
          },
          (status)=>{
            // Alert.alert(`${status}`)
            switch (status) {
              case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                // console.log("DOWNLOADING_PACKAGE");
                // Alert.alert('DOWNLOADING_PACKAGE')
                break;
              case codePush.SyncStatus.INSTALLING_UPDATE:
                // console.log(" INSTALLING_UPDATE");
                // Alert.alert('INSTALLING_UPDATE')
                break;
              case codePush.SyncStatus.UP_TO_DATE:
                // Alert.alert('UP_TO_DATE')
                break;
              case codePush.SyncStatus.UPDATE_INSTALLED:
                // Alert.alert('UPDATE_INSTALLED')
                break;
              case codePush.SyncStatus.UPDATE_IGNORED:
                // Alert.alert('UPDATE_IGNORED')
                break;
              case codePush.SyncStatus.UNKNOWN_ERROR:
                Alert.alert('UNKNOWN_ERROR')
                break;
              case codePush.SyncStatus.SYNC_IN_PROGRESS:
                // Alert.alert('SYNC_IN_PROGRESS')
                break;
              case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                // Alert.alert('CHECKING_FOR_UPDATE')
                break;
              case codePush.SyncStatus.AWAITING_USER_ACTION:
                // Alert.alert('AWAITING_USER_ACTION')
                break;
              case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                // Alert.alert('DOWNLOADING_PACKAGE')
                break;
              case codePush.SyncStatus.INSTALLING_UPDATE:
                // Alert.alert('INSTALLING_UPDATE')
                break;
            }
          },
          (progress) => {
            // console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
          }
        )
      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          2
        </Text>
        <Button 
          title="检查更新"
          onPress={this.checkUpdate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 100,
    // textAlign: 'center',
    // margin: 10,
    // color:'black'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUMEi,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: false
};

App = codePush(codePushOptions)(App); // eslint-disable-line
export default App;

