import baseConfig from "@subicura/vitepress-theme/config";

const nav = [
  {
    text: "๐ ๊ฐ์ด๋",
    activeMatch: `^/guide/`,
    link: "/guide/hello",
  },
  {
    text: "๐บ ์์๊ฐ์",
    activeMatch: `^/wait/`,
    link: "/wait/coming-soon",
  },
  {
    text: "๐จโ๐ป ๋ธ๋ก๊ทธ",
    link: "https://subicura.com?utm_source=subicura.com&utm_medium=referral&utm_campaign=devops",
  },
];

export const sidebar = {
  "/guide/": getGuideSidebar(
    "๊ฐ๋ฐ๊ณผ ํ์คํธ ์ฝ๋",
    "๋ฐฐํฌ",
    "์ปจํ์ด๋ (์ค๋น์ค)",
    "์ง์์  ํตํฉ(CI) (์ค๋น์ค)",
    "์ฟ ๋ฒ๋คํฐ์ค (์ค๋น์ค)"
  ),
};

function getGuideSidebar(groupA, groupB, groupC, groupD, groupE) {
  return [
    {
      text: "๋ค์ด๊ฐ๊ธฐ",
      items: [{ text: "DevOps ๋์ํ๊ธฐ", link: "/guide/hello" }],
    },
    {
      text: groupA,
      items: [
        { text: "Node.js ์น ์ ํ๋ฆฌ์ผ์ด์", link: "/guide/web" },
        { text: "Git", link: "/guide/git" },
        { text: "GitHub", link: "/guide/github" },
        { text: "Validate, ํ์คํธ ์๋ํ", link: "/guide/validate" },
      ],
    },
    {
      text: groupB,
      items: [
        { text: "๋ฐฐํฌํ๊ธฐ", link: "/guide/deploy" },
        { text: "AWS ๋ฐฐํฌ", link: "/guide/aws-deploy" },
        { text: "AWS ๋ค์ค ์๋ฒ ๋ฐฐํฌ", link: "/guide/aws-multi-deploy" },
        { text: "๋๋ฉ์ธ ์ฐ๊ฒฐํ๊ธฐ", link: "/guide/aws-domain" },
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
        { text: "Lint, ํ์คํธ, ์ปค๋ฒ๋ฆฌ์ง", link: "/guide/jenkins-report" },
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
        { text: "๋ชจ๋ํฐ๋ง", link: "/guide/monitoring" },
        { text: "๋ชจ๋ํฐ๋ง ์๋ฆผ", link: "/guide/alert" },
      ],
    },
  ];
}

export default {
  extends: baseConfig,

  lang: "en-US",
  title: "DevOps ์๋ด์",
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
        src: "https://distinct-protected.subicura.dev/script.js",
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
        name: "og:type",
        content: "website",
      },
    ],
    [
      "meta",
      {
        name: "og:site_name",
        content: "์ฟ ๋ฒ๋คํฐ์ค ์๋ด์",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://subicura.com/devops/imgs/share.png",
      },
    ],
    [
      "meta",
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    [
      "meta",
      {
        name: "twitter:creator",
        content: "@subicura",
      },
    ],
    [
      "meta",
      {
        name: "twitter:site",
        content: "@subicura",
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
      copyright: `Copyright ยฉ 2022-${new Date().getFullYear()} subicura`,
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
