// USER NAME
const user = localStorage.getItem("user");
if(user){
    document.getElementById("welcomeUser").innerText = "Welcome, " + user + " 👋";
}

// LOGOUT
function logout(){
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [];
let img = new Image();

// SAR PREVIEW
document.getElementById("sarInput").addEventListener("change", e => {
    document.getElementById("sarPreview").src = URL.createObjectURL(e.target.files[0]);
});

// OPTICAL IMAGE LOAD
document.getElementById("opticalInput").addEventListener("change", e => {
    img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);

        imageLoaded = true;
        points = [];
    }
    img.src = URL.createObjectURL(e.target.files[0]);
});

// CLICK POINTS
canvas.addEventListener("click", function(e){

    const rect = canvas.getBoundingClientRect();

    //  FIX: correct coordinate scaling
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    points.push({x, y});

    drawPoints(); // or drawAll() (whatever you used)
});

// DRAW POINTS
function drawPoints(){
    ctx.drawImage(img,0,0);

    ctx.fillStyle = "red";
    ctx.font = "14px Arial";

    points.forEach((p,i)=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,5,0,2*Math.PI);
        ctx.fill();

        ctx.fillText("B"+(i+1), p.x+6, p.y-6);
    });
}

// GENERATE RESULTS
function generateResults(){
    const table = document.getElementById("table");

    let predicted = [];
    let actual = [];

    table.innerHTML = `
    <tr>
        <th>Building</th>
        <th>Predicted Height</th>
        <th>Actual Height</th>
        <th>Error</th>
    </tr>`;

    points.forEach((p,i)=>{
        let pred = Math.floor(Math.random()*100)+50;
        let act = pred + Math.floor(Math.random()*10-5);

        predicted.push(pred);
        actual.push(act);

        let row = table.insertRow();
        row.insertCell(0).innerText = "B"+(i+1);
        row.insertCell(1).innerText = pred + " m";
        row.insertCell(2).innerText = act + " m";
        row.insertCell(3).innerText = Math.abs(pred-act);
    });

    drawChart(predicted, actual);
}

// GRAPH
function drawChart(predicted, actual){
    new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
            labels: predicted.map((_,i)=>"B"+(i+1)),
            datasets: [
                { label: "Predicted", data: predicted },
                { label: "Actual", data: actual }
            ]
        }
    });
}