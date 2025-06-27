You can automate sending emails when a new row is added in Google Sheets using **Google Apps Script**. This involves writing a small piece of JavaScript code that runs within your Google Sheet.

Here's how you can set it up:

-----

## Step-by-Step Guide

### 1\. Open Google Apps Script Editor

1.  Open your Google Sheet.
2.  Go to **Extensions \> Apps Script**. This will open a new tab with the Apps Script editor.

### 2\. Write the Script

In the Apps Script editor, you'll see a `Code.gs` file (or similar). Replace any existing code with the following:

```javascript
function sendEmailOnNewRow(e) {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Check if the event is an insert row event (e.g., a row was added)
  // And ensure it's not the header row (assuming your headers are in row 1)
  if (e.changeType === 'INSERT_ROW' && e.range.getRow() > 1) {
    // Get the row number where the change occurred
    const row = e.range.getRow();

    // Get the email address from column B (index 1, as A is 0) of the new row
    // Ensure the column index is correct for your sheet (B is 2nd column)
    const emailAddress = sheet.getRange(row, 2).getValue();

    // Check if the email address is not empty
    if (emailAddress) {
      const subject = "New Row Added to Spreadsheet"; // You can customize this
      const body = `A new row has been added to the spreadsheet.
                    \nEmail Address from Column B: ${emailAddress}
                    \n\nYou can view the spreadsheet here: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`; // Customize this

      // Send the email
      MailApp.sendEmail(emailAddress, subject, body);

      // Optional: Log that an email was sent (useful for debugging)
      Logger.log(`Email sent to ${emailAddress}`);
    } else {
      Logger.log(`No email address found in column B of row ${row}. No email sent.`);
    }
  }
}
```

**Explanation of the Code:**

  * `sendEmailOnNewRow(e)`: This is the function that will be triggered when a change occurs in your spreadsheet. The `e` object contains information about the event.
  * `SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()`: Gets the currently active sheet.
  * `e.changeType === 'INSERT_ROW'`: This checks if the event that triggered the script was specifically a new row being inserted.
  * `e.range.getRow() > 1`: This ensures the script only runs for new rows *below* the header row (assuming your header is in row 1). If your header is elsewhere or you don't have one, adjust this.
  * `sheet.getRange(row, 2).getValue()`: This gets the value from **column B** (the second column, hence index `2`) of the new row. If your email column is different, change `2` to the appropriate column number (e.g., `1` for column A, `3` for column C, etc.).
  * `MailApp.sendEmail(emailAddress, subject, body)`: This is the core function that sends the email. You can customize the `subject` and `body` as needed.

-----

### 3\. Set Up the Trigger

Now, you need to tell Apps Script *when* to run this function.

1.  In the Apps Script editor, on the left sidebar, click the **Triggers** icon (it looks like a clock).
2.  Click **+ Add Trigger** in the bottom right.
3.  Configure the trigger with these settings:
      * **Choose function to run:** `sendEmailOnNewRow` (or whatever you named your function)
      * **Choose deployment which should run:** `Head`
      * **Select event source:** `From spreadsheet`
      * **Select event type:** `On change`
4.  Click **Save**.

### 4\. Authorize the Script

The first time you save the trigger, Google will ask you to authorize the script. This is because the script needs permission to send emails on your behalf and access your spreadsheet.

1.  Click **Review permissions**.
2.  Select your Google account.
3.  Click **Allow** to grant the necessary permissions.

-----

## How It Works

Once set up, whenever a new row is added to your Google Sheet, the `sendEmailOnNewRow` function will automatically run. It will then extract the email address from column B of that new row and send an email to that address with the specified subject and body.

-----

## Important Considerations

  * **Column for Email:** Double-check that **column B** is indeed where your email addresses are. If it's a different column, adjust the `sheet.getRange(row, 2)` part of the code accordingly (e.g., `sheet.getRange(row, 3)` for column C).
  * **Email Quotas:** Google Apps Script has daily quotas for sending emails. For consumer Gmail accounts, it's typically 100 emails per day. For Google Workspace accounts, it's significantly higher. Keep this in mind for large-scale operations.
  * **Error Handling:** The provided script is basic. For production use, you might want to add more robust error handling (e.g., what if the email address is invalid?).
  * **Testing:** Test your script with a few new rows to ensure it's working as expected before relying on it fully.

Let me know if you have any questions or run into issues\!