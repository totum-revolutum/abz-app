<script setup lang="ts">
import { User } from "../types/user";

defineProps<{ user: User }>();
</script>

<template>
  <div class="userСard">
    <img :src="user.photo" alt="user" class="userСard__image" />

    <div class="userСard__name" v-tooltip="user.name">{{ user.name }}</div>

    <div class="userСard__info">
      <div class="userСard__info-position" v-tooltip="user.position">
        {{ user.position }}
      </div>
      <a
        :href="`mailto:${user.email}`"
        class="user-card__info-email"
        v-tooltip="user.email"
      >
        {{ user.email }}
      </a>
      <a
        :href="`tel:+${user.phone}`"
        class="userСard__info-phone"
        v-tooltip="user.phone"
      >
        {{ user.phone }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.userСard {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 254px;
  padding: 20px;

  background: white;
  border-radius: 10px;

  font-size: 16px;
  line-height: 26px;
  font-weight: 400;

  margin-bottom: 20px;

  @include onTablet {
    width: 330px;
    margin-bottom: 0;
  }

  @include onDesktop {
    width: 370px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &__image {
    width: 70px;
    height: 70px;

    border-radius: 50%;

    margin-bottom: 20px;
  }

  &__name {
    margin-bottom: 20px;

    width: 100%;
    text-align: center;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    cursor: default;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    text-align: center;

    cursor: default;

    &-position,
    &-email,
    &-phone {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}
</style>
