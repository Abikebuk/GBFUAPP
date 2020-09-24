#### Logs
* **[24/09/16] version 0.1.0 :** Pre Alpha commit.
    * Adds proxy on twitter stream.
    * Minor fixes
    * Raid update disabled 
        * Issue with duplicates due to Array.includes which doesn't works well. 
* **[20/09/16] version 0.0.1 :** First commit.
    * Twitter data fetch works.
        * But there is an issue on response which triggers Error 402 from twitter at the second request on service RaidFinder.  
        Will be fixed asap.
    * Raid update works but incomplete.
        * lacks recognition pages with multiples raids (ie : [Six Dragon Raids](https://gbf.wiki/Six-Dragon_Raids)).
        * Search query might have better alternatives? 
    * Logs 
        * Still need lot on work and maintenance on that.