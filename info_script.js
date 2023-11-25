var loadedInfoData = JSON.parse(localStorage.getItem('infoData')) || [];

document.addEventListener('DOMContentLoaded', function() {
    localStorage.removeItem('infoData');

    loadInfoData();
}, false);


function loadInfoData() {
    if (loadedInfoData.length === 0) {
        return;
    }
    var firmName = document.getElementById('firmName');
    var senderAddress = document.getElementById('senderAddress');
    var senderPlz = document.getElementById('senderPlz');
    var senderCity = document.getElementById('senderCity');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');

    var recieverName = document.getElementById('recieverName');
    var recieverCity = document.getElementById('recieverCity');
    var recieverAddress = document.getElementById('recieverAddress');
    infoData = loadedInfoData[0];
    console.log(infoData)
    firmName.value = infoData['firmName'];
    senderAddress.value = infoData['senderAddress'];
    senderPlz.value = infoData['senderPlz'];
    senderCity.value = infoData['senderCity'];
    phone.value = infoData['phone'];
    email.value = infoData['email'];
    recieverName.value = infoData['recieverName'];
    recieverCity.value = infoData['recieverCity'];
    recieverAddress.value = infoData['recieverAddress'];

}


function saveDetails() {
    var firmName = document.getElementById('firmName').value;
    var senderAddress = document.getElementById('senderAddress').value;
    var senderPlz = document.getElementById('senderPlz').value;
    var senderCity = document.getElementById('senderCity').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;

    var recieverName = document.getElementById('recieverName').value;
    var recieverCity = document.getElementById('recieverCity').value;
    var recieverAddress = document.getElementById('recieverAddress').value;


    var obj = {
        "firmName": firmName,
        "senderAddress": senderAddress,
        "senderPlz": senderPlz,
        "senderCity": senderCity,
        "phone": phone,
        "email": email,
        "recieverName": recieverName,
        "recieverCity": recieverCity,
        "recieverAddress": recieverAddress
    }


    loadedInfoData = [obj];

    localStorage.setItem('infoData', JSON.stringify(loadedInfoData));
}