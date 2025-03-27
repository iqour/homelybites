<template>
    <div class="profile-container">
      <div class="header">
        <h1>Homely Bites</h1>
        <button class="logout-btn" @click="logout">Log out</button>
      </div>
  
      <div class="profile-card">
        <div class="profile-info">
          <div class="profile-image">
            <img :src="userProfile.imageUrl || 'https://via.placeholder.com/150'" alt="Profile Image">
            <button class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
          </div>
          
          <div class="profile-details">
            <h2>{{ userProfile.name }}</h2>
            <p><strong>Pickup Location:</strong> {{ userProfile.pickupLocation }}</p>
            <p><strong>Pickup Time:</strong> {{ userProfile.pickupTimes }}</p>
            <p>
              <span class="emoji">😋</span> 
              <strong>Love:</strong> {{ userProfile.loves }}
            </p>
            <p>
              <span class="emoji">😠</span> 
              <strong>Hate:</strong> {{ userProfile.hates }}
            </p>
            <p>{{ userProfile.dietaryRequirements || 'No Special Dietary Requirements' }}</p>
          </div>
          
          <button class="review-btn">View Reviews</button>
          <button class="chat-btn">
            <i class="fas fa-comment"></i>
          </button>
        </div>
      </div>
  
      <div class="menu-section">
        <div class="menu-header">
          <h2>My Menu</h2>
          <button class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        
        <div class="menu-items">
          <div v-for="(item, index) in menuItems" :key="index" class="menu-item">
            <div class="item-image">
              <img :src="item.imageUrl" alt="Food Image">
            </div>
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p><strong>Contains:</strong> {{ item.ingredients }}</p>
              <p><strong>Portion:</strong> {{ item.portion }}</p>
              <p><strong>Price:</strong> ${{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getAuth, signOut } from 'firebase/auth';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  
  export default {
    name: 'ProfilePage',
    setup() {
      const auth = getAuth();
      const db = getFirestore();
      const userProfile = ref({
        name: 'Ryan Lim',
        pickupLocation: 'Buona Vista',
        pickupTimes: '11:30am (lunch), 5pm (dinner)',
        loves: 'Chinese Food & Western Food',
        hates: 'Coriander and Spring Onion',
        dietaryRequirements: null,
        imageUrl: null
      });
  
      const menuItems = ref([
        {
          name: 'Black Pepper Steak',
          ingredients: 'Beef, Garlic, Butter, Rosemary',
          portion: '300g',
          price: 15,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          name: 'Sweet and Sour Pork',
          ingredients: 'Pork, Pineapple',
          portion: '350g',
          price: 10,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          name: 'Xiao Long Bao',
          ingredients: 'Pork, Ginger',
          portion: '6 pieces',
          price: 12,
          imageUrl: 'https://via.placeholder.com/100'
        },
        {
          name: 'Raspberry Cake',
          ingredients: 'Raspberry, Lemon, Milk, Wheat, Butter',
          portion: '100g',
          price: 8,
          imageUrl: 'https://via.placeholder.com/100'
        }
      ]);
  
      const fetchUserProfile = async () => {
        if (auth.currentUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
              userProfile.value = { ...userProfile.value, ...userDoc.data() };
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      };
  
      const logout = async () => {
        try {
          await signOut(auth);
          // Navigate to login page
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };
  
      onMounted(fetchUserProfile);
  
      return {
        userProfile,
        menuItems,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8d0b0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .logout-btn {
    background-color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .profile-card, .menu-section {
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .profile-info {
    display: flex;
    position: relative;
  }
  
  .profile-image {
    position: relative;
    margin-right: 20px;
  }
  
  .profile-image img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .edit-btn {
    background-color: #f8b8b8;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  
  .profile-details {
    flex-grow: 1;
  }
  
  .profile-details h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .profile-details p {
    margin: 5px 0;
  }
  
  .emoji {
    margin-right: 5px;
  }
  
  .review-btn {
    background-color: #f8b8b8;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  
  .chat-btn {
    background-color: #f8b8b8;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 20px;
  }
  
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .menu-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
  
  .menu-item {
    display: flex;
    margin-bottom: 20px;
  }
  
  .item-image img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
  
  .item-details h3 {
    margin-top: 0;
    margin-bottom: 5px;
  }
  
  .item-details p {
    margin: 3px 0;
  }
  </style>