// 7bf9653c

async function showMovie(){

    let movie = document.getElementById("movie-title").value;

    let year = document.getElementById("movie-year").value;

    if(movie === "" && year == ""){
        alert("Please fill detail");
        return false;
    }

    // let res;

    // if(movie.length === 0 && year.length != 0){
    //     res = await fetch(`http://www.omdbapi.com/?s=y=${year}&apikey=7bf9653c`);

    //     // return res;
    // }
    // else if(movie.length != 0 && year.length === 0){
    //     res = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=7bf9653c`);

    //     // return res;
    // }
    // else if(movie.length === 0 && year.length === 0){
    //     alert("Please fill input");
    // }
    // else{
    //     res = await fetch(`http://www.omdbapi.com/?s=${movie}&y=${year}&apikey=7bf9653c`);

    //     // return res;
    // }

    let res = await fetch(`http://www.omdbapi.com/?s=${movie}&y=${year}&apikey=7bf9653c`);

    let data = await res.json();

    if(data.Search === undefined){
        alert("No movie exist");
        return;
    }
    showPoster(data.Search);
}



// =======================================================
// Show on movie
// =======================================================


let parent = document.getElementById("movie");


function showPoster(movies){
    // console.log(movies);

    parent.innerHTML = null;

    parent.style.display = "grid";

    movies.forEach(function(movie){

        let container = document.createElement("div");

        container.setAttribute("class", "movie-container");

        let img_container = document.createElement("div");

        let img = document.createElement("img");

        img.src = movie.Poster;

        img_container.append(img);

        let movie_detail = document.createElement("div");
        
        let title = document.createElement("p");

        title.innerText = movie.Title;

        let movieYear = document.createElement("p");

        movieYear.innerText = movie.Year;

        movie_detail.append(title, movieYear);

        container.append(img_container, movie_detail);

        parent.append(container);

    })
        
}



// =========================================================
// Reset button function
// =========================================================

function resetInput(){

    parent.innerHTML = null;

    document.getElementById("movie-title").value = "";

    document.getElementById("movie-year").value = "";
}


// ===========================================================
// Redirect to sign in page
// ===========================================================

document.getElementById("signIn").onclick = function (){
    window.location.href = "signIn.html"
}

// ==========================================================
// Redirect to sign up page
// ==========================================================

document.getElementById("signUp").onclick = function(){
    window.location.href = "signUp.html"
}



// ===========================================================
// Creating User Account
// ===========================================================

function signup(e){

    e.preventDefault();

    let creating_form = document.getElementById("signup_form");

    let user_data = {

        name: creating_form.name.value,
        email: creating_form.email.value,
        password: creating_form.password.value,
        username: creating_form.username.value,
        mobile: creating_form.mobile.value,
        description: creating_form.description.value,
    }

    // console.log(user_data)

    user_data = JSON.stringify(user_data);


    fetch("https://masai-api-mocker.herokuapp.com/auth/register", {

        method: "POST",

        body: user_data,

        headers: {

            'Content-Type': 'application/json'
        },
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        console.log(res);

        if(res.message == "Registration Success"){
            
            window.location.href = "signIn.html"

        }

        throw res;
    })
    .catch((err)=>{
        // console.log("err" + err);
        alert(err.message);
    })
}

// ==================================================================
// Login Functionality
// ==================================================================

function signin(e){

    e.preventDefault();

    let login_form = document.getElementById("login_form");

    let login_credential = {

        username: login_form.username.value,
        password: login_form.password.value,
    }

    // console.log(login_credential)

    let data_to_send = JSON.stringify(login_credential);

    fetch("https://masai-api-mocker.herokuapp.com/auth/login",{

        method: 'POST',

        body: data_to_send,

        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        // console.log(res);

        fetchmyData(login_credential.username, res.token);
    })
    .catch((err)=>{
        console.log(err)
    })
}



// ==============================================================================================================================
// fetching for userdata who login
// ==============================================================================================================================


function fetchmyData(username,token){

    fetch(`https://masai-api-mocker.herokuapp.com/user/${username}`,{

        headers:{
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
        }
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        // console.log(res);

        userLocalstorage(res);

        // if(res.username == username){

        //     if(localStorage.getItem("username") === null){
        //         localStorage.setItem("username",JSON.stringify([]));
        //     }

        //     let local_username = JSON.parse(localStorage.getItem("username"));

        //     local_username.push(res);
        //     // console.log(local_username)

        //     // c = 1;

        //     localStorage.setItem("username",JSON.stringify(local_username));

        //     alert("Logged In Successfully"); 

        //     window.location = "movieSearchEngine.html";
            
        // }
        
    })
    .catch((err)=>{
        console.log(err);
    })
}


// ===========================================================================================================================
// sending userdata to localstorage after login
// ===========================================================================================================================

function userLocalstorage(userDetail){

    if(localStorage.getItem("username") === null){
        localStorage.setItem("username",JSON.stringify([]));
    }

    let local_username = JSON.parse(localStorage.getItem("username"));

    local_username.push(userDetail);
            // console.log(local_username)


    localStorage.setItem("username",JSON.stringify(local_username));

    // alert("Logged In Successfully"); 

    document.getElementById("login_form").reset();

    window.open("movieSearchEngine.html", "_blank");

    // showUsername();


    //  = "movieSearchEngine.html";

    window.onbeforeunload = function(){

        localStorage.removeItem("username");

        return;
    }
}



// ===================================================================================================================
// showing username after login
// ===================================================================================================================


let userNameFromStorage = JSON.parse(localStorage.getItem("username"));

if(userNameFromStorage != undefined){

    showUsername();
}


function showUsername(){

    

    // console.log(userNameFromStorage[0])

    document.getElementById("login_btn") .innerHTML = null;

    document.getElementById("login_btn") .innerHTML = userNameFromStorage[0].username;

    document.getElementById("login_btn") .style.justifyContent = "flex-end";
}