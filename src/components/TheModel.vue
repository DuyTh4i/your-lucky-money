<template>
  <div id="container" class="fullscreen">
    <n-row
      gutter="2"
      style="
        position: fixed;
        top: 0px;
        left: 0px;
        cursor: pointer;
        opacity: 0.9;
        z-index: 10000;
        user-select: none;
      "
    >
      <n-col :span="3">
        <n-space justify="center" style="background-color: rgba(255, 255, 255, 0.1); ">
          <n-button v-if="logged === false">login</n-button>
          <n-dropdown :options="options">
            <n-avatar
              v-if="logged === true"
              round
              size="large"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </n-dropdown>
        </n-space>

        <div class="light-green">
          <div
            style="
              display: table-cell;
              vertical-align: middle;
              user-select: none;
            "
          >
            <n-flex vertical>
              <ul v-for="(value, key) in rarity" style="list-style-type: none">
                <li style="display: inline">
                  <img
                    style="width: 40%; vertical-align: middle"
                    :src="'./texture/prize/' + String(key) + '.png'"
                    alt=""
                  />
                  <span style="vertical-align: middle; margin-left: 20%; font-size: 1.3em; text-shadow: 1px 1px #000;" :class="'prize'+key" >
                    {{ value }}%
                  </span>
                </li>
              </ul>
            </n-flex>
          </div>
        </div>
      </n-col>
    </n-row>
  </div>

  <div style="position: absolute; left: 3px; top: 3px"></div>

  <div v-if="isOpen === true">
    <div class="filter"></div>
    <GetPrize @update-open="resetEnvelopes()" :prizeValue="value"></GetPrize>
  </div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { InteractionManager } from "three.interactive";
