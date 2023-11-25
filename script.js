
var loadedData = []
var loadedInfoData = JSON.parse(localStorage.getItem('infoData')) || [];
document.addEventListener('DOMContentLoaded', function() {
    loadData();
}, false);

function loadData() {
    loadedData = JSON.parse(localStorage.getItem('myData')) || [];
    var table = document.getElementById("table");
    var newRow
    for (let i = 0; i < loadedData.length; i++) {
        newRow = table.insertRow(-1);
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var deleteCell = newRow.insertCell(2);

        cell1.innerHTML = loadedData[i]["description"];
        cell2.innerHTML = loadedData[i]["amount"];
        deleteCell.innerHTML = '<button class="deleteButton" onclick="deleteRow(this)">X</button>';
        deleteCell.className = 'no-border';
    }
    console.log(loadedData);
    console.log(loadedInfoData);
}


// Schließen des Modals
function schließeModal() {
    document.getElementById("meinModal").style.display = "none";
}

// Schließen des Modals, wenn außerhalb geklickt wird
window.onclick = function(event) {
    var modal = document.getElementById("meinModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function deleteAll() {
    // Löscht einen spezifischen Eintrag
    localStorage.removeItem('myData');

    // Löscht alle Einträge in localStorage
    // localStorage.clear();

    // TODO: Tabelle neu laden
    location.reload();
}

function addRow(description, amount) {
    var table = document.getElementById("table");
    var newRow = table.insertRow(-1);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var deleteCell = newRow.insertCell(2);

    cell1.innerHTML = description;
    cell2.innerHTML = amount;
    deleteCell.innerHTML = '<button class="deleteButton" onclick="deleteRow(this)">X</button>';
    deleteCell.className = 'no-border';
    cell2.style = "max"
}


function addNewRow() {
    var description = document.getElementById("description").value;
    var amount = Math.round(parseFloat(document.getElementById("amount").value)*100)/100;
    if (amount < 0 || isNaN(amount)) {
        window.alert('Gebe eine Zahl >= 0 ein!');
        return;
    }
    if (description.length === 0) {
        window.alert('Bitte gebe was in der Beschreibung ein!');
        return;
    }
    addRow(description, amount.toLocaleString('de-DE')+'€');

    // Felder zurücksetzen
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    loadedData.push({"description": description, "amount": amount.toLocaleString('de-DE')+'€'});
    localStorage.setItem('myData', JSON.stringify(loadedData));
}

function anpassenFeld() {
    var field = document.getElementById("description");
    field.style.height = "auto";
    field.style.height = (field.scrollHeight) + "px";
}


function erstelleRechnung(daten) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    var infoData = getInfo();

    // Kopfzeile
    // Oben Links
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(`${infoData['firmName']}`, 15, 20);
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text("Ihr Servicepartner für XYZ", 15, 30)

    // 2. Kasten Links
    doc.setFontSize(12);
    doc.text(`${infoData['firmName']} - ${infoData['senderAddress']} - ${infoData['senderPlz']} ${infoData['senderCity']}`, 15, 45);
    const textWidth = doc.getTextWidth(`${infoData['firmName']} - ${infoData['senderAddress']} - ${infoData['senderPlz']} ${infoData['senderCity']}`);
    doc.line(15, 46, 15 + textWidth, 46)

    // Kundeninformationen
    doc.text(`${infoData['recieverName']}\n${infoData['recieverAddress']}\n${infoData['recieverCity']}`, 15, 55);

    // Oben Rechts
    doc.text(`${infoData['firmName']}\n${infoData['senderAddress']}\n${infoData['senderPlz']} ${infoData['senderCity']}\n\nTelefon: ${infoData['phone']}\n\nE-Mail: ${infoData['email']}`, 195, 30, "right");

    doc.setFont(undefined, 'bold');
    doc.setFontSize(20);
    doc.text("Rechnung", 15, 85);
    doc.setFontSize(10);
    doc.text("Rechnung Nr. 1234", 15, 93);
    doc.text("Kunde Nr. 1001", 85, 93);
    doc.text("Datum: 24.11.2023", 160, 93);

    // Rechnungsdetails
    //doc.text("Rechnung Nr. 1234\nKunde Nr. 1001\nDatum: 24.11.2023", 14, 50);

    // Einleitungstext
    //doc.text("Einleitungstext (optional)", 14, 60);

    // Tabelle
    doc.autoTable({
        columnWidth: 'wrap',
        columnStyles: {
            0: {cellWidth: 10},
            1: {cellWidth: 'auto'},
            2: {cellWidth: 30},
            3: {cellWidth: 20},
            4: {cellWidth: 30},

        },
        bodyStyles: {
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
        },
        theme: 'grid',
        headStyles: {theme: 'grid', fontWeight: "bold", fillColor : [200, 200, 200], lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0]},
        startY: 100,
        head: [['Pos', 'Beschreibung', 'Einzelpreis', 'Anzahl', 'Gesamtpreis']],
        body: daten,
        margin: { top: 10 },
        didDrawPage: function (data) {
            // Fügt Kopf- und Fußzeile auf jeder neuen Seite hinzu
            if (data.pageCount > 1) {
                doc.setPage(data.pageCount);
                kopfzeile();
                fusszeile();
            }
        },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            overflowColumns: 'linebreak'
        }
    });

    // Fußzeile
    doc.setFontSize(10);
    doc.text("Fußzeilentext, z.B. weitere Informationen", 14, doc.internal.pageSize.height - 10);

    // Speichern des PDFs
    doc.save('Rechnung.pdf');
}

function download() {
    data = []
    for (let i = 0; i < loadedData.length; i++) {
        data.push([i+1, loadedData[i]['description'], loadedData[i]['amount'], 1, loadedData[i]['amount']])
    }
    
    erstelleRechnung(data);
}

function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    var rowIndex = row.rowIndex - 1; // da `insertRow(-1)` verwendet wurde
    loadedData.splice(rowIndex, 1); // Entfernt den Eintrag aus dem Array
    localStorage.setItem('myData', JSON.stringify(loadedData)); // Aktualisiert localStorage
    row.parentNode.removeChild(row); // Entfernt die Zeile aus der Tabelle
}

function getInfo() {
    var loadedInfoData = JSON.parse(localStorage.getItem('infoData')) || [
        {
            'frimName': 'Musterfirma Müller',
            'senderAddress': 'Ringstraße 12',
            'senderPlz': '12345',
            'senderCitry': 'Testdorf',
            'phone': '0234 / 500 60 10',
            'email': 'indo@muellertest.de',
            'recieverName': 'Max Mustermann',
            'recieverAddress': 'Musterstr: 12',
            'recieverCity': 'Musterhause'
        }
    ];

    infoData = loadedInfoData[0];
    return infoData;
}