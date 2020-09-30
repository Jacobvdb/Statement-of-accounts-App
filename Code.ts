
function doGet(e) {
  

  var bookId = e.parameter.bookId;
  var query = e.parameter.query
  
  if (!bookId){return HtmlService.createHtmlOutput("No Bkper Book found")};


  var book = BkperApp.getBook(bookId)
  var bookName = book.getName()

  if (query.match(/account/g)) {
  
    // get this accounts properties
    var tmp  = query.match(':"(.*)"');
    var accountName = tmp[1];

  } else { return HtmlService.createHtmlOutput("Please select an account")}  
      
    var account = book.getAccount(accountName)
    var accountType = account.getType();

    var accountProperties = account.getProperties()
  

  return HtmlService.createHtmlOutput(bookName + " " + accountName + " " + accountType);
}


