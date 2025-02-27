import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import App from './App.jsx'
// import './index.css'
import { GlobalProvider } from "./common/GlobalState"; 
const {VITE_ApiGatewayURL, VITE_UserPoolId, VITE_ClientId} = import.meta.env;

Amplify.configure({
  API: {
    REST: {
      baseURI: {
        endpoint: 'https://90d1l1xoy8.execute-api.us-west-2.amazonaws.com/Prod/',
      }
    }
  },
  Auth: {
    Cognito: {
      
        userPoolId: "us-west-2_uhHQKGzmX",
          userPoolClientId: "n8r4hdvraltltsgp89g83arvd",
          region:"us-west-2"
    }
  }
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
  <Authenticator hideSignUp={true}>
  {({ signOut, user }) => (
  <App />
  )}
  </Authenticator></GlobalProvider>
</React.StrictMode>,
)
