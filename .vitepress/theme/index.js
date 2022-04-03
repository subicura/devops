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
  },
});
