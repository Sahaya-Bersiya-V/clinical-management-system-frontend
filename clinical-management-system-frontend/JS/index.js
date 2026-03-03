// ⭐ Star Rating Selection
const stars = document.querySelectorAll(".stars span");
let selectedRating = 0;

stars.forEach((star, index) => {
    star.addEventListener("click", () => {

        // Remove previous active state
        stars.forEach(s => s.classList.remove("active"));

        // Add active state to selected stars
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add("active");
        }

        selectedRating = index + 1; // store rating value
        console.log("Selected Rating:", selectedRating);
    });
});

// 📩 Review Submission
document.querySelector(".submit-btn").addEventListener("click", () => {
    const reviewText = document.querySelector(".review-box").value.trim();

    if (selectedRating === 0) {
        alert("Please select star rating⭐ before submitting!");
        return;
    }

    if (reviewText === "") {
        alert("Please write a review before submitting! ✍");
        return;
    }

    // Success message
    alert("Thank you for your review! 😊");

    // Reset form after submit
    document.querySelector(".review-box").value = "";
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("active"));
});


const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});
