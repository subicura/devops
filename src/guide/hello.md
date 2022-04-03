---
description: DevOps 도입하기
image: /imgs/share.png
---

# DevOps 도입하기

`Twelve Purple`은 창업한 지 얼마 안 된 꼬꼬마 스타트업입니다.

개발자는 총 3명, 모두 주니어 개발자로 이루어져 있지만, 열정만큼은 이미 구글, 테슬라입니다. 개발 언어는 `Node.js`, 클라우드는 `AWS`를 사용하고 곧 유니콘이 될(~~거라 생각~~) `Awesome API` 프로젝트를 진행하고 있습니다.

대표님이 어느 날 제대로 된 개발 문화를 위해선 우리도 `DevOps` 조직이 되어야 한다며, 새로운 CTO님을 영입했습니다.

<Chat-KakaoRoom>
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="안녕하세요 👋" isMe="false" />
  <Chat-KakaoMsg msg="안녕하세요!! DevOps에 대해 많은 가르침 부탁드립니다 🙇" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="네네" isMe="false" />
  <Chat-KakaoMsg msg="DevOps에 정답은 없어요" isMe="false" />
  <Chat-KakaoMsg msg="중요한 건 지속적으로 프로세스를 개선하고 자동화해서 서비스를 더 빨리, 더 안정적으로 제공하기 위해 노력해야 한다는 거죠" isMe="false" />
  <Chat-KakaoMsg msg="아.. 네네 😳" isMe="true" />
</Chat-KakaoRoom>

우선, 현재 개발 환경과 프로세스를 설명했고 한참 [말잇못](https://ko.dict.naver.com/#/entry/koko/cb46255407a84b52888ab30f2799054b)..하시더니 하나씩 개발 프로세스를 점검하기로 했습니다.

::: tip 💡 Twelve Purple
본 가이드에 등장하는 회사, 인물, 프로젝트는 모두 설명을 위해 만든 가상의 내용입니다.
:::

## 준비하기

본 가이드는 웹 애플리케이션 개발부터 배포, 자동화까지 일반적인 개발 프로세스 전반적인 내용을 넓고 얕게 다룹니다.

**개발과 테스트 코드**

Node.js 기반 웹 애플리케이션을 만들고 테스트 코드를 추가합니다. 팀 협업을 위해 Git과 GitHub을 도입하고 테스트 검사를 자동화합니다.

- [Node.js 웹 애플리케이션 - Fastify / Prettier / ESLint / Jest](./web)
- [Git](./git)
- [GitHub / GitHub Flow](./github)
- [Validate, 테스트 자동화 - husky / lint-staged](./validate)

**배포**

AWS에 Node.js 애플리케이션을 배포합니다. 살짝 PaaS를 알아보고 단일 서버 -> 다중 서버 -> SSL 적용까지 한 단계씩 진행합니다.

- [배포하기 - PaaS](./deploy)
- [AWS 배포 - EC2 / pm2](./aws-deploy)
- [AWS 다중 서버 배포 - ELB](./aws-multi-deploy)
- [도메인 연결 - Cloudflare / Certificate](./aws-domain)

**컨테이너**

Docker를 이용하여 Node.js 애플리케이션을 컨테이너로 배포합니다.

- [Docker - ECR](./docker)

**지속적 통합(CI)**

Jenkins를 이용하여 지속적으로 테스트를 검증하고 GitHub을 연동합니다.

- [Jenkins](./jenkins)
- [Lint / Test / Coverage](./jenkins-report)
- [Jenkins + GitHub - Multibranch Pipeline](./jenkins-github)

**쿠버네티스**

쿠버네티스를 이용하여 대규모 배포를 자동화합니다. 원하는 만큼 테스트 서버를 생성하고 모니터링하고 문제가 생겼을 때 알람을 받을 수 있게 설정합니다.

- [Kubernetes - EKS](./kubernetes)
- [Helm](./helm)
- [GitOps - ArgoCD](./gitops)
- [Cluster Autoscaling](./autoscaling)
- [Jenkins + GitOps - Continuous Delivery](./jenkins-gitops)
- [모니터링 - Grafana / Loki](./monitoring)
- [모니터링 알림 - Slack](./alert)

뭔가 복잡해 보이지만, 개발자의 수고를 덜어주고 여러 가지 작업을 자동화해주는 고마운 도구들입니다. 초보 개발자의 입장에서 하나하나 적용하면서 역할과 사용법을 익히다 보면 ~~아.. 이런 게 있구나~~ 쉽게 이해할 수 있을 겁니다.

자세한 동작 원리와 사용법을 다루기엔 내용이 너무 방대하기에, 우선 실습으로 간단하게 맛보고 잘 이해가 안 되거나 더 알고 싶은 부분은 관련 서적이나 링크를 참고해주세요.

도구의 사용법 자체보다는 `이걸 사용하면 이런 점이 좋구나`에 초점을 맞춰서 봐주세요. 새로운 도구는 언제든 나오고 개발 환경에 따라 더 나은 도구가 있을 수 있습니다.
