<script setup lang="ts">
import type { GridApi, GridReadyEvent, Theme } from 'ag-grid-community'
import { themeMaterial } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

const { t } = useI18n()
useHead({
  title: () => t('button.sessions'),
})

const sessionsStore = useSessionsStore()

// Column definitions
const columnDefs = [
  { field: 'id', sortable: true, filter: true },
  {
    field: 'startTime',
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'endTime',
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'geojson',
    sortable: true,
    filter: true,
    cellRenderer: (params: any) => JSON.stringify(params.value),
  },
  {
    field: 'sessions data',
    sortable: true,
    filter: true,
    cellRenderer: (params: any) => JSON.stringify(params.value),
  },
]

const gridApi = shallowRef<GridApi | null>(null)

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

const gridOptions = {
  pagination: true,
  paginationAutoPageSize: true,
  animateRows: true,
  defaultColDef: {
    resizable: true,
    minWidth: 100,
    flex: 1,
  },
  suppressMovableColumns: true,
}

const themeMaterialCustomized = themeMaterial
  .withParams(
    {
      wrapperBorder: true,
      backgroundColor: '#f5f5f5',
      // headerBackgroundColor: '#e0e0e0',
    },
    'light',
  )

const theme = ref<Theme | 'legacy'>(themeMaterialCustomized)

watch(isDark, () => {
  document.body.dataset.agThemeMode = isDark.value ? 'dark' : 'light'
}, { immediate: true })

// Fetch sessions when the component is mounted
onMounted(async () => {
  try {
    await sessionsStore.fetchSessions()
  } catch (error) {
    console.error('Error fetching sessions:', error)
  }
})

// Computed properties to access store state
const sessions = computed(() => sessionsStore.sessions)
const loading = computed(() => sessionsStore.loading)
</script>

<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">
      {{ t('button.sessions') }}
    </h1>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="i-material-symbols:feature-search-outline-rounded h-8 w-8" />
    </div>

    <div v-else class="ag-theme-material h-[600px] w-full">
      <!-- Use this for example data during development -->
      <AgGridVue
        v-if="sessions.length === 0"
        :column-defs="columnDefs"
        :row-data="sessions"
        :grid-options="gridOptions"
        class="h-full w-full"
        :theme="theme"
        @grid-ready="onGridReady"
      />
    </div>
  </div>
</template>
