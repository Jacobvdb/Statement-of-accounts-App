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
      
      var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
      var initialBlanceValueDate = initialBalanceArr[0]
      var initialBalanceValue = initialBalanceArr[1]
      var htmlheader ="";
      var htmlrow ="";
      
      var html = "Initial Balance Value " + book.formatDate(initialBlanceValueDate) + " " + book.formatValue(initialBalanceValue)  + "<br>" ;
      var header = transactionDataTable[0]
      for (var i = 0, len = header.length; i < len-1; i++) {
           var column = header[i];
           var htmlheader = htmlheader + " " + column + " " ;
      }
      //html = html + header.length
      html = html + htmlheader +  "<br>" ;
     

      
      for (var i = 0, len = transactionDataTableReverse.length; i < len-3; i++) {
        var item = transactionDataTableReverse[i];
        //Logger.log(i +" "+ transactionDataTableReverse[i])
        
          for (var j = 0, len = transactionDataTableReverse[i].length; j < len-1; j++) {
            //Logger.log(i + " " +j +" " +transactionDataTableReverse[i][j])
            if (j== 0){
               htmlrow = htmlrow + " "+ j + " "+ book.formatDate(transactionDataTableReverse[i][j])
            } else if (j == 3 || j == 5){
              htmlrow = htmlrow + " "+ j + " "+ book.formatValue(transactionDataTableReverse[i][j])
            } else {
              htmlrow = htmlrow + " "+ j + " "+ transactionDataTableReverse[i][j]
            }
          } 
        
        html = html +  htmlrow + "<br>"
        htmlrow = "";
     }
      //Logger.log("Final Balance Value " +  " " + balancesDataTable[0][1])
      
      
      html = html + "Final Balance Value " + book.formatDate(new Date()) +  ": " + book.formatValue(balancesDataTable[0][1]) + "<br>" ;
      
      //var 
      
      } else if (accountType == "ASSET") {
      Logger.log("asset")
      var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
      var initialBlanceValueDate = initialBalanceArr[0]
      var initialBalanceValue = initialBalanceArr[1]
      var html = "Initial Balance Value " + book.formatDate(initialBlanceValueDate) + ": " + book.formatValue(initialBalanceValue) + "<br>" ;
      //Logger.log("b "+ initialBlanceValueDate + " " + initialBalanceValue)
      for (var i = 0, len = transactionDataTableReverse.length; i <= len-2; i++) {
        var item = transactionDataTableReverse[i];
        Logger.log(i +" "+ transactionDataTableReverse[i])
        html = html + i +" "+ transactionDataTableReverse[i] +"<br>"
        for (var j = 0, len = transactionDataTableReverse[i].length; j < len; j++) {
          Logger.log(transactionDataTableReverse[i][j])
        } 
     }
    


      html = html + "Final Balance Value " + book.formatDate(new Date()) +  ": " + book.formatValue(balancesDataTable[0][1]) + "<br>" ;
      
      
            } else {
     //   Logger.log("This App only generates Statements of accounts for Asset or Liability accounts");
        return HtmlService.createHtmlOutput("This App only generates Statements of accounts for Asset or Liability accounts");
      }
      
      


      
  }
  else {
      //return HtmlService.createHtmlOutput("Please select an account");
      return HtmlService
      .createTemplateFromFile('Dialog')
      .evaluate();
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
  var initialBalanceValueDate = new Date(firstBlanceValueDate.substring(0,4),firstBlanceValueDate.substring(5,7) , "01")
  return [initialBalanceValueDate, initialBalanceValue] 
}

