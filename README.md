# Hunt-Helper
A website to help organize a scavenger hunt team.

Features:
1. User Login 
2. Group Creation
* Plotting of multiple loctions on Google Maps
* Creation of routes for members of subgroups inside group
* Semi-optimal ordering of markers in a route based on a progressive nearest-neighbor algorithm.

To install run on a *AMP stack with a file called "secret.php" in the root php folder with mysql login information. 

To test nearest-neighbor and progressive-nearest-neighbor algorithms:
1. Vist [HuskyHuntHelper](http://www.Huskyhunthelper.com)
2. Create an account 
3. When prompted join a sample group either
    * US Capitals
    * World Capitals
note: there is no password for either
4. click the Calculate Route Button in then click a starting point.
    * The distance of the route will be printed to console.log in miles. 
    * The routes will be displayed on screen flashing between the nearest-neighbor (Red) and progressive nearest-neighbor algorithms results. 
5. To get average distance and best distance for each algorithm run statsForRoute(route, cycles, useGoogle, numToGet, mileCutoff)  in the console where:
    * route: A string that is the name of the markers route. (use null for markers not in a route)
    * cycles: The integer number of cycles for the progressive nearest-neighbor algorithm to complete. 
    * useGoogle: boolean value that decides if Google walking distances should be used to calculate distances between points
    * numToGet: Integer number of points nearest to each point to find the Google walking distance for. 
    * mileCutoff: Integer distance in miles of the maximum distance that a point can be from a point and will still find a google distance for. 
    * (To explain: if useGoogle the nearest numToGet points to each point that are less than mileCutoff will have Google walking distance for their distance instead of Haversine distance.)