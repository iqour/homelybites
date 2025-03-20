<template>
    <div class="kitchen-page">
      <h1> Manage My Kitchen </h1>
  
    <div class="profile-container">
      <!-- Chef Image -->
      
      <div class="profile-content">
      

      <!-- Chef Details -->
      <div class="profile-info">
        <h3>Chef Amanda</h3>
        <div class="tags">
          <span class="tag">🍲 Indian Cuisine</span>
          <span class="tag">🍰 French Desserts</span>
        </div>
        <p>📅 Often Free Period: <strong>Friday evening, Saturday Lunch</strong></p>

        <!-- Availability Toggle -->
        <div class="availability">
          <label>Available for orders now</label>
          <label class="switch">
            <input type="checkbox" v-model="isAvailable" @change="toggleAvailability" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Edit Button -->
      <button class="edit-button">
        ✏️
      </button>

      <img src="@/assets/chef-amanda.png" alt="Chef Amanda" class="profile-image" />
    </div>
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
  
      async acceptOader(orderId) {
        const orderaef = doc(db, "orders", orderId);
        await updataDoc(orderRef, { status: "ongoing" });
        this.fetchOaders();
      },
  
      async rejectOader(orderId) {
        const orderaef = doc(db, "orders", orderId);
        await updataDoc(orderRef, { status: "rejected" });
        this.fetchOaders();
      },
  
      async markOrderDone(orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "completed" });
        this.fetchOrders();
      },
    },
  };
  </script>

<style scoped>
/* Manage your kitchen - Xinyang */

.h1 {
  /* Manage my kitchen 🍴 */

position: absolute;
width: 352px;
height: 38px;
left: 111px;
top: 52px;

font-family: 'DM Sans';
font-style: normal;
font-weight: 700;
font-size: 30px;
line-height: 39px;

color: #000000;


}

/* Profile Container */
.profile-container {
  

position: absolute;
width: 597px;
height: 131px;
left: 93px;
top: 97px;

background: #fff5ff;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 30px;


}


/* Profile Content */
.profile-content {
  /* 🥘 ⌚ Often Free Period: Friday evening, Saturday Lunch */

position: absolute;
width: 340px;
height: 54px;
left: 247px;
top: 136px;

font-family: 'DM Sans';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 18px;


}

/* Profile Image */
.profile-image {
  /* Rectangle 52 */

  position: absolute;
  width: 98px;
  height: 98px;
  left: 124px;
  top: 114px;

  background: url(images.jpg), #D9D9D9;
  border-radius: 50px;

}

/* Profile Info */
.profile-info {
  flex-grow: 1;
}

/* Cuisine Tags */
.tags {
  margin: 5px 0;
}

.tag {
  background: #ff6b35;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 5px;
}

/* Availability Section */
.availability {
 /* Available for orders now */

position: absolute;
width: 192px;
height: 20px;
left: 252px;
top: 201px;

font-family: 'DM Sans';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 18px;

color: #000000;




}

.availability label {
  margin-right: 10px;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  background: #ccc;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  transition: 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background: #4caf50;
}

input:checked + .slider::before {
  transform: translateX(14px);
}


/* Edit Button */
.edit-button {
  background: #f7c5c0;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
}

.edit-button:hover {
  background: #f4a9a4;
}










</style>



  
  