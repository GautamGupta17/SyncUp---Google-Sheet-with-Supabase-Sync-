const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {

    const {id, name, age} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CREDENTIALS_FILE,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth, 
        spreadsheetId,
    });
    
    const getRows = await googleSheets.spreadsheets.values.get({
        auth, spreadsheetId, 
        range: "Sheet1"
    }); 

    await googleSheets.spreadsheets.values.append({ 
        auth, 
        spreadsheetId, 
        range: "Sheet1!A:B", 
        valueInputOption: "USER_ENTERED", 
        resource: {
            values: [
                [
                    id, name, age
                ]

                
            ]
        }
    });

    res.send("Successfully submitted");
});

app.listen(3000, () => console.log("Running on port 3000"));
