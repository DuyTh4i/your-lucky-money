<template>
  <div id="container1" class="fullscreen1">
    <n-card
    v-if="showWish"
      size="small"
      role="dialog"
      style="
        width: 300px;
        position: absolute;
        left: 50%;
        bottom: 15%;
        transform: translateX(-50%);
      "
    >
      {{ wish }}
      <template #footer>
        <n-button @click="updateIsOpen()" color="#ff69b4" style="transform: translateX(-50%);
        left: 50%;"> xác nhận</n-button>
      </template>
    </n-card>
  </div>
</template>
<script>
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { Fireworks } from "fireworks-js";
import { ref } from "vue";

export default {
  data() {
    return {
      wish: "Chúc bạn và gia đình có 1 năm may mắn, khỏe mạnh.",
      showWish: ref(false),
    };
  },
  props: ["prizeValue", "isMuted"],
  methods: {
    init() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      this.container = document.getElementById("container1");
      this.fil = document.getElementById("filter");
      this.fireworks = new Fireworks(this.fil, {
        sound: {
          enabled: !this.isMuted,
          volume: {
            min: 4,
            max: 30,
          },
          files: [
            "./sounds/fireworks/explosion0.mp3",
            "./sounds/fireworks/explosion1.mp3",
            "./sounds/fireworks/explosion2.mp3",
          ],
        },
      });
    },
    updateIsOpen() {
      this.fireworks.stop();
      this.showWish = false;
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.$emit("update-open");
    },
    loadScene() {
      this.fireworks.start();
      console.log(this.prizeValue);
      this.camera.position.y = 6;
      this.camera.lookAt(0, -6, 0);
      const onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.container.appendChild(this.renderer.domElement);

      const geometry = new THREE.BoxGeometry(4, 0.1, 7);
      const material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/texture/front.webp"),
      });
      const cube = new THREE.Mesh(geometry, material);

      cube.position.z = 10;
      this.scene.add(cube);
      const prize = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 3.7),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(
            "/texture/prize/default/" + String(this.prizeValue) + ".webp"
          ),
        })
      );
      prize.position.z = 9;
      this.scene.add(prize);
      prize.rotateX(-Math.PI / 2);
      prize.rotateZ(-Math.PI / 2);
      this.showPrize(cube, prize);

      //debug
      //this.scene.add(new THREE.GridHelper(10, 10));
      //this.scene.add(new THREE.AxesHelper(3))
      this.animate();
    },

    animate() {
      requestAnimationFrame(this.animate);
      TWEEN.update();
      this.fireworks.updateOptions({
        sound: {
          enabled: !this.isMuted,
          volume: {
            min: 4,
            max: 30,
          },
          files: [
            "./sounds/fireworks/explosion0.mp3",
            "./sounds/fireworks/explosion1.mp3",
            "./sounds/fireworks/explosion2.mp3",
          ],
        },
      });
      this.renderer.render(this.scene, this.camera);
    },
    showPrize(cube, prize) {
      setTimeout(() => {
        new TWEEN.Tween(cube.position).to({ z: 3.5 }, 900).start();
      }, 1000);
      setTimeout(() => {
        new TWEEN.Tween(prize.position).to({ z: 1 }, 1500).start();
      }, 2000);
      setTimeout(() => {
        this.showWish = true;
      }, 4500);
    },
  },
  mounted() {
    this.init();
    this.loadScene();
  },
};
</script>
<style scoped>
.fullscreen1 {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
