import "./styles/index.css";
import { h, watch } from "vue";
import { VPTheme } from "@subicura/vitepress-theme";
// import Banner from "./components/Banner.vue";
import VueSchoolLink from "./components/VueSchoolLink.vue";
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference,
} from "./components/preferences";
// import SponsorsAside from "./components/SponsorsAside.vue";
// import VueJobs from "./components/VueJobs.vue";
import CustomImage from "./components/CustomImage.vue";
import KakaoMsg from "./components/Chat/KakaoMsg.vue";
import KakaoRoom from "./components/Chat/KakaoRoom.vue";
import SlackEmoji from "./components/Chat/SlackEmoji.vue";
import SlackMsg from "./components/Chat/SlackMsg.vue";
import SlackRoom from "./components/Chat/SlackRoom.vue";
import CodeLink from "./components/code-link.vue";
import UtterancesComment from "./components/UtterancesComment.vue";
import zoom from "medium-zoom";

export default Object.assign({}, VPTheme, {
  Layout: () => {
    return h(VPTheme.Layout, null, {
      // banner: () => h(Banner),
      // "aside-mid": () => h(SponsorsAside),
      // "aside-bottom": () => h(VueJobs),
      "content-bottom": () => h(UtterancesComment),
    });
  },
  enhanceApp({ app, router }) {
    app.provide("prefer-composition", preferComposition);
    app.provide("prefer-sfc", preferSFC);
    app.provide("filter-headers", filterHeadersByPreference);
    app.component("VueSchoolLink", VueSchoolLink);
    app.component("custom-image", CustomImage);
    app.component("code-link", CodeLink);
    app.component("Chat-KakaoMsg", KakaoMsg);
    app.component("Chat-KakaoRoom", KakaoRoom);
    app.component("Chat-SlackEmoji", SlackEmoji);
    app.component("Chat-SlackMsg", SlackMsg);
    app.component("Chat-SlackRoom", SlackRoom);

    // medium-zoom
    if (globalThis && globalThis.window) {
      let z = null;
      watch(router.route, () => {
        setTimeout(function () {
          if (z) {
            z.detach();
          }
          z = zoom(".vt-doc :not(a, a > picture) > img");
        }, 1000);
      });
    }

    var GA_ID = "UA-43194822-1";
    // var GA4_ID = "G-98XCF746ZC";
    // Google analytics integration
    if (GA_ID && typeof window !== "undefined") {
      (function (i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        i[r] =
          i[r] ||
          function () {
            (i[r].q = i[r].q || []).push(arguments);
          };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        "script",
        "https://www.google-analytics.com/analytics.js",
        "ga"
      );

      ga("create", GA_ID, "auto");
      // ga("set", "anonymizeIp", true);

      watch(router.route, (val) => {
        ga("set", "page", val.path);
        ga("send", "pageview");
      });

      // router.afterEach(function (to) {
      //   ga("set", "page", router.app.$withBase(to.fullPath));
      //   ga("send", "pageview");
      // });
    }

    // Google analytics 4 integration
    // if (
    //   process.env.NODE_ENV === "production" &&
    //   GA4_ID &&
    //   typeof window !== "undefined"
    // ) {
    //   var js = document.createElement("script");
    //   js.async = 1;
    //   js.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    //   document.body.appendChild(js);

    //   window.dataLayer = window.dataLayer || [];
    //   function gtag() {
    //     dataLayer.push(arguments);
    //   }
    //   gtag("js", new Date());
    //   gtag("config", GA4_ID);

    //   router.afterEach(function (to) {
    //     gtag("set", "page_path", router.app.$withBase(to.fullPath));
    //     gtag("event", "page_view");
    //   });
    // }
  },
});
