const url = "http://127.0.0.1:3000/login/"

function select_seats(selectedMovie, showTime){
    
}

// Function to display showtimes for a selected movie
function displayShowtimes(selectedMovie) {
    const showtimesContainer = document.getElementById('container');

    if (selectedMovie) {
        const showtimes = selectedMovie["showTime"].split(", ")        
        
        showtimes.forEach((showtime) => {
            const showtimeTile = document.createElement("div");
            showtimeTile.classList.add("showtime-tile");
            showtime.onclick = function(){
                select_seats(selectedMovie, showtime);
            };

            console.log(showtime);
            showtimeTile.innerHTML = `
                <p>Date: ${selectedMovie.releaseDate}</p>
                <p>Time: ${showtime}</p>
                <p>Theater Name: ${selectedMovie.theatreName}</p>
                <p>Theater Location: ${selectedMovie.theatreLocation}</p>
                `
                showtimesContainer.appendChild(showtimeTile);
        });
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch(url + "movies/timeslot", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const movie = await response.json();

    // Populate the movie list on page load
    displayShowtimes(movie);
});
