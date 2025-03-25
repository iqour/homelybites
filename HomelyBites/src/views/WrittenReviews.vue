<template>
    <div class="review-page">
        <div class="title">
            <h2>Homely Bites</h2>
            <h2>{{ chefName }}'s Ratings and Reviews</h2>
        </div>
  
        <div class="top-section">
            <div class="ratings-summary">
                <h3>{{ averageRating.toFixed(1) }} ⭐</h3>
                <p>{{ totalReviews }} ratings</p>

                <div class="rating-bars">
                    <div v-for="star in 5" :key="star" class="rating-row">
                        <span>{{ 6 - star }}</span>
                        <div class="bar">
                            <div class="fill" :style="{ width: getRatingPercentage(6 - star) + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
  
            <div class="leave-review">
                <button @click="openReviewForm">+</button>
                <h2>Leave a review!</h2>
            </div>
        </div>
  
        <div class="reviews-container">
            <div v-if="reviews.length === 0">No reviews yet.</div>
            <div class="reviews-wrapper">
                <button class="scroll-btn left" @click="scrollLeft">‹</button>
  
                <div class="reviews" ref="reviewsRef">
                    <div v-for="review in reviews" :key="review.id" class="review">
                        <div class="review-header">
                            <div class="avatar">{{ review.CustomerName[0] }}</div>
                            <h4>{{ review.CustomerName }}</h4>
                        </div>

                        <p class="rating">{{ '⭐'.repeat(review.Rating) }}</p>
                        <p>{{ review.Review }}</p>
                        <p class="dish"><strong>Ordered:</strong> {{ review.Selected_Dish }}</p>
                    </div>
                </div>
  
                <button class="scroll-btn right" @click="scrollRight">›</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import firebaseApp from '../firebase.js';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { ref, onMounted } from "vue";
const db = getFirestore(firebaseApp);
  
export default {
    setup() {
        const chefName = "Maria";
        const reviews = ref([]);
        const averageRating = ref(0);
        const totalReviews = ref(0);
        const reviewsRef = ref(null);
  
        const fetchReviews = async () => {
            const q = query(collection(db, "reviews"), where("ChefName", "==", chefName));
            const querySnapshot = await getDocs(q);
            let totalRating = 0;
  
            reviews.value = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                totalRating += data.Rating;
                return { id: doc.id, ...data };
            });
  
            totalReviews.value = reviews.value.length;
            averageRating.value = totalReviews.value ? totalRating / totalReviews.value : 0;
        };
  
        const getRatingPercentage = (star) => {
            const count = reviews.value.filter((r) => r.Rating === star).length;
            return totalReviews.value ? (count / totalReviews.value) * 100 : 0;
        };
  
        const scrollLeft = () => {
            reviewsRef.value.scrollBy({ left: -300, behavior: "smooth" });
        };
  
        const scrollRight = () => {
            reviewsRef.value.scrollBy({ left: 300, behavior: "smooth" });
        };
  
        const openReviewForm = () => {
            router.push('/review');
        };
  
        onMounted(fetchReviews);
  
        return {
            chefName,
            reviews,
            averageRating,
            totalReviews,
            getRatingPercentage,
            reviewsRef,
            scrollLeft,
            scrollRight,
            openReviewForm
        };
    },
};
</script>
  
<style scoped>
    .review-page {
        background-color: #f4c7a5;
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

    .top-section {
        display: flex;
        align-items: center;
        margin: 40px;
    }
  
    .ratings-summary {
        background: #fff;
        padding: 10px;
        border-radius: 10px;
        text-align: center;
        margin-right: 40px;
        width: 300px;
        height: 200px;
    }
  
    .rating-bars {
        display: flex;
        flex-direction: column;
    }
  
    .rating-row {
        display: flex;
        align-items: center;
        margin: 5px 0;
    }
  
    .bar {
        width: 100px;
        height: 5px;
        background: #ddd;
        margin-left: 10px;
        position: relative;
    }
  
    .fill {
        height: 100%;
        background: orange;
        position: absolute;
    } 
  
    .leave-review {
        background: #9b2c2c;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        color: white;
        cursor: pointer;
        margin-left: 40px;
        width: 280px;
        height: 180px;
    }
  
    .leave-review button {
        font-size: 40px;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
    }
  
    .reviews-container {
        margin-top: 20px;
        max-width: 800px;
    }
  
    .reviews-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
    }
  
    .reviews {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        max-width: 600px;
        overflow-x: auto;
        padding-bottom: 10px;
        margin: 40px;
    }
  
    .review {
        flex: 1 1 250px;
        background: #f8e1bb;
        padding: 15px;
        border-radius: 10px;
        text-align: left;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        min-width: 250px;
    }
  
    .review-header {
        display: flex;
        align-items: center;
        gap: 10px;
    }
  
    .avatar {
        width: 35px;
        height: 35px;
        background: white;
        color: black;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
  
    .rating {
        color: gold;
    }
  
    .dish {
        font-size: 0.9em;
        color: gray;
    }
  
    .scroll-btn {
        background: #9b2c2c;
        color: white;
        font-size: 24px;
        border: none;
        padding: 10px 15px;
        border-radius: 40%;
        cursor: pointer;
    }
  
    .scroll-btn:hover {
        background: #a83b3b;
    }
</style>