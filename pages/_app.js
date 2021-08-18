import "../styles/globals.css";
import Amplify from "aws-amplify";
import config from "../src/aws-exports";
Amplify.configure(config);

import AWS from "aws-sdk";
AWS.config.region = "ap-northeast-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-northeast-2:7d750501-0993-4a45-9422-a541e214672e",
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
