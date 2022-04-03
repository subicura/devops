---
description: Node.js 웹 애플리케이션에 정적분석, 포멧터, 테스트 코드 적용하기
image: /imgs/share.png
---

# Node.js 웹 애플리케이션

::: tip ⚡️ 목표
✅ [Node.js](https://nodejs.org/)와 [Fastify](https://www.fastify.io/)를 이용하여 웹 애플리케이션을 만듭니다.  
✅ [ESLint](https://eslint.org/)와 [Prettier](https://prettier.io/)를 이용하여 정적 코드 분석과 포멧팅을 적용합니다.  
✅ [Jest](https://jestjs.io/)를 이용하여 테스트 코드를 작성합니다.
:::

[[toc]]

## 웹 애플리케이션

`Awesome API`는 `Fastify` 웹 프레임워크를 이용하여 개발 중입니다. 아직 초창기라 많은 코드를 작성하진 못했지만 `/`에 접속하면, 완벽하게 `{ "hello": "world" }`를 출력합니다.

<<< @/public/code/src/app.js
<code-link link="src/app.js"/>

<<< @/public/code/src/server.js
<code-link link="src/server.js"/>

군더더기 없는 완벽한 코드입니다!

<Chat-KakaoRoom>
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="안녕하세요. 보내주신 코드를 봤는데.." isMe="false" />
  <Chat-KakaoMsg msg="네네 어떠신가요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="정적 코드 분석 도구를 추가하면 좋을 것 같습니다" isMe="false" />
  <Chat-KakaoMsg msg="앗 정적..코드 분석이 뭔가요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="정적 코드 분석은 소스 코드를 분석해서 애플리케이션을 실행하기 전에 문제점을 찾아주는 기능이에요" isMe="false" />
  <Chat-KakaoMsg msg="오타라던가 사용하지 않는 변수 등을 체크해서 잠재적인 버그를 찾을 수 있게 도와줍니다" isMe="false" />
  <Chat-KakaoMsg msg="와.. 비..싼가요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="무료에요 ㅎㅎㅎ Javascript에서 가장 많이 사용하는 ESLint를 적용해보죠" isMe="false" />
</Chat-KakaoRoom>

## ESLint

ESLint를 설치하고 기본적인 설정을 해줍니다.

```sh
# ESLint 설치
npm install eslint --save-dev

# 설정파일 생성
npm init @eslint/config
```

ESLint는 React, Vue.js등 다양한 환경을 지원하는데 현재 개발 환경에 맞게 옵션을 선택합니다.

- ✔ How would you like to use ESLint? · problems
- ✔ What type of modules does your project use? · commonjs
- ✔ Which framework does your project use? · none
- ✔ Does your project use TypeScript? · No
- ✔ Where does your code run? · node
- ✔ What format do you want your config file to be in? · JSON

::: warning ESLint config
`Where does your code run?` 설정은 복수 응답을 허용하기 때문에 `space`를 눌러 `node`만 체크하고 엔터를 입력합니다.
:::

ESLint 설정을 했으니, 스크립트를 실행할 수 있도록 `package.json`에 다음 내용을 추가합니다.

```json{3}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .", // ⇠ 추가
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

ESLint를 실행합니다.

```sh
# ESLint 실행
npm run lint
```

```sh
/Users/cs.kim/Downloads/tmp/awesome-api-server/app.js
  5:32  error  'request' is defined but never used  no-unused-vars
  5:41  error  'reply' is defined but never used    no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```

`app.js`파일의 5번째 줄에 사용하지 않는 변수 2개를 발견했습니다. 변수를 제거하고 다시 `lint`를 실행합니다.

```sh
# ESLint 실행
npm run lint
```

🎉 성공! 경고 없이 실행되었습니다.

::: tip ESLint 더보기
📔 [공식 문서](https://eslint.org/docs/user-guide/)  
📝 [규칙 설정하기](https://eslint.org/docs/user-guide/configuring/rules)  
📝 [특정 파일 검사 제외하기](https://eslint.org/docs/user-guide/configuring/ignoring-code)  
📝 [Visual Studio Code 확장 프로그램 설치하기](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
:::

<Chat-KakaoRoom>
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="이제 코드 형식을 모두 동일하게 맞춰볼까요?" isMe="false" />
  <Chat-KakaoMsg msg="코드 형식이라면.." isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="띄어쓰기라던가 따옴표 형태, 세미콜론 사용 유무 등 사용자마다 선호하는 방식이 다른 코딩 습관을 동일한 기준에 맞춰 수정할 수 있어요" isMe="false" />
  <Chat-KakaoMsg msg="아하! 안 그래도 저희끼리 규칙을 정하고 있었어요!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="규칙을 강제로 적용하고 많은 개발자가 사용하는 방식을 적용하면 도움이 되겠죠?" isMe="false" />
  <Chat-KakaoMsg msg="Prettier가 이쪽에선 가장 유명해요" isMe="false" />
</Chat-KakaoRoom>

## Prettier

코드 형식<sup>format</sup>을 맞춰주는 Prettier를 설치합니다.

```sh
# Prettier 설치
npm install prettier --save-dev
```

Prettier의 일부 규칙이 ESLint와 충돌할 수 있으니, 충돌을 방지하는 ESLint 플러그인도 추가합니다.

```sh
# ESLint 플러그인 설치
npm install eslint-config-prettier --save-dev
```

`.eslintrc`파일에 방금 추가한 플러그인을 설정합니다.

```json{1}
"extends": ["eslint:recommended", "eslint-config-prettier"], // ⇠ 추가
...
```

스크립트를 실행할 수 있도록 `package.json`에 다음 내용을 추가합니다.

```json{4}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier \"src/**/*.+(js|json)\"", // ⇠ 추가
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

Prettier를 실행합니다.

```sh
# Prettier 실행
npm run format
```

```sh
const fastify = require("fastify");

function build(opts = {}) {
  const app = fastify(opts);
  app.get("/", async function () {
    return { hello: "world" };
  });

  return app;
}

module.exports = build;
const server = require("./app")({
  logger: {
    level: "info",
  },
});

// Run the server!
server.listen(3000, "0.0.0.0", function (err) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
```

`app.js`파일과 `server.js`파일의 분석결과를 확인할 수 있습니다. 작은따옴표(')가 전부 큰따옴표(")로 변경되었고 마지막에 세미콜론(;)을 빼먹은 부분도 추가되었네요. 문자랑 연산자 사이에 적당한 간격이 생겼습니다.

기본 명령어는 분석만 하므로 변경된 사항을 바로 수정하도록 `--write` 옵션을 추가합니다.

```json{4}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.+(js|json)\"", // ⇠ --write 옵션 추가
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

다시 Prettier를 실행합니다.

```sh
# Prettier 실행
npm run format
```

```sh
src/app.js 12ms
src/server.js 5ms
```

🎉 성공! 모든 파일이 규칙에 맞게 변경되었습니다. 이제 팀원들 모두 동일한 형식으로 코드를 작성할 수 있겠네요.

ESLint와 Prettie를 따로 실행하지 않고 한 번에 실행하면 좋겠죠?

```json{5}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.+(js|json)\"",
  "validate": "npm run lint && npm run format", // ⇠ 추가
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

이제 `npm run validate`로 두 가지 모두 체크할 수 있습니다.

::: tip Prettier 더보기
📔 [공식 문서](https://prettier.io/docs/en/index.html)  
📝 [규칙 설정하기](https://prettier.io/playground/)  
📝 [특정 파일 검사 제외하기](https://prettier.io/docs/en/ignore.html)  
📝 [Visual Studio Code 확장 프로그램 설치하기](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)  
📝 [Visual Studio Code 저장, 붙여넣기 연동하기](https://code.visualstudio.com/docs/getstarted/settings)
:::

## Jest

사실 개발팀은 고민이 하나 있습니다. 지속 가능한 프로젝트의 성장을 위해선 테스트코드를 작성하라고 들었는데, 엄두가 나지 않았던 거죠. ~~시작을 못 하겠어요..~~

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="똑똑.. 혹시.. 테스트 코드 작성 방법을 알 수 있을까요???" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="오 테스트 코드 작성하시나요?" isMe="false" />
  <Chat-KakaoMsg msg="네네 작성은 하고 싶은데.. 사실 잘 모르겠어요 ㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="소프트웨어 테스트는 단위 테스트, 통합 테스트, E2E 테스트 등 다양한 방식이 있고.." isMe="false" />
  <Chat-KakaoMsg msg="아! 우선 단위 테스트를 작성해보죠. 일단 한번 해보고 더 자세히 알아볼게요!" isMe="false" />
  <Chat-KakaoMsg msg="Javascript엔 다양한 테스트 프레임워크가 있는데 이번엔 Jest를 사용할게요. 아주 빠르고 확장성이 좋아요" isMe="false" />
</Chat-KakaoRoom>

테스트 프레임워크 Jest를 설치합니다.

```sh
# Jest 설치
npm install jest --save-dev
```

Jest는 기본적으로 `__tests__` 디렉토리에 포함된 파일과 `*.test.js` 파일을 바라봅니다.

`src/__tests__/app.js` 파일을 다음과 같이 작성합니다. `/`에 요청을 보냈을 때, 예상하는 값이 나오는지 확인하는 코드입니다.

```js
const build = require("../app");

test('"/" 요청시 "hello: world" 응답 확인', async () => {
  const app = build();
  const res = await app.inject({
    url: "/",
  });
  expect(res.json()).toEqual({ hello: "world" });
});
```

테스트를 실행하는 스크립트를 `package.json`에 추가합니다.

```json{5}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier \"src/**/*.+(js|json)\"",
  "test": "jest" // ⇠ 추가
},
...
```

테스트를 실행합니다. 테스트는 npm의 배려로 간단하게 줄여서 사용할 수 있습니다.

```sh
# 테스트 스크립트 실행
# npm run test / npm test / npm t 모두 가능
npm t
```

```sh
 PASS  src/__tests__/app.js
  ✓ "/" 요청시 "hello: world" 응답 확인 (60 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.249 s, estimated 1 s
Ran all test suites.
```

🎉 성공! 테스트가 문제없이 통과했습니다.

이거 정말 정상적으로 동작한 걸까요? 의심스러우니 코드 내용을 바꿔서 다시 실행해봅니다.

```sh
 FAIL  src/__tests__/app.js
  ✕ "/" 요청시 "hello: world" 응답 확인 (58 ms)

  ● "/" 요청시 "hello: world" 응답 확인

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "hello": "world",
    +   "hello": "hey?",
      }

       6 |     url: "/",
       7 |   });
    >  8 |   expect(res.json()).toEqual({ hello: "world" });
         |                      ^
       9 | });
      10 |

      at Object.<anonymous> (src/__tests__/app.js:8:22)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.286 s, estimated 1 s
Ran all test suites.
```

`world`를 `hey?`로 바꿨더니 바로 테스트가 실패하는 것을 확인할 수 있습니다.

나중에 소스코드가 변경되면 테스트 코드도 같이 변경해야 하는 걸까요? -> 🙌 맞습니다! 하지만, 응답을 변경할 때마다 내용을 복사 붙여넣기 하긴 귀찮죠.

Jest에서 제공하는 `toMatchInlineSnapshot` 함수를 사용해봅니다.

```js{2}
// expect(res.json()).toEqual({ hello: "world" });  // ⇠ 기존 삭제
expect(res.json()).toMatchInlineSnapshot(); // ⇠ 추가
```

다시 테스트를 실행하면 다음과 같이 테스트 코드가 자동으로 변경됩니다.

```js
expect(res.json()).toMatchInlineSnapshot(`
  Object {
    "hello": "hey?",
  }
`);
```

다시 코드를 `hey?`에서 `world`로 변경하면, 테스트가 실패하고 Snapshot을 변경할지 물어봅니다.

```sh
 FAIL  src/__tests__/app.js
  ✕ "/" 요청시 "hello: world" 응답 확인 (62 ms)

  ● "/" 요청시 "hello: world" 응답 확인

    expect(received).toMatchInlineSnapshot(snapshot)

    Snapshot name: `"/" 요청시 "hello: world" 응답 확인 1`

    - Snapshot  - 1
    + Received  + 1

      Object {
    -   "hello": "hey?",
    +   "hello": "world",
      }

       6 |     url: "/",
       7 |   });
    >  8 |   expect(res.json()).toMatchInlineSnapshot(`
         |                      ^
       9 |     Object {
      10 |       "hello": "hey?",
      11 |     }

      at Object.<anonymous> (src/__tests__/app.js:8:22)

 › 1 snapshot failed.
Snapshot Summary
 › 1 snapshot failed from 1 test suite. Inspect your code changes or run `npm test -- -u` to update them.
```

정상적으로 변경한 것이므로 Snapshot을 업데이트합니다.

```sh
npm t -- -u
```

매번 복사 붙여넣기 할 필요가 없어서 편하네요. Snapshot은 API를 테스트하거나 프론트엔트 렌더링을 확인할 때 유용하게 사용할 수 있습니다.

마지막으로, ESLint에서 Jest 문법을 인식할 수 있도록 `.eslintrc`에 다음 내용을 추가합니다.

```json{5}
"env": {
    "node": true,
    "commonjs": true,
    "es2021": true,
    "jest": true // ⇠ 추가
},
```

::: tip Jest 더보기
📔 [공식 문서](https://jestjs.io/docs/getting-started)  
📝 [소프트웨어 테스팅 알아보기](https://martinfowler.com/tags/testing.html)  
📝 [Jest Matcher 알아보기](https://jestjs.io/docs/using-matchers)
:::

## 마무리

정적 코드 분석, 포멧팅, 테스트 코드는 프로젝트 초기엔 장점을 모르고 귀찮을 수 있지만, 프로젝트가 성장할수록 안정적이고 빠르게 개발할 수 있는 안전망 역할을 합니다. 막상 나중에 필요성을 깨닫고 추가하려면 테스트 코드를 추가하기 어려운 구조거나 너무 많은 수정이 필요해서 사용하기 어려울 수 있습니다. 처음부터 자연스럽게 사용할 수 있도록 의도적인 노오오오력이 필요합니다.

이제 프로젝트 기본 설정을 마쳤으니 본격적으로 협업을 위한 도구를 알아봅니다.
