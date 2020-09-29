
function doGet(e) {
  var params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
}