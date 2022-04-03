---
head:
  - - meta
    - property: "og:description"
      content: Git을 이용한 소스 버전 관리와 TDD
  - - meta
    - property: "twitter:description"
      content: Git을 이용한 소스 버전 관리와 TDD
---

# Git

::: tip ⚡️ 목표
✅ [Git](https://git-scm.org/)을 이용하여 소스를 버전 관리합니다.  
✅ TDD 방식으로 새 기능을 추가합니다.
:::

[[toc]]

## 버전관리

<Chat-KakaoRoom>
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="지난번에 파일을 압축해서 보내주셨는데, 혹시 GitHub 저장소에 초대해 주실 수 있나요?" isMe="false" />
  <Chat-KakaoMsg msg="아.. 저희가 아직 Git을 안쓰고 소스를 이메일로 공유하고 있어서요.. ㅠㅠ" isMe="true" />
  <Chat-KakaoMsg msg="매일매일 하루에 한번씩 압축해서 보관해요! ㅎㅎ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="읔.. 그럼 이번에 본격적으로 Git을 도입해볼까요??" isMe="false" />
  <Chat-KakaoMsg msg="Git을 사용하면 타임머신처럼 이전 상태로 쉽게 돌아갈 수 있고 협업도 더 간편해질거에요 ㅎㅎ" isMe="false" />
  <Chat-KakaoMsg msg="오.. 좋습니다!" isMe="true" />
</Chat-KakaoRoom>

Git은 리누스 토발즈가 2005년에 ~~2주 만에 만든~~ 분산 버전 관리 시스템(DVCS)<sup>Distributed version control systems</sup>입니다. 속도가 빠르고 강력한 브랜치 기능으로 사실상 표준으로 사용하고 있습니다.

우선 [Git을 설치](https://subicura.com/git/prepare/git-setup.html?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops)하고 저장소를 설정합니다.

```sh
# 저장소 초기화
git init

# 현재 저장소 상태 확인
git status
```

```sh
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.eslintrc.json
	node_modules/
	package-lock.json
	package.json
	src/

nothing added to commit but untracked files present (use "git add" to track)
```

`Untracked files`에 버전 관리할 파일들이 보입니다. 근데 `node_modules`는 `npm install`로 설치하는 항목이므로 버전 관리에서 제외해야 합니다. 가급적 소스코드만 최소한으로 관리하는 것이 좋습니다.

`.gitignore` 파일을 생성합니다.

```
node_modules
```

이제 `node_modules` 폴더를 제외했으니 첫 번째 커밋을 작성합니다.

```sh
# 전체 파일을 버전 관리 항목으로 추가
git add .
# 첫 번째 커밋
git commit -m "init"
```

🎉 첫 번째 커밋을 작성했습니다. 이제 파일을 수정하면 변경된 내용을 확인할 수 있고 지워진 파일을 복구할 수도 있습니다.

::: tip Git 더보기
📔 [공식 문서](https://git-scm.com/doc)  
📔 [Git / GitHub 안내서](https://subicura.com/git/?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops)  
📝 [Git 설치하기](https://subicura.com/git/prepare/?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops)  
📝 [Git 기본 가이드](https://subicura.com/git/guide/?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops#git%E1%84%8B%E1%85%B4-%E1%84%90%E1%85%B3%E1%86%A8%E1%84%8C%E1%85%B5%E1%86%BC)
:::

## TDD

Git도 도입했고, 이제 본격적으로 `Awesome API`의 두 번째 기능을 추가합니다. 지금 생각하는 기능은 `/ping`에 요청을 보내면 `{ "status": "ok" }`를 응답하는 API 입니다.

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="Git 첫 번째 Commit 성공했어요!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="오.. 축하합니다!" isMe="false" />
  <Chat-KakaoMsg msg="이번에 새로운 기능을 추가하고 있는데.. 혹시 TDD 방식으로 만들어 볼 수 있을까요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="테스트 코드가 마음에 드셨나 보네요 ㅎㅎ" isMe="false" />
  <Chat-KakaoMsg msg="그럼 본격적으로 테스트 코드를 더 작성해볼까요??" isMe="false" />
  <Chat-KakaoMsg msg="네네 ㅎㅎ" isMe="true" />
</Chat-KakaoRoom>

테스트 코드를 작성하고 확인할 때, 매번 `npm t`를 입력하는 것이 번거로우므로 `--watch` 옵션을 추가합니다.

`package.json` 파일을 다음과 같이 수정합니다.

```json{7}
"scripts": {
  "start": "node src/server.js",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.+(js|json)\"",
  "validate": "npm run lint && npm run format",
  "test": "jest",
  "test:watch": "jest --watch" // ⇠ 추가
},
...
```

스크립트를 실행합니다.

```sh
# 테스트 실행
npm run test:watch
```

```sh
No tests found related to files changed since last commit.
Press `a` to run all tests, or run Jest with `--watchAll`.

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

Jest는 똑똑하게 마지막 커밋 이후로 수정된 파일에 대해서 테스트를 수행합니다. 테스트 코드를 추가합니다.

`src/__tests__/app.js`에 `/ping`에 대한 테스트를 추가합니다.

```js
...
test('"/ping" 요청시 "status: ok" 응답 확인', async () => {
  const app = build();
  const res = await app.inject({
    url: "/ping",
  });
  expect(res.json()).toEqual({ status: "ok" });
});
```

테스트 코드를 저장하면 자동으로 테스트를 수행합니다.

```sh
 FAIL  src/__tests__/app.js
  ✓ "/" 요청시 "hello: world" 응답 확인 (79 ms)
  ✕ "/ping" 요청시 "status: ok" 응답 확인 (3 ms)

  ● "/ping" 요청시 "status: ok" 응답 확인

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

      Object {
    -   "status": "ok",
    +   "error": "Not Found",
    +   "message": "Route GET:/ping not found",
    +   "statusCode": 404,
      }

      18 |     url: "/ping",
      19 |   });
    > 20 |   expect(res.json()).toEqual({ status: "ok" });
         |                      ^
      21 | });
      22 |

      at Object.<anonymous> (src/__tests__/app.js:20:22)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   1 passed, 1 total
Time:        0.309 s, estimated 1 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

아직 코드를 작성하기 전이므로 정상적으로 테스트가 실패하였습니다.

저장할 때마다 실시간으로 테스트 결과를 알려주니 편한 것 같습니다. ~~모니터를 하나 더 사야겠습니다~~

이제 `src/app.js` 파일에 `/ping` 내용을 추가합니다.

```js
...
app.get("/ping", async function () {
  return { status: "ok" };
});
```

파일을 저장하면 자동으로 테스트를 수행합니다.

```sh
 PASS  src/__tests__/app.js
  ✓ "/" 요청시 "hello: world" 응답 확인 (90 ms)
  ✓ "/ping" 요청시 "status: ok" 응답 확인 (2 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   1 passed, 1 total
Time:        0.295 s, estimated 1 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

🎉 성공! 모든 테스트를 통과했습니다.

새로운 기능을 순식간에 만들었고 테스트 코드가 있어 심적으로 안정감을 느낍니다. `toEqual`을 `toMatchInlineSnapshot` 함수로 변경하고 수정한 코드를 커밋합니다.

아참! 커밋하기전에 정적 코드 분석을 먼저합니다.

```sh
# 정적분석, 포멧팅 실행
npm run validate
# 변경된 파일 추가
git add .
# 커밋
git commit -m "add ping"
```

## 마무리

Git은 많은 회사에서 사용 중인 협업을 위한 필수 도구입니다. 단순 이력 관리 외에 다양한 부가기능이 있으며, CLI 외에 GUI 도구나 IDE에 내장된 기능을 적절히 사용하면 생산성을 높일 수 있습니다. 특히 Git의 고급기능을 사용하면 고오오오급 개발자처럼 보이는 효과가 있습니다.

이제 Git을 도입했으니 본격적으로 GitHub을 이용하여 팀과 협업해봅니다.
