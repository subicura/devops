---
description: Validate, 테스트 자동체크 도입하기
image: /imgs/share.png
---

# Validate, 테스트 자동화

::: tip ⚡️ 목표
✅ [Husky](https://github.com/typicode/husky)를 이용하여 커밋할 때 Validate, 테스트 스크립트를 실행합니다.  
✅ [lint-staged](https://github.com/okonet/lint-staged)를 이용하여 Husky 실행 속도를 최적화 합니다.
:::

[[toc]]

Git을 도입하고, GitHub도 사용하고 GitHub Flow로 협업도 하고 개발팀의 개발문화가 많이 좋아진 것 같습니다. 🔥

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="요즘 PR이 많이 올라오는데.. validate나 테스트를 깜빡하고 Push하는 경우가 많습니다" isMe="true" />
  <Chat-KakaoMsg msg="아.. 진짜 계속 까먹어요 ㅠ 이거 혹시 해결방법 없을까요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="깜빡하는 팀원에게 벌금을 걷는..건 아니고 커밋하기 전에 강제로  체크하면 되겠네요" isMe="false" />
  <Chat-KakaoMsg msg="오 강제로 체크할 수가 있나요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="Git은 hook을 지원하기 때문에 pre-commit hook을 이용하면 됩니다" isMe="false" />
  <Chat-KakaoMsg msg=".git/hooks 디렉토리 봤는데.. 봐도 잘 모르겠어요 ㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="ㅎㅎㅎ 쉘 스크립트를 몰라도 사용할 수 있어요. Husky를 도입해 보죠" isMe="false" />
</Chat-KakaoRoom>

## Husky

Husky는 Git hook을 손쉽게 사용할 수 있게 도와주는 도구입니다. ~~쉬운 게 최고~~

Husky를 설치합니다. 처음 설치하는 경우 손이 좀 많이 가는데, 이후에 사용하는 개발자는 `npm install` 후 바로 사용하면 됩니다.

```sh
# Husky 설치
npm install husky --save-dev
# package.json에 prepare 스크립트를 추가합니다 (설치하는 사람이 최초 한번만 실행)
npm set-script prepare "husky install"
# Git Hook 설정
npm run prepare
```

설치가 완료되면, Git Hook을 설정합니다. `.husky/pre-commit` 파일을 직접 수정하거나 스크립트를 이용합니다.

```sh
# commit 하기 전에 validate와 test 스크립트 실행
npx husky add .husky/pre-commit "npm run validate && npm run test"
```

이제 수정사항을 커밋해볼까요?

```sh
# 변경된 파일 추가
git add .
# 커밋
git commit -m "add husky"
```

```sh
> awesome-api-server@1.0.0 validate
> npm run lint && npm run format


> awesome-api-server@1.0.0 lint
> eslint .


> awesome-api-server@1.0.0 format
> prettier --write "src/**/*.+(js|json)"

src/__tests__/app.js 26ms
src/app.js 9ms
src/server.js 4ms

> awesome-api-server@1.0.0 test
> jest

 PASS  src/__tests__/app.js
  ✓ "/" 요청시 "hello: world" 응답 확인 (62 ms)
  ✓ "/ping" 요청시 "status: ok" 응답 확인 (2 ms)
  ✓ "/activity" 접속시 정상 응답 (2 ms)
  ✓ "/activity" 접속시 boredapi 오류 처리 (4 ms)
  ✓ "/activity" 접속시 activity 빈값 처리 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   3 passed, 3 total
Time:        0.323 s, estimated 1 s
Ran all test suites.
[add-activity e027190] add husky
 3 files changed, 29 insertions(+), 1 deletion(-)
 create mode 100755 .husky/pre-commit
```

Validate와 테스트 스크립트가 자동으로 실행되는 것을 확인할 수 있습니다. 스크립트가 실패하면 커밋도 실패하기 떄문에 이제 이전같은 실수는 더이상 없겠죠?

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="Husky 간단하고 진짜 좋네요!" isMe="true" />
  <Chat-KakaoMsg msg="근데.. 코드가 좀 커지니까 git commit 명령어가 너무 느려졌어요 ㅠㅠ 팀원들도 뭐라고 하고.. 빼자고.." isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="아무래도 코드가 크면 체크하는 시간도 오래 걸리고 사용자 경험이 좋지는 않죠 ㅠㅠ" isMe="false" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="그럼 커밋할 파일들만 체크하는 건 어떨까요?" isMe="false" />
  <Chat-KakaoMsg msg="???? 😳" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="link-staged를 도입해서 개선해보죠" isMe="false" />
</Chat-KakaoRoom>

::: tip Husky 더보기
📔 [Husky 공식문서](https://typicode.github.io/husky)
:::

## link-staged

link-staged는 Git의 staged 영역에 있는 파일만 필터링해서 작업할 수 있는 도구입니다. 전체 파일 중에 commit 할 파일만 체크하기 때문에 속도를 대폭 개선할 수 있습니다.

link-staged를 설치합니다.

```sh
# lint-staged 설치
npm install lint-staged --save-dev
```

`package.json`에 link-staged 스크립트를 추가합니다.

```json{9}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.+(js|json)\"",
  "validate": "npm run lint && npm run format",
  "test": "jest",
  "test:watch": "jest --watch",
  "prepare": "husky install",
  "lint-staged": "lint-staged" // ⇠ 추가
},
```

어떤 파일을 어떻게 체크할지 `.lintstagedrc`파일에 설정합니다.

`*.js` 파일에 대해서 Prettier, ESLint, Jest를 수행하고 Jest는 수정한 파일과 관련된 테스트를 수행하기 위해 `--findRelatedTests` 옵션을 추가합니다.

```sh
{
  "*.+(js)": [
    "prettier --write",
    "eslint",
    "jest --findRelatedTests"
  ]
}
```

기존 huksy Hook 설정을 변경합니다. `.husky/pre-commit` 파일을 수정합니다.

```sh{2}
# npm run validate && npm run test // ⇠ 삭제
npm run lint-staged # ⇠ 추가
```

이제 어떻게 동작하는지 커밋을 해볼까요?

```sh
# 변경된 파일 추가
git add .
# 커밋
git commit -m "add lint-staged"
```

아무런 체크 없이 커밋이 되었습니다. 수정한 파일중에 `.js` 파일이 없어서 lint-staged에 설정한 스크립트가 실행되지 않았습니다.

일부러 `.js` 파일을 하나 수정하고 다시 커밋합니다.

```sh
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[add-activity a02475c] update js
 1 file changed, 1 insertion(+)
```

lint-staged가 수정된 파일만 골라서 체크하는 것을 확인할 수 있습니다.

::: tip lint-staged 더보기
📔 [lint-staged 설정 공식문서](https://github.com/okonet/lint-staged#configuration)
:::

## 마무리

도구를 도입하는 목적은 "더 빨리, 더 안정적으로" 개발하는 것임을 생각하고 개선할 수 있는 방법을 찾는 것이 중요합니다. ~~찾아보면 이미 다 있음~~

이제 개발 환경은 여기까지 설정하고 본격적으로 배포를 해봅시다.
