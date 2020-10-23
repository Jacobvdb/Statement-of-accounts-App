// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
// reference for this solution
// https://stackoverflow.com/questions/30033459/how-to-pass-a-parameter-to-html/38314034#38314034
function doGet(e) {
  var bookId = e.parameter.bookId;
  var query = e.parameter.query;
  var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
  htmlTemplate.dataFromServerTemplate = { bookid: bookId, query: query };
  var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Generate Statement of Account');
  return htmlOutput;
}


function getStatementDataGS(bookId, query, accountName){
  var book = BkperApp.getBook(bookId);
  var account = book.getAccount(accountName);
  var accountType = account.getType();
  var error= ""; 
     
  var transactionDataTable = book.createTransactionsDataTable(query).build();
  var transactionDataTableReverse = transactionDataTable.slice(0).reverse();
  var balancesDataTable = book.createBalancesDataTable(query).build();
  
  var initialBalanceArr = extractInitialBalance(book, query,accountType ,accountName)
  var initialBalanceValue = initialBalanceArr[0]
  initialBalanceArr[1].setMonth(initialBalanceArr[1].getMonth() - 1);
  var initialBalanceValueDate = book.formatDate(initialBalanceArr[1])
 
  
   var finalBalanceValueDate = new Date();
   var finalBalanceValueDate = book.formatDate(finalBalanceValueDate) 
   var finalBalanceValue = balancesDataTable[0][1]
           
   // table header   
   var header = transactionDataTable[0]
   var headerArr = [];
   for (var k = 0; k < header.length; k++) {
    var column = header[k];
    headerArr.push(column) ;
}  
 
  
  Logger.log(accountType + " number of rows:" + transactionDataTableReverse.length)
  // transactions table
  var transactionsArr = new Array;
  for (var i = 0  ; i < transactionDataTableReverse.length-1; i++) {
         transactionsArr.push( [] );
         for (var j = 0; j < transactionDataTableReverse[i].length; j++) {
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
      
  if (accountType == "LIABILITY") {
  
  } else if (accountType == "ASSET"  ) {
  
    
  } else {
     var error = "This is an " + accountType +  ", please choose one Asset or Liability account, to create a Statments of account."     
  
  }
  
  
  // logo for pdf files
  var logoUrl = book.getProperty("statement_logo")
  var blob = UrlFetchApp.fetch(logoUrl).getBlob();
  var b64 = blob.getContentType() + ';base64,'+ Utilities.base64Encode(blob.getBytes()); 
  
  return [error, bookId, query, accountName, initialBalanceValue, initialBalanceValueDate, finalBalanceValue,finalBalanceValueDate, balancesDataTable, headerArr, transactionsArr, book.getProperties(), account.getProperties(), b64]
}
  
 


function extractInitialBalance(book, query, accountType ,accountName){
  var transactions = book.getTransactions(query)
  
  while (transactions.hasNext()) {
        var transaction = transactions.next();
        var firstBalanceValue = transaction.getAccountBalance();
        var firstAmount =transaction.getAmount() ;
        var firstBlanceValueDate = transaction.getDate();        
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
        } 
      
  var month = firstBlanceValueDate.substring(5,7)
  var initialBalanceValueDate = new Date(firstBlanceValueDate.substring(0,4),firstBlanceValueDate.substring(5,7) , "01")
  return [initialBalanceValue, initialBalanceValueDate ] 
}

// reference for this solution
// https://stackoverflow.com/questions/49244622/show-images-inside-a-pdf-created-with-gloogle-apps-script-blob
function generatePDF(html){
  var blob = Utilities.newBlob(html, "text/html", "text.html");
  var pdfblob = blob.getAs("application/pdf"); 
  return  pdfblob.getBytes();
  
}