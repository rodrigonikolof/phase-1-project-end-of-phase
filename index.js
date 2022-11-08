let imageUrl = {}; //holds current image//
const main = document.querySelector('.main');
let imageContainer = document.querySelector('.image-container'); //holds rendered picture of each API//
let viewedPics =[]; // stores data to enable "previous" button //
let arrayCounter = 0; //counter to cycle through viewedPics index//
let bookmarksContainer = document.querySelector('.show-bookmarks');


//navigation buttons//
document.querySelector('#catBtn').addEventListener('click', getCats);
document.querySelector('#dogBtn').addEventListener('click', getDogs);
document.querySelector('#bookmarksDiv').addEventListener('click', fetchBookmarks );

document.querySelector('#catBookmarkBtn').addEventListener('click', ()  => {
    saveAnimal(imageUrl)
    handleAddToBookmarksCat()
})
document.querySelector('#dogBookmarkBtn').addEventListener('click', ()  => {
    saveAnimal(imageUrl)
    handleAddToBookmarksDog()
})


function getCats(){
    fetch('https://api.thecatapi.com/v1/images/search')
    .then(response => response.json())
    .then (data => renderCatPicture(data[0].url)) 
    
}
function getDogs (){ 
    fetch('https://random.dog/woof.json')    
	.then(response => response.json())
	.then(data => renderDogPicture(data.url))
}

function showCatBtns(){
    document.querySelector('.home-container').style.display = 'none';
    document.querySelector('.dog-btns').style.display = 'none';
    bookmarksContainer.style.display = 'none';
    document.querySelector('.cat-btns').style.display = 'flex';
    document.querySelector('.image-container').style.display = 'block';
    
}
function showDogBtns(){
    document.querySelector('.home-container').style.display = 'none';
    document.querySelector('.cat-btns').style.display = 'none';
    bookmarksContainer.style.display = 'none';
    document.querySelector('.dog-btns').style.display = 'flex';
    document.querySelector('.image-container').style.display = 'block';
}
function showBookmarks(){
    document.querySelector('.home-container').style.display = 'none';
    document.querySelector('.cat-btns').style.display = 'none';
    document.querySelector('.dog-btns').style.display = 'none';
    document.querySelector('.image-container').style.display = 'none';
    bookmarksContainer.style.display = 'flex';
}


function renderCatPicture(data){
    showCatBtns();
    imageContainer.innerHTML = `<img class='mainPic'src='${data}'>`
    imageUrl = { "url" : data, "type" : "cat"};
    viewedPics.push(imageUrl);
}

function renderDogPicture(data){
    showDogBtns();
    imageContainer.innerHTML = `<img class='mainPic'src='${data}'>`
    imageUrl = { "url" : data, "type" : "dog"};
    viewedPics.push(imageUrl);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector('#nextCat').addEventListener('click', ()=> {
    getCats();
    arrayCounter++; 
    checkPrevious();
})
document.querySelector('#nextDog').addEventListener('click', ()=> {
    getDogs();
    arrayCounter++; 
    checkPrevious();
})

//changes text on Add to Bookmark button and disables it
function handleAddToBookmarksCat(){
    let catBtn = document.querySelector('#catBookmarkBtn')
    if (catBtn.innerText == 'Add to Bookmarks'){
        catBtn.innerText = 'Saved in Bookmarks';
        catBtn.setAttribute('disabled', 'disabled')
        catBtn.style.backgroundColor = 'grey';
    }
}
function handleAddToBookmarksDog(){
    let dogBtn = document.querySelector('#dogBookmarkBtn')
    if (dogBtn.innerText == 'Add to Bookmarks'){
        dogBtn.innerText = 'Saved in Bookmarks';
        dogBtn.setAttribute('disabled', 'disabled')
        dogBtn.style.backgroundColor = 'grey';
    }
}

//sends saved object to database
function saveAnimal(obj){
    fetch('http://localhost:3000/bookmarked/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accepts' : 'application.json',
        },
        body: JSON.stringify(obj)
    })
}

let bookmarked = [];
let filteredBookmarked = [];

function fetchBookmarks(){
fetch('http://localhost:3000/bookmarked')
.then(res => res.json())
.then(data=> allBookmarks(data))
}

