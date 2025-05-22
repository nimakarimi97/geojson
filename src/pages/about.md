---
title: About
---

<script setup>
const { t } = useI18n()
useHead({ title: () => t('button.about') })
</script>

<div class="text-center">
  <!-- You can use Vue components inside markdown -->
  <div i-carbon-dicom-overlay class="text-4xl -mb-6 m-auto" />
  <h3>{{ t('button.about') }}</h3>
</div>

```js
// syntax highlighting example
function vitesse() {
  const foo = 'bar'
  console.log(foo)
}
```
