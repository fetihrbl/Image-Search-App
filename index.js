const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

// Select HTML elements
const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");

// Initialize variables
let query = "";
let page = 1;

// Hide the "Show More" button initially
showMoreButtonEl.style.display = "none";

// Function to search images from Unsplash API
async function searchImages() {
    query = searchInputEl.value.trim(); // Get input value and remove spaces

    if (!query) return; // Prevent empty searches

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // If it's the first page, clear previous results
        if (page === 1) {
            searchResultsEl.innerHTML = "";
            showMoreButtonEl.style.display = "none"; // Hide button during first search
        }

        // If no results are found, display a message and hide the button
        if (data.results.length === 0) {
            searchResultsEl.innerHTML = "<h3>No results found.</h3>";
            showMoreButtonEl.style.display = "none";
            return;
        }

        // Loop through the results and add them to the page
        data.results.forEach((result) => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("search-result");

            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.alt_description || "Unsplash Image";

            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.textContent = result.alt_description || "View Image";

            // Append the image and link to the wrapper
            imageWrapper.append(image, imageLink);
            searchResultsEl.appendChild(imageWrapper);
        });

        // Increase page number for pagination
        page++;

        // Show "Show More" button after first search
        showMoreButtonEl.style.display = "block";
    } catch (error) {
        console.error("Error fetching images:", error);
        searchResultsEl.innerHTML = "<h3>Something went wrong. Please try again.</h3>";
        showMoreButtonEl.style.display = "none"; // Hide the button if an error occurs
    }
}

// Event listener for form submission (triggers search)
formEl.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    page = 1; // Reset page number for new search
    searchImages();
});

// Event listener for "Show More" button (loads more images)
showMoreButtonEl.addEventListener("click", searchImages);
