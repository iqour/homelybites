<template>
    <div class="review-container">
        <div class="title">
            <h2>Leave Review for Chef {{ chefName }}</h2> 
        </div>
  
        <div class="review-card">
            <div class="user-info">
                <div class="avatar">{{ customerAvatar }}</div> 
                <span>{{ customerName }}</span> 
            </div>
  
            <div class="rating-section">
                <p>Leave a Rating:</p>
                <div class="stars" id="rating-stars">
                    <span v-for="index in 5" :key="index" @click="setRating(index)" :class="{ active: index <= rating }"> 
                        ★ 
                    </span>
                </div>
            </div>
  
            <textarea id="review" placeholder="Write your review..."></textarea>
            
            <textarea id="dish" placeholder="What did you order?"></textarea>
  
            <button @click="submitReview">Submit</button>
        </div>
    </div>
</template>
  
<script>
import firebaseApp from '../firebase.js';
import { getFirestore, collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    name: 'Review',

    data() {
        return {
            rating: 0,
            chefId: this.$route.query.chefId, 
            customerId: this.$route.query.customerId, 
            chefName: '', 
            customerName: '', 
            customerAvatar: '', 
        };
    },

    methods: {
        setRating(stars) {
            this.rating = stars; 
        },

        async fetchNames() {
            try {
                const chefDoc = await getDoc(doc(db, "testUsers", this.chefId));
                if (chefDoc.exists()) {
                    this.chefName = chefDoc.data().name; 
                } else {
                    console.log("No such chef!");
                }

                const customerDoc = await getDoc(doc(db, "testUsers", this.customerId));
                if (customerDoc.exists()) {
                    this.customerName = customerDoc.data().name; 
                    this.customerAvatar = this.customerName.charAt(0).toUpperCase();
                } else {
                    console.log("No such customer!");
                }
            } catch (error) {
                console.error("Error fetching names: ", error);
            }
        },

        async submitReview() {
            let review = document.getElementById("review").value;
            let dish = document.getElementById("dish").value;

            if (!this.rating || !review || !dish) {
                alert("Please complete all fields before submitting.");
                return;
            }

            try {
                await addDoc(collection(db, "reviews"), {
                    ChefName: this.chefName, 
                    ChefId: this.chefId,
                    CustomerName: this.customerName, 
                    CustomerId: this.customerId,
                    Rating: this.rating,
                    Review: review,
                    Dish: dish,
                    Time: serverTimestamp(),
                });
                alert("Review submitted successfully!");
            } catch (error) {
                alert("Error submitting review.");
            }
        },
    },

    mounted() {
        this.fetchNames(); 
    },
};
</script>
  
<style scoped>
    .review-container {
        background-color: #f8f0e5;
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
        height: 450px;
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