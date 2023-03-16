//Jesus Ortega 
//Final Project for BVT 2211 Cohort
//Audio Nimbus - A prototype of an online music streaming platform

//creating a class for songs to easily upload/add new songs.
class Song {
    constructor(name, audioURL){
        this.name = name;
        this.audioURL = audioURL;
    }
    convertToURL() {
        this.audioURL = document.querySelector('.song-audio').files[0]
    }
}//end class song

//global song list
let mainSongList = document.getElementById('main-song-list');
let favList = document.getElementById('favorites');

//when pressing the upload audio button insert this form.
document.querySelector('#uploadButton').addEventListener('click', (e) => {
    e.preventDefault();
    //reset so that there arent multiple forms being added
    document.querySelector('.modal-body').innerHTML = '';

    const formElem = document.createElement('form');
    formElem.innerHTML = '<label>Title<br/> <input type="text" class="song-title" placeholder="Song Title"> </label>  <label>Upload Audio:<br /><input type="file" accept="audio/*" placeholder="" class="song-audio"></label> <button type="submit">Upload Song</button>' ;
    document.querySelector('.modal-body').append(formElem);
    
    formElem.addEventListener('submit', addSong);
});

let songsStorage = [];

//if local storage is not empty
if(localStorage.length != 0){
    const songData = localStorage.getItem('songs');
    const savedSongs = JSON.parse(songData);
    savedSongs.forEach(item => {
        creatingSongElement(item.name,item.url);
    });
}

//creating song element function
function creatingSongElement(name, url) {
    //create a li element
    const li = document.createElement('li');
    //add class
    li.className = 'list-group-item';
    //create card element
    const card = document.createElement('div');
    card.className = 'card';
    //create h5 element as song title
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.innerText = name;
    card.appendChild(cardTitle)
    //create audio element to add to card
    const audioEl = document.createElement('AUDIO');
    audioEl.className = 'card-body';
    audioEl.setAttribute("src", url);
    audioEl.setAttribute('controls', 'controls')
    //append to card element
    card.appendChild(audioEl);
    //create heart icon for favorites
    const like =  document.createElement('a');
    like.className = 'fav-song card-body';
    like.innerHTML = '<i class="fa-solid fa-heart"></i>';
    card.appendChild(like);
    //create an icon for deleting songs
    const del = document.createElement('a');
    del.className = 'del-song card-body';
    del.innerHTML = '<i class="fa-solid fa-trash"></i>'
    card.appendChild(del);
    //append to li
    li.appendChild(card);
    //append to the main song list
    mainSongList.appendChild(li);
}

function addSong(e) {
    e.preventDefault();
    //if any inputs from the form are incomplete then return jquery
    if(!$('form input[type=text]').val()||!$('form input[type=file]').val()){
        alert('form is incomplete');
        console.log('form is incomplete');
        return;
    }

    //turning form audio file into a url to add to DOM
    const file = document.querySelector('.song-audio').files[0]; 
    //create a song object to use to get our input
    const song = new Song(document.querySelector('input.song-title').value, URL.createObjectURL(file));

    //create a li element
    const li = document.createElement('li');
    //add class
    li.className = 'list-group-item';
    //create card element
    const card = document.createElement('div');
    card.className = 'card';
    //create h5 element as song title
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.innerText = song.name;
    card.appendChild(cardTitle)
    //create audio element to add to card
    const audioEl = document.createElement('AUDIO');
    audioEl.className = 'card-body';
    audioEl.setAttribute("src", song.audioURL);
    audioEl.setAttribute('controls', 'controls')
    //append to card element
    card.appendChild(audioEl);
    //create heart icon for favorites
    const like =  document.createElement('a');
    like.className = 'fav-song card-body';
    like.innerHTML = '<i class="fa-solid fa-heart"></i>';
    card.appendChild(like);
    //create an icon for deleting songs
    const del = document.createElement('a');
    del.className = 'del-song card-body';
    del.innerHTML = '<i class="fa-solid fa-trash"></i>'
    card.appendChild(del);
    //append to li
    li.appendChild(card);
    //append to the main song list
    mainSongList.appendChild(li);

    //persist the song data to local storage
    const songObject = {
        name: song.name,
        url: song.audioURL,
    };

    console.log(songObject);
    songsStorage.push(songObject);

    console.log((songsStorage));
    
    console.log(songObject);
    localStorage.setItem('songs', JSON.stringify(songsStorage));

    //clear the form
    document.querySelector('form').innerHTML = '';
}

