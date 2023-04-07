let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
const apiKey = "1e444574";

let getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

    if (movieName.length <= 0) {
      result.innerHTML = `<h3 class="msg">Please enter a movie name </h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.Response == "True") {
                    let imdbRating = data.imdbRating;
                    let rtValue = data.Ratings.find((rating) => rating.Source === "Rotten Tomatoes")?.Value;
                    let mcValue = data.Ratings.find((rating) => rating.Source === "Metacritic")?.Value;
                    result.innerHTML = `
                    <div class="info">
                        <img src="${data.Poster}" class="poster">
                        <div>
                            <h2>${data.Title}</h2>
                            <span class="MorS ${data.Type}">
                                ${data.Type}
                                ${data.Type === "series" ? ` - ${data.totalSeasons} Seasons` : ""}
                            </span>
                            <div class="rating">
                                <img src="star-icon.svg">
                                <h4>${imdbRating}</h4>
                            </div>
                            <div class="ratings">
                                <div><img class="IMDb" src="images/IMDb.svg">IMDb: ${imdbRating}</div>
                                ${rtValue ? `<div><img class="Tomatoes" src="images/Rotten_Tomatoes.svg">Rotten Tomatoes: ${rtValue}</div>` : ""}
                                ${mcValue ? `<div><img class="Metacritic" src="images/Metacritic.svg">Metacritic: ${mcValue}</div>` : ""}
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="origin">
                                <div>Language: <span>${data.Language}</span></div>
                                <div>Country: <span>${data.Country}</span></div>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(",").join("</div><div>")}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>
                    `;
                } else {
                    result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                }
            })
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
            });
    }
};
searchBtn.addEventListener("click", getMovie);