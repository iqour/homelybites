<template>

  <!-- home page main display part -->
  <div class="main-content">
    <h1 class = "title">Homely Bites</h1>

    <!-- Search bar and button -->
    <div class = "searchBar">
      <i class="icon-search"></i>
      <input type = "text" v-model="searchQuery" placeholder="Search home chefs by name or cuisine"/>
      <button @click = "onSearch" class="search-button">Search</button>
    </div>

    <!-- Categories of cuisines -->
    <div class="category-section">
      <h2 class="section-title">Explore by Cuisine</h2>
      <div class="category-container">
        <div v-for="category in categories" :key="category.name" class="category-card" @click="onCategoryClick(category.name)">
          <img :src="category.image" :alt="category.name" class="category-image" />
          <div class="category-name">{{ category.name }}</div>
        </div>
      </div>
    </div>

    <!-- Previously Ordered Row -->
    <div class="ordered-row">
      <h2 class="section-title">Chefs that You Ordered Before</h2>
      <div class="ordered-row-container">
        <div
          v-for="chef in orderedChefs"
          :key="chef.email"
          class="ordered-chef-card"
        >
          <img :src="chef.profileImage" alt="Chef Image" class="profile-image" />
          <div class="chef-details">
            <strong class="chef-name">{{ chef.name }}</strong>
            <p class="cuisine">{{ chef.cuisineSpecialty.join(", ") }}</p>
            <p class="address">{{ chef.pickupLocation.address }}</p>
            <p class="rating">Rating: {{ chef.rating }}</p>
            <a href="#" class="view-profile">> View Profile</a>
          </div>
        </div>
      </div>
    </div>

    <!-- buttons to add and delete chefs -->
    <div class="action-buttons">
      <button @click="saveChefsToFirestore">Save Chefs to Firestore</button>
      <button @click="clearChefsFromFirestore" style = "margin-left:10px">Clear All Chefs</button>
    </div>
    <p>Total User Profiles Number: {{ userCount }}</p>
  </div>
</template>

<script>
import firebaseApp from "@/firebase"
import { 
getFirestore, 
collection, 
doc,
addDoc, 
setDoc,
onSnapshot, 
getDocs, 
deleteDoc, 
query, 
where
} from "firebase/firestore"
import testChefs from "@/assets/testChef.json";
import chinese from "@/assets/categories/chinese.jpg";
import indian from "@/assets/categories/indian.jpg";
import western from "@/assets/categories/western.jpg";
import malay from "@/assets/categories/malay.jpg";
import japanese from "@/assets/categories/japanese.jpg";
import korean from "@/assets/categories/korean.jpg";


export default {
  name: 'Home',
  data() {
    return{
      searchQuery: "",
      categories: [
        { name: "Chinese", image: chinese },
        { name: "Indian", image: indian },
        { name: "Western", image: western },
        { name: "Malay", image: malay },
        { name: "Japanese", image: japanese },
        { name: "Korean", image: korean },
      ],
      previousChefs: [],
      userCount: 0,
      orderedChefs: [],
    };
  },
  methods:{
    async fetchOrderedChefs() {
      const db = getFirestore(firebaseApp);
      const ordersCollection = collection(db, "orders");

      const q = query(ordersCollection, where("customerID", "==", "testuser@test.com"));
      const snapshot = await getDocs(q);

      const chefIDs = new Set();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.chefID) {
          chefIDs.add(data.chefID);
        }
      });

      const usersCollection = collection(db, "testUsers");
      const allUsersSnapshot = await getDocs(usersCollection);
      const ordered = [];

      allUsersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (chefIDs.has(data.email)) {
          ordered.push(data);
        }
      });

      this.orderedChefs = ordered;
    },
    // save chefs info in chefs.json into firestore
    async saveChefsToFirestore() {
      const db = getFirestore(firebaseApp);
      const usersCollection = collection(db, "testUsers");
      for (const chef of testChefs) {
        const userDoc = doc(usersCollection, chef.email.toLowerCase());
        const { menu, ...chefData } = chef;
        await setDoc(userDoc, chefData);

        if (menu) {
          const menuCollection = collection(userDoc, "menu")
          for (const dish of menu) {
            await addDoc(menuCollection, dish);
          }
        }
      }
      console.log("Chefs added to Firestore");
    },
    // remove all stored chefs info from firestore
    async clearChefsFromFirestore() {
      const db = getFirestore(firebaseApp);
      const usersCollection = collection(db, "testUsers");
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      console.log("All chefs cleared from Firestore");
    },
    // count the number of chefs stored in firestore
    listenForUserCount() {
      const db = getFirestore(firebaseApp);
      const usersCollection = collection(db, "testUsers");
      this.unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        this.userCount = snapshot.size;
      });
    },
    onSearch() {
      if (this.searchQuery.trim() != "") {
        this.$router.push({ path: "/search", query: { q: this.searchQuery}})
      }
    },
    onCategoryClick(categoryName) {
      this.$router.push({ path: "/search", query: { q: categoryName}});
    },

    
  },
  async mounted() {
    this.listenForUserCount();
    await this.fetchOrderedChefs();
  },
  beforeMount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
