<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { User } from "../types/user";
import { getAllUsers } from "../api/apiUser";
import UserCard from "../components/UserCard.vue";
import Button from "../components/Button.vue";

const users = ref<User[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const nextPage = ref<number>(1);
const count = 6;

const BASE_URL = "https://frontend-test-assignment-api.abz.agency/api/v1";

const fetchUsers = async (page: number) => {
  isLoading.value = true;
  error.value = null;

  try {
    const url = `/users?page=${page}&count=${count}`;
    const data = await getAllUsers(url);

    users.value.push(...(data.users as User[]));

    if (data.links.next_url) {
      nextPage.value = page + 1;
    } else {
      nextPage.value = 0; // або null, якщо більше сторінок нема
    }
  } catch (err) {
    error.value = (err as Error).message || "Unknown error";
  } finally {
    isLoading.value = false;
  }
};

const onShowMore = () => {
  if (nextPage.value && nextPage.value > 0) {
    fetchUsers(nextPage.value);
  }
};

onMounted(() => {
  fetchUsers(nextPage.value);
});
</script>

<template>
  <section class="users" id="users">
    <h1 class="users__title">Working with GET request</h1>

    <div class="users__list">
      <UserCard v-for="user in users" :key="user.id" :user="user" />

      <div v-if="isLoading" class="users__loader">
        <span class="loader"></span>
      </div>
    </div>

    <div v-if="!isLoading" class="users__btn">
      <div class="users__btn-click" @click="onShowMore">
        <Button text="Show more" type="button" />
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<style scoped lang="scss">
.users {
  &__title {
    font-size: 40px;
    line-height: 40px;
    text-align: center;
    margin-bottom: 50px;
  }

  &__list {
    margin-bottom: 50px;

    @include onTablet {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
    }
  }

  &__loader {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .loader {
      width: 50px;
      height: 50px;
      border: 6px solid $bg-color;
      border-top: 6px solid $secondary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  &__btn {
    display: flex;
    justify-content: center;
    margin-bottom: 140px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
