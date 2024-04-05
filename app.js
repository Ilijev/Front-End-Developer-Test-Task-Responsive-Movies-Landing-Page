$(function () {
    const apiKey = "d96644d18099073635702aec47127ce2"; 

    async function fetchMovies(){
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}` //TMDB API for movies 

        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.results

    }
    fetchMovies()
  });
  