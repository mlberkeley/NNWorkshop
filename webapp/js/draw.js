// parameter handler

var maxLayers = 5;
var maxNodes = 5;

var layerSelector = $('#num-layers');
for(i = 1; i <= maxLayers; i++){
    var option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    layerSelector.append(option);
}
// layerSelector.val(Math.ceil(maxLayers/2));
layerSelector.val(2);
newLayerCount(layerSelector.val());
function newLayerCount(numLayers){
    // creates the selection boxes
    var layerParams = $('#layer-params');
    layerParams.empty();
    // make this into a table
    for (i = 1; i <= numLayers; i++){
        var tableRow = $('<tr></tr>');
        tableRow.append($('<td> Layer '+ i+"</td>"))
        var nodeSelector = $('<select id=layer'+i+'></select>');
        setupNodes(nodeSelector);
        tableRow.append(nodeSelector);
        layerParams.append(tableRow)
    }
}
function setupNodes(nodeSelector){
    /*
    Description:
        Sets up the node select box with the proper number of options (maxNodes)
    Args:
        nodeSelector (DOM jquery element) - the select box for the specific layer
    */
    nodeSelector.empty();
    for(j = 1; j <= maxNodes; j++){
        var option = $('<option></option>');
        option.val(j);
        option.html(j);
        nodeSelector.append(option);
    }
    // nodeSelector.val(Math.ceil(maxNodes/2));
    nodeSelector.val(2);
}

function getBlankNet(){
    /*
    Description :
        Returns an empty container. Abstraction to make future changes easier.
    */
    return new PIXI.Container();

}
function addDrawnNet(newNet){
    /*
    Description:
        Removes the old network and adds the new network.
    */
    var board = stage;
    for (var i = 0; i < board.children.length; i++) {
    	board.removeChild(board.children[i]);
    }
    board.addChild(newNet);
}
function getLayerSizes(){
    /*
    Description:
        Returns the layer sizes from the selection boxes.
    */
    var numLayers = layerSelector.val();
    var layerSizes = [];
    for(i = 1; i <= numLayers; i++){
        var curLayer = $('#layer'+i);
        layerSizes.push(parseInt(curLayer.val()));
    }
    return layerSizes;
}
function Node(){
    this.x = 0;
    this.y = 0;
    this.rad = nodeRad;
    this.getDrawing = function(){
        var nodeDrawing = new PIXI.Graphics();
        nodeDrawing.beginFill(0xFFFFFF);
        nodeDrawing.drawCircle(this.x, this.y, this.rad);
        return nodeDrawing;
    };
    this.inputCd = function(num_inputs, cur_input){
        /*
        Description:
            returns the position on the circle that the input would touch
        Args:
            num_inputs : the number of inputs that go into a node
            cur_input : the zero-based input index that we want the input pos for.
        */
        var limit = 2*Math.PI/3;
        var totalAngle = 2/15*Math.PI*num_inputs;
        if (totalAngle > limit){
            totalAngle = limit;
        }
        var division = totalAngle/(num_inputs+1);
        var centerOffSet = totalAngle/2-division*(cur_input+1);
        console.log("num_inputs",num_inputs+"\ndivsion"+ division*180/Math.PI+"\n"+ centerOffSet+division*180/Math.PI);
        return [this.x-this.rad*Math.cos(centerOffSet),this.y-this.rad*Math.sin(centerOffSet)];
        // return [this.x-this.rad, this.y]
    };
    this.outputCd = function(){

        return [this.x+this.rad, this.y];
    };
}
function drawArrow(start, end){
    /*
    returns a graphics object that has a directed graph
    */
    // arrow head setup
    var arrowSL = 10;
    var length = Math.sqrt(Math.pow(start[0]-end[0], 2) + Math.pow(start[1]-end[1],2));
    //draw and position the arrowhead
    var arrowHead = new PIXI.Graphics();
    arrowHead.lineStyle(1, 0, 1);
    arrowHead.beginFill(0x010101);
    arrowHead.moveTo(0,0);
    arrowHead.lineTo(arrowSL*Math.sin(Math.PI/3), arrowSL/2);
    arrowHead.lineTo(0, arrowSL);
    arrowHead.lineTo(1/4*arrowSL*Math.sin(Math.PI/3), arrowSL/2);
    arrowHead.lineTo(0,0);
    arrowHead.endFill();
    arrowHead.x = length - arrowSL*Math.cos(Math.PI/6);
    arrowHead.y = - arrowSL*Math.sin(Math.PI/6);

    var line = new PIXI.Graphics();
    line.lineStyle(1, 0, 1);
    line.moveTo(0, 0);
    line.lineTo(length, 0);

    line.addChild(arrowHead);
    line.x = start[0];
    line.y = start[1];
    line.rotation = Math.atan((end[1]-start[1])/(end[0]-start[0]));
    return line;
    // return arrowHead;
}
function Weight(){
    this.left = [0,0];
    this.right = [0,0];
    this.getDrawing = function(){
        return drawArrow(this.left, this.right);
    };
    this.value = 0;
}
var nodes = [], // nodes organized by layer
    weights = []; // weights organized by layer
var nodeRad = 30;
var separation = 40;
function createNetwork(){
    /*
    Description:
        Regenerates the new network based on the values selected in the layers
    */
    var newNet = getBlankNet();
    var numLayers = layerSelector.val();
    var layerSizes = getLayerSizes();


    var x = 60; // TODO make this x based on the number of layers - center the network in the viewport
    for(var layer = 0; layer < numLayers; layer++){
        var layerSize = layerSizes[layer];
        var nodeLayer = [];
        var y = displayHeight/2 - ((nodeRad+separation/2)*(layerSize-1));
        for(var nodeCt = 0; nodeCt < layerSize; nodeCt++){
            var curNode = new Node();
            curNode.x = x;
            curNode.y = y;
            newNet.addChild(curNode.getDrawing());
            nodeLayer.push(curNode);
            y += 2*nodeRad + separation; // update the y value for the next circle

        }
        x += 2*nodeRad + 2*separation;
        if (layer != 0){
            prevLayer = nodes[nodes.length-1];
            for(var nct = 0; nct < nodeLayer.length; nct++){
                var node = nodeLayer[nct];
                var n = prevLayer.length;
                console.log('n',n)
                for(var pct = 0; pct < n; pct++){
                    var prevNode = prevLayer[pct];
                    var weight = new Weight();
                    weight.right = node.inputCd(n, pct);
                    weight.left = prevNode.outputCd();
                    newNet.addChild(weight.getDrawing());
                }
            }
        }
        nodes.push(nodeLayer);
    }
    addDrawnNet(newNet);




}
var displayWidth = 800;
var displayHeight = 600;
var renderer = PIXI.autoDetectRenderer(displayWidth,displayHeight,{backgroundColor : 0xdfdfdf, antialias : true});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
/* stuff for random
// make a drawing*/
var graphics = new PIXI.Graphics();
graphics.lineStyle(1, 0, 1);
graphics.beginFill(0);
graphics.moveTo(0,0);
var length = 10;
graphics.lineTo(length,0);
graphics.lineTo(length/2,length*Math.sin(Math.PI/3));
graphics.lineTo(0,0);
graphics.endFill();
stage.addChild(graphics);

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);
    // render the container
    renderer.render(stage);
}
