<script setup lang="ts">
import { useData } from "vitepress";
import { withBase } from "vitepress";
import NewsLetter from "./NewsLetter.vue";

const { frontmatter, site } = useData();
</script>

<template>
  <section id="hero">
    <h1 class="tagline">
      <span class="accent">{{ site.title }}</span>
    </h1>
    <p class="description">
      {{ frontmatter.tagline }}
    </p>
    <p class="actions">
      <a class="get-started" :href="withBase(frontmatter.actionLink)">
        {{ frontmatter.actionText }}
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
          />
        </svg>
      </a>
    </p>
  </section>

  <div class="vt-doc">
    <div class="warning custom-block">
      <p class="custom-block-title">💡 주의</p>
      <p>본 가이드는 현재 미완성입니다. 예고없이 내용이 변경될 수 있습니다.</p>
    </div>
  </div>

  <section id="highlights" class="vt-box-container">
    <div class="vt-box">
      <h2>🧑‍💻 무엇을 배우나요?</h2>
      <p>
        개발과 테스트 코드, 클라우드 배포, CI/CD, 컨테이너부터 쿠버네티스까지
        다양한 DevOps 도구를 살펴봅니다.
      </p>
    </div>
    <div class="vt-box">
      <h2>💻 어떻게 배우나요?</h2>
      <p>
        Node.js 웹 애플리케이션을 만들고 AWS EKS에 배포하는 전체 과정을 핵심만
        골라 아주 빠르고 가볍게 훑어봅니다.
      </p>
    </div>
    <div class="vt-box">
      <h2>⚠️ 더 알아보기</h2>
      <p>
        최적의 DevOps 도구는 개발 언어와 프레임워크, 환경에 따라 다릅니다. 더
        나은 도구를 찾고 적용해보세요.
      </p>
    </div>
  </section>

  <div class="features features-4" style="align-items: center">
    <div class="feature" style="text-align: center">
      <a
        href="https://subicura.com/k8s/?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops"
        target="_blank"
      >
        <custom-image src="/imgs/k8s_hero.png" />
        <p style="margin-top: 0">쿠버네티스 안내서</p>
      </a>
    </div>
    <div class="feature" style="text-align: center">
      <a
        href="https://subicura.com/2021/06/27/study-guide.html?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops"
        target="_blank"
      >
        <custom-image src="/imgs/web_hero.png" />
        <p style="margin-top: 0">웹 개발자 학습 안내서</p>
      </a>
    </div>
    <div class="feature" style="text-align: center">
      <a
        href="https://subicura.com/git/?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops"
        target="_blank"
      >
        >
        <custom-image src="/imgs/git_hero.png" />
        <p style="margin-top: 0">Git/GitHub 안내서</p>
      </a>
    </div>
    <div class="feature" style="text-align: center">
      <a
        href="https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops"
        target="_blank"
      >
        >
        <custom-image src="/imgs/docker_hero.png" />
        <p style="margin-top: 0">도커 안내서</p>
      </a>
    </div>
  </div>

  <NewsLetter />
</template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 96px 32px;
  text-align: center;
}

.tagline {
  font-size: 64px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}

html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 24px;
  margin: 18px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .get-started {
  margin-right: 18px;
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover {
  transition-duration: 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

.actions .get-started,
.actions .setup {
  color: var(--vt-c-text-code);
}

.actions .get-started:hover,
.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}

.dark .actions .get-started:hover,
.dark .actions .setup:hover {
  background-color: var(--vt-c-gray-dark-3);
}

#special-sponsor {
  border-top: 1px solid var(--vt-c-divider-light);
  border-bottom: 1px solid var(--vt-c-divider-light);
  padding: 12px 24px;
  text-align: center;
}

#special-sponsor span {
  color: var(--vt-c-text-2);
  font-weight: 500;
  font-size: 13px;
  vertical-align: middle;
  margin: 0 24px;
}

#special-sponsor img {
  display: inline-block;
  vertical-align: middle;
  height: 36px;
}

.dark #special-sponsor img {
  filter: grayscale(1) invert(1);
}

.vt-doc {
  margin: 0 auto;
  max-width: 500px;
}

#highlights {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}

#highlights h2 {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.4px;
  color: var(--vt-c-text-1);
  transition: color 0.5s;
  margin-bottom: 0.75em;
}

#highlights p {
  font-weight: 400;
  font-size: 15px;
}

#highlights .vt-box {
  background-color: transparent;
}

#sponsors {
  max-width: 900px;
  margin: 0px auto;
}

#sponsors h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1em;
}

#sponsors .sponsor-container {
  margin-bottom: 3em;
}

.features {
  border-top: 1px solid #eaecef;
  padding: 2rem 0 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: stretch;
  justify-content: space-between;
  max-width: 768px;
  margin: 0 auto;
}

.dark .features {
  border-top-color: var(--vt-c-divider-light);
}

.features-4 .feature {
  flex-basis: 25%;
}

@media (max-width: 960px) {
  .tagline {
    font-size: 50px;
    letter-spacing: -0.5px;
  }
  .description {
    font-size: 20px;
    margin-bottom: 48px;
  }
}

@media (max-width: 768px) {
  .tagline {
    font-size: 42px;
    letter-spacing: -0.5px;
  }
}

@media (max-width: 576px) {
  #hero {
    padding: 64px 32px;
  }
  .description {
    font-size: 18px;
    margin: 12px 0 30px;
  }
  #special-sponsor img {
    display: block;
    margin: 2px auto 1px;
  }
  #highlights h3 {
    margin-bottom: 0.6em;
  }
  #highlights .vt-box {
    padding: 20px 36px;
  }
  .vt-doc {
    padding: 0 36px;
  }
  .actions a {
    margin: 0.5em 0;
  }
  .features {
    justify-content: center;
  }
  .features-4 .feature {
    flex-basis: 50%;
  }
  .feature {
    max-width: 260px;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 36px;
  }
}
</style>