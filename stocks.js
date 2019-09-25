var userID;
var name;
var currStock;

//creates a generic ajaxrequest which can be used within other functions to create and execute an ajax request
function ajaxRequest(method, url, data, callback){    
    let request = new XMLHttpRequest();
    request.open(method, url, true);
    //if the method used is post, add the needed header
    if(method == "POST"){
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            if(request.status == 200){
                let response = request.responseText;
		//set what happens when the request returns successfully
                callback(response);
            } else{
                console.log("error in AJAX request");
            }
        }
    }
    request.send(data);
}

//function that is called when the logout button is pressed, resets the user id and name to null, displays the login in fall and clears the rest of the screen
function logout(){
    userID = "";
    name = "";
    document.getElementById('stockInfo').style.display = "none";
    document.getElementById('login').style.display = "block";
    document.getElementById('password').value = "";
    document.getElementById('username').value = "";
    document.getElementById('loginFeedback').textContent = "";
    clearTable();
}

//used to check that the username and password entered by the user are valid in the database. Sends the entered information to a php script using an ajax request
function checkLogin(){        
    var username = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    
    //if no username has been entered, give the user feedback to ensure they enter a username
    if(username == ""){
        feedbackText = document.getElementById('loginFeedback').textContent = "Please enter a username and password";
        return;
    }
        
    var data = "username=" + username + "&password=" + pass;
    var url = "checkLogin.php";
    
    //send the username and password entered to a php script which checks the login is valid
    ajaxRequest('POST', url, data, verifyLogin);    
}

//the callback function for the checkLogin function, will recieve either a predefined 'error' code, or a JSON object containing information about the user
function verifyLogin(verifyCode){ 
    var feedbackText = document.getElementById('loginFeedback');
    
	//if a '-1' error code is returned, display a message to the user saying their inputted username doesn't exist
    if(verifyCode == "-1"){
        feedbackText.textContent = "Sorry, this username does not exist";
    }
    else if (verifyCode == "-2"){	//if a '-2' error code is returned, display a message saying the password doesn't match
        feedbackText.textContent = "Sorry, this password doesn't match your username";
        document.getElementById('password').textContent = "";
    }
    else { //otherwise dynamically change the page to display their list of stocks, their name and a button allowing them to logout
        var user = JSON.parse(verifyCode);
        name = user[0].fName + " " + user[0].sName;
        userID = user[0].userID;
        document.getElementById('name').textContent = name;
        document.getElementById('stockInfo').style.display = "block";
        displayStocks();
    }
}

//function which creates an ajax request to get the user's list of owned stocks
function displayStocks(){
    document.getElementById("login").style.display = "none";
    document.getElementById("stockInfo").style.display = "block";
    document.getElementById("moreInfo").style.visibility = "hidden";
    var url = "ownedStocks.php" + "?id=" + userID;
    ajaxRequest('GET', url, "", showList);
    
}

//callback function for the display stocks ajax request, recieves a list of infomation about owned stocks to display on the page
//dynamically updates the page to display this list
function showList(stocksList){
    var table = document.getElementById("stockList");
    var companies = JSON.parse(stocksList);
    clearTable();
    
    for(i = 0; i < companies.length; i++){
        
        var row = table.insertRow(-1);        
        var cName = companies[i].name;
        var name = row.insertCell(-1);
        var move = row.insertCell(-1);
        
        name.innerHTML = companies[i].name;
        move.innerHTML = companies[i].move;
        var d = companies[i].direction; 
        
        name.className = cName;
        move.className = cName;
        
	//adds an event listner which allows more infomation about the company to be displayed, upon clicking 
        name.addEventListener("click", function(e){getInfo(e);});
        move.addEventListener("click", function(e){getInfo(e);});
        
        if(d == "Up")
            move.style.color = "green";
        else if (d == "Down")
            move.style.color = "red";
    }
    
    document.getElementById('moreInfo').style.display = "inline-block";
    document.getElementById('moreInfo').style.visibility = "visible";
}

//when a company is clicked in the stocks list, creates an ajax request which returns additional info about the stock
function getInfo(e){    
    var url = "getMoreInfo.php" + "?name=" + e.target.className;
    ajaxRequest("GET", url, "", showInfo)
}

//callback function for the getInfo ajax request, displays additional info about the clicked stock
function showInfo(info){
    var info = JSON.parse(info);
    
    var table = document.getElementById("infoTable");
    table.style.visibility = "visible";
    
    table.innerHTML = "";
    
    var head = table.insertRow(-1);
    var price = table.insertRow(-1);
    var move = table.insertRow(-1);
    var trend = table.insertRow(-1);
    
    head.insertCell(-1).innerHTML = info['company'];
    currStock = info['company'];
    head.id = "head";
    head.insertCell(-1).innerHTML = "<button type='button' onclick='remove()' id='remove'>REMOVE</button>";
    price.insertCell(-1).innerHTML = "Current Price: ";
    price.insertCell(-1).innerHTML = info['price'];
    move.insertCell(-1).innerHTML = "Recent Change: ";
    
    var d = info['direction'];
    
    if(d == "Up")
            move.insertCell(-1).innerHTML = "+ " + info['change'];
        else if (d == "Down")
            move.insertCell(-1).innerHTML = "- " + info['change'];
    
    trend.insertCell(-1).innerHTML = "Annual Trend: ";
    trend.insertCell(-1).innerHTML = info['annual']
}

//creates an ajax request which removes the speicifed stock from the users list of owned stocks
function remove(){
    var url = "remove.php" + "?stock=" + currStock + "&user=" + userID;
    document.getElementById('infoTable').style.visibility = "hidden";
    ajaxRequest("GET", url, "", displayStocks);
}

//removes all information from the table which displays info about a stock
function clearTable(){
    currStock = null;
    var innerHTML = "<tr><th>Company</th><th>Recent Movement</th></tr>";
    document.getElementById('stockList').innerHTML = innerHTML;
}

//displays a modal box which creates an ajax request that gets the list of stocks the user doesn't currently own so they can add these
function showModal(){
    document.getElementById('modal').style.display = "block";
    var url = "unownedStocks.php" + "?user=" + userID;
    ajaxRequest("GET", url, "", displayAddList);
}

//closes the modal box
function cancel(){
    document.getElementById('modal').style.display = "none";
}

//callback function for the showModal ajaz request, displays the list of unowned stocks in a modal box
function displayAddList(list){
    var companies = JSON.parse(list);
    
    var div = document.getElementById('addList');
    
    while (div.hasChildNodes()) {   
        div.removeChild(div.firstChild);
    }
    
    for(i = 0; i < companies.length; i++){
        
        var c = document.createElement("input");
        c.type = "checkbox";
        c.name = "cList";
        c.value = companies[i].id;
        c.className = "c";
        c.id = companies[i].id;
        
        var label = document.createElement("label");
        label.for = companies[i];
        
        var text = document.createTextNode(companies[i].name);
        label.appendChild(text);
        
        var b = document.createElement("br");
        
        div.appendChild(c);
        div.appendChild(label);
        div.appendChild(b);
    }
}

//executed when the user clicks 'add' to add stocks to their list of tracked stocks
function addStocks(){
    var boxes = document.getElementsByClassName("c");
    var arr = [];
    for(i = 0; i < boxes.length; i++){
        if(boxes[i].checked){
            arr.push(boxes[i].id);
        }
    }
    var data = "user=" + userID + "&data=" + JSON.stringify(arr);
    var url = "addStocks.php";
    document.getElementById('modal').style.display = "none";
    ajaxRequest("POST", url, data, displayStocks);
}
