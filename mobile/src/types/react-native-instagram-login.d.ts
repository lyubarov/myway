declare module 'react-native-instagram-login' {
  import { Component } from 'react';
  
  interface InstagramLoginProps {
    ref: any;
    appId: string;
    appSecret: string;
    redirectUrl: string;
    scopes: string[];
    onLoginSuccess: (token: any) => void;
    onLoginFailure: (data: any) => void;
  }

  export default class InstagramLogin extends Component<InstagramLoginProps> {
    show: () => void;
  }
} 