// parameter handler
var maxLayers = 5;
var maxNodes = 5;
var nodeRad = 30;
var separation = 40;

var selection = null; // the selected network element

$('.editor').hide();

// setup the layer size selection box
var layerSelector = $('#num-layers');
for(i = 2; i <= maxLayers; i++){
    var option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    layerSelector.append(option);
}
// layerSelector.val(Math.ceil(maxLayers/2));
layerSelector.val(3);
newLayerCount(layerSelector.val());




// set up the FOV
var displayWidth = 800;
var displayHeight = 600;
var renderer = PIXI.autoDetectRenderer(displayWidth,displayHeight,{backgroundColor : 0xdfdfdf, antialias : true});
$('#viewport').append(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// start animating
animate();

// draw the network
createNetwork();

function setupLayerSelector(){

    var weightSelector = $('#layer-select');
    weightSelector.empty();
    //setup the weight editor selection box
    for(i = 1; i < nodes.length; i++){
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = "Layer "+i;
        weightSelector.append(option);
    }
    weightSelector.val(1);
    updateLayer(1);
}

function updateLayer(index){
    if (index == undefined)
        index=  1;
    else
        index = parseInt(index);
    var nodeSelector = $('#node-select');
    nodeSelector.empty();
    var nodeLayer = nodes[index];
    for(i = 0; i < nodeLayer.length; i++){
        var option = $('<option></option>');
        option.val(i);
        option.html("Node "+i);
        nodeSelector.append(option);
    }
    updateWeightTable(0);
}
function valueChangerRow(object, idx){
    var option = $('<tr></tr>');
    var name = $('<td></td>');
    name.html(object.repr());
    option.append(name);
    var input = $('<input class="form-control" id="obj{0}" onchange="selectedObjects[{0}].setValue(this.value)">'.format(idx))
    option.append(input);
    return option;
}
var selectedObjects = null;
function updateWeightTable(index){
    if(index == undefined)
        return;

    var weightSelector = $('#layer-select');
    var layer = parseInt(weightSelector.val());
    var weightTable = $('#weights-table');
    weightTable.empty();
    selectedObjects = [nodes[layer][index]].concat(weights[layer-1][index]);
    for(var i = 0; i < selectedObjects.length; i++){
        weightTable.append(valueChangerRow(selectedObjects[i], i));
    }
    console.log(weightTable.html());

}
////////////////////////////////////////////////////////////////////////////////
/////////////////////           Functions for drawing       ////////////////////
////////////////////////////////////////////////////////////////////////////////
function newLayerCount(numLayers){
    // creates the selection boxes
    var layerParams = $('#layer-params');
    layerParams.empty();

    // make this into a table
    for (i = 1; i <= numLayers; i++){
        var tableRow = $('<tr></tr>');
        tableRow.append($('<td> Layer '+ i+"</td>"))
        var nodeSelector = $('<select class="form-control" id=layer'+i+'></select>');
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
// TODO literally unify references to these
function editWeight(weight){
    $('.editor').show();
    $('#reference').html("<p>${0}$</p>".format(weight.repr()));

    if (selection != null)
        selection.deselect();

    selection = weight;
    weight.select();

    $('#field-val').val(weight.value());
}
function editBias(node){
    $('.editor').show();
    $('#reference').html("<p>${0}$</p>".format(node.repr()));
    if (selection != null)
        selection.deselect();
    selection = node;
    selection.select();
    $('#field-val').val(node.value());
}
function updateWeight(){
    newVal = $('#field-val').val();
    newVal = parseFloat(newVal);
    if (!isNaN(newVal)){
        selection.setValue(newVal);
    }
    else{
        console.log('Could not update value to NaN number')
    }
    closeEditor();
}
function closeEditor(){
    $('.editor').hide();
    selection.deselect();
    selection = null;
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

function drawArrow(start, end, color){
    /*
    returns a graphics object that has a directed graph
    */
    if (color == undefined){
        color=0x000000;
    }
    var arrowSL = 10;
    var length = Math.sqrt(Math.pow(start[0]-end[0], 2) + Math.pow(start[1]-end[1],2));
    var line = new PIXI.Graphics();
    line.lineStyle(1, color, 1);
    line.moveTo(0, 0);
    line.lineTo(length, 0);
    //draw arrowHead
    line.lineStyle(1,color,1);
    line.beginFill(color);
    line.lineTo(length - arrowSL*Math.cos(Math.PI/6),  -arrowSL*Math.sin(Math.PI/6));
    line.lineTo(length- 3/4*arrowSL*Math.cos(Math.PI/6), 0);
    line.lineTo(length-arrowSL*Math.cos(Math.PI/6), arrowSL*Math.sin(Math.PI/6));
    line.lineTo(length, 0);
    line.endFill()
    // line.addChild(arrowHead);
    line.x = start[0];
    line.y = start[1];
    line.rotation = getAngle(end, start);

    return line;
    // return arrowHead;
}
function getAngle (opp, adj){
    return Math.atan((opp[1]-adj[1])/(opp[0]-adj[0]));
}
var id = 0;

function createNetwork(){
    /*
    Description:
        Regenerates the new network based on the values selected in the layers
    */
    $('#outputBox').hide();
    var newNet = getBlankNet();
    var numLayers = layerSelector.val();
    var layerSizes = getLayerSizes();
    nodes = []; weights = [];
    weightMats = [], biases = [];

    var x = 60; // TODO make this x based on the number of layers - center the network in the viewport
    for(var layer = 0; layer < numLayers; layer++){
        var layerSize = layerSizes[layer];
        var nodeLayer = [], biasLayer = [];
        var y = displayHeight/2 - ((nodeRad+separation/2)*(layerSize-1));
        for(var nodeCt = 0; nodeCt < layerSize; nodeCt++){
            var bias = guassianRandom();
            var curNode = new Node(layer, nodeCt);

            curNode.x = x;
            curNode.y = y;
            newNet.addChild(curNode.getSprite());

            curNode.setValue(bias, true);
            biasLayer.push(bias);
            nodeLayer.push(curNode);

            y += 2*nodeRad + separation; // update the y value for the next circle
        }
        x += 2*nodeRad + 2*separation; // update the x value for the next layer
        // generate the weights

        if (layer != 0){ // We don't generate weights for the first layer
            prevLayer = nodes[nodes.length-1];
            var weightLayer = []
            var layerVals = [];
            for(var pct = 0; pct < prevLayer.length; pct++){
                var prevNode = prevLayer[pct];
                var n = prevLayer.length;
                var nodeWeights = [];
                var weightVals = [];
                for(var nct = 0; nct < nodeLayer.length; nct++){
                    var node = nodeLayer[nct];
                    var weight = new Weight(prevNode, node, layer);
                    weight.right = node.inputCd(prevLayer.length, pct);
                    weight.left = prevNode.outputCd();
                    weight.setValue(guassianRandom(), true);
                    weightVals.push(weight.value());
                    nodeWeights.push(weight);
                    newNet.addChild(weight.getSprite());
                }
                weightLayer.push(nodeWeights);
                layerVals.push(weightVals);
            }
            weights.push(weightLayer);
            weightMats.push(math.matrix(layerVals));
        }
        nodes.push(nodeLayer);
        biases.push(biasLayer);
    }
    addDrawnNet(newNet);
    setupInputFields();
    setupLayerSelector();
}

function newWeightVals(weightVals){
    // run a check to make sure the sizes are correct
    assert(weightVals.length == weights.length, "Mismatched number of layers.");
    var newMats = [];
    for(var lIdx = 0; lIdx < weightVals.length; lIdx ++){
        valLayer = weightVals[lIdx];
        weightsLayer = weights[lIdx];
        assert(valLayer.length == weightsLayer.length,
            "Mismatched number of nodes ({0} vs {1} in layer {2}."
            .format(valLayer.length, weightsLayer.length, lIdx));
        for(var nIdx = 0; nIdx < weightsLayer.length; nIdx++){
            nodeWeights = weightsLayer[nIdx];
            nodeValues = valLayer[nIdx];
            assert(nodeValues.length == nodeWeights.length, "Mismatched weight sizes (vals {0}, weights {1}) idx {2}".format(nodeValues.length, nodeWeights.length, nIdx));
            for(var wIdx= 0; wIdx < nodeWeights.length; wIdx++){
                nodeWeights[wIdx].setValue(nodeValues[wIdx]);
            }
        }
        newMats.push(math.matrix(valLayer));

    }
    weightMats = newMats;
}
function getWeights(){
    var weightVals = []
    for(var lIdx = 0; lIdx < weights.length; lIdx ++){
        var layer = weights[lIdx];
        var weightLayer = [];
        for(var nIdx = 0; nIdx < layer.length; nIdx++){
            var nodeWeights =layer[nIdx];
            var weightVals = [];
            for(var wIdx= 0; wIdx < nodeWeights.length; wIdx++){
                weightVals.push(nodeWeights[wIdx]);
            }
            weightLayer.push(weightVals);
        }
        weightVals.push(math.matrix(weightLayer));
    }
    return weightVals;
}
function setupInputFields(){
    var inputs = getNetworkSizes()[0];
    var inputDiv = $('#inputs');
    inputDiv.empty();
    for(var i = 0; i < inputs; i++){
        var row = $('<tr></tr>'.format(i));
        row.html('<td>Input {0}</td><td><input class="form-control" id = "input{0}"></td>'.format(i));
        inputDiv.append(row);

    }
}
function getNetworkSizes(){
    var sizes = [];
    for(var i = 0;  i < nodes.length; i++){
        sizes.push(nodes[i].length)
    }
    return sizes;
}
function getInputs(){
    var inputs = getNetworkSizes()[0];
    var vals = []
    for(var i = 0; i < inputs; i++){
        var newVal =parseInt($('#input'+i).val());
        assert(newVal!= NaN, "Improper type of input at input{0}".format(i));
        vals.push(newVal);
    }
    return vals;
}
// var g = new Graphics();
// g.moveTo(0,300);
// g.lineStyle(1,0,1);
// g.lineTo(800,300);
// stage.addChild(g);
function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
