<template>
  <div>
    <h1>Home Page</h1>
    <!-- Search bar and button -->
    <div class = "searchBar">
      <input 
      type = "text" 
      v-model="searchQuery" 
      placeholder="Search home chefs by name or cuisine specialty" 
      />
      <button @click = "searchChefs">Search</button>
    </div>

    <!-- Search results -->
    <div v-if = "searchResults.length > 0">
      <h2>Search Results</h2>
      <ul>
        <li v-for = "chef in searchResults" :key ="chef.email">
          <div class = "chef-card">
            <img :src ="chef.profileImage" alt="Chef Image" class="profile-image"/>
            <div class = "chef-details">
              <strong>{{ chef.name }}</strong>
              <p>Cuisine Specialty: {{ chef.cuisineSpecialty.join(", ") }}</p>
              <p>Address: {{  chef.pickupLocation.address }}</p>
              <p>Rating: {{ chef.rating }}</p>
            </div>
          </div>
        </li> 
      </ul>
    </div>

    <!-- if nothing is found -->
    <div v-else-if="searchQuery && searchResults.length == 0">
      <p>No matched chefs found.</p>
    </div>

    <!-- buttons to add/delete chefs -->
    <button @click="saveChefsToFirestore">Save Chefs to Firestore</button>
    <button @click="clearChefsFromFirestore" style = "margin-left:10px">Clear All Chefs</button>
    <p>Total User Profiles Number: {{ userCount }}</p>
  </div>
</template>

<script>
import firebaseApp from "@/firebase"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  QuerySnapshot, } from "firebase/firestore"
import chefs from "@/assets/chefs.json";

export default {
    name: 'Home',
    data() {
      return{
        searchQuery: "",
        searchResults: [],
        userCount: 0,
        unsubscribe: null,
      };
    },
    methods:{
      // save chefs info in chefs.json into firestore
      async saveChefsToFirestore() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, "users");

        for (const chef of chefs) {
          await addDoc(usersCollection, chef);
        }

        console.log("Chefs added to Firestore");
      },
      // remove all stored chefs info from firestore
      async clearChefsFromFirestore() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, "users");

        const querySnapshot = await getDocs(usersCollection);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        console.log("All chefs cleared from Firestore");
      },
      // count the number of chefs stored in firestore
      listenForUserCount() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, "users");

        this.unsubscribe = onSnapshot(usersCollection, (snapshot) => {
          this.userCount = snapshot.size;
          console.log("User count updated", this.userCount);
        });
      },
      // search chefs by name or cuisine specialty
      async searchChefs() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const allChefs = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        
        if (this.searchQuery.trim() == "") {
          this.searchResults = [];
          return;
        }

        const searchInput = this.searchQuery.toLowerCase();
        this.searchResults = allChefs.filter((chef) => {
          const nameMatch = chef.name.toLowerCase().includes(searchInput);
          const cuisineMatch = chef.cuisineSpecialty.some((cuisine) => 
            cuisine.toLowerCase().includes(searchInput));
            return nameMatch || cuisineMatch;
        });
      }
    },
    mounted() {
      this.listenForUserCount();
    },
    beforeMount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }
}
</script>

<style scoped>
.search-bar {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.search-bar input {
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-bar button {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

p {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.chef-card {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.chef-details {
  flex: 1;
}
</style>