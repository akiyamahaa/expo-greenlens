import Toast from "react-native-toast-message";
import { googleAuth } from './auth-actions';

let GoogleSignin: any;
let statusCodes: any;
let isErrorWithCode: any;

try {
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  statusCodes = googleSignInModule.statusCodes;
  isErrorWithCode = googleSignInModule.isErrorWithCode;
} catch (error) {
  console.warn('Google Sign In module not available - this is expected in Expo Go');
}

// Configure Google Sign In for Expo (called during app initialization)
export const configureGoogleSignIn = () => {
  if (!GoogleSignin) {
    return;
  }

  const config = {
    // This is NOT the Android/iOS client ID, but the WEB client ID
    webClientId: process.env.EXPO_PUBLIC_KEY_GOOGLE_WEB ?? '263543007402-k8u0nn7ujellds9ib2tng8j9r0dcdjoe.apps.googleusercontent.com',
    // iOS Client ID - cần để hoạt động trên iOS
    iosClientId: process.env.EXPO_PUBLIC_KEY_GOOGLE_IOS ?? '263543007402-7h1jbskud17d6fnlnr7ml440nrlkg83f.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  };

  try {
    GoogleSignin.configure(config);
  } catch (error) {
    // Silent fail
  }
};

export const handleGoogleSignIn = async () => {
  if (!GoogleSignin) {
    Toast.show({
      type: 'error',
      text1: 'Google Sign In không khả dụng',
      text2: 'Cần build native để sử dụng Google Sign In'
    });
    return;
  }

  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    console.log(userInfo, "sadasdas")
    
    if (userInfo.data?.idToken) {
      try {
        await googleAuth({ access_token: userInfo.data.idToken });
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập Google thành công 👋',
        });
      } catch (error) {
        console.log(error, "error")
      }
    } else {
      throw new Error('Không thể lấy Google ID token');
    }
  } catch (error) {
    if (isErrorWithCode && isErrorWithCode(error) && statusCodes) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Toast.show({
            type: 'info',
            text1: 'Đã hủy đăng nhập',
            text2: 'Bạn đã hủy quá trình đăng nhập Google'
          });
          break;
        case statusCodes.IN_PROGRESS:
          Toast.show({
            type: 'info',
            text1: 'Đang xử lý',
            text2: 'Quá trình đăng nhập đang diễn ra'
          });
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Google Play Services không khả dụng'
          });
          break;
        default:
          Toast.show({
            type: 'error',
            text1: 'Đăng nhập Google thất bại',
            text2: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
          });
          break;
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập Google thất bại',
        text2: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      });
    }
  }
};