import TWEEN from "@tweenjs/tween.js";
import { useDialog, NIcon } from "naive-ui";
import GetPrize from "./GetPrize.vue";
import { h, defineComponent } from "vue";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default {
  setup() {
    return {
      options: [
        {
          label: "Profile",
          key: "profile",
          icon: renderIcon(UserIcon),
        },
        {
          label: "Edit Profile",
          key: "editProfile",
          icon: renderIcon(EditIcon),
        },
        {
          label: "Logout",
          key: "logout",
          icon: renderIcon(LogoutIcon),
        },
      ],
    };
  },
  components: { GetPrize },
  data() {
    return {
      logged: true,
      value: null,
      isOpen: false,
      pin: 0.25,
      coors: [
        {
          x: 0.5,
          y: 1.02,
          z: 1.9,
        },
        {
          x: -0.7,
          y: 1.17,
          z: 1.75,
        },
        {
          x: -1,
          y: 1.1,
          z: 1.1,
        },
        {
          x: -1.2,
          y: 0.86,
          z: 0.7,
        },
        {
          x: -0.95,
          y: 1.1,
          z: -0.3,
        },
        {
          x: -1.09,
          y: 0.88,
          z: -1.2,
        },
        {
          x: 0.25,
          y: 0.82,
          z: 1.73,
        },
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
          x: -0.3,
          y: 0.29,
          z: -1.9,
        },
        {
          x: -0.55,
          y: 0.44,
          z: -2.2,
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
        500: 0,
      },
    };
  },
  methods: {
    init() {
      this.envelopes = [];
      this.ribbons = [];
      this.dialog = useDialog();
      this.itemGeo = new THREE.BoxGeometry(0.2, 0.35, 0.005);
      this.itemMat = [
        new THREE.MeshPhongMaterial({
          color: 0xdb0614,
          transparent: true,
          opacity: 0,
        }),
        new THREE.MeshPhongMaterial({
          color: 0xdb0614,
          transparent: true,
          opacity: 0,
        }),
        new THREE.MeshPhongMaterial({
          color: 0xdb0614,
          transparent: true,
          opacity: 0,
        }),
        new THREE.MeshPhongMaterial({
          color: 0xdb0614,
          transparent: true,
          opacity: 0,
        }),
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load("/texture/front.png"),
          transparent: true,
          opacity: 0,
        }),
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load("/texture/back.png"),
          transparent: true,
          opacity: 0,
        }),
      ];
      this.ribbonMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
      });
      this.stats = new Stats();
      this.container = document.getElementById("container");
      this.scene = new THREE.Scene();
      this.boxHelper = new THREE.BoxHelper(undefined, 0xffffff);
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
      this.orbitControls = new OrbitControls(this.camera, this.container);

      this.scene.add(this.boxHelper);

      this.interactionManager = new InteractionManager(
        this.renderer,
        this.camera,
        this.container
      );
    },

    loadScene() {
      //basic setup
      this.camera.position.set(4.2, -0.05, -0.27);

      this.renderer.shadowMap.enabled = true;
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(this.renderer.domElement);

      //auto resize
      const onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
      this.scene.add(spotLight);
      this.scene.add(hemisphereLight);

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
      this.scene.add(floor);

      //orbit setup
      this.orbitControls.minDistance = 2;
      this.orbitControls.maxDistance = 4.7;
      this.orbitControls.enableDamping = true;
      //this.orbitControls.autoRotate = true;
      this.orbitControls.minPolarAngle = Math.PI / 4;
      this.orbitControls.maxPolarAngle = Math.PI / 1.7;
      //this.orbitControls.enablePan = false;

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
          this.scene.add(gltf.scene);
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
          this.resetEnvelopes();
        },
        undefined,
        (e) => {
          console.error(e);
        }
      );

      //debug
      //container.appendChild(this.stats.dom);
      //this.scene.add(new THREE.GridHelper(5, 5));
      //this.scene.add(new THREE.AxesHelper(3));

      this.animate();
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
    generateEnvelope() {
      if (this.envelopes.length > 0) {
        this.detachEnvelopes();
      }
      setTimeout(() => {
        this.coors.forEach((value) => {
          const item = new THREE.Mesh(this.itemGeo, this.itemMat);
          item.receiveShadow = true;
          item.castShadow = true;
          item.rotateY(Math.PI / 2);
          item.position.set(value.x, value.y - 0.35, value.z);
          item.userData.prize = this.gacha();
          item.addEventListener("click", (event) => {
            if (event.target == this.boxHelper.object) {
              this.isPopup = true;
              this.value = item.userData.prize;
              this.confirmItem();
            } else {
              this.boxHelper.visible = true;
              this.boxHelper.setFromObject(item);
            }
            console.log(event.target.userData.prize);
          });
          this.interactionManager.add(item);
          this.envelopes.push(item);
          this.ribbons.push(
            new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(value.x, value.y, value.z),
                new THREE.Vector3(value.x, value.y + this.pin, value.z),
              ]),
              this.ribbonMat
            )
          );
        });
        this.ribbons.forEach((rib) => this.scene.add(rib));
        this.envelopes.forEach((env) => this.scene.add(env));
        this.attachEnvelopes();
      }, 1000);
    },
    animate() {
      requestAnimationFrame(this.animate);
      TWEEN.update();
      this.orbitControls.update();
      this.interactionManager.update();
      this.renderer.renderLists.dispose();
      this.renderer.render(this.scene, this.camera);
      //this.stats.update();
    },
    attachEnvelopes() {
      this.envelopes.forEach((item) => {
        new TWEEN.Tween(item.position)
          .to({ y: item.position.y + 0.35 }, 800)
          .start();
      });
      this.itemMat.forEach((mat) => {
        new TWEEN.Tween(mat).to({ opacity: 1 }, 800).start();
      });
      setTimeout(() => {
        new TWEEN.Tween(this.ribbonMat).to({ opacity: 1 }, 500).start();
      }, 400);
    },

    detachEnvelopes() {
      this.boxHelper.visible = false;
      this.envelopes.forEach((item) => {
        new TWEEN.Tween(item.position)
          .to({ y: item.position.y - 0.35 }, 800)
          .start();
      });
      this.itemMat.forEach((mat) => {
        new TWEEN.Tween(mat).to({ opacity: 0 }, 800).start();
      });
      setTimeout(() => {
        new TWEEN.Tween(this.ribbonMat).to({ opacity: 0 }, 500).start();
      }, 400);
      setTimeout(() => {
        this.envelopes.forEach((item) => {
          this.interactionManager.remove(item);
          item.removeFromParent();
          item.geometry.dispose();
          item.material.forEach((mat) => mat.dispose());
        });
        this.ribbons.forEach((item) => {
          item.removeFromParent();
          item.geometry.dispose();
          item.material.dispose();
        });
        this.envelopes = [];
        this.ribbons = [];
      }, 810);
    },

    resetEnvelopes() {
      this.isOpen = false;
      this.value = null;
      this.generateEnvelope();
    },

    confirmItem() {
      this.dialog.warning({
        title: "Xác nhận",
        content: "Bạn muốn mở bao lì xì này?",
        positiveText: "Mở",
        negativeText: "Không",
        onPositiveClick: () => {
          this.isOpen = true;
        },
      });
    },
  },
  mounted() {
    this.init();
    this.loadScene();
  },
};
</script>

<style scoped>
.filter {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-color: black;
  opacity: 0.6;
  animation-name: example;
  animation-duration: 0.5s;
}
@keyframes example {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}
.light-green {
  display: table;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.1);
}
.prize10{
  color: rgb(255, 208, 0);
}
.prize20{
  color: rgb(0, 13, 255);
}
.prize50{
  color: rgb(255, 0, 60);
}
.prize100{
  color: rgb(13, 255, 0);
}
.prize200{
  color: rgb(255, 145, 0);
}
.prize500{
  color: rgb(0, 200, 255);
}
</style>
