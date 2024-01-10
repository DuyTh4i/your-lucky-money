<template>
  <div>
    <canvas id="canvas" class="fullscreen"></canvas>
  </div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default {
  data() {},
  methods: {
    loadScene() {
      //variables
      const stage = document.getElementById("canvas");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        stage.clientWidth / stage.clientHeight,
        1,
        100
      );
      camera.position.set(4.2, -0.05, -0.27);

      const pointLight1 = this.createPointLight(3, -1, 3, 0xffd3c2, 15, 0);
      const pointLight2 = this.createPointLight(-3, -1, 3, 0xffd3c2, 15, 0);
      const pointLight3 = this.createPointLight(2.5, -1, -2.5, 0xffd3c2, 15, 0);
      const pointLight4 = this.createPointLight(
        -2.5,
        -1,
        -2.5,
        0xffd3c2,
        15,
        0
      );
      const pointLight5 = this.createPointLight(
        2.5,
        2.5,
        -0.1,
        0xffffff,
        18,
        0
      );
      pointLight5.castShadow = true;
      pointLight5.shadow.camera.top = 0;
      pointLight5.shadow.camera.bottom = -3;
      pointLight5.shadow.camera.left = -2;
      pointLight5.shadow.camera.right = 2;
      pointLight5.shadow.camera.near = 1;
      pointLight5.shadow.camera.far = 1000;
      scene.add(pointLight1);
      scene.add(pointLight2);
      scene.add(pointLight3);
      scene.add(pointLight4);
      scene.add(pointLight5);

      //setup grid ground
      //scene.add(new THREE.GridHelper(5, 5));

      //floor
      const geometry = new THREE.PlaneGeometry(2000, 2000, 8, 8);
      const material = new THREE.MeshPhongMaterial({
        color: 0x9e9e9e,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(geometry, material);
      floor.receiveShadow = true;
      floor.rotateX(-Math.PI / 2);
      floor.position.y = -2.47;
      scene.add(floor);

      //render
      const renderer = new THREE.WebGLRenderer({
        canvas: stage,
        alpha: true,
        antialias: true
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(stage.clientWidth, stage.clientHeight);

      const controls = new OrbitControls(camera, stage);
      controls.minDistance = 2;
      controls.maxDistance = 4.7;
      // controls.addEventListener("change", (event) => {
      //   console.log(controls.object.position);
      // });
      controls.enableDamping = true;
      //controls.autoRotate = true;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.enablePan = false;

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      //load model
      const loader = new GLTFLoader();
      loader.load(
        "/models/sakura/sakura.glb",
        (gltf) => {
          gltf.scene.traverse((n) => {
            if (n.isMesh) {
              n.castShadow = true;
              n.receiveShadow = true;
            }
          });
          scene.add(gltf.scene);
          const model = gltf.scene;

          // // Calculate the bounding box of the model (but no a single Mesh) so that the whole model is centered
          let box3 = new THREE.Box3();
          box3.expandByObject(model);

          // // Assign the center point of the bounding box to the vector
          let center = new THREE.Vector3();
          box3.getCenter(center);

          // // Reposition the model so that it is centered.
          model.position.x = model.position.x - center.x;
          model.position.y = model.position.y - center.y;
          model.position.z = model.position.z - center.z - 0.5;
        },
        undefined,
        (e) => {
          console.error(e);
        }
      );

      animate();
    },
    createPointLight(x, y, z, color, intensity, distance) {
      const pointLight = new THREE.PointLight(color, intensity);
      pointLight.position.set(x, y, z);
      pointLight.distance = distance;
      return pointLight;
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
  overflow: auto;
}
</style>
