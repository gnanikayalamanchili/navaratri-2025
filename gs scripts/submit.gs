function doPost(e) {
  try {
    // Your bookings sheet ID (can be same or different from saree data)
    const SHEET_ID = '1I9jIRMXWDjHO0TJUQuYCIDqKXl0BrwDHV19QIUudsGQ';
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Get or create Bookings sheet
    let sheet = spreadsheet.getSheetByName('Bookings');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Bookings');
      // Add headers
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp', 'Name', 'Phone', 'Email', 'Gotram', 
        'Saree Code', 'Price', 'Day', 'Date', 'Deity'
      ]]);
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Add the new booking data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.phone,
      data.email,
      data.gotram,
      data.sareeCode,
      data.price,
      data.day,
      data.date,
      data.deity
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error', 
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}