<template>
    <div class="kitchen-page">
      <h1> Manage My Kitchen </h1>
  
    <div class="profile-container">
      <!-- Chef Image -->
      
      <div class="profile-content">
      

      <!-- Chef Details -->
      <div class="profile-info">
        <h3>Chef Maria</h3>
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
      
  <div class="orders-container">
      <!-- Ongoing Orders -->
      <div class ="ongoing-container">
        <h2>Ongoing Orders</h2>
        <div v-if="ongoingOrders.length">
          <div v-for="order in ongoingOrders" :key="order.id" class="order">
            <p><strong>Customer:</strong> {{ order.customer }}</p>
            <ul>
              <li v-for="(qty, item) in order.items" :key="item">
                  {{ item }}: {{ qty }}
                </li>
            </ul>
            <p><strong>Time:</strong> {{ formatDate(order.time) }}</p>
          <button @click="markOrderDone(order.id)">Done</button>
          </div>
        </div>
        <p v-else>No ongoing orders</p>
      </div>

      <!-- Pending Orders -->
      <div class="pending-orders">
        <h2>Pending Orders</h2>
        <div v-if="pendingOrders.length">
          <div v-for="order in pendingOrders" :key="order.id" class="order-card">
            <p><strong>Customer:</strong> {{ order.customer }}</p>
            <ul>
              <li v-for="(qty, item) in order.items" :key="item">
                {{ item }}: {{ qty }}
              </li>
            </ul>
            <p><strong>Time:</strong> {{ formatDate(order.time) }}</p>

            <div class="order-actions">
              <button @click="acceptOrder(order.id)">✅ Accept</button>
              <button @click="rejectOrder(order.id)">❌ Reject</button>
            </div>
          </div>
        </div>
        <p v-else>No pending orders</p>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { db, auth } from "@/firebase";
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
        try {
          const user = auth.currentUser;
          if (!user) return;

          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("chef", "==", user.uid));
          const snapshot = await getDocs(q);

          this.pendingOrders = [];
          this.ongoingOrders = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const order = {
              id: docSnap.id,
              customer: data.customer,
              items: data.items,
              status: data.status,
              time: data.time,
            };

            if (order.status === "pending") {
              this.pendingOrders.push(order);
            } else if (order.status === "ongoing") {
              this.ongoingOrders.push(order);
            }
          });
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      },
    
      async toggleAvailability() {
        const chefRef = doc(db, "chefs", "chefAmanda");
        await updateDoc(chefRef, { available: this.isAvailable });
        alert("Availability updated!");
      },
  
      async acceptOrder(orderId) {
      try {
        await updateDoc(doc(db, "orders", orderId), {
          status: "ongoing",
        });
        this.fetchOrders();
      } catch (err) {
        console.error("Error accepting order:", err);
      }
    },
  
      async rejectOrder(orderId) {
        try {
          await updateDoc(doc(db, "orders", orderId), {
            status: "rejected",
          });
          this.fetchOrders();
        } catch (err) {
          console.error("Error rejecting order:", err);
        }
      },

      formatDate(timestamp) {
      if (!timestamp?.toDate) return "Unknown";
      return timestamp.toDate().toLocaleString();
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
  background: #f8f0e5;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: center;
}


/* Profile Content */
.profile-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  /*align-items: center;*/
  justify-content: flex-start; 
  width: 80%;  /* Ensures it takes a good width */
  max-width: 800px; /* Prevents it from stretching too wide */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  flex-wrap: wrap; /* Allows wrapping of elements inside */
}
/* Profile Image */

.profile-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 15px;
  flex-shrink: 0; /* Prevents the image from resizing */
}

/* Profile Info */
.profile-info {
  flex-grow: 1;
  min-width: 60%; /* Ensures text does not overflow */
  padding: 10px 15px; /* Adds spacing inside */
  display: flex;
  justify-content: flex-start; 
  flex-direction: column;
}


/* Cuisine Tags */
.tags {
  margin: 5px 0;
  
  justify-content: center;
  align-items: center;
  display: flex;
  flex-wrap: wrap; /* Prevents overflow */
}

.tag {
  background: #ff6b35;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Availability Section */
.availability {
  display: flex;
  align-items: center;
  margin-top: 10px;
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

.orders-container {
  display: flex;
  justify-content: space-between; /* Space items evenly */
  align-items: flex-start; /* Align to the top */
  width: 100%;
  gap: 20px;
  margin-top: 10px;
}


.ongoing-container {
  /* Group 199 */
  flex: 1;
  box-shadow: 0 4px 10px rbga(0,0,0,0.1);
  width: 45%;
  height: 300px;
  
  background-color: #ffd7b6;
  
  border-radius: 5px;
}

.pending-container {
  /* Group 199 */

  flex: 1;
  box-shadow: 0 4px 10px rbga(0,0,0,0.1);
  width: 45%;
  height: 300px;
  
  background-color: #ffd7b6;
  
  border-radius: 5px;
}

#Done {
 
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 0px;
gap: 8px;

width: 81px;
height: 40px;
left: 114px;
top: 423px;

background: #499A68;
border-radius: 100px;

}










</style>



  
  