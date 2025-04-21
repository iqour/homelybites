<template>
  <div class="profile-container">
    <!-- Chef Profile Section -->
    <div class="profile-header">
      <h1 class="title">Homely Bites</h1>
      <button class="logout-btn">Log out</button>
    </div>

    <div class="chef-profile">
      <div class="profile-image-container">
        <img :src="chef.profileImage" alt="Chef Profile" class="profile-image" />
        <button class="edit-btn" @click="toggleEditProfile">
          <i class="edit-icon">✏️</i>
        </button>
      </div>

      <div class="chef-info">
        <h2>{{ chef.name }}</h2>
        <p><strong>Pickup Location:</strong> {{ chef.pickupLocation.address }}</p>
        <p><strong>Pickup Time:</strong> {{ formatPickupTimes(chef.pickupTimes) }}</p>
        <p>
          <span class="emoji">😋</span> <strong>Love:</strong> {{ chef.preferences?.loves.join(' & ') }}
        </p>
        <p>
          <span class="emoji">😖</span> <strong>Hate:</strong> {{ chef.preferences?.hates.join(' and ') }}
        </p>
        <p>{{ chef.dietaryNotes || 'No Special Dietary Requirements' }}</p>
        <button class="review-btn">View Reviews</button>
        <button class="chat-btn">
          <i class="chat-icon">💬</i>
        </button>
      </div>
    </div>

    <!-- Menu Section -->
    <div class="menu-section">
      <div class="menu-header">
        <h2>My Menu</h2>
        <button class="edit-btn" @click="toggleEditMenu">
          <i class="edit-icon">✏️</i>
        </button>
      </div>

      <div class="menu-grid">
        <div v-for="dish in menu" :key="dish.id" class="dish-card">
          <img :src="dish.imageUrl || '/default-dish.jpg'" alt="Dish Image" class="dish-image" />
          <div class="dish-details">
            <h3>{{ dish.name }}</h3>
            <p class="dish-contains"><strong>Contains:</strong> {{ dish.materials.join(', ') }}</p>
            <p class="dish-portion"><strong>Portion:</strong> {{ dish.portion }}</p>
            <p class="dish-price"><strong>Price:</strong> ${{ dish.price }}</p>
            <div class="dish-badges">
              <span v-if="dish.vegetarian" class="badge vegetarian">Vegetarian</span>
              <span v-if="dish.halal" class="badge halal">Halal</span>
              <span class="badge cuisine">{{ dish.cuisineType }}</span>
            </div>
            <p v-if="!dish.isAvailable" class="not-available">Currently Unavailable</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Menu Modal -->
    <div v-if="showEditMenu" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="toggleEditMenu">&times;</span>
        <h2>Edit Menu</h2>
        <form @submit.prevent="saveMenu">
          <div v-for="(dish, index) in editableMenu" :key="index" class="edit-dish-form">
            <h3>Dish {{ index + 1 }}</h3>
            <div class="form-group">
              <label>Name:</label>
              <input v-model="dish.name" required />
            </div>
            <div class="form-group">
              <label>Description:</label>
              <textarea v-model="dish.description"></textarea>
            </div>
            <div class="form-group">
              <label>Materials:</label>
              <input v-model="dish.materialsInput" placeholder="Comma separated list" />
            </div>
            <div class="form-group">
              <label>Portion:</label>
              <input v-model="dish.portion" required />
            </div>
            <div class="form-group">
              <label>Price ($):</label>
              <input type="number" v-model="dish.price" step="0.01" required />
            </div>
            <div class="form-group">
              <label>Cuisine Type:</label>
              <select v-model="dish.cuisineType">
                <option v-for="cuisine in cuisineTypes" :key="cuisine" :value="cuisine">
                  {{ cuisine }}
                </option>
              </select>
            </div>
            <div class="form-group checkboxes">
              <label>
                <input type="checkbox" v-model="dish.isAvailable" />
                Available
              </label>
              <label>
                <input type="checkbox" v-model="dish.vegetarian" />
                Vegetarian
              </label>
              <label>
                <input type="checkbox" v-model="dish.halal" />
                Halal
              </label>
            </div>
            <button type="button" class="remove-btn" @click="removeDish(index)">
              Remove Dish
            </button>
          </div>
          <button type="button" class="add-btn" @click="addNewDish">Add New Dish</button>
          <div class="action-buttons">
            <button type="submit" class="save-btn">Save Changes</button>
            <button type="button" class="cancel-btn" @click="toggleEditMenu">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="toggleEditProfile">&times;</span>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="editableChef.name" required />
          </div>
          <div class="form-group">
            <label>Pickup Location:</label>
            <input v-model="editableChef.pickupLocation.address" required />
          </div>
          <div class="form-group">
            <label>Pickup Times:</label>
            <div v-for="(time, index) in editableChef.pickupTimes" :key="index" class="pickup-time-input">
              <input v-model="time.time" placeholder="Time (e.g., 11:30am)" />
              <input v-model="time.meal" placeholder="Meal (e.g., lunch)" />
              <button type="button" class="remove-btn small" @click="removePickupTime(index)">✕</button>
            </div>
            <button type="button" class="add-btn small" @click="addPickupTime">+ Add Time</button>
          </div>
          <div class="form-group">
            <label>Love (Food preferences):</label>
            <input v-model="lovesInput" placeholder="Comma separated list" />
          </div>
          <div class="form-group">
            <label>Hate (Food dislikes):</label>
            <input v-model="hatesInput" placeholder="Comma separated list" />
          </div>
          <div class="form-group">
            <label>Dietary Notes:</label>
            <textarea v-model="editableChef.dietaryNotes" placeholder="Any special dietary information"></textarea>
          </div>
          <div class="action-buttons">
            <button type="submit" class="save-btn">Save Changes</button>
            <button type="button" class="cancel-btn" @click="toggleEditProfile">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Left Sidebar Navigation -->
    <div class="sidebar">
      <div class="nav-item">
        <i class="nav-icon">🏠</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">🛒</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">☰</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">👤</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">💬</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">📱</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">📝</i>
      </div>
      <div class="nav-item">
        <i class="nav-icon">❤️</i>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc
} from "firebase/firestore";

