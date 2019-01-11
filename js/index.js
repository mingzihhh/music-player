function $(selector) {
    return document.querySelector(selector);
}

var currentIndex = 0;
var audio = new Audio();
audio.autoplay = true;

var previousBtn = $('.music-player .control .cut-song .previous');
var playBtn = $('.music-player .control .cut-song .play');
var nextBtn = $('.music-player .control .cut-song .next');
var album = $('.music-player .album');
var bgArt = $('#bg-artwork');
var totalTime = $('.music-player .progress .total-time');
var nowTime = $('.music-player .progress .now-time');
var title = $('.music-player .music-info .title');
var author = $('.music-player .music-info .author');
var progressBar = $('.music-player .progress .time');
var progressNow = $('.music-player .progress .time .time-bar');
var flipPlayer = $('.flip-player');
var musicListContainer = $('.music-list .menu');
var musicList;


getMusicList(function (list) {
    loadMusic(list[currentIndex]);
    setMusicList(list);
})


function setTime(time) {
    var min = parseInt(time / 60);
    var sec = parseInt(time % 60);
    min = min.toString().length == 2 ? min : '0' + min;
    sec = sec.toString().length == 2 ? sec : '0' + sec;
    return min + ':' + sec;
}

function getMusicList(callback) {
    var xml = new XMLHttpRequest();
    xml.open('GET', '../music.json', true);
    xml.onload = function () {
        if((xml.status >= 200&&xml.status <= 300)){
            musicList = JSON.parse(xml.responseText);
            callback(musicList);
        }else{
            console.log('服务器异常');
        }
    }
    xml.onerror = function(){
        console.log('服务器异常') ;
    }
    xml.send()
}

function loadMusic(musicObj){
    audio.src = musicObj.src;
    // audio.load();
    audio.ondurationchange = function(){
        totalTime.innerText = setTime(this.duration);
    }
    title.innerText = musicObj.title;
    author.innerText = musicObj.author;
    album.style.background = 'url(' + musicObj.img + ')';
    bgArt.style.background = 'url(' + musicObj.img + ')';

}
function setMusicList(list){
    var container = document.createDocumentFragment();
    var index = 1;
    list.forEach(function(musicObj){
        var node = document.createElement('li');
        node.classList.add('song');
        node.classList.add('clearfix');
        var number = document.createElement('div');
        number.innerText = index++;
        number.classList.add('number');
        var title = document.createElement('div');
        title.innerText = musicObj.title;
        title.classList.add('title');
        var author = document.createElement('div');
        author.innerText = musicObj.author;
        author.classList.add('author');
        var img = document.createElement('img');
        img.src = musicObj.img;
        img.classList.add('thumbnail');
        node.appendChild(number);
        node.appendChild(img);
        node.appendChild(title);
        node.appendChild(author);
        container.appendChild(node);
    });
    musicListContainer.appendChild(container);
}
audio.ontimeupdate = function(){ 
    progressNow.style.width = (this.currentTime) / (this.duration) * 100 + '%';
}

audio.onplay = function(){
    clock = setInterval(function () {
        nowTime.innerText = setTime(audio.currentTime);
    }, 1000);
    playBtn.querySelector('.iconfont').classList.add('icon-pause');
    playBtn.querySelector('.iconfont').classList.remove('icon-play');
}
audio.onpause = function(){
    clearTimeout(clock);
    playBtn.querySelector('.iconfont').classList.add('icon-play');
    playBtn.querySelector('.iconfont').classList.remove('icon-pause');

}
audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex]);
}

playBtn.onclick = function(){
    if(audio.paused){
        audio.play();
        this.querySelector('.iconfont').classList.add('icon-pause');
        this.querySelector('.iconfont').classList.remove('icon-play');    
    }else{
        audio.pause();
        this.querySelector('.iconfont').classList.add('icon-play');
        this.querySelector('.iconfont').classList.remove('icon-pause');
    }  
}
previousBtn.onclick = function () {
    currentIndex = (musicList.length + (--currentIndex)) % musicList.length;
    loadMusic(musicList[currentIndex]);
}
nextBtn.onclick = function() {
    currentIndex = (++currentIndex)%musicList.length;
    loadMusic(musicList[currentIndex]); 
}
progressBar.onclick = function(e){
    var percent = e.offsetX / parseInt(getComputedStyle(this).width);
    progressNow.style.width = percent * 100 + '%';
    audio.currentTime = audio.duration * percent;
}
flipPlayer.onclick = function(e){
    if(e.target.classList.contains('listBtn')){
        this.classList.remove('player');
        this.classList.add('list');
    }
    if(e.target.classList.contains('back')){
        this.classList.remove('list');
        this.classList.add('player');
    }
}
musicListContainer.onclick = function(e){
    if(e.target.tagName.toLowerCase() === 'li'){
        for(var i = 0 ;i < this.children.length ; i++){
            if(this.children[i] === e.target){
                currentIndex = i;
                loadMusic(musicList[currentIndex]);
                flipPlayer.classList.remove('list');
                flipPlayer.classList.add('player');
                
            }
        }
    }
}
