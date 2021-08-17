# Amplify-Flix

[한국어](README_ko.md)

![AmplifyLoveDogs](Amplify_Love_Dogs.png)

본 워크샾에서는, [Amplify](https://docs.amplify.aws/), [Next.js](https://nextjs.org/), [GraphQL](https://graphql.org/) 을 이용하여 AWS 위에 full-stack serverless application 을 만들어 보려합니다

Netflix, Watcha 와 같은 어플리케이션을 만들어보려 합니다.
추천 영화들을 보여주고, 영화를 선택하면, 상세정보를 볼수 있게 됩니다.
추가적으로 어드민인 경우, 영화 영상을 업로드 할수 있게 되고, 업로드 된 영상은 로그인 된 사용자들이 다운로드 할수 있게 됩니다.

그리고 사용자의 액션은 AWS Kinesis DataStream 으로 보내지게 됩니다. Kinesis DataStream 으로 들어온 데이터는 추후에 Anlaytics 나 AI/ML (예 : 추천) 을 위한 작업에 사용될수 있습니다.

## Overview

Create Next App 을 이용하여 새로운 어플리케이션을 생성합니다.

Amplify CLI 를 이용하여 AWS Cloud 환경을 셋업하고, Amplify Library 를 이용하여 어플리케이션을 백엔드와 연결합니다.

본 가이드는 1~2 시간정도 소요됩니다.

This project will be a fully-serverless application with following architecture.

[Demo](https://dev.d2lf8ywg8xsqzo.amplifyapp.com)

### Required Background / Level

본 워크샾은 data-driven full stack serverless 어플리케이션에 대해 알고 싶은 front-end 와 back-end 개발자들을 위해 만들어졌습니다.

React 에대한 지식이 있다면 도움이 되지만, 필수는 아닙니다.

### Topics we will cover

- Next.js application
- Web application Hosting
- Authentication
- Data Inestion into Kinesis DataStream
- Deleting the resources

### Features we will implement

1. Application hosting
2. Authentication : Sign Up, Login, Signout
3. Sending data to Kinesis DataStream
4. Application UI

### Development Environment

시작하기전에, 아래 패키지들을 설치해주세요.

- Node.js v10.x or later
- npm v5.x or later
- git v2.14.1 or later

터미널에서 [Bash shell](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) 상에서 Amplify CLI 를 실행해서 infra를 생성하고, Next.js application 을 로컬에서 띄우고 브라우져 상에서 테스트 하려 합니다.

### AWS Account

If you don't have an AWS account and would like to create and activate an AWS account, please refer to the following
[link](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

### Create a Next.js application

[Create Next App](https://nextjs.org/docs/api-reference/create-next-app) 을 이용하여 새로운 프로젝트를 생성해봅시다.

```sh
$ npx create-next-app amplify-love-dogs
```

생성된 디렉토리로 이동해서, aws-amplify 연관 패키지들을 설치해봅시다.

```sh
$ cd amplify-love-dogs
$ yarn add aws-amplify @aws-amplify/ui-react lodash
```

### Styling with TailwindCSS

본 앱에서는 TailwindCSS 를 이용하여 스타일링을 해보려 합니다.

Tailwind CSS 관련 패키지를 설치합시다. devDependencies 에만 들어가도록 설치합니다.

```sh
$ yarn add --dev tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/forms
```

Tailwind 관련 설정 파일들 (`tailwind.config.js` `postcss.config.js`) 생성을 위해 다음 명령어를 실행합니다.

```sh
$ npx tailwindcss init -p
```

`tailwind.config.js` 의 내용을 다음과 같이 변경합니다. (production builds 에서 사용되지 않는 스타일링을 tree-shake 하기 위해서입니다.)

```diff
// tailwind.config.js
module.exports = {
-  purge: [],
+  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
-  plugins: [],
+. plugins: [require('@tailwindcss/forms')],
}
```

Tailwind 의 base, component, utilties 스타일이 사용되도록 next.js 에서 생성된 `./styles/globals.css` 파일을 다음과 같이 변경합니다.

```
/* ./styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> TailwindCSS 설치에 대한 자세한 내용은, 다음 링크를 확인하세요. [here](https://tailwindcss.com/docs/guides/nextjs)

### / root page

기본으로 생성된 **pages/index.js** 를 변경합니다.

```js
/* pages/index.js */
import Head from "next/head";

function Home() {
  return (
    <div>
      <Head>
        <title>Amplify Love Dogs</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐕</text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Amplify Love Dogs
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to Amplify Love Dogs
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
```

문제없이 로딩이 되는지, `yarn dev` 명령어로 로컬에서 서버를 띄우고, 브라우져에서 확인해봅니다.

```sh
$ yarn dev
```

### Intializing a git repostory

본 프로젝트를 위한 git repository를 하나 만들어주세요. (https://github.com/new)
repository 생성을 하였으면, 로컬에서 git 을 초기화 하고, 생성된 repository 의 url 을 추가해주세요.

```sh
$ git init
$ git remote add origin git@github.com:username/project-name.git
$ git add .
$ git commit -m 'initial commit'
$ git push origin main
```

## Install Amplify CLI & Initialize Amplify Project

### Install Amplify CLI

Amplify CLI 를 설치해봅시다.

```sh
$ npm install -g @aws-amplify/cli
```

다음은 CLI 에서 AWS credential 을 사용하도록 설정해봅시다.

> 이 과정에 대한 자세한 설명을 보고 싶으면, 비디오를 확인하세요. [here](https://www.youtube.com/watch?v=fWbM5DLh25U)

```sh
$ amplify configure

- Specify the AWS Region: ap-northeast-2
- Specify the username of the new IAM user: amplify-cli-user
> In the AWS Console, click Next: Permissions, Next: Tags, Next: Review, & Create User to create the new IAM user. Then return to the command line & press Enter.
- Enter the access key of the newly created user:
? accessKeyId: (<YOUR_ACCESS_KEY_ID>)
? secretAccessKey: (<YOUR_SECRET_ACCESS_KEY>)
- Profile Name: amplify-cli-user
```

### Initialzing Amplify Project

amplify 프로젝트를 초기화 해봅시다.

```sh
$ amplify init

- Enter a name for the project: amplifyforum
- Enter a name for the environment: dev
- Choose your default editor: Visual Studio Code (or your default editor)
- Please choose the type of app that youre building: javascript
- What javascript framework are you using: react
- Source Directory Path: src
- Distribution Directory Path: out
- Build Command: npm run-script build
- Start Command: npm run-script start
- Do you want to use an AWS profile? Y
- Please choose the profile you want to use: amplify-cli-user
```

> **Distribution Directory Path 는 꼭 `out` 으로 변경해주세요.** (next.js 에서 build 후 export 를 하면 out 디렉토리로 결과물이 들어갑니다.)

> `amplify init` 초기화가 끝나면, **amplify** 폴더가 생성되고 **src** 폴더아래 `aws-exports.js` 파일이 생성됩니다.

> **src/aws-exports.js** 는 amplify 의 설정값들이 들어있습니다.

> **amplify/team-provider-info.json** 파일에는 amplify 프로젝트의 back-end 환경(env) 관련 변수들이 들어가 있습니다. 다른 사람들과 동일한 백엔드 환경을 공유하고 싶다면, 이 파일을 공유하면 됩니다. 만약에 프로젝트를 공개하고 싶은 경우라면 이 파일은 빼주는게 좋습니다. (.gitignore 에 추가) [관련문서](https://docs.amplify.aws/cli/teams/shared)

amplify 프로젝트의 상태를 보고 싶다면 `amplify status` 명령어로 확인하실수 있습니다.

```sh
$ amplify status
```

amplify 프로젝트 상태를 Amplify console 로 확인하고 싶다면, `amplify console` 명령어로 확인할수 있습니다.

```sh
$ amplify console
```

### Configuring the Next applicaion with Amplify

Amplify 프로젝트가 생성되고 준비되었으니, app 을 통해 테스트 해봅시다.

우선 해야할일은, 우리가 만들고 있는 app 에서 Amplify project 에 대해 인식하도록 설정하는 것입니다. src 폴더 안에 자동생성된 `aws-exports.js` 파일을 참조하도록 추가해봅시다.

설정을 하기위해 **pages/\_app.js** 파일을 열고, 다음 코드를 추가합니다.

```diff
  import '../styles/globals.css'
+ import Amplify from "aws-amplify";
+ import config from "../src/aws-exports";
+ Amplify.configure(config);

  function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
  }

  export default MyApp
```

위 코드가 추가되면, app 에서 Amplify 를 통해 셋업된 AWS service 를 이용할 준비가 됩니다.

## Hosting

Amplify Console 은 배포와 CI 를 위한 hosting 서비스 입니다.

우선 build 스크립트 변경을 위해 **package.json** 안의 내용중 `scripts` 부분을 다음과 같이 변경해주세요.

```diff
"scripts": {
  "dev": "next dev",
-  "build": "next build",
+  "build": "next build && next export",
  "start": "next start"
},
```

> `next export` 는 next.js app 을 static HTML 파일로 변환해줍니다. 따라서 Node 서버가 필요 없이 app 을 로딩할수 있습니다.

> Amplify hosting 에서는 2021년 4월 현재 static file 만 서빙 가능합니다. 하지만 곧 server-side rendering 을 지원할 예정입니다.

Hosting 을 추가하기 위해, 다음 명령어를 실행합니다.

```sh
$ amplify add hosting

? Select the plugin module to execute: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type: Manual deployment
```

`amplify push` 명령어로 변경사항 (`add hosting`) 을 적용해봅니다.

```sh
$ amplify push
```

`amplify publish` 명령어로 hosting 으로 배포를 해봅니다.

```sh
$ amplify publish
```

배포가 완료되면, 브라우져에서 터미널에 출력된 url 로 들어가보셔서 next.js 앱이 정상적으로 로딩되는 것을 확인해주세요.

## Adding Authentication

다음과정은, authentication을 추가를 해보겠습니다.

authentication 추가를 위해, `ampfliy add auth` 명령어를 실행합니다.

```sh
$ amplify add auth

? Do you want to use default authentication and security configuration? Default configuration
? How do you want users to be able to sign in when using your Cognito User Pool? Username
? Do you want to configure advanced settings? No, I am done.
```

변경사항 적용을 위해 `amplify push` 명령어를 실행합니다.

```sh
$ amplify push

? Are you sure you want to continue? Yes
```

### withAuthenticator

인증/로그인된 사용자들만 접근할수 있는 페이지에 `withAuthenticator` HOC (Higher Order Component) 를 적용하면 됩니다.

예를들어, **/pages/index.js** 페이지에 withAuthenticator 를 적용하면, 사용자는 반드시 로그인을 해야합니다. 로그인이 되어있지 않다면, 로그인 페이지로 이동하게 됩니다.

테스트를 위해 **/pages/index.js** 를 변경해봅시다.

```diff
/* pages/index.js */
import Head from "next/head";
+ import { withAuthenticator } from "@aws-amplify/ui-react";

- export default Home;
+ export default withAuthenticator(Home);
```

> Authenticator UI Component 관련 문서 [here](https://docs.amplify.aws/ui/auth/authenticator/q/framework/react)

코드를 변경했으면 브라우져에서 테스트 해봅시다.

```sh
yarn dev
```

로그인 프롬프트가 뜨는 것으로, Authentication 플로우가 app 에 추가된것을 확인할 수 있습니다.

일단, sign up 계정생성을 해봅시다.

계정 생성을 하면 입력한 이메일로 confirmation code 가 전송됩니다.

이메일로 받은 confirmation code 를 입력해서 계정 생성을 마무리 합니다.

auth console 로 들어가면 생성된 사용자를 확인할수 있습니다.

```sh
$ amplify console auth

> Choose User Pool
```

### Signout

Signout 기능을 Signout UI Compnonent 를 이용해 추가해봅시다.

`AmplifySignout` compoent 를 페이지 어딘가에 넣어주세요.

```js
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

/* UI 어딘가에 넣어주세요. */
<AmplifySignOut />;
```

> Sign Out UI Component 문서 [here](https://docs.amplify.aws/ui/auth/sign-out/q/framework/react)

SignOut 버튼을 눌러서 로그아웃이 잘 되는지도 확인해보세요.

### Accessing User Data

로그인 상태에서 `Auth.currentAuthenticatedUser()` 로 사용자 정보를 가져올수 있습니다.

사용자 정보 확인을 위해 **pages/index.js** 파일을 변경해봅시다.

```diff
+ import { useEffect } from "react";
+ import { Auth } from "aws-amplify";

function Home() {
+ useEffect(() => {
+ checkUser(); // new function call
+ }, []);
+
+ async function checkUser() {
+   const user = await Auth.currentAuthenticatedUser();
+   console.log("user: ", user);
+   console.log("user attributes: ", user.attributes);
+ }

  /* 이전과 동일 */
}



```

브라우져 콘솔을 열고 / 페이지를 로딩하면, 콘솔에 로그인된 사용자 정보들과 attributes 들이 출력되는걸 확인할수 있습니다.

## Prepare data to show in UI

UI 에 보여질 데이터가 저장될 파일들을 생성해봅시다. (1) 강아지들 목록 (2) 강아지들 사진들.

### Breed list

Create a file in **src/breeds.js** and fill with following

```javascript
const BREEDS = {
  affenpinscher: [],
  african: [],
  airedale: [],
  akita: [],
  appenzeller: [],
  australian: ["shepherd"],
  basenji: [],
  beagle: [],
  bluetick: [],
  borzoi: [],
  bouvier: [],
  boxer: [],
  brabancon: [],
  briard: [],
  buhund: ["norwegian"],
  bulldog: ["boston", "english", "french"],
  bullterrier: ["staffordshire"],
  cairn: [],
  cattledog: ["australian"],
  chihuahua: [],
  chow: [],
  clumber: [],
  cockapoo: [],
  collie: ["border"],
  coonhound: [],
  corgi: ["cardigan"],
  cotondetulear: [],
  dachshund: [],
  dalmatian: [],
  dane: ["great"],
  deerhound: ["scottish"],
  dhole: [],
  dingo: [],
  doberman: [],
  elkhound: ["norwegian"],
  entlebucher: [],
  eskimo: [],
  finnish: ["lapphund"],
  frise: ["bichon"],
  germanshepherd: [],
  greyhound: ["italian"],
  groenendael: [],
  havanese: [],
  hound: ["afghan", "basset", "blood", "english", "ibizan", "plott", "walker"],
  husky: [],
  keeshond: [],
  kelpie: [],
  komondor: [],
  kuvasz: [],
  labradoodle: [],
  labrador: [],
  leonberg: [],
  lhasa: [],
  malamute: [],
  malinois: [],
  maltese: [],
  mastiff: ["bull", "english", "tibetan"],
  mexicanhairless: [],
  mix: [],
  mountain: ["bernese", "swiss"],
  newfoundland: [],
  otterhound: [],
  ovcharka: ["caucasian"],
  papillon: [],
  pekinese: [],
  pembroke: [],
  pinscher: ["miniature"],
  pitbull: [],
  pointer: ["german", "germanlonghair"],
  pomeranian: [],
  poodle: ["miniature", "standard", "toy"],
  pug: [],
  puggle: [],
  pyrenees: [],
  redbone: [],
  retriever: ["chesapeake", "curly", "flatcoated", "golden"],
  ridgeback: ["rhodesian"],
  rottweiler: [],
  saluki: [],
  samoyed: [],
  schipperke: [],
  schnauzer: ["giant", "miniature"],
  setter: ["english", "gordon", "irish"],
  sheepdog: ["english", "shetland"],
  shiba: [],
  shihtzu: [],
  spaniel: [
    "blenheim",
    "brittany",
    "cocker",
    "irish",
    "japanese",
    "sussex",
    "welsh",
  ],
  springer: ["english"],
  stbernard: [],
  terrier: [
    "american",
    "australian",
    "bedlington",
    "border",
    "dandie",
    "fox",
    "irish",
    "kerryblue",
    "lakeland",
    "norfolk",
    "norwich",
    "patterdale",
    "russell",
    "scottish",
    "sealyham",
    "silky",
    "tibetan",
    "toy",
    "westhighland",
    "wheaten",
    "yorkshire",
  ],
  vizsla: [],
  waterdog: ["spanish"],
  weimaraner: [],
  whippet: [],
  wolfhound: ["irish"],
};

export default BREEDS;
```

### Images for breeds

[this file](breed-image-url.json) 파일을 다운로드해서 **breed-image-url.json** 로 저장해주세요.

## Implementing UI

UI 구현에 필요한 패키지를 설치합니다. devDependencies 로 들어가도록 설치합니다.

```sh
$ yarn add --dev @headlessui/react @heroicons/react
```

**pages/index.js** 를 다음과 같이 변경합니다.

```javascript
import Head from "next/head";
import { useEffect, useState } from "react";
import _ from "lodash";
import BREEDS from "../src/breeds";
import fs from "fs";
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { Analytics } from "aws-amplify";

async function fetchBreeds() {
  return [...Object.keys(BREEDS)];
}

async function fetchBreedImageUrls(mainBreed) {
  const data = fs.readFileSync("breed-image-url.json");
  const imageUrls = JSON.parse(data);
  return imageUrls;
}

export async function getStaticProps(context) {
  const breeds = await fetchBreeds();
  const breedImageUrls = await fetchBreedImageUrls();

  return {
    props: { initialBreeds: breeds, initialBreedsUrls: breedImageUrls },
  };
}

function DogCard({ imageUrl, onNext, onPrev, onLike }) {
  return (
    <>
      <div className="max-w-screen-lg mx-auto h-80">
        <img
          src={imageUrl}
          alt=""
          className="object-cover h-full mx-auto pointer-events-none group-hover:opacity-75"
        />
      </div>
      <div className="mt-4">
        <span className="relative z-0 inline-flex rounded-md shadow-sm">
          <button
            onClick={onPrev}
            type="button"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={onLike}
            type="button"
            className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <HeartIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={onNext}
            type="button"
            className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </span>
      </div>
    </>
  );
}

function Home({ initialBreeds, initialBreedsUrls }) {
  const [breeds, setBreeds] = useState(initialBreeds);
  const [breedsUrls, setBreedsUrls] = useState(initialBreedsUrls);
  const [randomBreed, setRandomBreed] = useState();
  const [randomBreedUrl, setRandomBreedUrl] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    console.log("breeds = ", breeds);
    checkUser();
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user);
    console.log("user attributes: ", user.attributes);
    setCurrentUser(user);
  }

  useEffect(() => {
    setRandomBreed(_.sample(breeds));
  }, [breeds]);

  useEffect(() => {
    console.log("breed = ", randomBreed);
    const urls = breedsUrls[randomBreed];
    setRandomBreedUrl(_.sample(urls));
  }, [randomBreed]);

  const handleLike = () => {
    setRandomBreed(_.sample(breeds));
  };

  const handlePrev = () => {
    setRandomBreed(_.sample(breeds));
  };

  const handleNext = () => {
    setRandomBreed(_.sample(breeds));
  };

  return (
    <div>
      <Head>
        <title>Amplify Love Dogs</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐕</text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Amplify Love Dogs
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to Amplify Love Dogs
              </p>
              <div className="mt-4">
                {randomBreed && randomBreedUrl && (
                  <DogCard
                    breed={randomBreed}
                    imageUrl={randomBreedUrl}
                    onLike={handleLike}
                    onPrev={handlePrev}
                    onNext={handleNext}
                  />
                )}
              </div>
            </div>
            <div className="mt-6">
              <AmplifySignOut />
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default withAuthenticator(Home);
```

## Sending data from application

Let's create data endpoint where application will send data to. In this guide, we will set up a Kinesis DataStream.

### Set up Kinesis DataStream

Let's create a Kinesis DataStream endpoint with Amplify cli

```sh
$ amplify add analytics

? Select an Analytics provider : Amazon Kinesis Streams
? Enter a Stream name : amplifylovedogsKinesis
? Enter number of shards : 1
? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started) : Yes

```

To apply the change we just made, run `amplify push --y`

```sh
$ amplify push --y
```

### Configure application for Kinesis DataStream

Update **\_app.js** file.

```diff
import config from "../src/aws-exports";
+ import { Analytics, AWSKinesisProvider } from "aws-amplify";

Amplify.configure(config);
+ Analytics.addPluggable(new AWSKinesisProvider());
+ Analytics.configure({
+   AWSKinesis: {
+     region: config.aws_project_region,
+  },
+ });

```

### Send events to Kinesis

Let's update **pages/index.js** to send user events to Kinesis

```diff
import { Auth } from "aws-amplify";
+ import { Analytics } from "aws-amplify";

/* same as before */

function Home({ initialBreeds, initialBreedsUrls }) {
  /* same as before */
  const handleLike = () => {
+    recordUserActivity("like");
    setRandomBreed(_.sample(breeds));
  };

  const handlePrev = () => {
+    recordUserActivity("prev");
    setRandomBreed(_.sample(breeds));
  };

  const handleNext = () => {
+    recordUserActivity("next");
    setRandomBreed(_.sample(breeds));
  };

+  const recordUserActivity = (action) => {
+    const userActivity = {
+      username: currentUser.username,
+      action,
+      breed: randomBreed,
+    };
+    console.log(userActivity);
+    Analytics.record(
+      {
+        data: { userActivity },
+        streamName: "amplifylovedogsKinesis-dev" // TODO: Set to Kinesis Stream Name, and it has to include environment name too, e.g.: 'traveldealsKinesis-dev'
+      },
+      "AWSKinesis"
+    );
+  };
}
```

### Test events

In the browser, do some action. (e.g. like a dog) and see if events get sent to the Kinesis without any issues.

![AmplifyLoveDogsLiked](Amplify_Love_Dogs_Liked.png)

### Review Kinesis DataStream

Let's open up [Kinesis Console](https://console.aws.amazon.com/kinesis/) and see if data has been recieved.

Click on `Data Streams` and select the stream that we created (e.g. `amplifylovedogsKinesis-dev`)

![KinesisStreamManagementConsole](Amazon_Kinesis_Streams_Management_Console.png)

Check `Monitoring` tab to see if there are any changes in Incoming data and put records

![KinesisStreamManagementConsole02](Amazon_Kinesis_Streams_Management_Console_02.png)

## Additional Tests + TODO's

## Removing resources

If you want to remove one of the services you added with Amplify CLI, you can run `amplify remove`

For example, `amplify remove auth` will remove authentication feature.

```sh
$ amplify remove auth

$ amplify push
```

If you are not sure about which services you have enabled, you can check with `amplify status`

```sh
$ amplify status
```

### Deleting the Amplify project and all services

If you want to delete Amplify project completely, run `amplify delete`

```sh
$ amplify delete
```

