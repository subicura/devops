import baseConfig from "@subicura/vitepress-theme/config";

const nav = [
  {
    text: "📔 가이드",
    activeMatch: `^/guide/`,
    link: "/guide/hello",
  },
  {
    text: "📺 영상강의",
    activeMatch: `^/wait/`,
    link: "/wait/coming-soon",
  },
  {
    text: "👨‍💻 블로그",
    link: "https://subicura.com?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops",
  },
];

export const sidebar = {
  "/guide/": getGuideSidebar(
    "개발과 테스트 코드",
    "배포",
    "컨테이너 (준비중)",
    "지속적 통합(CI) (준비중)",
    "쿠버네티스 (준비중)"
  ),
};

function getGuideSidebar(groupA, groupB, groupC, groupD, groupE) {
  return [
    {
      text: "들어가기",
      items: [{ text: "DevOps 도입하기", link: "/guide/hello" }],
    },
    {
      text: groupA,
      items: [
        { text: "Node.js 웹 애플리케이션", link: "/guide/web" },
        { text: "Git", link: "/guide/git" },
        { text: "GitHub", link: "/guide/github" },
        { text: "Validate, 테스트 자동화", link: "/guide/validate" },
      ],
    },
    {
      text: groupB,
      items: [
        { text: "배포하기", link: "/guide/deploy" },
        { text: "AWS 배포", link: "/guide/aws-deploy" },
        { text: "AWS 다중 서버 배포", link: "/guide/aws-multi-deploy" },
        { text: "도메인 연결하기", link: "/guide/aws-domain" },
      ],
    },
    {
      text: groupC,
      items: [{ text: "Docker", link: "/guide/docker" }],
    },
    {
      text: groupD,
      items: [
        { text: "Jenkins", link: "/guide/jenkins" },
        { text: "Lint, 테스트, 커버리지", link: "/guide/jenkins-report" },
        { text: "Jenkins + GitHub", link: "/guide/jenkins-github" },
      ],
    },
    {
      text: groupE,
      items: [
        { text: "Kubernetes", link: "/guide/kubernetes" },
        { text: "Helm", link: "/guide/helm" },
        { text: "GitOps", link: "/guide/gitops" },
        { text: "Cluster AutoScaling", link: "/guide/autoscaling" },
        { text: "Jenkins + GitOps", link: "/guide/jenkins-gitops" },
        { text: "모니터링", link: "/guide/monitoring" },
        { text: "모니터링 알림", link: "/guide/alert" },
      ],
    },
  ];
}

export default {
  extends: baseConfig,

  lang: "en-US",
  title: "DevOps 안내서",
  description: "Vue.js - The Progressive JavaScript Framework2",
  srcDir: "src",
  scrollOffset: "header",

  base: "/devops/",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/devops/icons/favicon-32x32.png`,
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/devops/icons/favicon-16x16.png`,
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: `/devops/icons/apple-touch-icon.png`,
      },
    ],
    ["link", { rel: "manifest", href: "/devops/manifest.json" }],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/devops/icons/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/devops/icons/mstile-150x150.png",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
    [
      "script",
      {
        src: "https://cdn.usefathom.com/script.js",
        "data-site": "AIERDXCX",
        "data-spa": "auto",
        defer: "",
      },
    ],
    [
      "meta",
      {
        name: "og:image",
        content: "https://subicura.com/devops/imgs/share.png",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://subicura.com/devops/imgs/share.png",
      },
    ],
  ],

  themeConfig: {
    nav,
    sidebar,

    socialLinks: [
      { icon: "github", link: "https://github.com/subicura/devops/" },
      { icon: "twitter", link: "https://twitter.com/subicura" },
      { icon: "blog", link: "https://subicura.com" },
    ],

    editLink: {
      repo: "subicura/devops",
      text: "Edit this page on GitHub",
    },

    footer: {
      copyright: `Copyright © 2022-${new Date().getFullYear()} subicura`,
    },
  },
  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ["../.."],
      },
    },
    build: {
      minify: "terser",
      chunkSizeWarningLimit: Infinity,
    },
    json: {
      stringify: true,
    },
  },

  vue: {
    reactivityTransform: true,
  },
};
