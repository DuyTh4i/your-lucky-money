<template>
  <div id="container1" class="fullscreen"></div>
  <n-button @click="updateIsOpen()" color="#ff69b4"> xác nhận</n-button>
</template>
<script>
import * as THREE from "three";

export default {
  methods: {
    updateIsOpen(){
      this.$emit('update-open');
    },
    loadScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );

      camera.position.y = 5;
      camera.lookAt(0, -5, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      const container = document.getElementById("container1");
      container.appendChild(renderer.domElement);
      scene.add(new THREE.GridHelper(10, 10));
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    },
  },
  mounted() {
    this.loadScene();
  },
};
</script>
<style scoped>
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