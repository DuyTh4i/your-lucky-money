<template>
  <div id="container1" class="fullscreen1">
    <n-button
      style="
        position: absolute;
        left: 50%;
      bottom: 15%;
        transform: translateX(-50%);
      "
      v-if="showBut === true"
      size="large"
      @click="updateIsOpen()"
      color="#ff69b4"
    >
      xác nhận</n-button
    >
  </div>
</template>
<script>
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export default {
  data() {
    return {
      showBut: false,
    };
  },
  props: ["prizeValue"],
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
    },
    updateIsOpen() {
      this.showBut = false;
      this.$emit("update-open");
    },
    loadScene() {
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
        map: new THREE.TextureLoader().load("/texture/front.png"),
      });
      const cube = new THREE.Mesh(geometry, material);

      cube.position.z = 10;
      this.scene.add(cube);
      const prize = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 3.7),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(
            "/texture/prize/" + String(this.prizeValue) + ".png"
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
        this.showBut = true;
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
