<template>
    <div class="review-page">
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
        </div>
  
        <div class="reviews-container">
            <div v-if="reviews.length === 0">No reviews yet.</div>
            <div class="reviews-wrapper">
  
                <div class="reviews" ref="reviewsRef">
                    <div v-for="review in reviews" :key="review.id" class="review">
                        <div class="review-header">
                            <div class="avatar">{{ review.CustomerName[0] }}</div>
                            <h4>{{ review.CustomerName }}</h4>
                        </div>

                        <p class="rating">{{ '⭐'.repeat(review.Rating) }}</p>
                        <p>{{ review.Review }}</p>
                        <p class="dish"><strong>Ordered:</strong> {{ review.Dish }}</p>
                    </div>
                </div>
  
            </div>
        </div>
    </div>
</template>
  
<script>
import firebaseApp from '../firebase.js';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
    setup() {
        const chefId = ref(null);
        const reviews = ref([]);
        const averageRating = ref(0);
        const totalReviews = ref(0);
        const reviewsRef = ref(null);

        const fetchReviews = async () => {
            if (!chefId.value) return;

            const q = query(collection(db, "reviews"), where("ChefId", "==", chefId.value));
            const querySnapshot = await getDocs(q);
            let totalRating = 0;

            reviews.value = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                totalRating += data.Rating;
                return { id: doc.id, ...data };
            });

            totalReviews.value = reviews.value.length;
            averageRating.value = totalReviews.value ? (totalRating / totalReviews.value) : 0;
        };

        const getRatingPercentage = (star) => {
            const count = reviews.value.filter((r) => r.Rating === star).length;
            return totalReviews.value ? (count / totalReviews.value) * 100 : 0;
        };

        const scrollLeft = () => {
            if (reviewsRef.value) {
                reviewsRef.value.scrollBy({ left: -300, behavior: "smooth" });
            }
        };

        const scrollRight = () => {
            if (reviewsRef.value) {
                reviewsRef.value.scrollBy({ left: 300, behavior: "smooth" });
            }
        };

        onMounted(() => {
            onAuthStateChanged(auth, async(user) => {
                await fetchReviews();
            });
        });

        return {
            chefId,
            reviews,
            averageRating,
            totalReviews,
            getRatingPercentage,
            reviewsRef,
            scrollLeft,
            scrollRight,
        };
    },
};
</script>
  
<style scoped>
    .review-page {
        background-color: #f8f0e5;
        text-align: center;
        min-height: 100vh; 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .top-section {
        display: flex;
        align-items: center;
        margin: 40px;
    }

    .ratings-summary {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin-right: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
    }

    .rating-bars {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    .rating-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 80%;
        min-width: 150px;
        margin: 5px 0;
    }

    .bar {
        flex-grow: 1;
        height: 6px;
        background: #ddd;
        margin-left: 10px;
        position: relative;
        border-radius: 3px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: orange;
        position: absolute;
        left: 0;
        transition: width 0.3s ease-in-out;
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
        flex-wrap: nowrap;        
        gap: 15px;
        max-width: 600px;
        scroll-behavior: smooth;
        overflow-x: auto;
        padding-bottom: 10px;
        margin: 40px;
        max-width: 1000px;
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
        flex: 0 0 250px;
        min-width: 250px;
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
</style>