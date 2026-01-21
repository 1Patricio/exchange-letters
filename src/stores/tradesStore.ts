import api from "@/api/api";
import type { Trade } from "@/models/Trade";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTradesStore = defineStore('trades', () => {
  const listTrade = ref<Trade[]>([])
  const selectedTrade = ref<Trade | null>()
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  const page = ref(1)
  const rpp = ref(10)
  const more = ref(false)

  async function getTrades() {
    isLoading.value = true;
    try {
      const response = await api.get(`/trades?rpp=${rpp.value}&page=${page.value}`);

      if (page.value === 1) {
        listTrade.value = response.data.list;
      } else {
        listTrade.value.push(...response.data.list);
      }

      more.value = response.data.more;

    } catch (err: any) {
      error.value = err.message;
      throw err
    } finally {
      isLoading.value = false;
    }
  }

  async function postTrade(request: Trade) {
    isLoading.value = true
    error.value = null
    try{
      const response = await api.post('/trades', request)
      return response.data
    }catch(err:any){
      error.value = err?.response?.data?.message || err?.message
      throw err
    }finally{
      isLoading.value = false
    }
  }

  async function setSelectedTrade(trade: Trade){
    selectedTrade.value = trade

  }

  return {
    listTrade,
    selectedTrade,
    isLoading,
    error,
    page,
    rpp,
    more,
    getTrades,
    postTrade,
    setSelectedTrade
  }
})
