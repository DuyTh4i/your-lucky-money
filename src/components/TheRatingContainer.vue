<template>
  <div class="containerLeft">
    <n-flex justify="center">
      <n-dropdown
        :options="options"
        style="display: inline-block"
        @select="selectMenu"
      >
        <n-avatar
          round
          :size="avatarSize"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
      </n-dropdown>
    </n-flex>
    <div class="rate" v-if="isPortrait === false">
      <ul class="element">
        <template
          v-for="(value, key) in rarity"
          :key="key"
          style="display: inline-block"
        >
          <li v-if="value > 0" style="margin-top: 50px">
            <img :src="'./texture/prize/' + String(key) + '.webp'" />
            <span :class="'prize' + key"> {{ value }}% </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
  <n-modal
    v-model:show="showModal"
    transform-origin="center"
    preset="dialog"
    title="Dialog"
  >
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <TheSetting></TheSetting>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-modal>
</template>

<script>
import { NIcon } from "naive-ui";
import { h, ref } from "vue";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";
import TheSetting from "./TheSetting.vue";

export default {
  components: { TheSetting },
  props: ["username", "avatarSize", "isPortrait", "rarity"],
  data() {
    return {
      showModal: ref(false),
      options: [
        {
          label: this.username,
          key: "username",
          icon: this.renderIcon(UserIcon),
        },
        {
          label: "Cài đặt",
          key: "setting",
          icon: this.renderIcon(EditIcon),
        },
        {
          label: "Đăng xuất",
          key: "logout",
          icon: this.renderIcon(LogoutIcon),
        },
      ],
    };
  },
  methods: {
    selectMenu(key) {
      if (key === "setting") this.showModal = true;
    },
    renderIcon(icon) {
      return () => {
        return h(NIcon, null, {
          default: () => h(icon),
        });
      };
    },
  },
};
</script>

<style scoped>
.prize10 {
  color: rgb(255, 208, 0);
}
.prize20 {
  color: rgb(0, 13, 255);
}
.prize50 {
  color: rgb(255, 0, 60);
}
.prize100 {
  color: rgb(13, 255, 0);
}
.prize200 {
  color: rgb(255, 145, 0);
}
.prize500 {
  color: rgb(0, 200, 255);
}
.containerLeft {
  height: 100vh;
  width: 12%;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  user-select: none;
  /* background-color: rgba(255, 255, 255, 0.2); */
}
.rate {
  display: table;
  height: 100%;
  user-select: none;
  pointer-events: none;
}
.element {
  list-style-type: none;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
img {
  width: 50%;
  vertical-align: middle;
}
span {
  vertical-align: middle;
  margin-left: 10%;
  font-size: 1.3em;
  text-shadow: 1px 1px #000;
}
</style>
