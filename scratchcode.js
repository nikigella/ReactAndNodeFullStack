// write a function to retrieve a blob of json
// make an ajax request! Use the 'fetch' function
// https://rallycoding.herokuapp.com/api/music_albums

// function fetchAlbums() {
//     fetch('https://rallycoding.herokuapp.com/api/music_albums')
//         // fetch -> returns a response and then to actually work with
//         // the data we get back from the request url above, we need to
//         // convert it into a json format
//         .then(res => res.json())
//         .then(json => console.log(json));
// }

// Using the new syntax (async/await)

async function fetchAlbums() {
    const res = await fetch('https://rallycoding.herokuapp.com/api/music_albums')
        // fetch -> returns a response and then to actually work with
        // the data we get back from the request url above, we need to
        // convert it into a json format
        const json = await res.json()
        
        console.log(json)
}


// const fetchAlbums = async () =>  {
//     const res = await fetch('https://rallycoding.herokuapp.com/api/music_albums')
//         // fetch -> returns a response and then to actually work with
//         // the data we get back from the request url above, we need to
//         // convert it into a json format
//         const json = await res.json()
        
//         console.log(json)
// }

fetchAlbums();
