Pucman.Graph = (function() {

    var state = null;
    var map = null;
    var geoData = null;
    var cyGraph = null;
    var north = null;
    var east = null;
    var south = null;
    var west = null;
    var apiUrlBase = null;
    var apiUrlData = null;

    /**
     * getGeoData - a function to get geodata by calling a http request
     * @return a json formatted result of the request
     */
    var getGeoData = function(apiUrlBase, apiUrlData) {
        var result = null;
        $.ajax({
            url: apiUrlBase + apiUrlData,
            DataType: 'json',
            async: false,
            success: function(data) {
                result = data;
            }
        });
        return result;
    };

    /**
     * forms the json input into nodes and edges so the return is a graph
     * @param geodata in json format
     * @return a cythoscape api formated graph
     */
    var createCyGraph = function(result) {
        var elements = {
            edges: [],
            nodes: []
        };
        //each node from json is to be formed as a cythoscape node, containing an id and a position.x and position.y
        for (var i = 0; i < result.elements.length; ++i) {
            if (result.elements[i].type === "node") {
                var node = result.elements[i];
                var newNode = {
                    data: {},
                    position: {}
                };
                newNode.data.id = "" + node.id;
                newNode.position.x = node.lon;
                newNode.position.y = node.lat;
                elements.nodes.push(newNode);
            } else if (result.elements[i].type === "way") {
                //each way from json is to be formed into an edge with an id, an id of the source node and an id of the target node
                var way = result.elements[i];
                var source = null;
                while (way.nodes.length > 1) {
                    source = way.nodes.shift();
                    var newWay = {
                        data: {}
                    };
                    newWay.data.id = source + " " + way.nodes[0];
                    newWay.data.source = source;
                    newWay.data.target = way.nodes[0];
                    elements.edges.push(newWay);
                }
            }
        }
        //returns a cythoscape graph. the layout is kind of standard an is necessary
        return cytoscape({
            headless: true,
            elements: elements,
            layout: {
                name: 'preset',
                positions: undefined,
                zoom: undefined,
                pan: undefined,
                fit: false,
                padding: 30,
                animate: false,
                animationDuration: 500,
                ready: undefined,
                stop: undefined
            }
        });
    };

    /**
     * forms the geo-coordiantes into pixel-coordinates
     * @param a node with geocoordinates
     * @return a node position in pixel coordinates
     */
    var convertNodeToPixel = function(node) {
        var widthConversion = state.game.width / (east - west);
        var heightConversion = state.game.height / (south - north);
        var pos = {
            x: (node.position().x - west) * widthConversion,
            y: (node.position().y - north) * heightConversion
        };
        node.position(pos);
    };

    /**
     * deletes every node that has a degree of 1 (only one connected edge)
     * deletes this edge
     * calls itself recursively with the formerly connected node
     * @param any node
     */
    var deleteDeadEnds = function(node) {
        //first delete all connected edges, second delete the node itself, third call the function with formerly connected node  
        if (node.degree() === 1) {
            var nextNode = node.neighborhood('node[id]');
            node.connectedEdges().remove();
            node.remove();
            deleteDeadEnds(nextNode);
        }
    };

    /**
     * calculates in which direction a away point is from another point
     * @param pointA is the point from which we go
     * @param pointB is the point which is away
     * @return a direction
     */
    var dirAToB = function(pointA, pointB) {
        var dir = Phaser.Point.subtract(pointB, pointA);
        var dirArrow = null;
        if (dir.y < (-1 * Math.abs(dir.x))) {
            dirArrow = Phaser.UP;
        } else if (dir.x >= Math.abs(dir.y)) {
            dirArrow = Phaser.RIGHT;
        } else if (dir.y > Math.abs(dir.x)) {
            dirArrow = Phaser.DOWN;
        } else if (dir.x <= (-1 * Math.abs(dir.y))) {
            dirArrow = Phaser.LEFT;
        }
        return dirArrow;
    };

    /**
     * 
     * removes edges on crossroads which are in the same direction like others
     * @param node the crossroad to be checked
     * @TODO nochmal nachschauen
     */
    var cleanCrossroads = function(node) {
        var neighbors = node.neighborhood('node[id]');
        var listDir = [];
        for (var i = 0, len = neighbors.length; i < len; i++) {
            var dir = dirAToB(node.position(), neighbors[i].position());
            if (listDir.indexOf(dir) === -1) {
                listDir.push(dir);
            } else {
                node.edgesWith(neighbors[i]).remove();
                deleteDeadEnds(neighbors[i]);
            }
        }
    };

    /**
     * forms all edges into a sack full of nodes
     * 
     */
    var interpolateGraph = function() {
        cyGraph.edges().forEach(function(edge) {
            //iterate over all edges, forEach one do:
            //get the source and the target, put them into a list of points
            //call the interpolate function with that list
            //put that list of nodes into the graph and delete the edge you interpolated
            var pointList = [];
            pointList.push(edge.source().position());
            pointList.push(edge.target().position());
            interpolatePointList(pointList);
            //wenn die kante interpoliert ist fuege sie in cyGraph ein
            createPath(pointList, edge);
            edge.remove();
        });
    };

    /**
     * replaces an edge(with 2 nodes) by a path with the help of a bucket full of nodes 
     * @param coodList: a list of nodes wich needs to be connected to a path with each other (each node edges to the next node)
     * @param edge: the edge to be replaced by the new path (needed for the begin and the end)
     */
    var createPath = function(coordList, edge) {
        //first an last coord comes form the edge, so it can be deleted from the coordList
        coordList.pop();
        coordList.shift();
        idSource = edge.source().id();
        idTarget = null;
        //put a new edge into the cythoscape graph fro every node you find.
        for (var i = 0; i <= coordList.length; ++i) {
            if (i < coordList.length) {
                idTarget = edge.id() + '.n' + i;
                var x = 0;
                var y = 0;
                x += coordList[i].x;
                y += coordList[i].y;
                cyGraph.add({
                    group: "nodes",
                    data: {
                        id: idTarget
                    },
                    position: {
                        x: x,
                        y: y
                    }
                });

            } else {
                idTarget = edge.target().id();
            }
            var edgeId = edge.id() + '.e' + i;
            cyGraph.add({
                group: "edges",
                data: {
                    id: edgeId,
                    source: idSource,
                    target: idTarget
                }
            });
            idSource = idTarget;
        }
    };

    /**
     * interpolates between two nodes. puts as much points between as possible so every edge edge has the same length (about 1) in the end
     * @param the two nodes of the edge to be interpolated
     */
    var interpolatePointList = function(pointList) {
        var pointListX = [];
        var pointListY = [];
        var step = 1 / spanOfPointList(pointList);
        while (pointList.length !== 0) {
            var point = pointList.shift();
            pointListX.push(point.x);
            pointListY.push(point.y);
        }
        for (i = 1; i >= 0; i -= step) {
            var pX = Phaser.Math.linearInterpolation(pointListX, i);
            var pY = Phaser.Math.linearInterpolation(pointListY, i);
            var nextPoint = new Phaser.Point(pX, pY);
            if (pointList.length === 0 || nextPoint.distance(pointList[0]) > 1.5) {
                pointList.unshift(nextPoint);
            }
        }
    };

    /**
     * calculates the distance of a path
     * @param pointList: a list of points to be calculated
     * @return span: the distance of the path
     */
    var spanOfPointList = function(pointList) {
        var span = 0;
        for (var i = 0; i < pointList.length - 1; i++) {
            span += Phaser.Point.distance(pointList[i], pointList[i + 1]);
        }
        return span;
    };

    /**
     * find biggest subgraph, remove smaller subgraphs
     */
    var findBiggestConnectedPartGraph = function() {
        var found = 0;
        var node = cyGraph.nodes().eq(Math.floor(Math.random(cyGraph.nodes().length)));
        cyGraph.nodes().forEach(function(ele) {
            //für jeden knoten, mache eine a* suche nach jedem knoten, 
            // zaehle die true und false (aStar.found = true wenn gefunden, false sonst
            // es wird eine verbindung von einem zufälligen knoten (node) zu jedem anderen knoten (ele) im graph gesucht
            //was am ende die grössere zahl ist, ist der grösste graph
            var aStar = cyGraph.elements().aStar({
                root: ele,
                goal: node
            });
            if (aStar.found) {
                ++found;
            }
        })
        var notFound = cyGraph.nodes().length - found;
        //Fall 1: die anzahl der nicht verbundnen knoten ist kleiner als die zahl der verbundnen alle nicht verbundenn werden gelöscht
        if (notFound < found) {
            //found wird erhalten, notFound wird gelöscht
            cyGraph.nodes().forEach(function(ele) {
                var aStar = cyGraph.elements().aStar({
                    root: node,
                    goal: ele
                });
                if (!aStar.found) {
                    ele.connectedEdges().remove();
                    ele.remove();
                }
            })
        } else {
            //found ist kleiner oder gleich notFound
            //notFound wird erhalten, found wird gelöscht
            cyGraph.nodes().forEach(function(ele) {
                var aStar = cyGraph.elements().aStar({
                    root: node,
                    goal: ele
                });
                if (aStar.found) {
                    ele.connectedEdges().remove();
                    ele.remove();
                }
            })
        }
    }
    
    /**
     * calculate the bounds of the graph
     */
    var calculateBounds = function(limiter) {
        if (limiter === 0) {
            limiter = 0.6;
        }
        north = map.getBounds().ne.lat;
        east = map.getBounds().ne.lon;
        south = map.getBounds().sw.lat;
        west = map.getBounds().sw.lon;
        centerY = map.getCenter().lat;
        centerX = map.getCenter().lon;
        distY = limiter * (north - south);
        distX = limiter * (east - west);
        newNorth = centerY + distY * 0.5;
        newSouth = centerY - distY * 0.5;
        newEast = centerX + distX * 0.5;
        newWest = centerX - distX * 0.5;
    };
    
    /**
     * initialisation of the graph
     */
    init = function() {
        calculateBounds(0);
        apiUrlBase = "http://overpass-api.de/api/interpreter?data=[out:json];";
        apiUrlData = "(way[\"highway\"]" +
            "[\"highway\"!=\"primary\"]" +
            "[\"highway\"!=\"footway\"]" +
            "[\"highway\"!=\"steps\"]" +
            "[\"highway\"!=\"service\"]" +
            "[\"highway\"!=\"construction\"]" +
            "[\"highway\"!=\"cycleway\"]" +
            "[\"highway\"!=\"path\"]" +
            "[\"highway\"!=\"elevator\"]" +
            "[\"area\"!=\"yes\"]" +
            "[\"building\"!=\"yes\"]" +
            "[\"highway\"!=\"bridleway\"]" +
            "[\"highway\"!=\"raceway\"]" +
            "[\"highway\"!=\"track\"]" +
            "[\"highway\"!=\"trunk\"]" +
            "[\"highway\"!=\"tertiary_link\"]" +
            "[\"highway\"!=\"secondary_link\"]" +
            "(" + newSouth + "," + newWest + "," + newNorth + "," + newEast + "););out body;>;out skel qt;";
        geoData = getGeoData(apiUrlBase, apiUrlData);
        cyGraph = createCyGraph(geoData);
        cyGraph.nodes().forEach(function(ele) {
            convertNodeToPixel(ele);
        });
        cyGraph.nodes().forEach(function(ele) {
            deleteDeadEnds(ele);
            cleanCrossroads(ele);
            if (ele.degree() === 0) {
                ele.remove();
            }
        });
        findBiggestConnectedPartGraph();
        interpolateGraph();
    };

    return {
        getGeoData: getGeoData,
        dirAToB: dirAToB,
        getGraph: function(game) {
            state = game;
            map = state.map;
            init();
            state.graphReady = true;
            return cyGraph;
        }
    };
})();
