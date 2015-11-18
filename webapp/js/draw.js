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
layerSelector.val(Math.ceil(maxLayers/2));
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
    nodeSelector.val(Math.ceil(maxNodes/2));
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
    this.inputCd = function(){
        return [this.x-this.rad,this.y];
    };
    this.outputCd = function(){
        right = this.inputCd();
        return [right[0]+this.rad*2, right[1]];
    };
}
function drawArrow(start, end){
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, .1, 1);
    graphics.moveTo(start[0], start[1]);
    graphics.lineTo(end[0], end[1]);
    return graphics;
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


    var x = 60;
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
                for(var pct = 0; pct < prevLayer.length; pct++){
                    var prevNode = prevLayer[pct];
                    var weight = new Weight();
                    weight.right = node.inputCd();
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
var renderer = PIXI.autoDetectRenderer(displayWidth,displayHeight,{backgroundColor : 0xdfdfdf});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
/* stuff for random
// make a drawing*/
var graphics = new PIXI.Graphics();
graphics.lineStyle(1, 0, 1);
graphics.moveTo(0,300);
graphics.lineTo(800, 300);
stage.addChild(graphics);
/*
graphics.beginFill(0xFF3300);
graphics.moveTo(50,50);
graphics.lineTo(250, 50);
graphics.lineTo(100, 100);
graphics.lineTo(250, 220);
graphics.lineTo(50, 220);
graphics.lineTo(50, 50);
graphics.endFill();
var texture = graphics.generateTexture();
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);
*/
// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    // bunny.rotation += 0.01;

    // render the container
    renderer.render(stage);
}
