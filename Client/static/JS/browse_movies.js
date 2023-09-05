// You can use JavaScript to fetch movie data from your database and dynamically create movie tiles here.
// Example:
let movieData = []
const url = "http://127.0.0.1:3000/login/"


async function slot_timing(movie) {
    const response = await fetch(url + "movies/timeslot", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    });

    if(response.status != 200){
        console.log(response.status);
    }
}


//Display the movie details by default
document.addEventListener("DOMContentLoaded", async function() {
    // const email = document.getElementById("email").value;

    const response = await fetch(url + "movies/fetch", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    movieData = await response.json();
    let user = movieData.user;
    movieData = movieData.movies;
    console.log(movieData);
    console.log(user);

    const movieList = document.querySelector(".movie-list");
    const userDetails = document.getElementById("user_details");

    movieData.forEach((movie) => {
        const movieTile = document.createElement("div");
        movieTile.classList.add("movie-tile");
        movieTile.onclick = function(){
            slot_timing(movie);
        };

        console.log(movie);
        movieTile.innerHTML = `
            <h2>${movie.movieName}</h2>
            <p>Release Date: ${movie.releaseDate}</p>
            <p>Theater: ${movie.theatreName}</p>
            <p>Location: ${movie.theatreLocation}</p>
        `;
        movieList.appendChild(movieTile);
    });

    //Loading user details
    userDetails.innerHTML = `
        <h3>User</h3>
        <br>
        <p>${String(user)}</p>
        <br>
    `
});

// User icon click event to show/hide user popup
const userIcon = document.getElementById("userIcon");
const userPopup = document.getElementById("userPopup");

//search and logout buttons
const searchButton = document.getElementById("search");
const logoutButton = document.getElementById("logoutButton");


//Display the search query details
searchButton.addEventListener("click", function() {
    const searchText = document.getElementById("searchText").value.toLowerCase();
    const movieList = document.querySelector(".movie-list");
    movieList.innerHTML = "";

    let result = false;
    movieData.forEach((movie) => {
        let name = movie.movieName.toLowerCase();
        let theatreLocation = movie.theatreLocation.toLowerCase();
        let theatreName = movie.theatreName.toLowerCase();
        let releaseDate = movie.releaseDate.toLowerCase();

        if ( name.includes(searchText) || theatreName.includes(searchText) || 
            theatreLocation.includes(searchText) || releaseDate.includes(searchText)) {
            
            const movieTile = document.createElement("div");
            movieTile.classList.add("movie-tile");
            movieTile.onclick = function(){
                slot_timing(movie);
            };

            console.log(movie);
            movieTile.innerHTML = `
                <h2>${movie.movieName}</h2>
                <p>Release Date: ${movie.releaseDate}</p>
                <p>Theater: ${movie.theatreName}</p>
                <p>Location: ${movie.theatreLocation}</p>
            `;
            movieList.appendChild(movieTile);
            result = true;
            return;
        }
    });
    console.log(result);

    if(result == false) {
        const movieTile = document.createElement("div");
        movieTile.classList.add("movie-tile");
        movieTile.innerHTML = `<p>No matches found for your search...</p>`;
        movieList.appendChild(movieTile);
    }

});


userIcon.addEventListener("click", () => {
    userPopup.style.display = userPopup.style.display === "block" ? "none" : "block";
});

// Close user popup when clicking outside of it
document.addEventListener("click", (event) => {
    if (event.target !== userIcon && event.target !== userPopup) {
        userPopup.style.display = "none";
    }
});

// Close user popup when the logout button is clicked
logoutButton.addEventListener("click", function () {
    userPopup.style.display = "none";
    // Add logout logic here
    location.assign(url.replace("login/", "") + "logout");
});
