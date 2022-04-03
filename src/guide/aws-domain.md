---
head:
  - - meta
    - property: "og:description"
      content: 도메인 연결하고 SSL 인증서 적용하기
  - - meta
    - property: "twitter:description"
      content: 도메인 연결하고 SSL 인증서 적용하기
---

# 도메인 연결하기

::: tip ⚡️ 목표
✅ Cloudflare을 이용하여 도메인을 설정합니다.  
✅ HTTP와 HTTPS 차이를 이해합니다.  
✅ AWS Certificate Manager를 이용하여 인증서를 발급합니다.  
✅ ALB에 SSL 인증서를 등록합니다.
:::

[[toc]]

`Awesome API`는 ALB 주소 `http://awesome-api-lb-0123456789.ap-northeast-2.elb.amazonaws.com/` 그대로 서비스 중입니다. 아무래도 긴 도메인은 기억하기 어렵고 나중에 ALB를 변경하면 주소가 변경되어 문제가 생기니 별도 도메인을 사용하기로 했습니다.

도메인을 발급하고 DNS에 연결한 다음, ALB 주소를 바라보게 설정하면 끝입니다. ~~참 쉽죠?~~

## 도메인 발급

유료로 도메인을 구입하거나 [freenom](https://www.freenom.com/)에서 무료로 도메인을 발급합니다.

1. 원하는 주소를 입력하고 검색합니다.

<div class="image-550">
  <custom-image src="/imgs/aws-domain/freenom-search.png" alt="freenom" />
</div>

2. 다행히 아직 선점당하지 않은 도메인이 있습니다. `.ml`이 뭔가 머신러닝 느낌도 나고 좋아 보입니다. `Get it now!`를 누릅니다.

<div class="image-450">
  <custom-image src="/imgs/aws-domain/freenom-result.png" alt="freenom result" />
</div>

> `Get it now!`로 선택이 불가능하다면, `12purple.ml`처럼 전체 도메인으로 다시 검색합니다.

3. 12개월 무료를 선택하고 `Continue`를 누릅니다.

<div class="image-550">
  <custom-image src="/imgs/aws-domain/freenom-cart.png" alt="freenom cart" />
</div>

4. 이메일 인증 또는 구글, 페이스북으로 로그인하고 최종 정보를 입력하면 도메인이 발급됩니다.

<div class="image-450">
  <custom-image src="/imgs/aws-domain/freenom-verify.png" alt="freenom verify" />
</div>

> freenom은 테스트 용도로만 사용하고 실제 서비스에 사용한다면 유료 도메인을 검토해주세요.

## DNS 등록

발급받은 도메인에 주소를 연결하기 위해 DNS(Domain Name System)를 등록합니다.

AWS를 이용중이면 Amazon Route53을 사용하는 것이 좋습니다. Amazon Route53은 저렴하고 모니터링이나 로드 밸런싱 같은 [여러 가지 기능](https://aws.amazon.com/ko/route53/)을 제공합니다. 최근 AWS에 특화된 기능이 붙으면서 UI가 많이 복잡해졌는데 지금은 DNS의 기본적인 사용법을 알아보는 것이 중요하므로 좀 더 일반적이고 범용적으로 사용할 수 있는 Cloudflare를 사용하겠습니다.

[Cloudflare](https://www.cloudflare.com/)에 로그인하고 Websites 메뉴에서 새로운 사이트를 추가합니다.

1. 방금 생성한 도메인을 입력하고

<div class="image-400">
  <custom-image src="/imgs/aws-domain/cf-add-site.png" alt="Cloudflare Websites" />
</div>

2. 무료 플랜을 선택합니다.

<div class="image-500">
  <custom-image src="/imgs/aws-domain/cf-plan.png" alt="Cloudflare Plan" />
</div>

3. `12purple.ml`을 바라보는 경로를 추가합니다.

<custom-image src="/imgs/aws-domain/cf-add-record.png" alt="Cloudflare Add Record" />

> - `Type`: IP주소를 바로 입력할 땐 A를 선택하고 도메인 주소를 바라볼 땐 CNAME을 선택합니다. ALB는 고정 IP 대신 도메인을 제공하므로 CNAME을 선택합니다.
> - `Name`: 도메인 앞에 붙는 주소를 입력합니다. www.12purple.ml 이라면 www를 입력하고 12purple.ml 처럼 아무것도 없다면 @를 입력합니다.
> - `Target`: 바라보는 주소를 입력합니다. ALB 도메인 주소를 입력합니다.
> - `Proxy`: Cloudflare에 특화된 기능입니다. 단순 경로 설정만 할지, 모든 트래픽을 Cloudflare를 거치게 할지 선택합니다. 상황에 따라 결정해야 하는 데 일단 사용하고 어떤 기능인지 알아보겠습니다.
> - `TTL`: 경로 정보 유지(캐시) 시간을 설정합니다. 한번 IP 정보를 조회하면 TTL 시간만큼 다시 조회하지 않습니다. TTL 시간이 너무 길면 DNS 변경이 바로 적용되지 않으므로 너무 길지 않게 설정합니다.

4. 마지막으로 도메인을 구입한 곳에서 Cloudflare DNS를 바라보도록 네임서버<sup>Nameserver</sup>를 변경합니다.

<div class="image-450">
  <custom-image src="/imgs/aws-domain/cf-nameserver.png" alt="Cloudflare Nameserver" />
</div>

5. Management Tools > Nameservers 메뉴를 선택합니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/freenom-edit.png" alt="Freenom Edit" />
</div>

6. Cloudflare에서 안내한 네임서버 주소를 입력합니다. 그리고 잠시 기다립니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/freenom-ns.png" alt="Freenom Nameserver" />
</div>

> DNS는 전파되는 데 시간이 필요합니다. 빠르면 1~2분, 늦으면 하루가 걸리기도 합니다.

7. 잠시 기다리고 새로고침하면 최종적으로 설정이 완료됩니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/cf-success.png" alt="Cloudflare Success" />
</div>

<div class="image-600">
  <custom-image src="/imgs/aws-domain/12purple.png" alt="12Purple" />
</div>

🎉 짠! https://12purple.ml 접속에 성공했습니다! 도메인이 연결되었고.. 앗? `HTTPS(SSL)`로 접속됩니다?

## HTTPS

<Chat-KakaoRoom>
  <Chat-KakaoMsg msg="Cloudflare에서 제공하는 프록시 기능을 사용했더니 자동으로 HTTPS 적용이 되네요!" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="HTTPS가 뭔지 아시나요?" isMe="false" />
  <Chat-KakaoMsg msg="아.. 그 HTTP 통신에 암호화 기능을 추가해서 데이터를 안전하게 주고받을 수 있게 해주는 거 아닌가요?" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="네네 그러면 지금 Cloudflare가 HTTPS를 적용해주니까 안전한 걸까요??" isMe="false" />
  <Chat-KakaoMsg msg="네네 그쵸 브라우저에서도 자물쇠 모양이 보이고 안전한 연결이라고 확인했습니다" isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="사실 방금 적용한 HTTPS 방식은 안전하지 않아요. Cloudflare에서도 개인정보가 포함되어 있을 땐 해당 방식을 사용하지 말라고 안내합니다" isMe="false" />
  <Chat-KakaoMsg msg="오잉?? " isMe="true" />
  <Chat-KakaoMsg avatar="senior" user="촋 CTO" msg="HTTPS가 어떻게 동작하는지 정확히 이해하지 않으면, 오히려 보안에 더 위험할 수 있어요. 한번 자세히 알아볼게요!" isMe="false" />
</Chat-KakaoRoom>

사용자가 웹서버와 통신을 하면 중간에 악의적인 사용자가 내용을 몰래 훔쳐볼 수 있습니다. 예를 들어, 신뢰할 수 없는 Wifi 공유기를 사용하면 공유기에 설치된 악의적인 프로그램이 메시지를 훔쳐볼 수 있는 거죠.

HTTPS를 사용하면 모든 요청을 암호화해서 전송합니다.

다음과 같은 HTTP 요청을

```sh
GET /ping HTTP/2
Host: 12purple.ml
user-agent: curl/7.79.1
accept: */*
```

HTTPS에선 이런 식으로 전송합니다.

```
m5ea9XAZX7mUjeVCVMWWBwqKVQ585h8DVUDPSXzMjv7AJBS...
```

HTTPS 기술은 안전하지만, 문제는 **암호화 구간**입니다.

Cloudflare에서 기본으로 설정한 Flexible 방식은 브라우저와 Cloudflare 구간만 암호화 하는 방식입니다.

<div class="image-550">
  <custom-image src="/imgs/aws-domain/cf-flexible.png" alt="Cloudflare flexible mode" />
</div>

브라우저와 Cloudflare 구간은 암호화하지만, Cloudflare에서 AWS(ALB) 구간은 평문으로 전송하는 것을 볼 수 있습니다.평문으로 전송된 데이터는 악의적인 사용자가 훔쳐볼 수 있고 이를 해결하려면 Cloudflare와 AWS 구간도 HTTPS 통신을 하거나 프록시 기능을 사용하지 않고 직접 ALB에서 HTTPS를 제공해야 합니다.

::: tip Cloudflare 더보기
📝 [SSL 암호화 방식 안내](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
:::

## AWS Certificate Manager

보안 취약점을 해결하기 위해 ALB에 인증서를 적용합니다.

<div class="image-700">
  <custom-image src="/imgs/aws-domain/aws-certificate.png" alt="Cloudflare flexible mode" />
</div>

브라우저와 AWS(ALB) 구간을 암호화하고 ALB와 EC2 구간은 기존과 동일하게 평문으로 전송합니다. AWS 내부 통신이 평문이긴 하지만, VPC 네트워크는 다른 네트워크와 격리되어 있기 때문에 데이터가 유출될 가능성은 거의 없습니다.

로드밸런서가 HTTPS를 처리하고 백엔드 서버와 HTTP로 통신하는 방식을 SSL Termination 또는 SSL Offloading이라고 하는데, 이 방식은 암복호화 부하를 로드 밸런서가 책임지기 때문에 백엔드 서버의 부하가 줄어들고 백엔드 서버에 별도 인증서를 설정할 필요가 없어 전체 설정이 단순하고 편리한 장점이 있습니다.

::: warning ELB의 SSL Termination 방식은 안전한가요?
[충분히 안전](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/configuring-https-endtoend.html)하지만 완전히 안전하진 않습니다. 더 높은 수준의 보안을 요구하는 경우 ELB와 EC2 구간도 HTTPS로 암호화해야 합니다.

📝 [ALB와 내부 서비스간 인증 더보기](https://kevin.burke.dev/kevin/amazons-albs-insecure-internal-traffic/)
:::

ACM(AWS Certificate Manager)을 사용하면 인증서를 **무료로** 만들 수 있습니다. ACM메뉴에서 `Request a certificate`를 선택합니다.

1. `Public certificate`를 선택하고 `Next`를 클릭합니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/acm-public.png" alt="ACM public certificate" />
</div>

2. 도메인을 설정합니다.

인증서는 특정 도메인뿐 아니라, 서브 도메인(\*.12purple.ml)을 지원합니다. Wildcard라고 부르는 기능을 사용하면 도메인마다 설정할 필요가 없이 \*로 여러 개의 도메인을 지원하기 때문에 유용합니다. 단, 서브의 서브는 지원하지 않기 때문에 별도로 등록해야 합니다.

여기선 `12purple.ml`과 그 하위 도메인 `*.12purple.ml`(www.12purple.ml, api.12purple.ml, status,12purple.ml, ...), 테스트 서버용으로 사용할 `*.test.12purple.ml`(pr-01.test.12purple.ml, ...)을 추가합니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/acm-domain.png" alt="ACM Domain" />
</div>

3. 도메인 인증 방식을 선택합니다.

인증서는 도메인 소유자만 만들 수 있기 때문에, 소유자 인증을 해야 합니다. `DNS validation`은 특정 값을 DNS에 지정하여 소유자임을 증명하는 방식입니다.

<div class="image-600">
  <custom-image src="/imgs/aws-domain/acm-validation.png" alt="ACM Validation" />
</div>

4. 인증서를 만들고 상태를 확인합니다.

인증서 등록 상태를 보면 인증대기 중(Pending validation)인 것을 알 수 있습니다. DNS에 CNAME을 등록하면 ACM이 자동으로 확인하고 인증서를 발급해 줍니다. Amazon Route53을 이용하면 CNAME 등록을 자동으로 할 수 있지만, Cloudflare는 수동으로 추가해야합니다.

<custom-image src="/imgs/aws-domain/acm-status.png" alt="ACM Status" />

5. 한 땀 한 땀 추가하고 최초 설정한 프록시도 해제합니다.

<custom-image src="/imgs/aws-domain/cf-validation.png" alt="Cloudflare DNS" />

6. 조금 시간이 지나고 ~~가끔 오래걸림~~ 새로고침을 하면 인증서가 발급(Issued)됩니다.

<custom-image src="/imgs/aws-domain/acm-success.png" alt="ACM issued" />

::: tip AWS Certificat Manager 더보기
📔 [AWS Certificat Manager 소개](https://aws.amazon.com/ko/certificate-manager/)
:::

## ALB 인증서 추가하기

마지막으로 ALB에 인증서를 추가합니다.

1. 기존에 생성했던 ALB에 HTTPS용 리스너를 추가합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-domain/alb-listner.png" alt="ALB Listner" />
</div>

2. HTTPS 프로토콜과 443 포트를 설정하고 기존에 생성했던 Target group을 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-domain/alb-443.png" alt="ALB Protocol" />
</div>

3. 조금 전에 만들었던 인증서를 선택합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-domain/alb-ssl.png" alt="ALB ssl" />
</div>

4. 기존 ALB의 방화벽(Security Group)은 80포트만 오픈했기 때문에 추가로 443포트를 오픈합니다. Security Groups에서 ALB에 설정한 항목을 선택하고 Inbound Rules를 수정합니다.

<div class="image-650">
  <custom-image src="/imgs/aws-domain/sg-https.png" alt="ALB SG" />
</div>

이제 다시 접속해봅니다.

🎉 성공입니다! ALB 인증서로 HTTPS가 정상 동작하는 것을 확인하였습니다.

## 마무리

지금까지 AWS에 웹 서버를 배포하고 도메인을 연결하고 인증서를 적용해 보았습니다. 클라우드 환경이 등장하면서 많은 부분이 간소화되었지만, 여전히 불편한 부분이 있습니다.

서버를 관리하는 엔지니어들은 더 더 더 자동화를 원하고 안정적인 서비스를 제공하기 위해 노력하였습니다. 다음 장부터 어떤 기술이 있는지 하나씩 알아보겠습니다.
