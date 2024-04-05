$(function () {
  const apiKey = "d96644d18099073635702aec47127ce2";

  async function fetchMovies() {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`; //TMDB API for movies

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.results;
  }

  async function movieCard() {
    let movies = await fetchMovies();

    const moviesContainer = $("#movies");
    moviesContainer.empty();
    console.log(moviesContainer);
   
    movies.forEach(async (movie) => {
      const title = movie.title;
      const year = movie.release_date.slice(0, 4); // Extract the year
      const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`; // Construct poster image URL
      const description = movie.overview.slice(0, 100) + "..."; // description
        const genreNames =movie.genre_ids


      const movieCard = `
              <div class="col">
                <div class="card h-100 bg-light text-dark  ">
                  <img src="${posterPath}" class="card-img-top" alt="Movie Poster">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${year} | ${genreNames}</p>
                    <p class="card-text">${description}</p>
                  </div>
                </div>
              </div>
            `;

      // Append the movie card to the container
    
        moviesContainer.append(movieCard);
     
    });
  }
  movieCard();
});