//event listeners for favoriting and deleting songs
mainSongList.addEventListener('click', delSong);
mainSongList.addEventListener('click', favSong);

function favSong(e) {
    e.preventDefault();
    //if click the fav icon then add it to the favorites list
    if(e.target.parentElement.classList.contains('fav-song')) {
        console.log('you favorited this song!');
        console.log(e.target.parentElement.parentElement.querySelector('h5').innerText);
        console.log(e.target.parentElement.parentElement.querySelector('AUDIO').getAttribute('src'));
        //create a song object with the info from the parent element
        const song = new Song(e.target.parentElement.parentElement.querySelector('h5').innerText, e.target.parentElement.parentElement.querySelector('AUDIO').getAttribute('src'));
        //create a new li element
        const li = document.createElement('li');
        li.className = 'list-group-item';
        //create fav name
        const p = document.createElement('p');
        p.innerText = song.name;

        li.appendChild(p);

        favList.appendChild(li);

    }    
}

function delSong(e) {
    e.preventDefault();
    //console.log(e.target)
    if(e.target.parentElement.classList.contains('del-song')) {
        console.log(e.target);
        if(confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();
            console.log(e.target.parentElement.parentElement);
            delSongFromLocal(e.target.parentElement.parentElement);
        }
    }
}

//this will delete the song from local storage
function delSongFromLocal(songItem) {
    let songs;
    if(localStorage.getItem('songs') === null) {
        songs = [];
    } else {
        songs = JSON.parse(localStorage.getItem('songs'));
    }
    console.log('before: '+songs);
    songs.forEach(function(song, index){
        if(songItem.textContent === song.name){
            songs.splice(index, 1);
        }
    });

    console.log('after: '+ songs);

    localStorage.setItem('songs', JSON.stringify(songs));
}

/* function runEvent(e){
    e.preventDefault();
    //if any inputs from the form are incomplete then return jquery
    if(!$('form input[type=text]').val()||!$('form input[type=file]').val()){
        alert('form is incomplete');
        console.log('form is incomplete');
        return;
    }
    //create a new li element, give it the list-group-item class and then insert the html we need for the audio track, finally append it to the main song list
    const songElem = document.createElement('li');
    songElem.className = 'list-group-item';
    songElem.innerHTML = '<div class="card d-flex flex-row align-items-center"><h2 class="songTitle" style="margin-left: 10px" ></h2><audio id="track" src="" controls type="audio/mp3"></audio><i class="fa-solid fa-heart" style="margin-left: 5px"></i></div>';
    mainSongList.appendChild(songElem);

    //turning form audio file into a url to add to DOM
    const file = document.querySelector('.song-audio').files[0]; 
    //create a song object to use to get our input
    const song = new Song(document.querySelector('input.song-title').value, URL.createObjectURL(file));

    let tracks = document.getElementsByClassName('track');
    console.log(tracks);
 
    $('#track').attr("src", URL.createObjectURL(file));
    document.getElementById('track').load();
    
    document.querySelector('.list-group-item h2.songTitle').innerHTML = song.name;
    
    console.log(document.querySelector('input.song-title').value);
    console.log(URL.createObjectURL(file));
    console.log(document.querySelector('.list-group-item h2.songTitle').innerHTML);

    document.querySelector('form').innerHTML = '';
    console.log(mainSongList);
    

   

} */


