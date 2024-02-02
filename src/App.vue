<template>
  <div class="fullscreen">
    <n-dialog-provider>
      <TheModel :username="username" :isMuted="isMuted"></TheModel>
    </n-dialog-provider>
  </div>
  <n-button
    class="changeAudio"
    strong
    secondary
    circle
    color="#FFFFFF"
    @click="changeAudio"
  >
    <template #icon>
      <n-icon
        ><music-icon v-if="isMuted === false" /><muted-icon
          v-else="isMuted === true"
      /></n-icon> </template
  ></n-button>
  <TheFooter></TheFooter>
</template>
<script>
import TheModel from "./components/TheModel.vue";
import TheFooter from "./components/TheFooter.vue";
import { VolumeMuteOutline as MutedIcon } from "@vicons/ionicons5";
import { MusicalNotesOutline as MusicIcon } from "@vicons/ionicons5";

export default {
  data() {
    return {
      isMuted: true,
      username: "Khách",
      audio: document.getElementById("audio"),
    };
  },
  components: {
    MutedIcon,
    MusicIcon,
    TheModel,
    TheFooter,
  },
  methods: {
    changeAudio() {
      this.isMuted = !this.isMuted;
      if (this.isMuted === false) this.audio.play();
      else this.audio.pause();
    },
  },
  mounted() {
    audio.volume = 0.3;
    document.addEventListener("visibilitychange", (event) => {
      if (this.isMuted === false)
        if (document.visibilityState !== "visible") this.audio.pause();
        else this.audio.play();
    });
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
  overflow: hidden;
}
body {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.changeAudio {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>
