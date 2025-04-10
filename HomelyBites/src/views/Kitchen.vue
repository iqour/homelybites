<template>
    <div class="kitchen-page">
      <h1> Manage My Kitchen </h1>
  
    <div class="profile-container">
      <!-- Chef Image -->
      
      <div class="profile-content">
      

      <!-- Chef Details -->
      <div class="profile-info">
        <h3>Chef {{ user.name }}</h3>
        <div class="tags">
          <span v-for="tag in user.cuisineTags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <p><strong>Free Period:</strong> {{ user.freePeriod }}</p>

        <!-- Availability Toggle -->
        <div class="availability">
          <label>
            <strong>Status: </strong>
            <span :style="{ color: user.isAvailable ? 'green' : 'gray' }">
              {{ user.isAvailable ? "Available" : "Not available" }}
            </span>
          </label>
          <label class="switch">
            <input
              type="checkbox"
              v-model="user.isAvailable"
              @change="toggleAvailability"
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>


      <!-- Edit Button -->
      <button class="edit-button">
        ✏️
      </button>

      <img :src="user.profileImage" alt="Chef photo" v-if="user.profileImage" />
    </div>
  </div>
      
    <!-- all orders -->
    <div class="orders-container">
      <div class="ongoing-orders">
        <h2>Ongoing Orders</h2>
        <div v-if="ongoingOrders.length" class="scroll-row">
          <OrderCard
            v-for="order in ongoingOrders"
            :key="order.id"
            :order="order"
            :formatDate="formatDate"
            :showActions="true"
            @done="markOrderDone(order.id)"
          />
        </div>
        <p v-else>No ongoing orders</p>
    </div>


      <!-- Pending Orders -->
      <div class="pending-orders">
      <h2>Pending Orders</h2>
      <div v-if="pendingOrders.length" class="scroll-row">
        <OrderCard
          v-for="order in pendingOrders"
          :key="order.id"
          :order="order"
          :formatDate="formatDate"
          :showActions="true"
          @accept="acceptOrder(order.id)"
          @reject="rejectOrder(order.id)"
        />
      </div>
      <p v-else>No pending orders</p>
    </div>
  </div>
  </div>
</template>
  
<script>
import { db, auth } from "@/firebase";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import OrderCard from "@/components/OrderCard.vue";



export default {
  components: {
  OrderCard
  },
  name: "Kitchen",
  data() {
    return {
      user: {
        name: "",
        profileImage: "",
        cuisineTags: [],
        freePeriod: "",
        isAvailable: false,
      },
      currentUserId: null,
      ongoingOrders: [],
      pendingOrders: [],
    };
  },

  async created() {
    console.log("Created hook triggered");

    try {
      // 🛠 Hardcoded test login (remove in production)
      const userCred = await signInWithEmailAndPassword(
        auth,
        "cheftesting@gmail.com",
        "12345678" 
      );

      const uid = userCred.user.uid;
      this.currentUserId = uid;

      // 🔥 Fetch chef profile from Firestore
      const profileDoc = await getDoc(doc(db, "users", uid));
      if (profileDoc.exists()) {
        this.user = profileDoc.data();
        console.log("✅ Loaded chef profile:", this.user);
      } else {
        console.warn("⚠️ Chef profile not found in Firestore.");
      }

      // 📦 Fetch orders
      await this.fetchOrders();
    } catch (err) {
      console.error("❌ Login or fetch failed:", err.message);
    }
  },

  methods: {
    async fetchOrders() {
      try {
        console.log("try fetching order:", this.currentUserId);

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("chefID", "==", this.currentUserId));
        const snapshot = await getDocs(q);

        this.pendingOrders = [];
        this.ongoingOrders = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();

          let customerName =  "Unknown";
          try {
            const customerRef = doc(db, "users", data.customerID); // customer UID
            const customerDoc = await getDoc(customerRef);

            console.log("Fetching customer:", data.customerID);
            console.log("Document exists?", customerDoc.exists());
            console.log("Raw document data:", customerDoc.data());

            if (customerDoc.exists()) {
              const customerData = customerDoc.data();
              console.log("Customer document data:", customerDoc.data());
              customerName = customerData.name || "Unnamed";
            }
          } catch (err) {
            console.warn("Could not fetch customer name:", err);
          }

          const itemDetails = [];

          if (Array.isArray(data.Items)) {
            for (const itemId of data.Items) {
              try {
                const itemRef = doc(db, "items", itemId.trim());
                const itemSnap = await getDoc(itemRef);
                if (itemSnap.exists()) {
                  const itemData = itemSnap.data();
                  itemDetails.push({
                    name: itemData.name,
                    quantity: itemData.quantity,
                  });
                } else {
                  itemDetails.push({ name: "Unknown Item", quantity: 0 });
                }
              } catch (err) {
                console.error(`❌ Error fetching item ${itemId}:`, err);
                itemDetails.push({ name: "Error loading item", quantity: 0 });
              }
            }
          }

          const order = {
            id: docSnap.id,
            customer: customerName,
            items: itemDetails,
            status: data.status,
            time: data.time,
          };

          if (order.status === "pending") {
        this.pendingOrders.push(order);
      } else if (order.status === "ongoing") {
        this.ongoingOrders.push(order);
      }
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
},

    async toggleAvailability(event) {
      const newValue = event.target.checked;
      this.user.isAvailable = newValue;

      try {
        const docRef = doc(db, "users", this.currentUserId);
        await updateDoc(docRef, {
          isAvailable: newValue,
        });
        console.log("✅ Availability updated:", newValue);
      } catch (err) {
        console.error("❌ Failed to update availability:", err);
      }
    },

    async acceptOrder(orderId) {
      try {
        await updateDoc(doc(db, "orders", orderId), {
          status: "ongoing",
        });
        await this.fetchOrders();
      } catch (err) {
        console.error("Error accepting order:", err);
      }
    },

    async rejectOrder(orderId) {
      try {
        await updateDoc(doc(db, "orders", orderId), {
          status: "rejected",
        });
        await this.fetchOrders();
      } catch (err) {
        console.error("Error rejecting order:", err);
      }
    },

    async markOrderDone(orderId) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "completed" });
        await this.fetchOrders();
      } catch (err) {
        console.error("Error marking order done:", err);
      }
    },

    formatDate(timestamp) {
      if (!timestamp?.toDate) return "Unknown";
      return timestamp.toDate().toLocaleString();
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
  flex-direction: row;        /* 🧭 Make it row not column */
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;
  flex-wrap: wrap;            /* In case of small screen */
}


.ongoing-orders,
.pending-orders {
  flex: 1;
  background-color: #ffd7b6;
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
  max-width: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

.scroll-row {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding-bottom: 10px;
  gap: 12px;
}

.scroll-row::-webkit-scrollbar {
  height: 8px;
}
.scroll-row::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}












</style>



  
  