</script>

<style scoped>
* {
font-family: 'DM Sans', sans-serif;
margin: 0;
padding: 0;
box-sizing: border-box;
}

.main-content {
flex: 1;
padding: 20px;
}

.title {
font-size: 24px;
font-weight: bold;
text-align: left;
margin-bottom: 10px;
}

.searchBar {
display: flex;
align-items: center;
gap: 10px;
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 4px 4px 10px rgba(0,0,0,0.1);
margin-top: 30px;
width: 100%;
}

.searchBar i {
font-size: 18px;
margin-left: 10px;
}

.searchBar input {
flex: 1;
border: none;
outline: none;
font-size: 16px;
font-weight: 350;
}

.search-button {
font-size: 18px;
padding: 10px 20px;
background: transparent;
border: none;
cursor: pointer;
border-radius: 8px;
text-align: center;
}

.search-button:hover {
background-color: lightgrey;
}

.category-section {
margin-top: 20px 0;
}

.section-title {
font-size: 18px;
margin-bottom: 20px;
margin-top: 40px;
font-weight: 600;
}

.category-container {
display: flex;
overflow-x: auto;
overflow-y: hidden;
gap: 20px;
padding: 15px 10px;
}

.category-card {
display: flex;
flex-direction: column;
align-items: center;
background-color: white;
border-radius: 16px;
padding: 20px;
box-shadow: 2px 4px 12px rgba(0,0,0,0.12);
cursor: pointer;
font-weight: 500;
transition: all 0.3s ease;
min-width: 160px;
flex-shrink: 0;
}

.category-card:hover {
transform: scale(1.05);
box-shadow: 2px 6px 16px rgba(0,0,0,0.15);
}

.category-image {
width: 120px;
height: 120px;
border-radius: 50%;
object-fit: cover;
margin-bottom: 15px;
}

.category-name {
font-size: 14px;
font-weight: 500;
text-align: center;
}

.chef-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 30px;
}

.chef-card {
display: flex;
align-items: center;
background-color: white;
padding: 30px;
border-radius: 20px;
box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
/* width: 100%; */
}

.profile-image {
width: 120px;
height: 120px;
border-radius: 50%;
margin-right: 20px;
}

.chef-details {
display: flex;
flex-direction: column;
}

.chef-name {
font-size: 18px;
font-weight: bold;
}

.cuisine, .address, .rating {
font-size: 14px;
margin: 2px 0;
font-weight: 300;
}

.view-profile {
font-size: 14px;
color: gray;
border-radius: 6px;
text-decoration: underline;
font-weight: 300;
margin-top: 10px;
}

.view-profile:hover {
background-color: lightgray;
}

.ordered-row-container {
display: flex;
overflow-x: auto;
gap: 30px;
padding: 20px;
background-color: white;
border-radius: 20px;
box-shadow: 2px 2px 12px rgba(0,0,0,0.08);
margin-top: 20px;
}

.ordered-chef-card {
display: flex;
align-items: center;
padding: 20px;
border-radius: 20px;
background-color: #fff;
min-width: 350px;
/* box-shadow: 2px 2px 10px rgba(0,0,0,0.1); */
}

.action-buttons button {
margin-top: 20px;
margin-bottom: 20px;
font-size: 18px;
padding: 10px 20px;
}

</style>