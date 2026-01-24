<template>
  <div class="q-pa-md">
    <div class="flex text-h6 justify-center q-mb-none" style="align-content: center;">
      <router-link class="text-grey-8" :to="{ name: 'profile-card' }">Cartas</router-link>
      <q-separator vertical spaced size="2px" style="max-height: 32px; color: black;"/>
      <p class="text-secondary text-bold">Trocas</p>
    </div>
    <h5 class="q-my-sm text-secondary text-bold">Minhas Solicitações</h5>

    <div v-if="tradeStore.isLoading">
      <LoadingComponent />
    </div>

    <div v-else>
      <div v-if="tradeStore.listUserTrade.length">
        <q-table
          flat
          bordered
          style="height: 500px"
          :rows="trades"
          :columns="columns"
          :loading="tradeStore.isLoading"
          row-key="id"
          virtual-scroll
          :virtual-scroll-item-size="48"
          :virtual-scroll-sticky-size-start="48"
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[0]"
          hide-pagination
          @row-click="onClick"
          table-header-class="bg-grey-3"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" close-on-click>
              <q-btn icon="delete" color="red" @click.stop="onDelete(props.row.id)"></q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-card-receiving="props">
            <q-td :props="props">
                {{ props.row.tradeCards?.find((tradeReceiving: any) => tradeReceiving.type === 'RECEIVING')?.card?.name ?? '-' }}
                <q-badge
                  rounded
                  color="primary"
                  v-if="props.row.tradeCards?.filter((tradeReceiving: any) => tradeReceiving.type === 'RECEIVING').length >= 2 "
                  :label="`+ ${props.row.tradeCards?.filter((tradeReceiving: any) => tradeReceiving.type === 'RECEIVING').length - 1}`"
                />
            </q-td>
          </template>
          <template v-slot:body-cell-card-offering="props">
            <q-td :props="props">
                {{ props.row.tradeCards?.find((tradeOffering: any) => tradeOffering.type === 'OFFERING')?.card?.name ?? '-' }}
                <q-badge
                  rounded
                  color="primary"
                  v-if="props.row.tradeCards?.filter((tradeOffering: any) => tradeOffering.type === 'OFFERING').length >= 2 "
                  :label="`+ ${props.row.tradeCards?.filter((tradeOffering: any) => tradeOffering.type === 'OFFERING').length - 1}`"
                />
            </q-td>
          </template>
        </q-table>
      </div>

      <div v-else>
        <div class="col-12 col-md-6 flex flex-center bg-grey-2 q-pa-md q-pt-lg">
          <div class="text-center">
            <q-img
              src="/undraw/trade-empty-icon.svg"
              class="q-mx-auto q-mb-md"
              style="max-width: 300px"
              contain
            />
            <h4 class="text-secondary text-bold q-mb-sm">Você não possui solicitações de troca!</h4>
            <p class="text-grey-darken-1">Vá para página de <strong><router-link class="text-secondary" :to="{ name: 'trades' }">Trocas</router-link></strong> e solicite troca de cartas</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useNotification } from '@/composables/useNotification';
import type { Trade } from '@/models/Trade';
import { useTradesStore } from '@/stores/tradesStore';
import { useQuasar, type QTableColumn } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const tradeStore = useTradesStore()
const notification = useNotification()
const $q = useQuasar()
const router = useRouter()

const trades = ref<Trade[]>([])

const columns: QTableColumn[] = [
  {
    name: 'user',
    label: 'Usuário',
    field: (row: any) => row.user?.name ?? 'Desconhecido',
    align: 'left',
    sortable: true
  },
  {
    name: 'card-offering',
    label: 'Oferecendo',
    field: '',
    align: 'left'
  },
  {
    name: 'card-receiving',
    label: 'Recebendo',
    field: '',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Ações',
    field: '',
    align: 'center'
  }
]

onMounted(async () => {
    try {
    await tradeStore.getUserTrades()
    trades.value = tradeStore.listUserTrade
  } catch {
    notification.error("Erro ao buscar solicitação de trocas")
  }
})

async function onDelete(id: string) {
  $q.dialog({
    title: 'Deseja realmente deletar esta solicitação do seu perfil?',
    message: 'Essa ação não pode ser desfeita',
    cancel: {
      label: 'Cancelar',
      color: 'red',
    },
    persistent: true,
    ok: {
      label: 'Sim',
      color: 'secondary',
    },
  }).onOk(async () => {
    try {
      await tradeStore.deleteTrade(id)
      const tradeRemove = tradeStore.listUserTrade.findIndex(trade => trade.id === id)

      if(tradeRemove !== -1){
        tradeStore.listUserTrade.splice(tradeRemove, 1)
      }
      notification.success('Solicitação de troca deletada com sucesso')
    } catch {
      notification.error('Erro ao excluir solicitação do usuário')
    }
  })
}

function onClick(_evt: Event, row: any) {
  if(_evt.currentTarget?.removeEventListener)
  tradeStore.setSelectedTrade(row)
  router.push({
    name: 'trades-view',
    params: { id: row.id }
  })
}
</script>
