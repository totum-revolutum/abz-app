<script setup lang="ts">
import Button from "./Button.vue";
</script>

<template>
  <header class="header">
    <div class="header__content">
      <a href="/" class="header__logo">
        <img src="../assets/logo.svg" alt="logo test task" />
      </a>

      <div class="header__buttons">
        <a href="#users">
          <Button text="Users" width="100px" type="button" />
        </a>

        <a href="#form">
          <Button text="Sign up" width="100px" type="button" />
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  background: #ffffff;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 14px;

    @include onTablet {
      padding: 13px 32px;
    }

    @media all and (min-width: 1190px) {
      width: 1170px;
      margin: 0 auto;
      padding: 13px 0;
    }
  }

  &__logo {
    width: 104px;
    height: 26px;
    transition: transform 0.3s;
    display: flex;
    align-items: center;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__buttons {
    display: flex;
    gap: 10px;
    line-height: 26px;
  }
}
</style>
