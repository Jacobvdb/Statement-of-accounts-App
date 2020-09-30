// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
function doGet(e) {
  var bookId = e.parameter.bookId;
  var query = e.parameter.query;
  if (!bookId) {
      return HtmlService.createHtmlOutput("No Bkper Book found");
  }
  ;
  var book = BkperApp.getBook(bookId);
  var bookName = book.getName();
  if (query.match(/account/g)) {
      // get this accounts properties
      var accountName = extractAccountName(query);
      var account = book.getAccount(accountName);
      return HtmlService.createHtmlOutput(account.getBalance);
      //var accountName = tmp[1];
  }
  else {
      return HtmlService.createHtmlOutput("Please select an account");
  }
  ;
  var account = book.getAccount(accountName);
  var accountType = account.getType();
  //var accountProperties = account.getProperties()
  return HtmlService.createHtmlOutput(bookName + " " + accountName + " " + accountType);
}



function extractAccountName(query){

var name  = query.match(":'(.*)'");
var tempName=name[0]  
return tempName.replace(/^:'|'$/g, '')
  
  //var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAwLfM_aMKDA")
  //Logger.log(book.getName())
  //var account = book.getAccount(accountName.replace(/^:'|'$/g, ''))
  //Logger.log(account.getCheckedBalance())
}


