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
      var accountType = account.getType;
      var currentCheckedBalance = account.getCheckedBalance;
      var currentUncheckedBalance =account.getBalance;

      var transactions = book.getTransactions(query)

      while (transactions.hasNext()) {
        var transaction = transactions.next();
        var arr = [];
        arr.push(transaction.getAmount)
        
       }

      return HtmlService.createHtmlOutput(arr);


      
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
  return tempName.replace(/^:'|'$/g, '');
}


