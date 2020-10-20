// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
// reference for this solution
// https://stackoverflow.com/questions/30033459/how-to-pass-a-parameter-to-html/38314034#38314034
function doGet(e) {
  var bookId = e.parameter.bookId;
  var query = e.parameter.query;
  var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
  htmlTemplate.dataFromServerTemplate = { bookid: bookId, query: query };
  var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Test Statement of Account');
  return htmlOutput;
}


function getStatementDataGS(bookId, query, accountName){
var book = BkperApp.getBook(bookId);
var account = book.getAccount(accountName);
var accountType = account.getType();
var error= "";

Logger.log("ok 1")
  
var transactionDataTable = book.createTransactionsDataTable(query).build();
var transactionDataTableReverse = transactionDataTable.slice(0).reverse();
var balancesDataTable = book.createBalancesDataTable(query).build();

var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
var initialBalanceValue = initialBalanceArr[0]
var initialBalanceValueDate = book.formatDate(initialBalanceArr[1])

 var finalBalanceValueDate = new Date();
 var finalBalanceValueDate = book.formatDate(finalBalanceValueDate) 
 var finalBalanceValue = balancesDataTable[0][1]
    //Logger.log("Final Balance Value " +  
 Logger.log( "aqui") 
 
 // table header   
 var header = transactionDataTable[0]
 var headerArr = [];
 for (var i = 0, len = header.length; i <= len-1; i++) {
      var column = header[i];
      headerArr.push(column) ;
 }   

// transactions
var transactionsArr = new Array;
for (var i = 0, len = transactionDataTableReverse.length; i <= len-4; i++) {
       transactionsArr.push( [] );
       for (var j = 0, len = transactionDataTableReverse[i].length; j < len-1; j++) {
       if (j== 0){
             var postDate = book.formatDate(transactionDataTableReverse[i][j])
            transactionsArr[i].push(postDate)
          } else if (j == 3 || j == 5){
            transactionsArr[i].push( book.formatValue(transactionDataTableReverse[i][j]))
          } else {
            transactionsArr[i].push(transactionDataTableReverse[i][j])
          }
        
       } 
             }
    
Logger.log("arr " + transactionsArr)
if (accountType == "LIABILITY") {

} else if (accountType == "ASSET"  ) {

  
} else {
   var error = "This is an " + accountType +  ", please choose one Asset or Liability account, to create a Statments of account."     

}

return [error, bookId, query, accountName, initialBalanceValue, initialBalanceValueDate, finalBalanceValue,finalBalanceValueDate, balancesDataTable, headerArr, transactionsArr]
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
     


// initialBalanceValueDate = "01/" + firstBlanceValueDate.substring(5,7)  + "/" +firstBlanceValueDate.substring(0,4);
var initialBalanceValueDate = new Date(firstBlanceValueDate.substring(0,4),firstBlanceValueDate.substring(5,7) , "01")
Logger.log( "bla bla " + initialBalanceValueDate)
return [initialBalanceValue, initialBalanceValueDate ] 
}