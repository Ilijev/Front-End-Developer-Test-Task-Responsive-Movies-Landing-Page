$(function () {
  const apiKey = "d96644d18099073635702aec47127ce2";
  let movieArray = [];
  //filter object to be able to search by each one
  let filters = {
    genreId: "", // genre filtering
    searchTerm: "", // Search term filter
  };

  $("#genreBtns").on("click", ".genre-filter", function () {
    // not arrow functon because of the this  keyword ask me how i know :D
    //finding the clicked button
    const clickedBtn = $(this);

    filters.genreId = clickedBtn.data("genreId");

    // Refetch movies with the updated filter:
    movieCard();
  });
  //random quote
  async function randomQuote(){
    const quoteUrl = `https://quoteapi.pythonanywhere.com/random`; 
    const response = await fetch(quoteUrl);
    const data = await response.json();
    console.log(data.Quotes[0].quote)
    $ ("#randomQuote").append(` <div class="py-2 text-center fw-bold">${data.Quotes[0].quote}</div>`)
    
    setTimeout(function () {
      $("#randomQuote").remove();
    }, 1500)
  }

  // form validations this was from Gemini 's code, I just added a few things
  
  $("#addMovieForm").validate({
    // ... validation rules and messages
    submitHandler: function (form) {
      event.preventDefault(); // Prevent default form submission

      const title = $("#movieTitle").val();
      const date = $("#movieDate").val();
      const description = $("#movieDescription").val();

      const newMovie = {
        title: title,
        date: date,
        description: description
      };

      movieArray.push(newMovie);
      movieCard(newMovie); // Call movieCard after adding movie

      $(form).trigger("reset"); // Optionally clear form fields
    }
  });

  function filterBySearchTerm() {
    const searchTerm = $("#searchInput").val();
    filters.searchTerm = searchTerm;
    console.log(filters);
    movieCard(); // Refetch movies based on updated filters
  }
  $("#searchInput").on("input", filterBySearchTerm);

  async function getGenres() {
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`; //TMDB API for genders
    const response = await fetch(genresUrl);
    const data = await response.json();
    // console.log(data)
    return data.genres;
  }

  async function fetchMovies(filters) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`; //TMDB API for movies

    // console.log(filters);

    let queryParams = "";

    queryParams = queryParams.length ? `?${queryParams}` : "";

    if (filters.genreId) {
      queryParams += `&with_genres=${filters.genreId}`; // Single genre ID for filtering
    }

   
    if (filters.searchTerm !== "") { 
        queryParams += `&query=${encodeURIComponent(filters.searchTerm)}`
      }

    const response = await fetch(`${url}${queryParams}`);
    const data = await response.json(); 
    return data.results; 
  }

  async function movieCard(newMovie = null) {
    let genres = await getGenres();
    
    let movies;
  if (newMovie) {
      movies = await fetchMovies(filters);
    movies.push(newMovie);
  } else {
    movies = await fetchMovies(filters);
  }

    console.log(movieArray)
    //create btns for filtering through genres
    const genreBtns = $("#genreBtns");
    genreBtns.empty();

    // console.log(genres);

    genres.forEach((genre) => {
      const btn = `<button class="btn btn-sm btn-light genre-filter" data-genre-id="${genre.id}">${genre.name}</button>`;

      genreBtns.append(btn);
    });
    const moviesContainer = $("#movies");
    moviesContainer.empty();

    movies.forEach(async (movie) => {
      const title = movie.title;
      const year = movie.release_date.slice(0, 4); // Extract the year
      const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`; // Construct poster image URL
      const description = movie.overview.slice(0, 100) + "..."; // description
      const genreIds = movie.genre_ids;

      
      const movieGenres = genreIds
        .map(
          (genreId) =>
            genres.find((genre) => genre.id === genreId).name || "unknown"
        )
        .join(",");
     

      const movieCard = `
  <div class="col">
    <div class="card h-100 bg-light text-dark">
      <a href="#" class="movie-poster-link" data-movie-id="${movie.id}"> <img src="${posterPath}" class="card-img-top" alt="Movie Poster">
      </a>
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
 

  //getting movie details
  async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
    //filling the modal with the movie details
  $(document).on("click", ".movie-poster-link", async function (event) {
    event.preventDefault(); // Prevent default link behavior
  
    const clickedLink = $(this);
    const movieId = clickedLink.data("movieId");
  
    
    const movieDetails = await fetchMovieDetails(movieId);

    $("#movieTitle").text(movieDetails.title);
    $("#movieYear").text(movieDetails.release_date.slice(0, 4));
    $("#movieDescription").text(movieDetails.overview);
    $("#movieGenres").text(movieDetails.genres.map((genre) => genre.name).join(", "));
  
    // Show the modal
    $("#movieModal").modal("show");
  });
  movieCard();
  randomQuote()
});
