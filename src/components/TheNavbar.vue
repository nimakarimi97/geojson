<script setup lang="ts">
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t, locale } = useI18n()

async function toggleLocales() {
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}
</script>

<template>
  <nav flex="~ gap-4" justify-between px-6 py-4 text-xl>
    <div flex-center>
      <RouterLink icon-btn to="/" :title="t('button.home')">
        <div i-carbon-home />
      </RouterLink>

      <RouterLink icon-btn to="/about" :title="t('button.about')" data-test-id="about">
        <div i-carbon-dicom-overlay />
      </RouterLink>

      <div class="group relative" icon-btn>
        <button
          :title="t('api.gtfs_docs')"
          flex-center hover:text-blue-500 dark:hover:text-blue-400
        >
          <div i-carbon-api-1 />
        </button>

        <div
          class="invisible absolute z-10 mt-2 transform border border-gray-200 rounded-md bg-white p-2 text-gray-800 opacity-0 shadow-lg transition-all duration-200 ease-in-out group-hover:visible -translate-y-2 group-hover:translate-y-0 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-200 group-hover:opacity-100"
          w-50 text-sm
          flex="~ col gap-1"
        >
          <a
            href="https://smartroads-dev.tim.it/docs"
            target="_blank"
            rel="noopener noreferrer"
            :title="t('api.gtfs_docs')"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div i-carbon-api />
            {{ t('api.gtfs_docs') }}
          </a>
          <a
            href="https://smartroads-dev.tim.it/pinbike/docs"
            target="_blank"
            rel="noopener noreferrer"
            :title="t('api.pinbike_docs')"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div i-carbon-bicycle />
            {{ t('api.pinbike_docs') }}
          </a>
        </div>
      </div>
    </div>

    <div flex-center>
      <div i-material-symbols:bus-railway-outline text-2xl />
      <h1 font-bold dark:text-white class="hidden md:block">
        GeoJSON Tool
      </h1>
    </div>

    <div flex-center>
      <button icon-btn :title="t('button.toggle_dark')" data-test-id="toggle_dark" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <a icon-btn :title="t('button.toggle_langs')" @click="toggleLocales()">
        <div i-carbon-language />
      </a>
    </div>
  </nav>
</template>
