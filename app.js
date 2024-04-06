$(function () {
  const apiKey = "d96644d18099073635702aec47127ce2";
    //filter object to be able to search by each one
  let filters = {
    genreId: "", // genre filtering
    searchTerm: "", // Search term filter
  };

  $('#genreBtns').on('click', '.genre-filter', function() {
    //finding the clicked button 
    const clickedBtn = $(this); 

    filters.genreId = clickedBtn.data('genreId');
  
    // Refetch movies with the updated filter:
    movieCard();
  });

  async function getGenres() {
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`; //TMDB API for genders
    const response = await fetch(genresUrl);
    const data = await response.json();
    // console.log(data)
    return data.genres;
  }



  async function fetchMovies(filters) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`; //TMDB API for movies

    console.log(filters)

    let queryParams = "";

    queryParams = queryParams.length ? `?${queryParams}` : "";
    
    if (filters.genreId) {
      queryParams += `&with_genres=${filters.genreId}`; // Single genre ID for filtering
    }

    if (filters.searchTerm) {
      queryParams += `&query=${filters.searchTerm}`; // Optional search term
    }

    const response = await fetch(`${url}${queryParams}`);
    const data = await response.json(); // Parse the JSON response
    return data.results; // Return only the movies array

  }

  async function movieCard() {
      let genres = await getGenres();
      let movies = await fetchMovies(filters);

    //create btns for filtering through genres
    const genreBtns =  $('#genreBtns')
    genreBtns.empty();
    
    console.log(genres);
    
    genres.forEach(genre=>{
        const btn =`<button class="btn btn-sm btn-light genre-filter" data-genre-id="${genre.id}">${genre.name}</button>`
        
        genreBtns.append(btn)
    })
    const moviesContainer = $("#movies");
    moviesContainer.empty();
    // console.log(moviesContainer);

    movies.forEach(async (movie) => {
      const title = movie.title;
      const year = movie.release_date.slice(0, 4); // Extract the year
      const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`; // Construct poster image URL
      const description = movie.overview.slice(0, 100) + "..."; // description
      const genreIds = movie.genre_ids;

      // const  movieGenres = genres.map(genre. )
      // console.log( genres.find(28))
      const movieGenres = genreIds
        .map(
          (genreId) =>
            genres.find((genre) => genre.id === genreId).name || "unknown"
        )
        .join(",");
    //   console.log(
    //     genreIds.map((genreId) => genres.find((genre) => genre.id === genreId))
    //   );

      const movieCard = `
              <div class="col">
                <div class="card h-100 bg-light text-dark  ">
                  <img src="${posterPath}" class="card-img-top" alt="Movie Poster">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${year} | ${movieGenres}</p>
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
