$(function () {
    const apiKey = "my_API_Key"; // Replace with my API key

    async function fetchMovies(){
        const url = ''

        const response = await fetch(url)
        const data = await response.json()
        return data

    }
  
  });
  