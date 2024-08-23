

function onSelectionChange(e) {

    var range = e.range;
    var spreadSheet = e.source;
    var sheetName = spreadSheet.getActiveSheet().getName();
    var column = range.getColumn();
    var row = range.getRow();
    var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByMame(sheetName);

    if (row > 1 && column > 1){
        if(dataSheet.getRange(row, column).getValue() != null ){
            // create in database api call 
        }
        else {
            dataSheet.getRange(row, column).setValue(
                // fetch from database and put into here
            );
        }
    }
}

function addMenu()
{
    var menu = SpreadsheetApp.getUi().createMenu('Custom');
    menu.addItem('Copy Rows'm 'copy rows');
    menu.addToUi();
}

function onOpen(e)
{
    addMenu();
}