# 热更新客户端配置
* 前期准备
* 配置Android
* 配置IOS
* 配置RN
* 发布命令
---
##前期准备
1. 项目中安装`react-native-code-push`
```
npm install --save react-native-code-push@latest
react-native link react-native-code-push
```
link时会提示：
>`What is your CodePush deployment key for Android (hit <ENTER> to ignore)`
>`What is your CodePush deployment key for iOS (hit <ENTER> to ignore)`

一直`Enter`即可，后边会配置。
2. 安装`code-push-cli`
```
npm install -g code-push-cli
```
3. 登陆`code-push`
```
code-push login http://127.0.0.1:3000
```
4. 注册应用
* ios
```
code-push add app test02-ios ios react-native
```
Name|Deployment Key
--|--
Production|xHyO39jpKtdBj2p6kuyz4w8Mv0lG4ksvOXqog
Staging|GTLSvDtcYqkGhLweJ9allwTa0zQB4ksvOXqog
* android
```
code-push add app test02-android android react-native
```
Name|Deployment Key
--|--
Production|sKhqyi4Tc4ZxlGHhhZrrr29b0JoH4ksvOXqog
Staging|kw8iMmcSgtY3lpnW0yzQ0a1THK0Y4ksvOXqog
`Production`对应生产包，其中`Staging`对应测试包。
5. 查看是否添加成功
```
code-push app ls
```
Name|Deployments
--|--
test02-ios|Production, Staging
test02-android|Production, Staging
6. 查看key
```
code-push deployment ls test02-ios -k
```
Name|Deployment Key|Update Metadata|Install Metrics
--|--|--|--
Production|eSJ9SxnaI5lYHkj6I9o90Z317AeL4ksvOXqog|No updates released|No installs reco
Staging|r4SNF3BL4vkgP4UK2gMWx7Iibh4S4ksvOXqog|No updates released|No installs reco
7. 查看其他命令
>code-push --h
---
#配置Android
1. 修改android-buildTypes节点，在`android/app/build.gradle`
```
buildTypes {
    debug {
        //这行没有的话本地运行会报错，提示[CODEPUSH_KEY]不存在，因为默认[react-native run-android]运行的是debug版本
        buildConfigField "String", "CODEPUSH_KEY", '""'
    }
    releaseStaging {
        ...
        buildConfigField "String", "CODEPUSH_KEY", '"JhGbiijRJf4miIUqBSPib1qux7G34ksvOXqog"'
    }
    release {
        ...
        buildConfigField "String", "CODEPUSH_KEY", '"HwMz0dkX2EOiybqt02JvajcT1FA64ksvOXqog"'
    }
}
```
2. 修改`getPackages()`方法，在`android/app/src/main/java/com/codepushclient(项目名)/MainApplication.java`
```
//最后一个参数为codepush服务器地址
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
      ...
      new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG, "http://127.0.0.1:3000")
  );
}
```
3. 修改`VersionName `，在`android/app/build.gradle`，android-defaultConfig节点，将版本号改成三位
```
defaultConfig {
    ...
    versionName "1.0.0"
    ...
}
```
在模拟器上安装对应版本包
>下边的命令除了第一个（默认debug安装），剩余两个都需要对安卓文件进行配置才可以，具体配置方法可以参考我的这篇文章[安卓打包APK](https://www.jianshu.com/p/3b9f5d50f293)
* `cd android && ./gradlew installDebug`debug版
* `cd android && ./gradlew installReleaseStaging`测试版
* `cd android && ./gradlew installRelease`正式版
安装不同版本时，如果提示错误`com.codepushclient signatures do not match the previously installed version`，将模拟器app卸载后再安装
* `cd android && ./gradlew assembleRelease`打包
---
#配置IOS
1. xcode打开项目Project中选中项目->选择Info标签->选择`Configurations `节点下的`+`，选择`选择Duplicate "Release" Configaration`输入`Staging`
![Info](https://upload-images.jianshu.io/upload_images/7999439-23e962b89bbf8e5c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 选择`BuildSettings`标签->点击`+`选择`Add User-Defined Setting`->输入`CODEPUSH_KEY (可随意)`->填写`deployment key`
![Build Settings](https://upload-images.jianshu.io/upload_images/7999439-a9f8f4c3c7e1c6f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. 修改`Info.plist`文件
* 在`CodePushDeploymentKey`中输入`$(CODEPUSH_KEY)`
* 修改`Bundle versions`版本号为三位
* 配置`CodePushServerURL`输入热更新服务器地址
![Info.plist](https://upload-images.jianshu.io/upload_images/7999439-01b26d274162c4ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. 如果服务器是`http`，需要设置`Allow Arbitary Loads`为`YES`
![image.png](https://upload-images.jianshu.io/upload_images/7999439-27d295bedac1f49c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---
#配置RN
```
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
  componentDidMount() {
    codePush.notifyAppReady()
  }
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
            switch (status) {
              case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("DOWNLOADING_PACKAGE");
                // Alert.alert('DOWNLOADING_PACKAGE')
                break;
              case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log(" INSTALLING_UPDATE");
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
                // Alert.alert('UNKNOWN_ERROR')
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
            console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
          }
        )
      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          12
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
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
export default App;
```
```
//config.js
import {
  Platform
} from 'react-native';
const isDev=true;
let deploymentKey = '';
if(isDev){
  deploymentKey = Platform.OS === 'ios'?'r4SNF3BL4vkgP4UK2gMWx7Iibh4S4ksvOXqog':'JhGbiijRJf4miIUqBSPib1qux7G34ksvOXqog';
}else{
  deploymentKey = Platform.OS === 'ios'?'eSJ9SxnaI5lYHkj6I9o90Z317AeL4ksvOXqog':'HwMz0dkX2EOiybqt02JvajcT1FA64ksvOXqog';
}
const config = {
  deploymentKey,
}
export default config;
```
---
#发布命令
1. 更新测试包（默认更新的是`Staging`环境）
```
//更新ios
code-push release-react test02-ios ios
//更新android
code-push release-react test02-android android
```
2. 更新正式包
```
//更新ios
code-push release-react test02-ios ios -d Production
//更新android
code-push release-react test02-android android -d Production
```
---
#codePush配置
```
codePush.sync({
  updateDialog: {
    optionalIgnoreButtonLabel: '稍后',
    optionalInstallButtonLabel: '立即更新',
    optionalUpdateMessage: '有新版本了，是否更新？',
    title: '更新提示'
  },
  installMode: codePush.InstallMode.IMMEDIATE,
})
```
* codePush.InstallMode.IMMEDIATE（表示安装完成立即重启更新）
* codePush.InstallMode.ON_NEXT_RESTART（表示安装完成后会在下次重启后进行更新）
* codePush.InstallMode.ON_NEXT_RESUME（表示安装完成后会在应用进入后台后重启更新）
