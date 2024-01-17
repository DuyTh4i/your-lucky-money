<template>
  <n-dialog-provider>
    <TheModel></TheModel>
  </n-dialog-provider>
  <TheFooter></TheFooter>
</template>
<script>
import TheModel from "./components/TheModel.vue";
import TheFooter from "./components/TheFooter.vue";
export default {
  components: {
    TheModel,
    TheFooter,
  },
};
</script>
