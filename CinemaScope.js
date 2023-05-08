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
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiMDT}&query=${contentName}`;
  try {
    const response = await fetch(movieUrl);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const contentId = data.results[0].id;
      const imagesUrl = `https://api.themoviedb.org/3/movie/${contentId}/images?api_key=${apiMDT}`;
      const imagesResponse = await fetch(imagesUrl);
      const imagesData = await imagesResponse.json();
      if (imagesData.backdrops && imagesData.backdrops.length > 0) {
        imageUrl = `https://image.tmdb.org/t/p/original${imagesData.backdrops[0].file_path}`;
        console.log(`Background image set for movie:`, imageUrl);
      } else {
        console.warn(`No image found for movie:`, contentName);
      }
    } else {
      console.warn(`No movie found:`, contentName);
    }
  } catch (error) {
    console.error("Error fetching movie background image:", error);
  }
  if (!imageUrl) {
    const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiMDT}&query=${contentName}`;
    try {
      const response = await fetch(tvUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const contentId = data.results[0].id;
        const imagesUrl = `https://api.themoviedb.org/3/tv/${contentId}/images?api_key=${apiMDT}`;
        const imagesResponse = await fetch(imagesUrl);
        const imagesData = await imagesResponse.json();
        if (imagesData.backdrops && imagesData.backdrops.length > 0) {
          imageUrl = `https://image.tmdb.org/t/p/original${imagesData.backdrops[0].file_path}`;
          console.log(`Background image set for TV show:`, imageUrl);
        } else {
          console.warn(`No image found for TV show:`, contentName);
        }
      } else {
        console.warn(`No TV show found:`, contentName);
      }
    } catch (error) {
      console.error("Error fetching TV show background image:", error);
    }
  }
  if (!imageUrl) {
    console.warn('No movie or TV show found:', contentName);
    return;
  }
  document.body.style.backgroundImage = `url('${imageUrl}')`;
};
searchBtn.addEventListener("click", async () => {
  await getMovie();
  await setBackgroundImage();
});
