// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
function doGet(e) {
  var bookId = e.parameter.bookId;
  var query = e.parameter.query;
  if (!bookId) {
      var msg ="No Bkper Book found";
      return HtmlService.createHtmlOutput(msg);
      
  }
  
  var book = BkperApp.getBook(bookId);
  var bookName = book.getName();
  if (query.match(/account/g)) {
    var accountName = extractAccountName(query);
    var account = book.getAccount(accountName);
    var accountType = account.getType();
    var transactionDataTable = book.createTransactionsDataTable(query).build();
    var transactionDataTableReverse = transactionDataTable.slice(0).reverse();
    var balancesDataTable = book.createBalancesDataTable(query).build();
    var finalBalanceValueDate = Utilities.formatDate(new Date(), "GMT", "MM/dd/yyyy")

    if (accountType == "LIABILITY") {
      //Logger.log("liability") 
      var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
      var initialBlanceValueDate = initialBalanceArr[0]
      var initialBalanceValue = initialBalanceArr[1]
      //Logger.log("length " +transactionDataTableReverse.length)
      var html = "Initial Balance Value " + initialBlanceValueDate + " " + initialBalanceValue
      Logger.log("Initial Balance Value " + initialBlanceValueDate + " " + initialBalanceValue);
      
      Logger.log(" ");
      Logger.log(transactionDataTable[0])// header
      for (var i = 0, len = transactionDataTableReverse.length; i <= len-2; i++) {
         var item = transactionDataTableReverse[i];
         Logger.log(i +" "+ transactionDataTableReverse[i])
         //for (var j = 0, len = transactionDataTableReverse[i].length; j < len; j++) {
         //  Logger.log(transactionDataTableReverse[i][j])
         //} 
      }
      //Logger.log("Final Balance Value " +  " " + balancesDataTable[0][1])
      
      
      html = html + "<br>Final Balance Value " + book.formatDate(new Date()) +  ": " + book.formatValue(balancesDataTable[0][1])
      
      //var 
      
      } else if (accountType == "ASSET") {
      Logger.log("asset")
      var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
      var initialBlanceValueDate = initialBalanceArr[0]
      var initialBalanceValue = initialBalanceArr[1]
      var html = "Initial Balance Value " + book.formatDate(initialBlanceValueDate) + ": " + book.formatValue(initialBalanceValue)
      //Logger.log("b "+ initialBlanceValueDate + " " + initialBalanceValue)
      
      
            } else {
     //   Logger.log("This App only generates Statements of accounts for Asset or Liability accounts");
        return HtmlService.createHtmlOutput("This App only generates Statements of accounts for Asset or Liability accounts");
      }
      
      


      
  }
  else {
      return HtmlService.createHtmlOutput("Please select an account");
  }
  ;
  var account = book.getAccount(accountName);
  var accountType = account.getType();
  //var accountProperties = account.getProperties()
  return HtmlService.createHtmlOutput(html);
}




function extractAccountName(query){
  var name  = query.match(":'(.*)'");
  var tempName=name[0]  
  return tempName.replace(/^:'|'$/g, '');
}


function extractInitialBalance(book, query, accountType ,accountName){
  var transactions = book.getTransactions(query)
  
  while (transactions.hasNext()) {
        var transaction = transactions.next();
        var firstBalanceValue = transaction.getAccountBalance();
        var firstAmount =transaction.getAmount() ;
        var firstBlanceValueDate = transaction.getDate();
        
       //Logger.log("Amount: " + transaction.getAmount() + " " + transaction.getAccountBalance() + " "+ transaction.getDate() + " "+ transaction.getDescription() + "type: "+  accountType + ""+ transaction.getCreditAccountName())
        
        
  }  
     if(accountType == "LIABILITY"){
        
          if( transaction.getCreditAccountName() == accountName){
          // credit account increases
          
          var initialBalanceValue = (firstBalanceValue * 1) - (firstAmount * 1)
          } else {
          // credit account decreases
          var initialBalanceValue = (firstBalanceValue * 1) + (firstAmount * 1)
          }
        
        
        } else if (accountType == "ASSET") {
          if( transaction.getCreditAccountName() == accountName){
         // Debit account decreases
           var initialBalanceValue = (firstBalanceValue * 1) + (firstAmount * 1)
          } else {
          // debit account increases
            var initialBalanceValue = (firstBalanceValue * 1) - (firstAmount * 1)
          }
        
        
        } else {
           
        }
       
  
  
  var initialBalanceValueDate = "01/" + firstBlanceValueDate.substring(5,7)  + "/" +firstBlanceValueDate.substring(0,4);
  initialBalanceValueDate = new Date(initialBalanceValueDate)
  return [initialBalanceValueDate, initialBalanceValue] 
}