function allBookmarks(data){
    showBookmarks();
    bookmarksContainer.innerHTML= `
    <h2> My Bookmarks </h2>  
    <div class="filterDiv">  
    <label id="filters">Filter:</label>
    <select id="filter-bookmarks" name="filter-bookmarks">
    <option value="" selected disabled hidden>Select</option>
    <option value="both">Cats and Dogs</option>
    <option value="dog">Dogs</option>
    <option value="cat">Cats</option>
    </select> 
    </div>`
    buildFilter();
    bookmarked = [];
    data.forEach(el => bookmarked.push(el))
    bookmarked.forEach(el=>renderBookmarks(el))
}

//listens for change in select tag and grabs value
function buildFilter(){
    const filter = document.querySelector('#filter-bookmarks');
    filter.addEventListener('change', ()=>{
        let filterValue = filter.value;
        filterBookmarks(filterValue);
    })
}

//renders bookmarks as per filtered value
function filterBookmarks(filterValue){
    filteredBookmarked = bookmarked.filter(el => {
    if (el.type == filterValue){return el}
    else if(filterValue == 'both'){return el}
    
    })
    bookmarksContainer.innerHTML = `
    <h2> My Bookmarks </h2> 
    <div class="filterDiv">    
    <label>Filter:</label>
    <select id="filter-bookmarks" name="filter-bookmarks">
    <option value="" selected disabled hidden>Select</option>
    <option value="both">Cats and Dogs</option>
    <option value="dog">Dogs</option>
    <option value="cat">Cats</option>
    </select> 
    </div>`;
    buildFilter();
    filteredBookmarked.forEach(renderBookmarks)
}


//Creates cards/divs for bookmarked elements
function renderBookmarks(el){
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `<img src="${el.url}" class="bookmarkPic">
    <button class="button-0" id="deleteBtn">Delete</button>`;
    let id = el.id;
    bookmarksContainer.appendChild(card)
    card.querySelector('#deleteBtn').addEventListener('click', () => {
    deleteBookmark(id);
    card.remove(); 
    })
}

function deleteBookmark(id){
    fetch(`http://localhost:3000/bookmarked/${id}`,{
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json', 'Accepts': 'application/json'},
    })
}

// DARK MODE// 
let checkbox = document.querySelector('#checkbox')
checkbox.addEventListener('click', ()=> {
    document.querySelector('body').classList.toggle('dark-mode');
   let h6 = document.querySelectorAll('h6');
   let h2=  document.querySelectorAll('h2');
   let ps = document.querySelectorAll('p');
   h6.forEach((el)=> el.classList.toggle('text-dark-mode'))
   h2.forEach((el)=> el.classList.toggle('text-dark-mode'))
   ps.forEach((el)=> el.classList.toggle('text-dark-mode'))
    let darkModeLabel = document.querySelector('#darkmode-label');
    darkModeLabel.innerText == 'Dark Mode OFF' ? darkModeLabel.innerText = 'Dark Mode ON' : darkModeLabel.innerText = 'Dark Mode OFF'
})

// RANDOM HOME PAGE //
function randomSpecies(){
   let random = Math.round(Math.random())
   random == 1? getCats():getDogs()
}
document.querySelector('#surpriseBtn').addEventListener('click', ()=> randomSpecies())
document.querySelector('#logo').addEventListener('click', ()=> window.location.reload())

//PREVIOUS BUTTON// 
const previous1 = document.querySelector('#previous1');
const previous2 = document.querySelector('#previous2');
previous1.addEventListener('click', ()=> previousPic());
previous2.addEventListener('click', ()=> previousPic());

function previousPic(){
    
    if(viewedPics[arrayCounter].type == 'cat'){
        renderCatPicture(viewedPics[arrayCounter-1].url)
        arrayCounter--;
        checkPrevious()
    }
    else {
        renderDogPicture(viewedPics[arrayCounter-1].url)
        arrayCounter--;
        checkPrevious()
    }
}

function checkPrevious(){
if ( arrayCounter == 0){
    previous1.innerText = "Nothing Here";
    previous2.innerText = "Nothing Here";
    previous1.disabled = true;
    previous2.disabled = true;
    previous1.style.backgroundColor = 'grey';
    previous2.style.backgroundColor = 'grey';
}
else{
    previous1.innerText = "Previous";
    previous2.innerText = "Previous";
    previous1.disabled = false;
    previous2.disabled = false;
    previous1.style.backgroundColor = '#0276FF';
    previous2.style.backgroundColor = '#0276FF';
}
}
checkPrevious();
