<template>
  <div id="container" class="fullscreen"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { InteractionManager } from "three.interactive";

export default {
  data() {
    return {
      pin: 0.25,
      coors: [
        {
          x: 0.1,
          y: 0.57,
          z: 1.5,
        },
        {
          x: 0.2,
          y: -0.42,
          z: 0.15,
        },
        {
          x: 0.38,
          y: -0.6,
          z: -0.2,
        },
        {
          x: 0.58,
          y: -0.6,
          z: -0.7,
        },
        {
          x: -0.05,
          y: -0.35,
          z: -0.5,
        },
        {
          x: -0.1,
          y: -0.3,
          z: -0.9,
        },
        {
          x: -0.08,
          y: -0.3,
          z: -1.3,
        },
        {
          x: 0,
          y: -0.25,
          z: -1.7,
        },
        {
          x: 0.5,
          y: -0.2,
          z: -2.1,
        },
        {
          x: 0.85,
          y: -0.3,
          z: -2.5,
        },
        {
          x: 0.8,
          y: -0.18,
          z: -3,
        },
      ],
      rarity: {
        20: 45,
        50: 45,
        10: 4.9,
        100: 4.9,
        200: 0.2,
      },
    };
  },
  methods: {
    loadScene() {
      //basic setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100
      );
      camera.position.set(4.2, -0.05, -0.27);
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      const container = document.getElementById("container");
      container.appendChild(renderer.domElement);
      const interactionManager = new InteractionManager(
        renderer,
        camera,
        container
      );
      //auto resize
      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);

      //light setup
      const hemisphereLight = new THREE.HemisphereLight(
        0x8d7c7c,
        0xffd3c2,
        2.4
      );
      const spotLight = new THREE.SpotLight(0xffffff, 25);
      spotLight.angle = Math.PI / 3.5;
      spotLight.penumbra = 0.6;
      spotLight.castShadow = true;
      spotLight.position.set(2.5, 2.5, -0.1);
      scene.add(spotLight);
      scene.add(hemisphereLight);

      //floor setup
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshPhongMaterial({
          color: 0x9e9e9e,
        })
      );
      floor.receiveShadow = true;
      floor.rotateX(-Math.PI / 2);
      floor.position.y = -2.47;
      scene.add(floor);

      //orbit setup
      const orbitControls = new OrbitControls(camera, container);
      orbitControls.minDistance = 2;
      orbitControls.maxDistance = 4.7;
      orbitControls.enableDamping = true;
      //orbitControls.autoRotate = true;
      orbitControls.minPolarAngle = Math.PI / 4;
      orbitControls.maxPolarAngle = Math.PI / 1.7;
      //orbitControls.enablePan = false;

      //load model
      const loader = new GLTFLoader();
      loader.setDRACOLoader(
        new DRACOLoader().setDecoderPath(
          "https://www.gstatic.com/draco/v1/decoders/"
        )
      );
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

      //envelope setup
      const itemFront = new THREE.TextureLoader().load("/texture/front.png");
      const itemBack = new THREE.TextureLoader().load("/texture/back.png");
      const itemGeo = new THREE.BoxGeometry(0.2, 0.35, 0.005);
      const itemMat = [
        new THREE.MeshPhongMaterial({ color: 0xdb0614 }),
        new THREE.MeshPhongMaterial({ color: 0xdb0614 }),
        new THREE.MeshPhongMaterial({ color: 0xdb0614 }),
        new THREE.MeshPhongMaterial({ color: 0xdb0614 }),
        new THREE.MeshPhongMaterial({ map: itemFront }),
        new THREE.MeshPhongMaterial({ map: itemBack }),
      ];
      const ribbonMat = new THREE.LineBasicMaterial({ color: 0x000000 });
      this.coors.forEach((value) => {
        const item = new THREE.Mesh(itemGeo, itemMat);
        item.receiveShadow = true;
        item.castShadow = true;
        item.rotateY(Math.PI / 2);
        item.position.set(value.x, value.y, value.z);
        item.userData.prize = this.gacha();
        item.addEventListener("click", (event) => {
          console.log(event.target.userData.prize);
        });
        scene.add(item);
        scene.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(value.x, value.y, value.z),
              new THREE.Vector3(value.x, value.y + this.pin, value.z),
            ]),
            ribbonMat
          )
        );
        interactionManager.add(item);
      });

      //debug
      //const stats = new Stats();
      //container.appendChild(stats.dom);
      // scene.add(new THREE.GridHelper(5, 5));
      // scene.add(new THREE.AxesHelper(3));

      const animate = () => {
        orbitControls.update();
        interactionManager.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        //stats.update();
      };

      animate();
    },
    gacha() {
      const rand = Math.random() * 100000;
      const percent = rand / 1000;
      let result = null,
        acc = 0;
      Object.keys(this.rarity).forEach((key) => {
        if (result === null && percent > 100 - this.rarity[key] - acc)
          result = key;
        acc += parseFloat(this.rarity[key]);
      });
      return result;
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
