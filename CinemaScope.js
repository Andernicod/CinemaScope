let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
const apiKey = "1e444574";
const apiMDT = "66d8c0055f0a6242054781bc886c7236";

let getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

    if (movieName.length <= 0) {
      result.innerHTML = `<h3 class="msg">Please enter a movie name </h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
            if (data.Response === "True") {
                const imdbRating = data.Ratings.find(
                  (rating) => rating.Source === "Internet Movie Database"
                ).Value;
                const rtRating = data.Ratings.find(
                  (rating) => rating.Source === "Rotten Tomatoes"
                );
                const rtValue = rtRating ? rtRating.Value : "N/A";
                
                const mcRating = data.Ratings.find(
                  (rating) => rating.Source === "Metacritic"
                );
                const mcValue = mcRating ? mcRating.Value : "N/A";
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
                            <div><img class="Tomatoes" src="images/Rotten_Tomatoes.svg">Rotten Tomatoes: ${rtValue}</div>
                            <div><img class="Metacritic" src="images/Metacritic.svg">Metacritic: ${mcValue}</div>
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

const setBackgroundImage = async () => {
  const contentName = movieNameRef.value;
  let imageUrl;
  const url = `https://www.omdbapi.com/?t=${contentName}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "True") {
      if (data.Type === "movie") {
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiMDT}&query=${contentName}`;
        const movieResponse = await fetch(movieUrl);
        const movieData = await movieResponse.json();
        if (movieData.results.length > 0) {
          const movieId = movieData.results[0].id;
          const backdropPath = movieData.results[0].backdrop_path;
          imageUrl = `https://image.tmdb.org/t/p/original/${backdropPath}`;
        }
      } else if (data.Type === "series") {
        const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiMDT}&query=${contentName}`;
        const seriesResponse = await fetch(seriesUrl);
        const seriesData = await seriesResponse.json();
        if (seriesData.results.length > 0) {
          const seriesId = seriesData.results[0].id;
          const backdropPath = seriesData.results[0].backdrop_path;
          imageUrl = `https://image.tmdb.org/t/p/original/${backdropPath}`;
        }
      }
    } else {
      console.warn(`No movie/series found:`, contentName);
    }
  } catch (error) {
    console.error("Error fetching movie/series background image:", error);
  }
  if (imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
};

searchBtn.addEventListener("click", async () => {
  await getMovie();
  await setBackgroundImage();
});

if (/Mobi|Android/i.test(navigator.userAgent)) {
  searchBtn.style.fontSize = '16px';
}
