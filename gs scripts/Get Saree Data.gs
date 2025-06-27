function doGet() {
  try {
    // Your saree data sheet ID
    const SAREE_SHEET_ID = '1nPRhKGnxkfb3O_jOZttuilmNqlGUuA5fZ7UnpQanSw8';
    const BOOKING_SHEET_ID = '1I9jIRMXWDjHO0TJUQuYCIDqKXl0BrwDHV19QIUudsGQ';
    
    // Get saree data
    const sareeSheet = SpreadsheetApp.openById(SAREE_SHEET_ID).getActiveSheet();
    const sareeData = sareeSheet.getDataRange().getValues();
    const sareeHeaders = sareeData[0]; // First row contains headers
    const sareeRows = sareeData.slice(1); // All other rows contain saree data
    
    // Convert to object format
    const sarees = {};
    
    sareeRows.forEach(row => {
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
    
    // Get booked sarees
    const bookedSarees = getBookedSareeCodes(BOOKING_SHEET_ID);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        sarees: sarees,
        bookedSarees: bookedSarees
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

// Helper function to get all booked saree codes
function getBookedSareeCodes(sheetId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Bookings');
    
    if (!sheet) {
      return []; // No bookings sheet exists yet
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return []; // Only headers or empty sheet
    }
    
    // Extract saree codes from column 6 (index 5)
    const bookedCodes = data.slice(1)
      .map(row => row[5]) // Saree Code column
      .filter(code => code && code.toString().trim() !== ''); // Remove empty values
    
    return bookedCodes;
    
  } catch (error) {
    console.error('Error getting booked saree codes:', error);
    return [];
  }
}

// Helper function to check if a specific saree is already booked
function isSareeAlreadyBooked(sheetId, sareeCode) {
  try {
    const bookedCodes = getBookedSareeCodes(sheetId);
    return bookedCodes.includes(sareeCode);
  } catch (error) {
    console.error('Error checking if saree is booked:', error);
    return false; // If there's an error, allow the booking to proceed
  }
}