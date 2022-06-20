const clock = document.querySelector("h2#clock");
const API_KEY = "fe63c14e98b8f3d6a9042440c2530112";
const idForm = document.querySelector("#name")
const idinput = idForm.querySelector("input")
const userName = document.querySelector(".userName")
const toDoForm = document.querySelector("#todo")
const toDoInput = toDoForm.querySelector("input")
const toDOList = document.getElementById("todo-list")

const TODOS_KEY = "todos"
let toDos = [];

function getClock(){
    const date = new Date();
    
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    clock.innerText =`${hours}:${minutes}:${seconds}`
}
function changeBg(){
    const images = ["bg1.jpg", "bg2.jpg","bg3.jpg","bg4.png"];
    const RandomImages = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('./images/${RandomImages}')`
}

getClock()
changeBg()
setInterval(getClock, 1000)

function onGeoOk(position){
    const lat = position.coords.latitude;
    const lng = position.coords.longitude
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    console.log(url)
    fetch(url).then(response => response.json()).then(data => {
        const weather = document.querySelector("#weather span:first-child")
        const city = document.querySelector("#weather span:last-child")
        city.innerText =  data.name
        weather.innerText =  `${data.weather[0].main}`
    })
}
function onGeoError(){
    alert("Can't find you. No weather for you")
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)

function savedID(event){
    event.preventDefault();
    const newID = idinput.value;
    idinput.value = "";
    const h1 = document.createElement("h1")
    h1.innerText = `hello ${newID}`;
    userName.appendChild(h1);
    localStorage.setItem("id", JSON.stringify(newID))
    idForm.style.display = "none"
}

idForm.addEventListener("submit", savedID);

function savedTODOs(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos))
}

function deleteToDo(event){
    const li = event.target.parentElement;
    li.remove()
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id))
    savedTODOs();
    
}
function paintToDo(newTodo){
    const li = document.createElement("li")
    li.id = newTodo.id;
    const span = document.createElement("span")
    span.innerText = newTodo.text;
    const button = document.createElement("button")
    button.innerText="x";
    button.addEventListener("click", deleteToDo)
    li.appendChild(span)
    li.appendChild(button)
    toDOList.appendChild(li)
    savedTODOs()
}

function handleToDOSumbit(event){
    event.preventDefault();
    const newToDO = toDoInput.value;
    toDoInput.value = ""
    const newToDoObj = {
        text : newToDO,
        id : Date.now(),
    }
    toDos.push(newToDoObj)
    paintToDo(newToDoObj)
    savedTODOs()
}

toDoForm.addEventListener("submit", handleToDOSumbit);

const saveToDos = localStorage.getItem(TODOS_KEY);
if(saveToDos !== null){
    let parsedToDos = JSON.parse(saveToDos)
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}

