import { recipes } from "./recipes.js";

const recipesContainer = document.getElementById("recipes");
const searchInput = document.getElementById("search");
const sortBy = document.getElementById("sort-by");
const maxDuration = document.getElementById("max-duration");
const durationValue = document.getElementById("duration-value");
const maxCalories = document.getElementById("max-calories");
const caloriesValue = document.getElementById("calories-value");
const resetFiltersBtn = document.getElementById("reset-filters");
const modal = document.getElementById("recipe-modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-modal");

function openModal(recipe) {
    modalBody.innerHTML = `
        <h2>${recipe.title}</h2>
        <h3>영양 정보</h3>
        <div class="modal-nutrition">
            <div class="nutrition-item">
                <strong>${recipe.nutiritions.calories}</strong>
                <span>칼로리 (kcal)</span>
            </div>
            <div class="nutrition-item">
                <strong>${recipe.nutiritions.protein}</strong>
                <span>단백질</span>
            </div>
            <div class="nutrition-item">
                <strong>${recipe.nutiritions.fat}</strong>
                <span>지방</span>
            </div>
            <div class="nutrition-item">
                <strong>${recipe.nutiritions.carbs}</strong>
                <span>탄수화물</span>
            </div>
        </div>
        <h3>재료</h3>
        <ul>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        <h3>조리법</h3>
        <ol>
            ${recipe.instructions.map(step => `<li>${step}</li>`).join("")}
        </ol>
    `;
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function displayRecipes(recipeList) {
    recipesContainer.innerHTML = "";
    if (recipeList.length === 0) {
        recipesContainer.innerHTML = `<p class="no-results">일치하는 레시피가 없습니다.</p>`;
        return;
    }
    recipeList.forEach(recipe => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe-card", "fade-in");
        
        // Extracting only the number from duration string for comparison
        const durationNum = parseInt(recipe.duration.split(" ")[0]);

        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span class="recipe-duration">
                        <i class="far fa-clock"></i> ${recipe.duration}
                    </span>
                    <span class="recipe-calories">
                        <i class="fas fa-fire-alt"></i> ${recipe.nutiritions.calories} kcal
                    </span>
                </div>
                <div class="recipe-actions">
                    <button class="btn btn-primary btn-view">레시피 보기</button>
                    <button class="btn btn-secondary"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;
        recipeElement.querySelector('.btn-view').addEventListener('click', () => openModal(recipe));
        recipesContainer.appendChild(recipeElement);
    });
}

function filterAndSortRecipes() {
    let filteredRecipes = [...recipes];

    // Search filter
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchValue) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchValue))
        );
    }

    // Duration filter
    const maxDurationValue = parseInt(maxDuration.value);
    filteredRecipes = filteredRecipes.filter(recipe => {
        const durationNum = parseInt(recipe.duration.split(" ")[0]);
        return durationNum <= maxDurationValue;
    });

    // Calories filter
    const maxCaloriesValue = parseInt(maxCalories.value);
    filteredRecipes = filteredRecipes.filter(recipe => recipe.nutiritions.calories <= maxCaloriesValue);

    // Sorting
    const sortByValue = sortBy.value;
    switch (sortByValue) {
        case 'duration-asc':
            filteredRecipes.sort((a, b) => parseInt(a.duration.split(" ")[0]) - parseInt(b.duration.split(" ")[0]));
            break;
        case 'duration-desc':
            filteredRecipes.sort((a, b) => parseInt(b.duration.split(" ")[0]) - parseInt(a.duration.split(" ")[0]));
            break;
        case 'calories-asc':
            filteredRecipes.sort((a, b) => a.nutiritions.calories - b.nutiritions.calories);
            break;
        case 'calories-desc':
            filteredRecipes.sort((a, b) => b.nutiritions.calories - a.nutiritions.calories);
            break;
    }

    displayRecipes(filteredRecipes);
}

function resetFilters() {
    searchInput.value = "";
    sortBy.value = "default";
    maxDuration.value = "60";
    durationValue.textContent = "60 분";
    maxCalories.value = "600";
    caloriesValue.textContent = "600 kcal";
    filterAndSortRecipes();
}

// Event Listeners
searchInput.addEventListener("input", filterAndSortRecipes);
sortBy.addEventListener("change", filterAndSortRecipes);
maxDuration.addEventListener("input", () => {
    durationValue.textContent = `${maxDuration.value} 분`;
    filterAndSortRecipes();
});
maxCalories.addEventListener("input", () => {
    caloriesValue.textContent = `${maxCalories.value} kcal`;
    filterAndSortRecipes();
});
resetFiltersBtn.addEventListener("click", resetFilters);
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


// Initial display
displayRecipes(recipes);