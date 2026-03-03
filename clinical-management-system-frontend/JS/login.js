const hardUser = "LabTechnician";
const hardPass = "12345";

function validateLogin() {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    let emailError = document.getElementById("emailError");

    let valid = true;

    // Reset error 
    emailError.innerText = "";

    // Validate Username
    if (user === "") {
        emailError.innerText = "Please enter your username!";
        valid = false;
    }

    // Validate Password
    if (pass === "") {
        document.getElementById("password").style.border = "2px solid red";
        alert("Please enter your password!");
        valid = false;
    } else {
        document.getElementById("password").style.border = "1px solid #b5ecec";
    }

    if (!valid) return;

    // Validate credentials
    if (user === hardUser && pass === hardPass) {
        alert("Login Successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Username or Password!");
    }
}
