---
description: AWS 멀티 서버 배포 하기
image: /imgs/share.png
---

# AWS 다중 서버 배포

::: tip ⚡️ 목표
✅ AWS VPC에 대해 알아봅니다.  
✅ AWS CLI 사용법을 알아봅니다.  
✅ 프라이빗 서브넷을 생성합니다.  
✅ ALB를 생성합니다.  
:::

[[toc]]

`Awesome API` 서비스는 점점 인기가 많아졌고 더 이상 `t2.micro` 한 대로 버티긴 어려울 것 같습니다. CPU 성능을 높이는 스케일 업<sup>Scale Up</sup> 방식도 생각했지만, 부하에 따라 서버의 개수를 유연하게 조정할 수 있는 스케일 아웃<sup>Scale Out</sup> 방식으로 결정했습니다.

<Chat-KakaoRoom>
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="이번엔 서버를 프라이빗 서브넷에 구축해 볼게요" isMe="false" />
  <Chat-KakaoMsg msg="퍼블릭 서브넷하고 프라이빗 서브넷 차이가 뭔가요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="퍼블릭 서브넷은 인터넷에 노출된 영역이고 프라이빗 서브넷은 인터넷과 분리된 내부망 영역이라고 보시면 돼요" isMe="false" />
  <Chat-KakaoMsg msg="근데.. 인터넷이랑 분리되어 있으면 어떻게 접근하나요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="퍼블릭 서브넷에 로드 밸런서랑 NAT 게이트웨이를 둘 거에요. 그럼 프라이빗 네트워크에 있는 서버가 외부랑 통신할 수 있어요" isMe="false" />
  <Chat-KakaoMsg msg="아! 그럼 외부에서 접근할 땐 로드 밸런서를 통해서 접근하고 내부에서 인터넷 통신이 필요할 땐 NAT 게이트웨이를 거치는 거군요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="네네 맞아요. 직접적인 서버 접근이 불가능하기 때문에 보안 측면에서 유리해요" isMe="false" />
  <Chat-KakaoMsg msg="네트워크 구성이 쪼옴 어려울 수 있는데 일단 만들면서 알아볼게요" isMe="false" />
</Chat-KakaoRoom>

## AWS VPC

VPC(Virtual Private Cloud)는 AWS에서 제공하는 강력한 ~~복잡한~~ 가상 네트워크 환경입니다.

서울(ap-northeast-2), 도쿄(ap-northeast-1), N. Virginia(us-east-1)등 각 지역<sup>region</sup>마다 VPC가 있고 서울은 4개의 가용영역<sup>Availability Zone</sup>(A,B,C,D)이 있습니다. 처음 AWS 계정을 생성하면 [가용영역별로 하나씩 퍼블릭 서브넷](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/default-vpc.html)을 만들어 주는데, 원하는 만큼 서브넷을 추가할 수 있고 프라이빗 서브넷을 추가하여 보안을 강화할 수 있습니다.

그냥 적당히 설정하고 쓰면 안 될까 싶지만, 인터넷에서 바로 접근할 수 있는 퍼블릭 서브넷에 서버를 배치하는 건 위험하고, 비좁은 서브넷에 서버를 배치하다 보면 나중에 IP가 부족할 수도 있습니다. ~~EKS 맛좀 보면..~~ 추후 VPC간 연결이나 VPN 사용을 고려하여 네트워크 대역을 변경할 필요도 있습니다.

일단 기본 설정을 유지하고 프라이빗 서브넷을 추가합니다. 서울 리전(ap-northeast-2) 가용영역 중 A와 C에 `172.31.112.0/20`, `172.31.144.0/20` 영역으로 생성하겠습니다.

<div class="image-500">
  <custom-image src="/imgs/aws-multi-deploy/vpc-subnet.png" alt="Public Subnet" />
</div>

::: tip CIDR(Classless Inter-Domain Routing)
[CIDR(사이더)](<https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%EB%8D%94_(%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9)>)는 IP 주소를 할당하고 패킷을 라우팅하는 방식 중 하나입니다. 서버는 IP 주소(xxx.xxx.xxx.xxx)로 통신을 하는데 하나하나 경로를 지정하면 복잡하기 때문에 앞에 주소를 고정하고 뒤에 주소만 다르게 하여 블록 단위로 경로를 관리합니다.  
CIDR 블록은 `xxx.xxx.xxx.xxx(아이피)/xx(고정 비트 수)`와 같이 표기하며 영역이 서로 겹치지 않게 잘 관리해야 합니다.
:::

::: tip AWS VPC 더보기
📔 [Amazon VPC란 무엇인가?](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/what-is-amazon-vpc.html)
:::

