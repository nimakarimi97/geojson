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
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Vitesse
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
