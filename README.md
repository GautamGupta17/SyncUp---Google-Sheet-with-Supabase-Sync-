# SyncUp---Google-Sheet+PostgreSQL
Two way sync implementation between PostgreSQL (Supabase) and Google Sheets

### Title
Real-time Data Sync between Google Sheets and Supabase

### Objective
Building a solution that enables real-time synchronization of data between a Google Sheet and a specified database (e.g., MySQL, PostgreSQL). The solution should detect changes in the Google Sheet and update the database accordingly, and vice versa.

### Problem Statement

Many businesses use Google Sheets for collaborative data management and databases for more robust and scalable data storage. However, keeping the data synchronised between Google Sheets and databases is often a manual and error-prone process. The task was to develop a solution that automates this synchronisation, ensuring that changes in one are reflected in the other in real-time.

### Features:
1. Real-time Synchronisation
  - Implement a system that detects changes in Google Sheets and updates the database accordingly.
   - Similarly, detect changes in the database and update the Google Sheet.
2.	CRUD Operations
   - Ensure the system supports Create, Read, Update, and Delete operations for both Google Sheets and the database.
   - Maintain data consistency across both platforms.
   
3. Conflict Handling
- Develop a strategy to handle conflicts that may arise when changes are made simultaneously in both Google Sheets and the database.
- Provide options for conflict resolution (e.g., last write wins, user-defined rules).
    
4. Scalability: 	
- Ensure the solution can handle large datasets and high-frequency updates without performance degradation.
- Optimize for scalability and efficiency.

### My Approach
- After I read the problem statement, my first thought was to initially synchronize both the dataabase and the sheet, giving the user the choice to pick their preference.
- Next, I wanted the changes in the database to reflect in the Google Sheet. My first attempt with MySQL proved unsuccessful as there was no native way to notify a service outside of MySQL when a CRUD operation had happened on a table.
- I initally had tried to make a timestamp based approach. When a CRUD operation occured on a table, there would be a new table called table_name_timestamps, which would record both the old and new changes, however this approach would not work out for a few reasons.

  - I had to create a new table with essentially the same values again, which would be costly in the long run.
  - Deleted values and newly created values would have a lot of columns with nothing in them.
  - And the previous problem remained where I had to continuosuly keep querying the last_modified column for changes and adding those to Google Sheets.

- All of these problems were solved once I made the decision to move to PostgreSQL. PostgreSQL has a feature called LISTEN/NOTIFY which allows you to listen to a channel and notify a service when a CRUD operation has happened on a table.
- I then created a trigger function that would notify a channel when a CRUD operation had happened on a table.
- A python service would continously poll for just this notification, and once it recieved it, it would just update the Google Sheet with the new changes.
- By far the biggest blocker was the MySQL issue, which was solved by moving to PostgreSQL.
- Next comes the second part of the problem, which would be updating the changes in the Google Sheet to the database. This is obviously harder, since Google Sheets can be edited in a number of ways, and I would have to keep track of all of them.
- My first hurdle was figuring out a way for Google Sheets to notify a service when a CRUD operation had happened on a sheet. I found out that Google Sheets has a feature called Google Apps Script, which allows you to write scripts that can be run on Google Sheets.
- I had setup a script to run on my Google Sheet,such that whenever a change occured, it would send a POST request to a service I had setup on my local machine.
- However, after a few hours of debugging, I found out that my router does not support port forwarding, and that the trigger I had setup on my Google Apps script would not work.
- I realised that continously polling the Google Sheet for changes would be an expensive approach, and decided to not implement that method into my project.
- In the end, due to time constraints, I decided to just keep a last edited timestamp on the sheet itself, and have my polling script perdiocally check for changes in that timestamp.
- I locally stored the last edited timestamp to make sure that I would not have the script run always.
- Since I had already made a script that copys the existing data from Google Sheets into the database, I decided to just run that script whenever I wanted to update the database with the Google Sheet.
- I have solved a few edge cases, an example being when the Google Sheet has completely empty rows, they get skipped instead of directing being added into the database, causing an error.