## AWS CLI

서브넷은 AWS 관리자 화면에서 클릭클릭으로 만들 수 있지만, 이번엔 AWS CLI<sup>Command Line Interface</sup>를 이용합니다. AWS는 ~~거의~~ 모든 걸 CLI로 빠르고 간편하게 만들 수 있습니다.

1. Access Key를 만들기 위해 Security Credentials 메뉴를 선택합니다.

<div class="image-250">
  <custom-image src="/imgs/aws-multi-deploy/security-credentials.png" alt="Security Credentials" />
</div>

2. Access Keys 항목에서 `Create New Access Key`를 누릅니다.

<div class="image-800">
  <custom-image src="/imgs/aws-multi-deploy/accesskey.png" alt="Access Key" />
</div>

3. Access Key ID와 Secret Access Key를 확인할 수 있습니다.

<div class="image-550">
  <custom-image src="/imgs/aws-multi-deploy/accesskey-create.png" alt="Access Key Created" />
</div>

::: warning 주의!!
Access Key ID와 Secret Access Key는 **무지무지무지 중요한 정보**입니다. 이 키만 있으면 AWS의 모든 리소스를 만들 수 있기 때문에 혹시나 유출되면 순식간에 채굴 서버가 생성되는 무시무시한 경험을 할 수 있습니다. 수백, 수천만원이 청구되길 원치 않는다면 키를 반드시 안전하게 보관하고 실습이 끝나고 필요하지 않은 키는 삭제하는 것이 좋습니다.
:::

[awscli를 설치하고](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html) Access Key를 설정합니다.

```sh
aws configure
```

```sh
AWS Access Key ID [None]: AKIA61234567890ABCDE
AWS Secret Access Key [None]: thisissecretdonotusethis
Default region name [None]: ap-northeast-2
Default output format [None]:
```

설정을 완료하고 계정 정보를 확인합니다.

```sh
aws sts get-caller-identity
```

```json
{
  "UserId": "AIDAI1234567890ABCDEF",
  "Account": "1234567890AB",
  "Arn": "arn:aws:iam::1234567890AB:user/subicura"
}
```

준비가 완료되었으니, 한 땀 한 땀 리소스를 생성하고 연결해 보겠습니다.

::: tip cli_pager 옵션
AWS CLI의 실행 결과를 화면에 그대로 출력하려면 다음 명령어를 입력합니다.  
`aws configure set cli_pager ""`
:::

