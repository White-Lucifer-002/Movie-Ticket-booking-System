const url = "http://127.0.0.1:3000/login/"

function select_seats(selectedMovie, showTime){
    
}

// Function to display showtimes for a selected movie
function displayShowtimes(selectedMovie) {
    const showtimesContainer = document.getElementById('showtimes');
    
    console.log("Movie:", selectedMovie)

    if (selectedMovie) {
        const showtimes = selectedMovie["showTime"].split(", ")        

        showtimesContainer.innerHTML = `
            <div class="box">
                <p class="moving-text">${selectedMovie["movieName"]}</p>
            </div>
            <br>
            <div class="date-input">
                <label for="date-input">Select a Date:</label>
                <input type="date" id="date">
            </div>
            <div class="time-input">
                <label for="time-input">Select a Time:</label>
                <select id="time">
                    <!-- Populate time options dynamically using JavaScript -->
                </select>
            </div>
        `;
        
        const timeSelect = document.getElementById("time");

        showtimes.forEach((showtime) => {
            const option = document.createElement("option");
            option.value = showtime;
            option.textContent = showtime;
            timeSelect.appendChild(option);

            // showtime.onclick = function(){
            // select_seats(selectedMovie, showtime);
            // };

            // console.log(showtime);
            // showtimeTile.innerHTML = `
            //     <p>Date: ${selectedMovie.releaseDate}</p>
            //     <p>Time: ${showtime}</p>
            //     <p>Theater Name: ${selectedMovie.theatreName}</p>
            //     <p>Theater Location: ${selectedMovie.theatreLocation}</p>
            //     `
            //     showtimesContainer.appendChild(showtimeTile);
        });
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // const dateInput = document.getElementById("date");
    const response = await fetch(url + "movies/timeslot?function=fetch", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const resp = await response.json();
    let user = resp["user"];
    delete resp["user"]

    const movie = resp;

    // Populate the showtime list on page load
    // dateInput.addEventListener("change", displayShowtimes);    
    displayShowtimes(movie);

    //Loading user details
    const userDetails = document.getElementById("user_details");
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
const logoutButton = document.getElementById("logoutButton");

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