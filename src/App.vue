<template>
  <div class="fullscreen">
    <n-dialog-provider>
      <TheModel :username="username"></TheModel>
    </n-dialog-provider>
  </div>
  <TheFooter></TheFooter>
</template>
<script>
import TheModel from "./components/TheModel.vue";
import TheFooter from "./components/TheFooter.vue";

export default {
  data() {
    return {
      username: "Do duy thai",
    };
  },
  components: {
    TheModel,
    TheFooter,
  },
};
</script>
<style>
.fullscreen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
