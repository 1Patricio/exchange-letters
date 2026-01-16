<template>
  <div class="q-pa-md">
    <h5 class="q-mb-sm text-secondary text-bold">Lista de Trocas</h5>
    <q-table
      flat
      bordered
      style="height: 500px"
      :rows="listTrade"
      :columns="columns"
      :loading="tradeStore.isLoading"
      row-key="id"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="{ rowsPerPage: 0 }"
      :rows-per-page-options="[0]"
      @virtual-scroll="onScroll"
      hide-pagination
      @row-click="onClick"
      table-header-class="bg-grey-3"

    />
  </div>
</template>

<script setup lang="ts">
import { useTradesStore } from '@/stores/tradesStore'
import { nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'

const tradeStore = useTradesStore()
const { listTrade } = storeToRefs(tradeStore)
const notification = useNotification()
const router = useRouter()

const canLoadMore = ref(false)

const columns = [
  {
    name: 'user',
    label: 'Usuário',
    field: (row: any) => row.user?.name ?? 'Desconhecido',
    align: 'left',
    sortable: true
  },
  {
    name: 'card-receiving',
    label: 'Recebendo',
    field: (row: any) => row.tradeCards?.find((tradeReceiving: any) => tradeReceiving.type === 'RECEIVING')?.card?.name ?? '-',
    align: 'left'
  },
  {
    name: 'card-offering',
    label: 'Oferecendo',
    field: (row: any) => row.tradeCards?.find((tradeOffering: any) => tradeOffering.type === 'OFFERING')?.card?.name ?? '-',
    align: 'left'
  }
]

onMounted(async () => {
  try {
    await tradeStore.getTrades()
    await nextTick()
    setTimeout(() => {
      canLoadMore.value = true
    }, 500)
  } catch (error) {
    notification.error('Erro ao carregar lista de trocas de cartas')
    console.error(error)
  }
})

async function onScroll({ to, ref }: { to: number; ref: any }) {
  if (!canLoadMore.value) return

  const lastIndex = listTrade.value.length - 1
  const threshold = Math.max(0, lastIndex - 2)

  if (to >= threshold && tradeStore.more && !tradeStore.isLoading) {
    try {
      tradeStore.page++
      await tradeStore.getTrades()
      await nextTick()
      ref.refresh()
    } catch (error) {
      notification.error('Erro ao carregar mais trocas')
      console.error(error)
      tradeStore.page--
    }
  }
}

function onClick(row: any, index: any) {
  console.log('Linha completa:', row)
  console.log('Index:', index)

  // Você pode fazer o que quiser com o ID
  //alert(`Clicou na troca ID: ${index.id}`)

  router.push({
    name: 'trades-view',
    params: {
      id: index.id
    }
  })

}

</script>
