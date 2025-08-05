<script setup lang="ts">
interface Props {
  width?: string;
  text: string;
  type: "button" | "submit";
  onSubmit?: () => void;
  disabled?: boolean;
}

const props = defineProps<Props>();

function handleClick() {
  if (!props.disabled && props.onSubmit) {
    props.onSubmit();
  }
}
</script>

<template>
  <button
    class="button"
    :style="{ width: width }"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<style scoped lang="scss">
.button {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 4px 22px;

  height: 34px;
  background-color: $btn-yellow;
  border-radius: 80px;
  color: rgba(0, 0, 0, 0.87);
  transition: background-color 0.3s;

  &:hover {
    background-color: $btn-yellow-hover;
  }

  &:disabled {
    background-color: $btn-disabled;
    color: rgba(255, 255, 255, 0.87);
    cursor: not-allowed;
  }
}
</style>
