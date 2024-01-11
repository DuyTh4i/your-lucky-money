<template>
  <div id="container" class="fullscreen"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

export default {
  methods: {
    loadScene() {
      //variables
      const container = document.getElementById("container");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100
      );
      camera.position.set(4.2, -0.05, -0.27);
      const hemisphereLight = new THREE.HemisphereLight(
        0x8d7c7c,
        0xffd3c2,
        2.4
      );
      scene.add(hemisphereLight);

      const spotLight = new THREE.SpotLight(0xffffff, 25);
      spotLight.angle = Math.PI / 3.5;
      spotLight.penumbra = 0.6;
      spotLight.castShadow = true;
      spotLight.position.set(2.5, 2.5, -0.1);
      scene.add(spotLight);

      //setup grid ground
      //scene.add(new THREE.GridHelper(5, 5));

      //floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshPhongMaterial({
          color: 0x9e9e9e,
        })
      );
      floor.receiveShadow = true;
      floor.rotateX(-Math.PI / 2);
      floor.position.y = -2.47;
      scene.add(floor);

      //render
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, container);
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
        stats.update();
      };

      //load model
      const loader = new GLTFLoader();
      loader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'))
      loader.load(
        "/models/sakura/test.glb",
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
      const stats = new Stats();
      container.appendChild(stats.dom);
      animate();

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);
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
