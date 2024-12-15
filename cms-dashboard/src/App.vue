<script setup>
  import Sidebar from "@/components/Sidebar.vue";
  import DataTable from 'datatables.net-vue3';
  import DataTablesCore from 'datatables.net-dt';
  
  DataTable.use(DataTablesCore);
</script>

<template>
  <div style="display: flex; flex-direction: row;">
    <Sidebar />
    <RouterView />
  </div>
</template>