import * as React from 'react';
import { StatusBar } from 'expo-status-bar';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
//ios : 120287574723-s5dm72h3dms3atu7492u3r93jea07slo.apps.googleusercontent.com
//web :120287574723-ml5jc41kmqqeh273sgk4399pv5nbspd6.apps.googleusercontent.com
//android :120287574723-b9vftrbno8egkam7oe6m82bpbrk95ae5.apps.googleusercontent.com
//fingerprint android - 55:62:01:AA:95:F9:FA:A0:67:8B:BC:22:99:FE:D2:89:C6:8E:FF:72

WebBrowser.maybeCompleteAuthSession();


export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "120287574723-ml5jc41kmqqeh273sgk4399pv5nbspd6.apps.googleusercontent.com",
    iosClientId: "120287574723-s5dm72h3dms3atu7492u3r93jea07slo.apps.googleusercontent.com",
    androidClientId: '120287574723-b9vftrbno8egkam7oe6m82bpbrk95ae5.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log('SUCCESS',response.authentication.accessToken );
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo()
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
   try {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userInfor = await response.json();
    console.log(userInfor);
    setUser(userInfor);
   } catch (error) {
    console.log(error);
   }
  }

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Hoooray</Text>
          <Image source={{ uri: user.picture }}></Image>
          <Text>{user.name}</Text>
        </View>

      );
    }
  }

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null &&
        <>
          <TouchableOpacity onPress={() => {
            promptAsync();
          }}>
            <Text>{'Sign Google Account'}</Text>
          </TouchableOpacity>
        </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