export default {
  name: "ProfilePage",
  data() {
    return {
      chefId: "", // This will be populated from route params
      chef: {},
      menu: [],
      showEditMenu: false,
      showEditProfile: false,
      editableMenu: [],
      editableChef: {
        name: "",
        pickupLocation: { address: "" },
        pickupTimes: [],
        preferences: {
          loves: [],
          hates: []
        },
        dietaryNotes: ""
      },
      lovesInput: "",
      hatesInput: "",
      cuisineTypes: [
        "Chinese", 
        "Indian", 
        "Western", 
        "Malay", 
        "Japanese", 
        "Korean", 
        "Thai", 
        "Italian", 
        "French", 
        "Mexican"
      ]
    };
  },
  created() {
    // Get chef ID from route params (in a real app)
    // this.chefId = this.$route.params.id;
    
    // For demonstration, we'll use a hardcoded ID
    this.chefId = "ryan.lim@example.com";
    this.fetchChefData();
  },
  methods: {
    async fetchChefData() {
      try {
        const db = getFirestore(firebaseApp);
        const chefDocRef = doc(db, "testUsers", this.chefId);
        const chefDoc = await getDoc(chefDocRef);
        
        if (chefDoc.exists()) {
          this.chef = chefDoc.data();
          
          // Fetch menu items (subcollection)
          const menuCollectionRef = collection(chefDocRef, "menu");
          const menuSnapshot = await getDocs(menuCollectionRef);
          
          this.menu = menuSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          console.error("Chef not found");
        }
      } catch (error) {
        console.error("Error fetching chef data:", error);
      }
    },
    formatPickupTimes(times) {
      if (!times || !times.length) return "Not specified";
      return times.map(t => `${t.time} (${t.meal})`).join(", ");
    },
    toggleEditMenu() {
      this.showEditMenu = !this.showEditMenu;
      if (this.showEditMenu) {
        // Create a deep copy of menu for editing
        this.editableMenu = this.menu.map(dish => ({
          ...dish,
          materialsInput: dish.materials.join(", ")
        }));
      }
    },
    toggleEditProfile() {
      this.showEditProfile = !this.showEditProfile;
      if (this.showEditProfile) {
        // Create a deep copy of chef for editing
        this.editableChef = JSON.parse(JSON.stringify(this.chef));
        
        // Set the input fields for the comma-separated lists
        this.lovesInput = this.chef.preferences?.loves.join(", ") || "";
        this.hatesInput = this.chef.preferences?.hates.join(", ") || "";
        
        // Ensure pickupTimes is an array
        if (!this.editableChef.pickupTimes) {
          this.editableChef.pickupTimes = [];
        }
      }
    },
    addNewDish() {
      this.editableMenu.push({
        name: "",
        description: "",
        materialsInput: "",
        materials: [],
        portion: "",
        price: 0,
        isAvailable: true,
        imageUrl: "",
        cuisineType: this.cuisineTypes[0],
        vegetarian: false,
        halal: false
      });
    },
    removeDish(index) {
      this.editableMenu.splice(index, 1);
    },
    addPickupTime() {
      this.editableChef.pickupTimes.push({ time: "", meal: "" });
    },
    removePickupTime(index) {
      this.editableChef.pickupTimes.splice(index, 1);
    },
    async saveMenu() {
      try {
        const db = getFirestore(firebaseApp);
        const chefDocRef = doc(db, "testUsers", this.chefId);
        const menuCollectionRef = collection(chefDocRef, "menu");
        
        // Process each dish in editableMenu
        for (const dish of this.editableMenu) {
          // Convert comma-separated string to array
          dish.materials = dish.materialsInput.split(",").map(item => item.trim()).filter(item => item);
          
          // Remove temporary materialsInput field
          delete dish.materialsInput;
          
          if (dish.id) {
            // Update existing dish
            await updateDoc(doc(menuCollectionRef, dish.id), dish);
          } else {
            // Add new dish
            const docRef = await addDoc(menuCollectionRef, dish);
            dish.id = docRef.id;
          }
        }
        
        // Handle deleted dishes
        const deletedDishes = this.menu.filter(
          original => !this.editableMenu.some(edited => edited.id === original.id)
        );
        
        for (const dish of deletedDishes) {
          await deleteDoc(doc(menuCollectionRef, dish.id));
        }
        
        // Refresh menu data
        await this.fetchChefData();
        this.toggleEditMenu();
        
      } catch (error) {
        console.error("Error saving menu:", error);
      }
    },
    async saveProfile() {
      try {
        // Process inputs
        this.editableChef.preferences = {
          loves: this.lovesInput.split(",").map(item => item.trim()).filter(item => item),
          hates: this.hatesInput.split(",").map(item => item.trim()).filter(item => item)
        };
        
        const db = getFirestore(firebaseApp);
        const chefDocRef = doc(db, "testUsers", this.chefId);
        
        // Update chef document
        await updateDoc(chefDocRef, this.editableChef);
        
        // Refresh chef data
        await this.fetchChefData();
        this.toggleEditProfile();
        
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
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

.profile-container {
  display: flex;
  position: relative;
  min-height: 100vh;
  background-color: #f9e0ce;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.logout-btn {
  background-color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
}

.chef-profile {
  display: flex;
  background-color: white;
  border-radius: 20px;
  margin: 0 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.profile-image-container {
  position: relative;
  margin-right: 20px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ffcdb2;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  font-size: 20px;
}

.chef-info {
  flex: 1;
}

.chef-info h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chef-info p {
  margin: 8px 0;
  font-size: 16px;
}

.emoji {
  font-size: 18px;
  margin-right: 5px;
}

.review-btn {
  background-color: #ffcdb2;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: 500;
}

.chat-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #ffcdb2;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chat-icon {
  font-size: 24px;
}

.menu-section {
  margin: 30px 20px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.menu-header h2 {
  font-size: 20px;
  font-weight: bold;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.dish-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.dish-image {
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
  margin-right: 15px;
}

.dish-details {
  flex: 1;
}

.dish-details h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.dish-contains,
.dish-portion,
.dish-price {
  font-size: 14px;
  margin: 3px 0;
}

.dish-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 10px;
  display: inline-block;
}

.vegetarian {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.halal {
  background-color: #e3f2fd;
  color: #1565c0;
}

.cuisine {
  background-color: #fff3e0;
  color: #e65100;
}

.not-available {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
}

.sidebar {
  width: 80px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.nav-item {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 12px;
}

.nav-item:hover {
  background-color: #f9e0ce;
}

.nav-icon {
  font-size: 24px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}

.edit-dish-form {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.edit-dish-form h3 {
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.checkboxes label {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
}

.checkboxes input[type="checkbox"] {
  width: auto;
  margin-right: 5px;
}

.pickup-time-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.pickup-time-input input {
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.add-btn,
.remove-btn,
.save-btn,
.cancel-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.add-btn {
  background-color: #f0f9ff;
  color: #0369a1;
}

.remove-btn {
  background-color: #fee2e2;
  color: #b91c1c;
}

.save-btn {
  background-color: #f0fdf4;
  color: #15803d;
}

.cancel-btn {
  background-color: #f1f5f9;
  color: #475569;
}

.add-btn.small,
.remove-btn.small {
  padding: 5px 10px;
  font-size: 12px;
}
</style>
