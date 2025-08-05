<script setup>
import "@/utils/main.scss";
import "floating-vue/dist/style.css";
import { ref } from "vue";
import Users from "./components/Users.vue";
import UserForm from "./components/UserForm.vue";

import Banner from "./components/Banner.vue";
import Header from "./components/Header.vue";

const isUpdated = ref(false);

function handleUpdated() {
  isUpdated.value = !isUpdated.value;
}
</script>

<template>
  <Header />
  <Banner />

  <div class="container">
    <Users :isUpdated="isUpdated" />
    <UserForm @updated="handleUpdated" />
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 1290px;
  margin: 0 auto;
  padding: 0 15px 100px 15px;

  @include onTablet {
    padding: 0 32px 100px 32px;
  }

  @include onDesktop {
    padding: 0 60px 100px 60px;
  }
}
</style>
