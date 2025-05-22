<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <div>
    <div text-4xl />
  </div>
</template>
