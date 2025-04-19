<template>
  <div class="main-content">
    <h1 class="title">Homely Bites</h1>

    <!-- Search bar with the current querry filled in home page -->
    <div class = "searchBar">
        <i class="icon-search"></i>
        <input type = "text" v-model="searchQuery" placeholder="Search home chefs by name or cuisine"/>
        <button @click = "onSearch" class="search-button">Search</button>
    </div>

    <!-- search results -->
    <div v-if = "searchTriggered" class="results">
      <h2 class="results-info">{{ searchResults.length }} matches for '{{  lastSearchQuery }}'</h2>
    
      <div class="chef-grid">
        <div v-for = "chef in searchResults" :key ="chef.email" class="chef-card">
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
  </div>
</template>
  
<script>
import firebaseApp from "@/firebase";
import { 
  getFirestore, 
  collection, 
  getDocs } from "firebase/firestore";

export default {
    name: "SearchResults",
    data() {
        return {
            searchQuery: this.$route.query.q || "",
            lastSearchQuery: this.$route.query.q || "",
            searchResults: [],
            searchTriggered: false,
        };
    },
    watch: {
        '$route.query.q': {
            immediate: true,
            handler(newQuery) {
                this.searchQuery = newQuery;
                this.lastSearchQuery = newQuery;
                this.searchChefs();
            },
        },
    },
    methods: {
        async searchChefs() {
            const db = getFirestore(firebaseApp);
            const usersCollection = collection(db, "testUsers");
            const querySnapshot = await getDocs(usersCollection);
            const allChefs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const input = this.searchQuery.toLowerCase();
            this.searchResults = allChefs.filter((chef) => {
                const nameMatch = chef.name.toLowerCase().includes(input);
                const cuisineMatch = chef.cuisineSpecialty.some((cuisine) =>
                cuisine.toLowerCase().includes(input)
                );
                return nameMatch || cuisineMatch;
            }).sort((a, b) => b.rating - a.rating);
            this.searchTriggered = true;
        },
        onSearch() {
            if (this.searchQuery.trim() != "") {
                this.$router.push({ path: '/search', query: { q: this.searchQuery }})
            }
        }
    },
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
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 10px;
  font-weight: 300;
  text-align: left;
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
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
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
</style>