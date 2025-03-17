<template>
    <div class="kitchen-page">
      <h1>Manage My Kitchen</h1>
  
      <!-- Availability Toggle -->
      <div class="availability">
        <label>Available for orders</label>
        <input type="checkbox" v-model="isAvailable" @change="toggleAvailability" />
      </div>
  
      <!-- Ongoing Orders -->
      <div>
        <h2>Ongoing Orders</h2>
        <div v-for="order in ongoingOrders" :key="order.id" class="order">
          <p>{{ order.customer }} - {{ order.items.join(", ") }}</p>
          <button @click="markOrderDone(order.id)">Done</button>
        </div>
      </div>
  
      <!-- Pending Orders -->
      <div>
        <h2>Pending Orders</h2>
        <div v-for="order in pendingOrders" :key="order.id" class="order">
          <p>{{ order.customer }} - {{ order.items.join(", ") }}</p>
          <button @click="acceptOrder(order.id)">Accept</button>
          <button @click="rejectOrder(order.id)">Reject</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from "@/firebase";
  import { collection, doc, updateDoc, getDocs, query, where } from "firebase/firestore";
  
  export default {
    name: 'Kitchen',
    data() {
      return {
        isAvailable: true,
        ongoingOrders: [],
        pendingOrders: [],
      };
    },
    async created() {
      await this.fetchOrders();
    },
    methods: {
      async fetchOrders() {
        const ordersRef = collection(db, "orders");
  
        // Fetch ongoing orders
        const ongoingQuery = query(ordersRef, where("status", "==", "ongoing"));
        const ongoingSnapshot = await getDocs(ongoingQuery);
        this.ongoingOrders = ongoingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        // Fetch pending orders
        const pendingQuery = query(ordersRef, where("status", "==", "pending"));
        const pendingSnapshot = await getDocs(pendingQuery);
        this.pendingOrders = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
  
      async toggleAvailability() {
        const chefRef = doc(db, "chefs", "chefAmanda");
        await updateDoc(chefRef, { available: this.isAvailable });
        alert("Availability updated!");
      },
  
      async acceptOrder(orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "ongoing" });
        this.fetchOrders();
      },
  
      async rejectOrder(orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "rejected" });
        this.fetchOrders();
      },
  
      async markOrderDone(orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "completed" });
        this.fetchOrders();
      },
    },
  };
  </script>
  