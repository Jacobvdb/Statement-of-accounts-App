
function doGet(e) {
  var params = JSON.stringify(e);

  var bookId = e.parameter.bookId;
  var query = e.parameter.query

  var book = BkperApp.getBook(bookId)
  var bookName = book.getName()

  Logger.log(bookName)

  //return HtmlService.createHtmlOutput("Book: " + bookId +" query: " +query);
}