::: tip AWS CLI 더보기
📔 [AWS CLI 소개](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)  
📝 [AWS Vault](https://github.com/99designs/aws-vault)
:::

## 프라이빗 서브넷 만들기

<div class="image-550">
  <custom-image src="/imgs/aws-multi-deploy/vpc-private-subnet.png" alt="Public Subnet" />
</div>

프라이빗 서브넷을 만들기 위해선 다음 리소스가 필요합니다.

- 서브넷
- NAT 게이트웨이 (+ 공인 IP / Elastic IP)
- 라우팅 테이블

1. A 가용영역에 서브넷을 생성합니다.  
   서브넷이 퍼블릭 서브넷인지 프라이빗 서브넷인지는 연결된 라우팅 테이블에 따라 결정됩니다. 라우팅 테이블에 설정된 경로가 인터넷 게이트웨이를 바라보면 퍼블릭 서브넷, 그렇지 않으면 프라이빗 서브넷입니다.  
   기본 라우팅 테이블은 인터넷 게이트웨이를 바라보므로 새로 만들어야 합니다.

```sh
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 172.31.112.0/20 --availability-zone=ap-northeast-2a
```

> - `vpc-id`: 서브넷을 생성할 VPC ID를 입력합니다. VPC 메뉴에서 확인하거나 `aws ec2 describe-vpcs --query 'Vpcs[*].VpcId'` 명령어를 이용합니다.
> - `availability-zone`: 가용영역을 입력합니다. 서울 지역의 A 가용영역인 `ap-northeast-2a`를 입력합니다.

2. NAT 게이트웨이에 할당할 공인 IP를 생성합니다.

```sh
aws ec2 allocate-address --domain vpc
```

3. 프라이빗 서브넷이 인터넷에 연결할 수 있도록 NAT 게이트웨이를 생성합니다.

```sh
aws ec2 create-nat-gateway --subnet-id <public-subnet-id> --allocation-id <elastic-ip-address-id>
```

> - `subnet-id`: NAT 게이트웨이가 위치할 서브넷 ID를 입력합니다. A 가용영역에 있는 Public Subnet ID를 선택합니다. VPC > Subnets 메뉴에서 확인하거나 `aws ec2 describe-subnets --query 'Subnets[*].[SubnetId, AvailabilityZone, CidrBlock]'` 명령어를 이용합니다.
> - `allocation-id`: 위에서 생성한 Elastic IP 정보를 입력합니다.

4. 프라이빗 서브넷에 연결할 라우팅 테이블을 만듭니다.

```sh
aws ec2 create-route-table --vpc-id <vpc-id>
```

5. 생성한 라우팅 테이블에 경로를 추가합니다.

```sh
aws ec2 create-route --route-table-id <route-table-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <nat-gateway-id>
```

> - `route-table-id`: 위에서 생성한 라우팅 테이블 ID를 입력합니다.
> - `destination-cidr-block`: 내부망을 제외한 모든 요청을 NAT 게이트웨이로 보내기 위해 '0.0.0.0/0'을 입력합니다.
> - `gateway-id`: 위에서 생성한 NAT 게이트웨이 ID를 입력합니다.

6. 완성된 라우팅 테이블을 서브넷에 연결합니다.

```sh
aws ec2 associate-route-table --route-table-id <route-table-id> --subnet-id <private-subnet-id>
```

> - `route-table-id`: 위에서 생성한 라우팅 테이블 ID를 입력합니다.
> - `subnet-id`: 위에서 생성한 서브넷 ID를 입력합니다.

🎉 조금(?) 복잡했지만 프라이빗 서브넷을 생성했습니다! 위 내용을 참고하여 C 가용영역에 하나 더 만듭니다. ~~숙제~~

## EC2 여러개 만들기

지난번에 배포했던 방식은 다음과 같습니다.

<div class="image-550">
  <custom-image src="/imgs/aws-multi-deploy/vpc-public.png" alt="Public Subnet" />
</div>

퍼블릭 서브넷에 EC2를 배치하고 바로 요청을 처리하는 방식입니다. 방화벽을 설정했지만, 왠지 불안한 구성입니다.

<div class="image-550">
  <custom-image src="/imgs/aws-multi-deploy/vpc-private.png" alt="Public / Private Subnet" />
</div>

이번에 구성할 방식은 프라이빗 서브넷에 EC2 2대를 배치하고 Load Balancer를 통해 요청을 처리합니다. 프라이빗 서브넷에 배치해서 안전하고 Load Balancer를 통해 여러 대의 서버에 요청을 할 수 있습니다.

[지난번](./aws-deploy.html#ec2-만들기)에 만들었던 방법과 비슷하게 EC2를 2대 생성합니다. 차이점은 Subnet, Auto-assign public IP, Security Group 입니다.

**Subnet** `Private 영역 선택`

- 앞에서 생성한 프라이빗 서브넷을 선택합니다.

<div class="image-600">
  <custom-image src="/imgs/aws-multi-deploy/ec2-private-subnet.png" alt="EC2 - Subnet" />
</div>

**Auto-assign public IP** `Disable`

- 외부에 노출하지 않는 서버이므로 공인 아이피를 할당하지 않습니다.

<div class="image-600">
  <custom-image src="/imgs/aws-multi-deploy/ec2-private-ip.png" alt="EC2 - Public IP" />
</div>

**Security Group** `3000 포트를 전체(0.0.0.0/0) 허용`

- Load Balancer가 80 포트로 요청을 받으면 뒤에 있는 서버는 꼭 80 포트가 아니여도 괜찮습니다. 기존 애플리케이션 설정인 3000 포트를 사용합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-multi-deploy/ec2-private-sg.png" alt="EC2 - Security Group" />
</div>

**Number of instances** `2`

- 동일한 설정으로 여러 대의 서버를 생성합니다.

<div class="image-350">
  <custom-image src="/imgs/aws-multi-deploy/ec2-number.png" alt="EC2 - Number of instances" />
</div>

서버가 생성되면, [지난번과 동일](./aws-deploy.html#node-js-배포)하게 서버에 접속하여 애플리케이션을 배포합니다. 3000포트 그대로 서비스하므로 iptables 설정은 제외해도 됩니다.

## Elastic Load Balancer 만들기

로드 밸런서는 부하를 적절하게 분산해주는 장치입니다. 기본적인 동작 방식은 사용자가 로드 밸런서에 요청을 보내면 로드 밸런서가 여러대의 서버 중 한대에 요청을 전달하고, 서버가 응답한 결과를 다시 사용자에게 전달해줍니다.

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="지난번엔 서버 IP로 바로 요청을 보냈는데, 이젠 로드 밸런서로 요청을 해야 하나요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="네네 로드 밸런서로 요청을 보내면 연결된 서버로 부하를 분산해 줍니다" isMe="false" />
  <Chat-KakaoMsg msg="근데.. 혹시 로드 밸런서가 죽으면 어떻게 되나요??" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="로드 밸런서가 죽으면 아무리 서버가 많아도 서비스가 멈추겠죠??" isMe="false" />
  <Chat-KakaoMsg msg="헉??!! 그럼.. 로드 밸런서를 안 죽게 그 앞에 또 로드 밸런서를 두나요..?" isMe="true" />
  <Chat-KakaoMsg msg="그리고 부하가 진짜 많으면 로드 밸런서도 죽을 수 있는 거 아닌가요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="ㅎㅎ 맞아요. 로드 밸런서도 죽을 수 있기 때문에 대비가 필요해요" isMe="false" />
  <Chat-KakaoMsg msg="그 고민을 해결해주는 서비스가 Elastic Load Balancer에요. Elastic Load Balancer는 둘 이상의 가용 영역에서 설치해서 안정성을 높이고 트래픽에 따라 자동으로 성능을 확장해줍니다" isMe="false" />
</Chat-KakaoRoom>

Elastic Load Balancer는 Application Load Balancers, Network Load Balancers, Gateway Load Balancers, Classic Load Balancer 총 4가지 로드 밸런서를 제공하는데 여기선 ALB(Application Load Balancers)를 사용합니다. HTTP 통신을 할 때 가장 많이 사용하는 로드 밸런서입니다.

EC2 > Load Balancers 메뉴에서 새로운 로드 밸런서를 추가합니다.

1. 여러 종류 중에 ALB를 선택합니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/create-lb.png" alt="ELB - Type" />
</div>

2. 이름을 입력하고 Scheme와 IP address type은 기본값을 선택합니다. 내부망에서 사용하는 경우 Internal을 선택할 수 있습니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/elb-basic-config.png" alt="ELB - Basic Configuration" />
</div>

3. 로드 밸런서를 배치할 서브넷을 선택합니다. 로드 밸런서는 인터넷 요청을 받아야 하므로 퍼블릭 서브넷에 배치하고 안정성을 위해 2개 이상의 가용 영역을 선택합니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/elb-network.png" alt="ELB - Network Mapping" />
</div>

4. HTTP(80)를 허용하는 Security Group을 만듭니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/elb-sg.png" alt="ELB - Security Group" />
</div>

5. 로드 밸런서 HTTP(80) 요청을 전달할 Target Group을 생성합니다. 대부분 기본 설정을 그대로 사용하고 Port를 80에서 3000으로 변경합니다.

<div class="image-250">
  <custom-image src="/imgs/aws-multi-deploy/target-group-port.png" alt="Target Group - Port" />
</div>

> 대상 인스턴스는 이전에 만든 EC2를 선택하고 `Include as pending below`를 선택합니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/target-group-regist.png" alt="Target Group - Regist" />
</div>

6. 생성한 Target Group을 선택합니다.

<div class="image-700">
  <custom-image src="/imgs/aws-multi-deploy/elb-target.png" alt="ELB - Target Group" />
</div>

최종적으로 ALB가 생성되면, DNS name으로 접근하여 테스트합니다.

🎉성공! 정상적으로 응답을 확인했습니다. 이제 서버 한 대에 문제가 생겨도 서비스는 정상 작동하고 부하가 생겨도 손쉽게 확장할 수 있습니다.

::: tip Elastic Load Balancing 더보기
📔 [Elastic Load Balancing 소개](https://aws.amazon.com/ko/elasticloadbalancing/)  
📔 [Application Load Balancer 알아보기](https://docs.aws.amazon.com/ko_kr/elasticloadbalancing/latest/application/introduction.html)
:::

## 마무리

가장 일반적인 배포 방식을 알아보았습니다. 서비스마다 세부적인 차이는 있지만, 큰 틀은 동일하다고 보시면 됩니다.

Elastic Beanstalk도 EC2를 만들고, Target Group에 등록하고 ELB를 연결하는 동일한 방식을 사용합니다. 배포방식을 `All at once`에서 `Rolling with additional batch`로 변경하면, 배포할 때 새로운 EC2를 하나 더 만들고 애플리케이션을 배포한 다음 Target Group을 새로운 EC2를 바라보게 변경하고 이전 EC2를 제거하는 과정을 자동으로 해줍니다. 순간적으로 인스턴스가 2대 생기기 때문에 서비스가 중단되지 않겠죠?

그럼 도메인을 연결하고 HTTPS 보안을 적용하는 방법을 알아보겠습니다.
