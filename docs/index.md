Overview
========
The Observatory is a web application whose sole aim is to visualize/communicate the __Solution Architecture Overview__ model, currently implemented in __IBM RSA__.
 
The Observatory is entirely based on JavaScript, HTML and CSS. Consequently, maintaining the Observatory (as well as understanding the documentation) requires you to be familiar with 'modern web development' along with its frameworks. The _client side_ of Observatory utilizes:
* __jQuery__ (v1.10.2) for interaction
* __Bootstrap__ (v3.0.0) for templating
* __D3.js__ (v3.2.6) for visualization (the Observatory uses svg).
* __typeahead__ (v0.9.3) for incremental searching/filtering systems (the search bar)
 
The _server side_ is composed of:
* nginx (1.5.1) - a static web server
* node.js, in order to
    * break down the SAO RSA model into JSON
    * Provide a REST interface for said JSON
 
####File structure (client)
* /css - contains styling along with themes
* /img - images from Bootstrap...
* /js
    * /*.js - the 'Observatory bulk'
    * /lib - bootstrap, d3, jquery and typeahead (using hogan)
* /json - the actual SAO RSA model as a JSON object.
Everything client is kept together by index.html, which provides used docs and interface.
 
## Application Flow
Here's a basic use-case. The indented bullets represent stuff the Observatory does.
1. A user GETs http://observatory.sebank.se
    * nginx serves index.html to the client.
    * The client web browser parses index.html and GETs dependencies (listed in __File structure (client)__ above.
    * The client parses nodes\_and\_links.json and puts it in the global __ALL__ object.
2. User types 'Panag'
    * typeahead suggests the system 'Panagon'
3. User selects Panagon by pressing arrowdown, followed by return
    * index.html gets the Panagon object from __ALL__ and passes it to __Net__.
    * __Net__ adds Panagon as first node to its internal object of visualized nodes.
    * __Net__ calls the global __update()__ function (residing in _draw.js_) which initializes a D3-driven barnes-hut network, draws the node Panagon and starts the network simulation (in effect visualizing the node Panagon).
4. The user right-clicks Panagon
    * A D3-driven radial menu is populated all the nodes that integrate with Panagon (_draw.js_, nodes obtained via the __ALL__ object). Each menu choice is set to call a callback (dependency injection) to add that specific node to the visualization. The menu is then displayed (_sunburst.js_). 
5. The user selects one of the nodes
    * The callback is invoked, in effect passing the selected node to __Net's add-function__.
    * Net adds the node, along with any links (i.e. integrations) to nodes already in __Net__.
6. The visualization now contains two nodes, which the user can drag around.
 
###ALL.js <small>revealing module pattern</small>
Contains functions for obtaining one or multiple nodes or links from the underlying JSON object nodes\_and\_links.json.
 
###Compartments.js <small>revealing module pattern</small>
Is a set of helper functions for transforming the RSA compartment names to user-friendly names.
 
###draw.js <small>main event loop</small>
Initializes the application environment, maps compartment names to colors, sets up static svg structures (menu icons, gradients), radial menus, does the actual drawing of nodes and links, updates bookmarklets, and performs the barnes-hut simulation.
 
###Net.js <small>revealing module pattern</small>
Is a set of helper functions for calculating angles for labels, along with creating bookmarklets.
 
###sunburst.js <small>really just a fast menu hack</small>
Is a stand-alone unpublished D3 plugin for creating radial menus loaded with callbacks. (I spent menu hours tweaking this file...)