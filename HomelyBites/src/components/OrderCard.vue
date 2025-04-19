<template>
    <div class="order-card">
      <p><strong>Customer:</strong> {{ order.customer }}</p>
      <p><strong>Items:</strong></p>
      <ul class="item-list">
        <li v-for="(item, index) in order.items" :key="index">
            {{ item.name }} × {{ item.quantity }}
        </li>
        </ul>
      <p><strong>Time:</strong> {{ formatDate(order.time) }}</p>
  
      <div v-if="showActions" class="order-actions">
        <button v-if="showActions && order.status === 'pending'" @click="$emit('accept')">✅ Accept</button>
        <button v-if="showActions && order.status === 'pending'" @click="$emit('reject')">❌ Reject</button>
        <button v-if="order.status === 'ongoing'" @click="$emit('done')">✅ Done</button>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrderCard",
    props: {
      order: Object,
      showActions: Boolean,
      formatDate: Function,
    },
  };
  </script>
  
  <style scoped>
  .order-card {
    min-width: 250px;
    max-width: 300px;
    background: #fff5e0;
    padding: 12px;
    margin-right: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  </style>
  