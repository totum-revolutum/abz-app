<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAllPositions,
  getToken,
  serverResponsePositions,
} from "../api/apiUser";
import Button from "./Button.vue";

const form = ref({
  name: "",
  email: "",
  phone: "+380",
  position_id: "",
  photo: null as File | null,
});

const positions = ref<serverResponsePositions["positions"]>([]);
const token = ref("");
const loading = ref(false);

const nameError = ref(false);
const emailError = ref(false);
const phoneError = ref(false);

function useDebounced(fn: () => void, delay = 1000) {
  let timer: number;

  return () => {
    clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
}

const validateName = () => {
  const regex = /^[\w',.\-][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/;
  nameError.value =
    !regex.test(form.value.name) ||
    form.value.name.length < 2 ||
    form.value.name.length > 60;
};

const validateEmail = () => {
  const regex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  emailError.value = !regex.test(form.value.email);
};

const validatePhone = () => {
  const regex = /^\+380\d{9}$/;
  phoneError.value = !regex.test(form.value.phone);
};

const onNameInput = useDebounced(validateName, 1500);
const onEmailInput = useDebounced(validateEmail, 1500);
const onPhoneInput = useDebounced(validatePhone, 1500);

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  form.value.photo = file;
};

const fetchPositions = async () => {
  try {
    const res = await getAllPositions("/positions");
    if (res.success) positions.value = res.positions;
  } catch (err) {
    console.error("Error fetching positions:", err);
  }
};

const fetchToken = async () => {
  try {
    const res = await getToken("/token");
    if (res.success) token.value = res.token;
  } catch (err) {
    console.error("Error fetching token:", err);
  }
};

onMounted(() => {
  fetchPositions();
  fetchToken();
});

const handleSubmit = async () => {
  validateName();
  validateEmail();
  validatePhone();

  if (
    !form.value.photo ||
    nameError.value ||
    emailError.value ||
    phoneError.value ||
    !form.value.position_id
  ) {
    alert("Please fill the form correctly.");
    return;
  }

  if (!/^\+380\d{9}$/.test(form.value.phone)) {
    alert("Phone number must be in format +380XXXXXXXXX");
    return;
  }

  const formData = new FormData();
  formData.append("name", form.value.name.trim());
  formData.append("email", form.value.email.trim());
  formData.append("phone", form.value.phone.trim());
  formData.append("position_id", String(+form.value.position_id));
  formData.append("photo", form.value.photo);

  loading.value = true;

  try {
    const res = await fetch(
      "https://frontend-test-assignment-api.abz.agency/api/v1/users",
      {
        method: "POST",
        headers: {
          Token: token.value,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("User registered successfully!");
      form.value = {
        name: "",
        email: "",
        phone: "+380",
        position_id: "",
        photo: null,
      };
    } else {
      alert("Error: " + JSON.stringify(data));
      console.error("Server validation errors:", data.fails);
    }
  } catch (err) {
    alert("Network error.");
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="form" id="form">
    <h1 class="form__title">Working with POST request</h1>

    <form @submit.prevent="handleSubmit" class="form__shape">
      <input
        v-model="form.name"
        @input="onNameInput"
        type="text"
        placeholder="Your name"
        class="form__input"
        :class="{ 'form__input--error': nameError }"
      />

      <input
        v-model="form.email"
        @input="onEmailInput"
        type="email"
        placeholder="Email"
        class="form__input"
        :class="{ 'form__input--error': emailError }"
      />

      <input
        v-model="form.phone"
        @input="onPhoneInput"
        type="tel"
        placeholder="Phone"
        class="form__input"
        :class="{ 'form__input--error': phoneError }"
      />
      <div class="form__hint">+38 (XXX) XXX - XX - XX</div>

      <div class="form__shape-positions">
        <h4 class="form__shape-positions__title">Select your position</h4>

        <div class="form__shape-positions__options">
          <label
            v-for="position in positions"
            :key="position.id"
            class="form__shape-positions__option"
          >
            <input
              type="radio"
              class="form__shape-positions__option--radio"
              :value="position.id"
              v-model="form.position_id"
              name="positions"
            />
            {{ position.name }}
          </label>
        </div>
      </div>

      <label for="inputTag" class="form__shape-upload-label">
        <span class="form__shape-upload-label__text">Upload</span>
        <span class="form__shape-upload-label__photo">
          {{ form.photo?.name || "Upload your photo" }}
        </span>
        <input
          id="inputTag"
          type="file"
          class="form__shape-upload-input"
          @change="handleFileChange"
        />
      </label>

      <div class="form__shape-submit">
        <Button
          class="button"
          text="Sign up"
          type="submit"
          :disabled="
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.photo ||
            !form.position_id ||
            loading
          "
        />
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    text-align: center;
    margin-bottom: 50px;
  }

  &__input {
    width: 100%;
    height: 54px;
    padding: 14px 16px;
    margin-bottom: 50px;
    font-size: 16px;
    line-height: 26px;
    border: 1px solid #d0cfcf;
    border-radius: 4px;
    transition: border-color 0.3s;

    &--error {
      border-color: $error-color;
    }
  }

  &__hint {
    margin-top: -45px;
    margin-bottom: 30px;
    color: #7e7e7e;
    font-size: 12px;
  }

  &__shape {
    width: 100%;
    max-width: 380px;

    @include onTablet {
      width: 380px;
    }

    &-positions {
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 50px;

      &__title {
        margin-bottom: 11px;
      }

      &__options {
        display: flex;
        flex-direction: column;
      }

      &__option {
        display: flex;
        align-items: center;
        margin-bottom: 7px;
        cursor: pointer;

        &--radio {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          border-radius: 50%;
          border: 1px solid #d0cfcf;
          transition: border-color 0.3s;
          appearance: none;
          cursor: pointer;
          position: relative;

          &:checked {
            border-color: $secondary-color;
          }

          &:checked::before {
            content: "";
            position: absolute;
            top: 4px;
            left: 4px;
            width: 10px;
            height: 10px;
            background-color: $secondary-color;
            border-radius: 50%;
            transform: scale(1);
          }
        }
      }
    }

    &-upload {
      &-label {
        display: flex;
        cursor: pointer;
        height: 54px;
        margin-bottom: 50px;

        &__text {
          padding: 14px 15px;
          font-size: 16px;
          line-height: 26px;
          border: 1px solid rgba(0, 0, 0, 0.87);
          border-radius: 4px 0 0 4px;
        }

        &__photo {
          flex-grow: 1;
          padding: 14px 0 14px 16px;
          border-top: 1px solid #d0cfcf;
          border-right: 1px solid #d0cfcf;
          border-bottom: 1px solid #d0cfcf;
          border-radius: 0 4px 4px 0;
          color: #7e7e7e;
          font-size: 16px;
          line-height: 26px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: border-color 0.3s, color 0.3s;

          &:hover {
            border-color: rgba(0, 0, 0, 0.87);
            color: rgba(0, 0, 0, 0.87);
          }
        }
      }

      &-input {
        display: none;
      }
    }

    &-submit {
      display: flex;
      justify-content: center;
    }
  }
}

.button {
  &:disabled {
    background-color: #b4b4b4;
    cursor: not-allowed;
  }
}
</style>
