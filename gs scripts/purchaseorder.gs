function doGet() {
  try {
    // Your saree data sheet ID
    const SHEET_ID = '1nPRhKGnxkfb3O_jOZttuilmNqlGUuA5fZ7UnpQanSw8';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    const headers = data[0]; // First row contains headers
    const rows = data.slice(1); // All other rows contain saree data
    
    // Convert to object format
    const sarees = {};
    
    rows.forEach(row => {
      const sareeCode = row[0]; // Saree Code column
      if (sareeCode) {
        sarees[sareeCode] = {
          price: row[1], // Price column
          day: row[2],   // Day column
          date: row[3],  // Date column
          deity: row[4]  // Deity column
        };
      }
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        sarees: sarees
      }))
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
