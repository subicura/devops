---
head:
  - - meta
    - property: "og:description"
      content: AWS 배포 하기
  - - meta
    - property: "twitter:description"
      content: AWS 배포 하기
---

# AWS 배포

::: tip ⚡️ 목표
✅ IAM, EC2에 대해 알아봅니다.  
✅ GitHub Deploy Key를 생성합니다.  
✅ Node.js를 설치하고 웹 애플리케이션 배포 환경을 구축합니다.  
✅ [PM2](https://pm2.keymetrics.io/)를 이용하여 무중단으로 배포합니다.
:::

[[toc]]

`/activity` API에 `participants` 항목을 추가해달라는 요구사항을 받았습니다. 간단하게 소스를 수정하고 새로운 버전을 배포합니다.

```js{6}
app.get("/activity", async function(_, reply) {
  try {
    const response = await fetch("https://www.boredapi.com/api/activity");
    const data = await response.json();
    if (data && data.activity) {
      return { activity: data.activity, participants: data.participants }; // ⇠ 수정
    } else {
      return reply
        .code(400)
        .send({ code: "API_ERROR", message: "Activity is required!" });
    }
  } catch (e) {
    return reply.code(400).send({ code: "API_ERROR", message: e.message });
  }
});
...
```

## Beanstalk 업데이트

기존에 만들었던 환경을 선택하고 새로운 버전을 배포합니다.

1. `Upload and deploy` 버튼을 누르고

<div class="image-750">
  <custom-image src="/imgs/aws-deploy/beanstalk-status.png" alt="Beanstalk Status" />
</div>

2. 최신 소스 파일을 업로드 합니다. 그럼 자동으로 업데이트를 진행합니다.

<div class="image-550">
  <custom-image src="/imgs/aws-deploy/beanstalk-upload.png" alt="Beanstalk Upload" />
</div>

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="배포중에 문제가 생겼습니다 ㅠㅠㅠㅠㅠㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="앗!! 어떤 문제인가요??" isMe="false" />
  <Chat-KakaoMsg msg="업데이트 중에 502 Bad Gateway 오류가 발생했어요 ㅠㅠㅠㅠㅠ 지금은 괜찮은데.. 잠깐 그랬던 것 같습니다" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="혹시 배포할 때 All at once 정책을 선택하셨나요?" isMe="false" />
  <Chat-KakaoMsg msg="기본값을 썼는데 All at once로 되어 있네요.." isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="Beanstalk는 여러 가지 배포 옵션이 있는데 무중단으로 배포하려면 다른 옵션을 선택해야 해요" isMe="false" />
  <Chat-KakaoMsg msg="아.. 몰랐어요 ㅠㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="PaaS는 많은 부분을 알아서 처리해주지만, 문제없이 운영하려면 세부적인 설정도 알아야 해요." isMe="false" />
  <Chat-KakaoMsg msg="밑바닥부터 서버를 구성하면서 어떤 식으로 동작하는지 알아보죠" isMe="false" />
</Chat-KakaoRoom>

::: tip AWS Elastic Beanstalk 더보기
📔 [Beanstalk 배포 옵션](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html)
:::

## IAM 만들기

가상머신을 만들기 전에 AWS 권한으로 서버에 접근할 수 있도록 AWS Systems Manager(SSM) EC2 Role을 생성합니다. 보통 서버에 접근할 땐 개인키<sup>Private Key</sup>나 아이디, 패스워드를 사용하는데 여러 가지 이유로 [AWS Systems Manager(SSM) 방식을 권장](https://aws.amazon.com/blogs/infrastructure-and-automation/toward-a-bastion-less-world/)합니다. 더 안전하고, 더 편리한 방법이라고 보면 될 것 같습니다.

IAM > Roles 메뉴에서 새로운 Role을 추가합니다.

1. EC2 권한을 선택합니다.

<div class="image-600">
  <custom-image src="/imgs/aws-deploy/iam-role-step-1.png" alt="IAM - Select trusted entity" />
</div>

2. AWS에서 미리 만들어 놓은 AmazonSSMManagedInstanceCore Policy를 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/iam-role-step-2.png" alt="IAM - Add permissions" />
</div>

3. 마지막으로 이름을 입력하고 Role을 생성합니다.

<div class="image-550">
  <custom-image src="/imgs/aws-deploy/iam-role-step-3.png" alt="IAM - Name" />
</div>

::: tip AWS System Manager 더보기
📔 [IAM(AWS Identity and Access Management) 공식문서](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/introduction.html)  
📔 [AWS System Manager 공식문서](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)  
📝 [Session Manager로 SSH 접속하기](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html)
:::

## EC2 만들기

IAM Role을 만들었으니, EC2 메뉴에서 새로운 인스턴스<sup>Instance</sup>를 생성합니다.

::: tip 🙋 EC2 설정은 왜 이렇게 복잡한가요
EC2는 2006년 처음 출시되었는데, 한 종류였던 [인스턴스 유형](https://aws.amazon.com/ko/ec2/instance-types/)이 지금은 400개가 넘고 계속해서 새로운 기능이 추가되면서 생성 화면이 엄청나게 복잡해졌습니다. 단순한 가상 머신 하나를 생성하더라도 설정할 게 많습니다.  
더욱 단순하게 사용할 수 있는 [Lightsail](https://aws.amazon.com/free/compute/lightsail/)이란 서비스도 있습니다.
:::

EC2 생성 옵션이 많은데 일단 무시하고 핵심적인 부분을 살펴봅니다.

**Amazon machine image (AMI)** `Amazon Linux 2 AMI (HVM) - Kernel 5.10 / 64-bit (x86)`

- OS(Windows, macOS, Linux, ...)와 CPU 아키텍처(x86, arm)를 선택합니다. 여기선 EC2에 최적화된 리눅스 배포판을 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-ami.png" alt="EC2 - AMI" />
</div>

**Instance type** `t2.micro (1 vCPU / 1 GiB Memory)`

- CPU와 메모리 성능을 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-instance-type.png" alt="EC2 - Instance Type" />
</div>

**Key pair** `사용하지 않음`

- 서버 콘솔 접근 시 사용할 공개키를 선택합니다. 여기선 AWS Systems Manager를 이용한 Session Manager 방식으로 접근할 거라 사용하지 않습니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-keypair.png" alt="EC2 - Key Pair" />
</div>

**Subnet** `Public 영역 선택`

- 네트워크 서브넷을 선택합니다. 퍼블릭 서브넷과 프라이빗 서브넷이 있는데 퍼블릭 서브넷은 인터넷에 노출되어 있고, 프라이빗 서브넷은 내부망에서만 접근이 가능하여 보안에 좋습니다. AWS 가입 후 별도로 VPC 설정을 하지 않았다면 퍼블릭 서브넷이 기본으로 생성되어 있습니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-subnet.png" alt="EC2 - Subnet" />
</div>

**Auto-assign public IP** `Enable`

- 공인 아이피 할당 여부를 선택합니다. 외부에서 접근하려면 아이피가 필요하기 때문에 사용함<sup>Enable</sup>으로 설정합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-public-ip.png" alt="EC2 - Public IP" />
</div>

**Security Group** `HTTP(80) 포트를 전체(0.0.0.0/0) 허용`

- 방화벽을 설정합니다. 보안에서 가장 신경 써야 할 부분 중 하나로 외부에 포트를 오픈할 땐 항상 주의해야 합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-sg.png" alt="EC2 - Security Group" />
</div>

**IAM instance profile** `AmazonSSMManagedInstanceCoreRole`

- IAM 권한을 선택합니다. Session Manager 방식을 사용하기 위해 앞에서 생성한 Role을 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-deploy/ec2-iam.png" alt="EC2 - IAM Role" />
</div>

나머지 항목은 기본값으로 두고 인스턴스를 생성합니다.

잠시 후, 인스턴스가 생성되고 부팅이 완료되면 `Connect` 버튼이 활성화됩니다.

<div class="image-450">
  <custom-image src="/imgs/aws-deploy/ec2-detail.png" alt="EC2 - Menu" />
</div>

`Connect`를 누르면 여러 가지 접속 방법을 보여주는데

<div class="image-700">
  <custom-image src="/imgs/aws-deploy/ec2-session-manager.png" alt="EC2 - Connect" />
</div>

Session Manager를 선택합니다.

<custom-image src="/imgs/aws-deploy/ec2-ssh.png" alt="EC2 - SSH" />

🎉 짠! 웹 기반 터미널로 가상머신에 접속했습니다.

::: tip AWS System Manager 더보기
📔 [EC2(Amazon Elastic Compute Cloud) 공식문서](https://docs.aws.amazon.com/ec2/index.html)  
📝 [Session Manager로 SSH 접속하기](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html)  
📝 [Session Manager 설정하기](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-configure-preferences.html)
:::

## GitHub Deploy Key 설정

GitHub 저장소에 접근하려면 [여러가지 방법](https://docs.github.com/en/developers/overview/managing-deploy-keys)이 있는데 서버에서 사용하기 적합한 Deploy Key 방식을 이용합니다.

Deploy Key 설정을 위해 개인키를 생성합니다.

```sh
# 접속 유저를 ssm-user에서 ec2-user로 변경 (앞으로 모든 명령어는 ec2-user로 수행. 매 접속시마다 실행)
sudo su ec2-user
# 개인키 + 공개키 생성
ssh-keygen -t ed25519 -C "awesome-api"
```

저장 위치와 암호를 물어보는데 그냥 엔터를 입력합니다.

```sh
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/ec2-user/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ec2-user/.ssh/id_ed25519.
Your public key has been saved in /home/ec2-user/.ssh/id_ed25519.pub.
The key fingerprint is:
SHA256:NPwKisflhIrCK+/dBoUpYR0xCM812349V9lNoTCUuYI awesome-api
The key's randomart image is:
+--[ED25519 256]--+
|ooo=+o .+= oo.   |
| *= o. .=o...    |
|..+. = .+..      |
|  ..E.+..o       |
|   ..o+.S .      |
| *= o. .=o...    |
|..+. = .+..      |
|  ..E.+..o       |
|   ..o+.S .      |
+----[SHA256]-----+
```

생성한 공개키 값을 확인합니다.

```sh
# 공개키 출력
cat ~/.ssh/id_ed25519.pub
```

```sh
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB1Ir2w8wBIEk7QyVEkBUNPlSanejN1mxPZjdoG6tx56 awesome-api
```

출력결과를 드래그 하고 복사한 다음, GitHub 저장소의 Settings 메뉴에서 Deploy key를 추가합니다.

Title 없이 Key만 입력합니다.

<div class="image-550">
  <custom-image src="/imgs/aws-deploy/github-deploy-keys.png" alt="EC2 - Deploy Keys" />
</div>

이제 서버에서 GitHub에 접근할 수 있는 권한이 추가되었습니다.

## Node.js 배포

모든 준비가 끝났으니 본격적으로 Node.js를 설치합니다.

```sh
# Node.js 버전 관리자 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
# nvm 활성화
. ~/.nvm/nvm.sh
# Node.js 16버전 설치
nvm install 16
# 설치 확인
node -v
```

```sh
v16.14.2
```

GitHub 저장소에서 소스를 가져옵니다.

```sh
# Git 설치
sudo yum install git -y
# 경로 이동
cd ~/
# 저장소 가져오기
git clone git@github.com:subicura/awesome-api-server.git
```

패키지를 설치하고 웹서버를 실행합니다.

```sh
# 경로 이동
cd ~/awesome-api-server
# node 패키지 설치
npm install
# 웹 서버 실행
nohup npm start &
```

::: tip nohup
nohup 명령어는 리눅스에서 프로세스를 실행한 터미널의 연결이 끊어지더라도 계속해서 동작 할 수 있게 해주는 명령어입니다.
:::

80 포트는 `root` 계정만 접근할 수 있기 때문에, 3000 포트로 실행한 웹서버를 80 포트랑 연결해 줍니다.

```sh
# 80 포트로 들어온 요청을 3000 포트로 연결
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
```

EC2 서버의 공인 IP를 확인하고 테스트합니다. 정상적으로 배포가 완료되었습니다!

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="알려주신 대로 IAM Role을 추가하고 EC2도 만들어서 배포는 잘 됐어요!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="ㅊㅋㅊㅋ 합니다 ㅎㅎㅎ" isMe="false" />
  <Chat-KakaoMsg msg="근데.. 새 버전으로 배포는 어떻게 하는 걸까요?" isMe="true" />
  <Chat-KakaoMsg msg="최신 소스를 pull 받은 다음 Node.js를 재시작하면 될 것 같은데.. 그럼 재시작하는 동안 서비스가 멈추지 않을까요?? ㅠㅠ" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="네네 맞아요" isMe="false" />
  <Chat-KakaoMsg msg="서비스는 멈추면 안 되고 Node.js는 재시작해야 하는 상황이네요. 하지만 Node.js를 재시작하는 동안은 서비스가 당연히 안 될 거고.." isMe="false" />
  <Chat-KakaoMsg msg="맞아요.. 어쩌죠.." isMe="true" />
  <Chat-KakaoMsg msg="쉽게 생각하면 서버를 2대 쓰면 돼요. 1대가 배포 중이더라도 다른 1대가 살아 있으면 서비스가 문제없이 동작하는 거죠" isMe="false" />
  <Chat-KakaoMsg msg="오?!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="Node.js 생태계엔 PM2라는 프로세스 관리 도구가 있어요" isMe="false" />
  <Chat-KakaoMsg msg="이걸 써서 무중단 배포를 해보죠" isMe="false" />
</Chat-KakaoRoom>

## PM2

PM2는 운영환경에서 사용할 수 있는 강력한 프로세스 관리자입니다. 여러 개의 인스턴스를 생성하고 모니터링하고 무중단 배포를 가능하게 합니다. (그 외에도 원격 배포 등 다양한 기능이 있습니다.)

PM2를 설치하고 사용법을 알아봅니다.

```sh
# 전역적으로 pm2 설치
npm install pm2 -g
# 버전 확인
pm2 -version
```

```sh
                        -------------

__/\\\\\\\\\\\\\____/\\\\____________/\\\\____/\\\\\\\\\_____
 _\/\\\/////////\\\_\/\\\\\\________/\\\\\\__/\\\///////\\\___
  _\/\\\_______\/\\\_\/\\\//\\\____/\\\//\\\_\///______\//\\\__
   _\/\\\\\\\\\\\\\/__\/\\\\///\\\/\\\/_\/\\\___________/\\\/___
    _\/\\\/////////____\/\\\__\///\\\/___\/\\\________/\\\//_____
     _\/\\\_____________\/\\\____\///_____\/\\\_____/\\\//________
      _\/\\\_____________\/\\\_____________\/\\\___/\\\/___________
       _\/\\\_____________\/\\\_____________\/\\\__/\\\\\\\\\\\\\\\_
        _\///______________\///______________\///__\///////////////__


                          Runtime Edition

        PM2 is a Production Process Manager for Node.js applications
                     with a built-in Load Balancer.

                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

[PM2] Spawning PM2 daemon with pm2_home=/Users/cs.kim/.pm2
[PM2] PM2 Successfully daemonized
5.2.0
```

버전만 확인하려고 했는데 뭔가 큰 로고랑 소개, 간단한 사용법도 출력되었습니다. PM2 설정 파일을 만듭니다.

```sh
# PM2 기본 설정 파일 생성
pm2 init simple
```

생성된 `ecosystem.config.js`을 다음과 같이 수정합니다.

```js
module.exports = {
  apps: [
    {
      name: "awesome-api",
      script: "./src/server.js",
      exec_mode: "cluster",
    },
  ],
};
```

추가한 설정파일을 커밋하고 GitHub 저장소에 push 한 다음 EC2 서버에서 pull 하고 실행해봅니다.

```sh
# 실행중인 Node.js 프로세스 중지
kill -9 `ps -ef | grep 'node' | grep -v grep | awk '{print $2}'`
# 서버에도 PM2 설치
npm install pm2 -g
# PM2 실행
pm2 start
```

```sh
┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ awesome-api    │ default     │ 1.0.0   │ fork    │ 2477     │ 0s     │ 0    │ online    │ 0%       │ 31.2mb   │ ec2-user │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

pm2가 Node.js 웹 애플리케이션을 성공적으로 실행했습니다. 테스트해보니 정상적으로 동작합니다!

소스를 수정하진 않았지만, 서버를 재시작 해볼까요?

```sh
# PM2 앱 재시작
pm2 reload awesome-api
```

중단 없이 성공적으로 재시작 했습니다. PM2가 프로세스를 새로 생성하고 이전 프로세스를 중단하는 과정을 자연스럽게 처리하면서 간편하게 무중단 배포를 구현했습니다.

`src/app.js` 파일을 수정하고 수정사항이 잘 적용되는지 확인해봅니다.

```js
app.get("/ping", async function () {
  // return { status: "ok" }; // ⇠ 삭제
  return { status: "pong" }; // ⇠ 추가
});
```

파일을 수정하고 재시작(`pm2 reload awesome-api`)합니다.

🎉 성공! 수정사항이 잘 반영되었습니다.

::: tip PM2 더보기
📔 [PM2 공식문서](https://pm2.keymetrics.io/docs/usage/quick-start/)  
📔 [PM2 설정파일](https://pm2.keymetrics.io/docs/usage/application-declaration/)  
📝 [클러스터 모드](https://pm2.keymetrics.io/docs/usage/cluster-mode/)  
📝 [Graceful start/shutdown](https://pm2.keymetrics.io/docs/usage/signals-clean-restart/)
:::

## 마무리

서버 배포를 위한 최소한의 기능을 알아보았습니다. 전체 배포 과정을 요약하면 다음과 같습니다.

1. SSH대신 Session Manager를 사용하기 위해 IAM 생성
2. 공인 IP를 가진 EC2 생성
3. nvm을 이용하여 Node.js 설치
4. 소스 가져오기
5. PM2로 프로세스 관리 및 업데이트

여기에 몇 가지 서비스를 붙이면 그럴듯한 배포 시스템이 완성됩니다.

그럼 여러 대의 서버를 이용한 보다 안정적인 배포 방식을 알아보겠습니다.
