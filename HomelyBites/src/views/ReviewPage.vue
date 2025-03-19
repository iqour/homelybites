<template>
    <div class="review-container">
        <div class="title">
            <h2>Homely Bites</h2>
            <h2>Ratings and Reviews for Maria</h2> <!-- Maria to be replaced by name of the chef to be reviewed -->
        </div>
  
        <div class="review-card">
            <div class="user-info">
                <div class="avatar">L</div> <!-- L to be replaced by user profile pic -->
                <span>Leonard</span> <!-- Leonard to be replaced by the name of the consumer -->
            </div>
  
            <div class="rating-section">
                <p>Leave a Rating:</p>
                <div class="stars">
                    <span v-for="(index) in 5" :key="index" @click="setRating(index + 1)" :class="{ active: index < rating }"> ★ </span>
                </div>
            </div>
  
            <textarea v-model="review" placeholder="Write your review..."></textarea>
  
            <select v-model="selectedDish">
                <option disabled value="">What did you order?</option>
                <option v-for="dish in dishes" :key="dish" :value="dish"> {{ dish }} </option>
            </select>
  
            <button @click="submitReview">Submit</button>
        </div>
    </div>
</template>
  
<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    name: 'Review',

    data() {
        return {
            rating: 0,
            review: "",
            selectedDish: "",
            dishes: ["Tacos", "Burrito", "Quesadilla", "Enchiladas"], // to be replaced by dishes chef's menu
        };
    },

    methods: {
        setRating(stars) {
            this.rating = stars;
        },

        async submitReview() {
            if (!this.rating || !this.review || !this.selectedDish) {
                alert("Please complete all fields before submitting.");
                return;
            }

            const reviewData = {
                rating: this.rating,
                review: this.review,
                dish: this.selectedDish,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            };

            try {
                await db.collection("MariaReviews").add(reviewData); // replace Maria with chef's name, and change database structure if necessary
                alert("Review submitted successfully!");
            } catch (error) {
                console.error("Error submitting review:", error);
                alert("Error submitting review.")
            }
        },
    },
};
</script>
  
<style scoped>
    .review-container {
        background-color: #FAB289;
        text-align: center;
        min-height: 100vh; 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
  
    .title {
        text-align: left;
    }

    .review-card {
        background-color: #FFE0B2;
        padding: 20px;
        border-radius: 15px;
        width: 600px;
        height: 400px;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
    }
  
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }
  
    .avatar {
        width: 40px;
        height: 40px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
  
    .rating-section {
        margin: 10px 0;
    }
  
    .stars span {
        font-size: 24px;
        cursor: pointer;
        color: gray;
    }
  
    .stars .active {
        color: gold;
    }
  
    textarea {
        width: 580px;
        height: 100px;
        margin: 10px 0;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    }
  
    select {
        width: 590px;
        height: 40px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin: 10px 0;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    }
  
    button {
        background-color: #B51F1F;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        width: 100px;
    }
  
    button:hover {
        background-color: rgb(159, 39, 39);
    }
</style>