<template>
  <div class="main-content">
    
    <!-- left side of the page: purchase history -->
    <div class="big-section">
      <h2 class = "section-title">Order History</h2>
      <div class="purchase-container">
        <div v-if="purchaseOrders.length === 0">No orders found for {{ userID }}</div>
        <div v-else>
          <div class="order-list">
            <div v-for="(order, index) in purchaseOrders"
                :key="index"
                class="order-row">
                <!-- left section: image -->
                <img
                  class="chef-image"
                  :src="chefNamesMap[order.chefID]?.image || 'https://via.placeholder.com/80'"
                  alt="Chef Image"/>
                <!-- middle section: order details -->
                <div class="order-details">
                  <div class="order-header">
                    <h3 class="chef-name">Chef {{ chefNamesMap[order.chefID]?.name || order.chefID }}</h3>
                  </div>
                  <p class="order-time">
                    {{ order.time?.seconds ? new Date(order.time.seconds * 1000).toLocaleString() : "N/A" }}
                  </p>
                  <div class="button-row">
                    <button @click="viewOrder(order)">View</button>
                    <button @click="openReviewForm(order)">Rate</button>
                    <button @click="reorder(order)">Reorder</button>
                  </div>
                </div>
                <!-- right section: price -->
                <div class="price">{{ formatCurrency(order.totalPrice) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="big-section">
      <h2 class = "section-title">Sales History</h2>
      <div class="sales-container">
        <div v-if="salesOrders.length === 0">No orders found for {{ userID }}</div>
        <div v-else>
          <div class="order-list">
            <div v-for="(order, index) in salesOrders"
                :key="index"
                class="order-row">
                <!-- left section: image -->
                <img
                  class="chef-image"
                  :src="customerNamesMap[order.customerID]?.image || 'https://via.placeholder.com/80'"
                  alt="Chef Image"/>
                <!-- middle section: order details -->
                <div class="order-details">
                  <div class="order-header">
                    <h3 class="chef-name">{{ customerNamesMap[order.customerID]?.name || order.customerID }}</h3>
                  </div>
                  <p class="order-time">
                    {{ order.time?.seconds ? new Date(order.time.seconds * 1000).toLocaleString() : "N/A" }}
                  </p>
                  <div class="button-row">
                    <button @click="viewOrder(order)">View</button>
                  </div>
                </div>
                <!-- right section: price -->
                <div class="price">{{ formatCurrency(order.totalPrice) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase";
import { 
  getFirestore, 
  collection, 
  getDocs } from "firebase/firestore";

export default {
  name: "OrderHistory",
  data() {
    return {
      userID: "testuser@test.com",
      purchaseOrders: [],
      chefNamesMap: {},
      salesOrders: [],
      customerNamesMap: {},
    };
  },
  methods: {
    formatCurrency(value) {
      return "$" + Number(value).toLocaleString();
    },
    //look for orders that has customerID as userID, look for chef's names
    async fetchPurchasesFromFirestore() {
      const db = getFirestore(firebaseApp);
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);
      const allOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const matchedOrders = allOrders.filter(order =>
        order.customerID?.toLowerCase() === this.userID.toLowerCase()
      );
      this.purchaseOrders = matchedOrders;

      const chefEmails = [...new Set(matchedOrders.map(order => order.chefID))];
      const usersRef = collection(db, "testUsers");
      const usersSnapshot = await getDocs(usersRef);
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (chefEmails.includes(data.email)) {
          this.chefNamesMap[data.email] = {
            name: data.name, 
            image: data.profileImage,
          }
        };
      });
    },
    viewOrder(order) {
      alert("Viewing order:\n" + JSON.stringify(order, null, 2));
    },
    reorder(order) {
      alert("Reordering items from Chef " + order.chefID);
    },
    openReviewForm(order) {
      this.$router.push({ 
        path: '/review', 
        query: { 
          chefId: order.chefID,       
          customerId: order.customerID
        } 
      });
    },
    async fetchSalesFromFirestore() {
      const db = getFirestore(firebaseApp);
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);
      const allOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const matchedOrders = allOrders.filter(order =>
        order.chefID?.toLowerCase() === this.userID.toLowerCase()
      );
      this.salesOrders = matchedOrders;

      const customerEmails = [...new Set(matchedOrders.map(order => order.customerID))];
      const usersRef = collection(db, "testUsers");
      const usersSnapshot = await getDocs(usersRef);
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (customerEmails.includes(data.email)) {
          this.customerNamesMap[data.email] = {
            name: data.name, 
            image: data.profileImage,
          }
        };
      });
    },
  },
  mounted() {
    this.fetchPurchasesFromFirestore();
    this.fetchSalesFromFirestore();
  }
};
</script>

<style scoped>

* {
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  gap: 40px;
  height: 90vh
}

.big-section {
  background-color: white;
  flex: 1;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
}

.purchase-container .sales-container {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding-right: 10px;
}

.order-row {
  display: flex;
  align-items: top;
  gap: 10px;
  border-bottom: 1px solid #eee;
  padding: 15px;
}

.chef-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}

.order-details {
  flex: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chef-name {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 7px;
}

.order-time {
  color: black;
  margin-bottom: 10px;
  font-weight: 300;
}

.price {
  color: black;
  font-size: 16px;
  font-weight: 350;
  flex: 1;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.button-row button {
  padding: 8px 12px;
  border: none;
  background-color: lightgray;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.button-row button:hover {
  background-color: lightgray;
}
</style>