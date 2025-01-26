<template>
  <div class="containerLeft">
    <n-flex justify="center">
      <n-dropdown
        :options="options"
        style="display: inline-block"
        @select="selectMenu"
      >
        <n-avatar
          style="margin-top: 5px; border: 2px solid #f0216d"
          round
          :size="avatarSize"
          src="./image/avt.webp"
        />
      </n-dropdown>
    </n-flex>
    <!-- <div class="rate" v-if="isPortrait === false">
      <ul class="element">
        <template v-for="item in rarity" style="display: inline-block">
          <li v-if="item.rate > 0" style="margin-top: 50px">
            <img
              :src="'./texture/prize/default/' + String(item.prize) + '.webp'"
            />

          </li>
        </template>
      </ul>
    </div> -->
  </div>
  <n-modal
    v-model:show="showModal"
    transform-origin="center"
    preset="dialog"
    title="Cài đặt"
    :show-icon="false"
    positive-text="Lưu"
    negative-text="Hủy"
    @positive-click="updateSetting()"
  >
    <n-space justify="center" style="margin-bottom: 5%">
      <n-switch v-model:value="settingRandomMode" /> Chế độ ngẫu nhiên
    </n-space>
    <n-space justify="center" style="text-align: center">
      <n-form label-placement="left" v-if="settingRandomMode">
        <template v-for="(item, index) in settingRarity" :key="index">
          <n-form-item>
            <n-image
              class="settingImg"
              width="100"
              :src="'./texture/prize/default/' + String(item.prize) + '.webp'"
            />
            <n-input-number
              style="vertical-align: middle"
              v-model:value="item.rate"
              :show-button="false"
              placeholder="Nhập tỷ lệ"
            >
              <template #suffix> % </template></n-input-number
            >
          </n-form-item>
        </template>
        <div style="background-color: #f4f4f4">
          <span :class="status">{{ sumRate }}%</span>
        </div>
      </n-form>

      <n-form label-placement="left" v-if="!settingRandomMode">
        <template v-for="(item, index) in settingQuantity" :key="index">
          <n-form-item>
            <n-image
              class="settingImg"
              width="100"
              :src="'./texture/prize/default/' + String(item.prize) + '.webp'"
            />
            <n-input-number
              style="vertical-align: middle"
              v-model:value="item.amount"
              placeholder="Nhập số lượng"
            ></n-input-number>
          </n-form-item>
        </template>
        <div style="background-color: #f4f4f4">
          <span :class="status">{{ sumRate }}</span>
        </div>
      </n-form>
    </n-space>
  </n-modal>
</template>

<script>
import { NIcon } from "naive-ui";
import { h, ref } from "vue";
import {
  PersonCircleOutline as UserIcon,
  OptionsOutline as SettingIcon,
  LogOutOutline as LogoutIcon,
  LogInOutline as LoginIcon,
} from "@vicons/ionicons5";

export default {
  inheritAttrs: false,
  props: [
    "username",
    "avatarSize",
    "isPortrait",
    "rarity",
    "isRandomMode",
    "quantity",
  ],
  data() {
    return {
      validator: (x) => {
        parseInt(x) > 0;
      },
      status: "valid",
      settingRandomMode: this.isRandomMode,
      settingRarity: JSON.parse(JSON.stringify(this.rarity)),
      settingQuantity: JSON.parse(JSON.stringify(this.quantity)),
      sum: 0,
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
          icon: this.renderIcon(SettingIcon),
        },
        {
          label: "Đăng nhập",
          key: "changeState",
          icon: this.renderIcon(LoginIcon),
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
    updateSetting() {
      if (this.status === "valid") {
        this.$emit("savedSetting", this.settingRandomMode, this.settingRarity, this.settingQuantity);
      } else {
        return false;
      }
    },
  },
  computed: {
    sumRate() {
      this.sum = 0;
      if (this.settingRandomMode) {
        this.settingRarity.forEach((item) => (this.sum += item.rate));
        this.sum = this.sum.toFixed(2);
        if (this.sum != 100) this.status = "invalid";
        else this.status = "valid";
        return this.sum;
      } else {
        this.settingQuantity.forEach((item) => (this.sum += item.amount));
        if (this.sum > 20) this.status = "invalid";
        else this.status = "valid";
        return this.sum;
      }
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
.rateDetail {
  vertical-align: middle;
  margin-left: 10%;
  font-size: 1.3em;
  text-shadow: 1px 1px #000;
}
.settingImg {
  vertical-align: middle;
  margin-right: 10%;
}
.valid {
  color: rgb(27, 183, 0);
  text-shadow: 0.5px 0.5px #027b00;
}
.invalid {
  color: rgb(183, 0, 0);
  text-shadow: 0.5px 0.5px #c80000;
}
</style>
