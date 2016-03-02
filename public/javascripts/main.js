
$(function(){
    console.log('ready');

});

function checkPass()
{
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('confirm');
    var message = document.getElementById('confirmMessage');
    
    //Set the colors we will be using ...
    var goodColor = "#66cc66";
    var badColor = "#ff6666";
    //Compare the values in the password field 
    //and the confirmation field
    if(pass1.value == pass2.value){
        $('#submit').attr('type', 'submit');
        pass2.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match!"
    }else{
        $('#submit').attr('type', 'button');
        pass2.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Do Not Match!"
    }
}  

function showForm(){
    $('#postForm').toggleClass('noShow');
}

function voteUp(x, y){
    console.log(x.id);
    console.log(y);
}

function voteDown(x, y){
    console.log(x.id);
    console.log(y);
}