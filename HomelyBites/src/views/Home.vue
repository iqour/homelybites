<template>
  <div class="home-container">
    <div class="main-content">
      <h1 class = "title">Homely Bites</h1>

      <!-- Search bar and button -->
      <div class = "searchBar">
        <i class="icon-search"></i>
        <input type = "text" v-model="searchQuery" placeholder="Search home chefs by name or cuisine"/>
        <button @click = "searchChefs" class="search-button">Search</button>
      </div>

      <!-- Search results -->
      <div v-if = "searchTriggered" class="results">
        <h2 class="results-info">{{ searchResults.length }} matches for '{{  lastSearchQuery }}'</h2>
        
        <div class="chef-grid">
          <div v-for = "chef in sortedSearchResults" :key ="chef.email" class="chef-card">
            <img :src ="chef.profileImage" alt="Chef Image" class="profile-image"/>
            <div class = "chef-details">
              <strong class="chef-name">{{ chef.name }}</strong>
              <p class="cuisine">{{ chef.cuisineSpecialty.join(", ") }}</p>
              <p class="address">{{  chef.pickupLocation.address }}</p>
              <p class="rating">Rating: {{ chef.rating }}</p>
              <a href="#" class="view-profile">> View Profile</a>
            </div>
          </div>
        </div>
      </div>

      <!-- buttons to add/delete chefs -->
      <div class="action-buttons">
        <button @click="saveChefsToFirestore">Save Chefs to Firestore</button>
        <button @click="clearChefsFromFirestore" style = "margin-left:10px">Clear All Chefs</button>
      </div>
      <p>Total User Profiles Number: {{ userCount }}</p>
    </div>
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
} from "firebase/firestore"
import chefs from "@/assets/chefs.json";

export default {
    name: 'Home',
    data() {
      return{
        searchQuery: "",
        searchResults: [],
        userCount: 0,
        unsubscribe: null,
        searchTriggered: false,
        lastSearchQuery: "",
      };
    },
    computed: {
      sortedSearchResults() {
        return [...this.searchResults].sort((a, b) => b.rating - a.rating);
      }
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
          this.searchTriggered = false;
          return;
        }
        const searchInput = this.searchQuery.toLowerCase();
        this.searchResults = allChefs.filter((chef) => {
          const nameMatch = chef.name.toLowerCase().includes(searchInput);
          const cuisineMatch = chef.cuisineSpecialty.some((cuisine) => 
            cuisine.toLowerCase().includes(searchInput));
            return nameMatch || cuisineMatch;
        });
        this.searchTriggered = true;
        this.lastSearchQuery = this.searchQuery;
      },
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
* {
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  display: flex;
  background: #f8f0e5;
  min-height: 100vh;
  width: 100%;
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
  box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
  margin-top: 30px;
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

.results-info {
  font-size: 14px;
  color: gray;
  margin-top: 10px;
  font-weight: 300;
}

.no-results {
  font-size: 14px;
  color: gray;
  margin-top: 10px;
  font-weight: 300;
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
  border-radius: 20px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
  width: 100%;
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

.action-buttons button {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  padding: 10px 20px;
}

</style>