# Granblue Fantasy Utility App (GBFUAPP)
####...........................................................................................................Server side
**Version :** ``0.0.1``

###Description
Server side of the GBFUAPP.

###Features
* **Raid Finder :**
    * Raids are fetched on a Twitter stream.
        * Works with both versions 1.1 and 2.0 of Twitter API. Uses Twitter-Lite for v1.1 and Axios for v2.0.  
        *Unfortunately version 2.0 is limited to 500,000 fetched tweet a month and is capped in a few hours.*
    * No SQL database.
        * There is not enough data to keep to justify the use of SQL Database. 
        * The only data present are the raids data which are stocked in data.json.
    * Automatic raids updates (in progress) with Cheerio and Puppeteer.
        * Raids data are updated automatically (if possible) every time a new one is found on the Twitter stream.
        * Raids data are gathered on gbf.wiki.
        
        
###How to use
* First check ``config.json`` then replace **front_hostname** with the hostname of your front.  
* Next replace every token with your own Twitter App tokens.
*Then run :
    ```
    npm run
    ```

###Configure 
You can change parameters of GBFUAPP by editing ``config.json``.