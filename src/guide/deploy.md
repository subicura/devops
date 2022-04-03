---
head:
  - - meta
    - property: "og:description"
      content: 배포의 종류와 PaaS 배포 하기
  - - meta
    - property: "twitter:description"
      content: 배포의 종류와 PaaS 배포 하기
---

# 배포하기

::: tip ⚡️ 목표
✅ On-Premise와 IaaS, PaaS, 서버리스, 컨테이너에 대해 알아봅니다.  
✅ [Heroku](https://www.heroku.com/)에 배포합니다.  
✅ [AWS Elastic Beanstalk](https://docs.aws.amazon.com/ko_kr/elastic-beanstalk)에 배포합니다.
:::

[[toc]]

드디어 1차 개발이 완료되어 배포를 준비합니다. ~~두근두근~~

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="AWS에 배포하려고 하는데 제가 배포는 처음이라서.. 혹시 조금 도와주실수 있나요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="드디어 개발이 완료되었군요 ㅊㅋㅊㅋ" isMe="false" />
  <Chat-KakaoMsg msg="혹시 생각한 배포 방식이 있나요?" isMe="false" />
  <Chat-KakaoMsg msg="음?? 그냥 배포만 하면 돼요! Node.js 웹서버요 ㅎㅎㅎ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="아.. 배포라고 하면 여러 가지 방법이 있는데, 아직 규모가 작으니까 EC2에 직접 배포하던가 AWS Elastic Beanstalk같은 PaaS 방식을 이용하면 좋을 것 같아요" isMe="false" />
  <Chat-KakaoMsg msg="Lambda같은 서버리스도 괜찮을 것 같고 시스템이 복잡해지면 ECS나 EKS같은 컨테이너 기술을 도입해보죠" isMe="false" />
  <Chat-KakaoMsg msg="EC2? PaaS? 서버리스? 컨테이너?..요?" isMe="true" />
</Chat-KakaoRoom>

## 배포방식

**On-premise vs Cloud**

배포는 크게 자체 서버<sup>On-premise</sup>와 클라우드<sup>cloud</sup>방식으로 나눌 수 있습니다. 자체 서버는 서버를 구매하고 설치부터 설정까지 모든 것을 관리할 수 있지만 그만큼 힘들고 서버를 손쉽게 확장하기 어려운 문제가 있습니다. 보안상의 이유로 클라우드를 사용할 수 없거나 특이한 하드웨어(3090 8대 연결?!)가 필요할 때 사용하고 서버를 한번 구매하면 ~~장애가 없다는 가정하에~~ 추가적인 비용이 발생하지 않기 때문에 비용적인 측면에서 자체 서버를 사용하는 경우도 있습니다.

**IaaS vs PaaS**

최근에는 사용한 만큼 비용을 지불하고 필요하면 수십-수백 대의 서버를 사용할 수 있는 클라우드 방식을 선호합니다. [AWS](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/), [Google Cloud](https://cloud.google.com/), [Naver Cloud](https://www.ncloud.com/)는 서버 설치, 전원 관리등을 제외한 대부분의 인프라를 직접 구성할 수 있고 IaaS(Infrastructure-as-a-service/이아스/아이아스) 방식이라고 합니다. [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), [netlify](https://www.netlify.com/), [AWS Elastic Beanstalk](https://aws.amazon.com/ko/elasticbeanstalk/), [Azure App Service](https://azure.microsoft.com/en-gb/services/app-service/#overview), [Google App Engine](https://cloud.google.com/appengine/)는 코드만 업로드하면 바로 서비스를 사용할 수 있는 PaaS(Platform-as-a-service/파스) 방식입니다.

**서버리스<sup>serverless</sup>**

서버리스는 서버가 없는(??) 방식입니다. 물론 물리적인 서버는 존재하지만, 추상적으로 서버가 없는 것처럼 서비스를 사용할 수 있습니다. [AWS Lambda](https://aws.amazon.com/ko/lambda/), [Azure Functions](https://azure.microsoft.com/ko-kr/services/functions/), [Google Cloud Functions](https://cloud.google.com/functions/), [Cloudflare Workers](https://workers.cloudflare.com/)가 있고 서비스를 사용한 만큼만(초 단위 과금) 비용을 지불하고 서버 관리 자체를 할 필요가 없다는 게 큰 매력입니다.

**컨테이너<sup>container</sup>**

컨테이너는 격리된 공간에서 프로세스가 동작하는 기술입니다. 기존에 배포하면서 불편했던 많은 부분을 해결해주고 확장과 롤백 등이 간편하여 많은 회사에서 사용하고 있습니다. 자세한 내용은 [Docker](./docker)에서 다룹니다.

각각의 방식은 장단점이 있고 모든 기술이 그러하듯 트레이드 오프를 고려하여 지금 가장 적합한 방식을 선택하면 됩니다.

## PaaS

<div style="margin-top: 15px">
  <Chat-KakaoRoom>
    <Chat-KakaoMsg msg="배포 방식을 살펴봤는데 PaaS 방식이 좋아 보입니다!" isMe="true" />
    <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="PaaS는 특별한 설정 없이 간편하게 배포할 수 있는 점에서 좋은 선택입니다 👍" isMe="false" />
    <Chat-KakaoMsg msg="배포가 간단한 만큼 단점도 있는데.. 혹시 아시나요?" isMe="false" />
    <Chat-KakaoMsg msg="아..아직 단점까진 확인 못 했습니다 ㅠ 서비스 소개 페이지 보니까 다 좋은점만 써있어요;;" isMe="true" />
    <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="일단 배포부터하고 단점은 천천히 알아볼게요. 중요한 건 기술 선택에 따른 트레이드 오프를 이해하고 이 선택이 맞는지 판단할 수 있는 능력을 키워야해요" isMe="false" />
    <Chat-KakaoMsg msg="그럼 초초초 간편한 Heroku 사용법을 알아볼게요. GitHub 계정만 연결하면 클릭 한두 번으로 배포할 수 있어요~" isMe="false" />
    <Chat-KakaoMsg msg="아.. 이런 게 PaaS구나! 하는 느낌적인 느낌을 느껴볼게요" isMe="false" />
    <Chat-KakaoMsg msg="네네" isMe="true" />
  </Chat-KakaoRoom>
</div>

PaaS는 복잡한 설정 대신 **규칙**이 중요합니다. PaaS가 많은 부분을 대신해 주지만 애플리케이션이 어떻게 동작하는지 정확히 알 수 없기 때문에 힌트를 줘야 합니다. Node.js로 만든 애플리케이션이라면 `package.json`파일이 존재해야 하고 `start` 스크립트를 작성해야 합니다. 그리고 웹서버가 오픈하는 포트도 정해져 있는데 `80`이나 `8080`으로 띄워야 하고 `PORT`라는 환경변수를 사용할 수도 있습니다. 이러한 규칙은 서비스마다 조금씩 다르기 때문에 사용하기 전에 관련 내용을 확인해야 합니다.

`Awesome API` 코드에 웹서버 포트 설정을 다음과 같이 수정합니다.

```js{2}
// process.env.PORT를 추가하여 PORT 환경변수가 있으면 해당 값을 웹서버의 Port로 사용합니다.
server.listen(process.env.PORT || 3000, "0.0.0.0", function(err) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
```

예전에는 포트가 3000으로 고정되어 있었지만, 이제 PORT 환경변수를 넣으면 해당 포트를 사용합니다.

## Heroku

Heroku는 전통적인 PaaS 서비스로 `Ruby`, `Node.js`, `Clojure`, `Python`, `Java`, `Scala`, `PHP`, `Go`등 다양한 언어를 지원합니다. GitHub을 연동하여 서비스를 배포해보겠습니다.

1. `New` -> `Create new app`을 선택합니다.

<div class="image-250">
  <custom-image src="/imgs/deploy/heroku-new.png" alt="New App" />
</div>

2. App name을 입력합니다. ~~아니 왜 Asia는 없지.. ㅠㅠ~~

<custom-image src="/imgs/deploy/heroku-new-app.png" alt="New App" />

3. 배포할 GitHub 저장소를 선택합니다.

<custom-image src="/imgs/deploy/heroku-github.png" alt="Connect GitHub" />

4. 수동으로 배포합니다. Manual Deploy 항목에서 Deploy Branch를 선택합니다.

<custom-image src="/imgs/deploy/heroku-deploy.png" alt="Build and deploy" />

잠시 기다리면.. 🎉 짠! 배포가 완료되었습니다. 새 앱 만들기부터 배포까지 5분도 채 걸리지 않았습니다.

배포 로그를 보면 Node.js를 추가하고 패키지를 설치한 다음 애플리케이션을 실행하는 모습을 볼 수 있습니다. 마치 Node.js 웹 애플리케이션 배포만 100번 이상 해본 사람이 서버를 착착착 설정해주는 느낌입니다.

PaaS는 정형적인 개발 패턴을 바탕으로 빌드부터 배포까지 각종 귀찮은 작업을 **알아서** 해줍니다.

::: tip Heroku 더보기
📔 [공식 문서](https://devcenter.heroku.com/)  
📔 [Node.js 문서](https://devcenter.heroku.com/categories/nodejs-support)
:::

## PaaS의 단점

PaaS는 일반적인 애플리케이션을 더 빨리, 더 안정적으로 제공하는 데 도움을 주지만 단점도 있습니다. 잘 알고 쓰면 초고속 로켓이지만, 잘 모르고 쓰면 서비스를 확장할 때 걸림돌이 될 수 있습니다.

- 특정 지역만 사용할 수 있습니다. Heroku는 미국과 유럽만 선택 가능합니다.
- 특정 언어/프레임워크만 사용할 수 있습니다. Rust라던가 Deno, Elixer 같은 언어는 사용이 어려울 수 있습니다.
- 특정 버전만 사용할 수 있습니다. Node.js 최신 버전이 나와도 서비스에서 지원하지 않으면 사용할 수 없습니다.
- 특정 CPU 아키텍처만 사용할 수 있습니다. arm 서버가 저렴하지만, x86만 지원할 수 있습니다.
- 특정 시스템 라이브러리 사용이 불가능 할 수 있습니다.
- 웹소켓, gRPC같은 특정 프로토콜을 사용하기 어렵습니다.
- 하나의 서비스는 하나의 서버를 사용합니다. 하나의 서버에 여러 개의 서비스를 사용하기 어렵습니다.
- 특정 경로에 생기는 파일 로그는 확인이 어려울 수 있습니다.
- cronjob등 서버에서 제공하는 기능을 사용할 수 없습니다.
- 서비스에서 제공하는 정보 외에 상세한 모니터링이 불가능합니다.
- 성능, 용량 제한이 있습니다.
- 서버의 세부 설정을 제어할 수 없습니다.
- 특정 서비스에 종속된 기술을 사용합니다. 범용적인 기술을 학습하기 어렵습니다.

PaaS마다 일부 커스터마이징을 지원하지만 IaaS만큼 자유롭진 않습니다.

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="PaaS가 생각보다 단점이 많네요 ㅠㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="단점이 있지만.. 특별한 기능이 필요한 게 아니면 사실 큰 문제는 없어요. 아마 대부분 단점을 잘 모르고 사용할 거예요 ㅎㅎ" isMe="false" />
  <Chat-KakaoMsg msg="그리고 AWS에서 제공하는 Beanstalk라는 서비스를 이용하면 약간 그.. 하이브리드? 처럼 PaaS지만 꽤 커스터마이징이 자유로운 환경 설정이 가능합니다" isMe="false" />
  <Chat-KakaoMsg msg="오.. 좋네요!!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="그럼 바로 배포해보죠!" isMe="false" />
</Chat-KakaoRoom>

## AWS Elastic Beanstalk

AWS에 로그인하고 Elastic Beanstalk를 만듭니다.

1. Application name을 입력하고

<div class="image-750">
  <custom-image src="/imgs/deploy/beanstalk-name.png" alt="New App" />
</div>

2. Platform을 Node.js로 선택합니다.

<div class="image-750">
  <custom-image src="/imgs/deploy/beanstalk-platform.png" alt="Select Platform" />
</div>

3. Beanstalk는 S3 또는 직접 업로드 방식을 지원합니다. GitHub에서 소스를 다운로드합니다. (아쉽지만, Beanstalk는 GitHub ~~Microsoft 소유~~ 연동을 지원하지 않고 자체 빌드 도구를 권장합니다.)

<div class="image-350">
  <custom-image src="/imgs/deploy/github-download.png" alt="GitHub Download" />
</div>

4. 다운로드 받은 zip 파일을 업로드합니다.

<div class="image-750">
  <custom-image src="/imgs/deploy/beanstalk-code.png" alt="Upload code" />
</div>

최종적으로 `Create Application`을 눌러 서비스를 생성합니다.

Beanstalk가 소스를 S3에 업로드하고 EC2를 만든 다음, AutoScaling Group, Security Group, CloudWatch를 설정하고 ELB까지 쭈우우우욱 생성합니다. AWS 인프라 위에서 필요한 리소스를 대신 만들어주는 방식이라 필요하면 세부적인 설정을 변경할 수 있습니다.

그럼 배포가 되었는지 확인해볼까요?

<div class="image-750">
  <custom-image src="/imgs/deploy/beanstalk-status.png" alt="Status" />
</div>

두둥! ❌ 배포가 **실패**했습니다. `Causes` 버튼을 누르고 로그를 확인해봐도 Health Check가 실패했다는 말만 있고 자세한 내용은 보이지 않습니다. [Node.js 플랫폼 문서](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html)를 살펴봅니다.

> 애플리케이션을 시작하는 데는 몇 가지 옵션이 있습니다. 소스 번들에 Procfile을 추가하여 애플리케이션을 시작하는 명령을 지정할 수 있습니다. Procfile을 제공하지 않고 npm start 파일을 제공할 경우 Elastic Beanstalk가 package.json를 실행합니다. 둘 중 하나를 제공하지 않으면 Elastic Beanstalk에서 app.js 또는 server.js 파일을 이 순서대로 찾아서 실행합니다.

`package.json` 파일이 분명히 있는데 무슨 일이지 확인해보니.. GitHub에서 다운받은 zip 파일이 디렉토리로 묶여 있는 것을 확인했습니다. 문서를 다시 천천히 보니 [소스 파일을 압축하는 방법](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-sourcebundle.html#using-features.deployment.source.git)도 알려줍니다.

```sh
git archive -v -o myapp.zip --format=zip HEAD
```

다시 소스를 압축하고 배포합니다.

🎉 짠! 배포에 성공했습니다.

::: tip AWS Elastic Beanstalk 더보기
📔 [공식 문서](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/Welcome.html)  
📔 [Node.js 문서](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/create_deploy_nodejs.html)
:::

## 마무리

스무스하게 PaaS 배포를 진행했지만, 실제 애플리케이션을 배포하려면 많은 시행착오가 필요합니다. 그럴 때마다 열심히 구글링하고 문서를 확인하면서 해결해야 합니다. 처음에는 간단해 보이지만 깊게 사용하다 보면 내부 구조를 알아야 하고 그러다 보면 어느 순간 기본적인 서버 지식을 요구합니다.

서버를 더 깊이 이해하고 추후 확장을 위해서 밑바닥부터 배포해보겠습니다.
