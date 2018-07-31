
import {
  Platform
} from 'react-native';
const isDev=true;
let deploymentKey = '';
if(isDev){
  deploymentKey = Platform.OS === 'ios'?'GTLSvDtcYqkGhLweJ9allwTa0zQB4ksvOXqog':'kw8iMmcSgtY3lpnW0yzQ0a1THK0Y4ksvOXqog';
}else{
  deploymentKey = Platform.OS === 'ios'?'xHyO39jpKtdBj2p6kuyz4w8Mv0lG4ksvOXqog':'sKhqyi4Tc4ZxlGHhhZrrr29b0JoH4ksvOXqog';
}
const config = {
  deploymentKey,
}
export default config;