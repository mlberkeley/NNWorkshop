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
function displayLabels(){
    return true;
}
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
    input.val(object.value());
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
function getInputDom(){
    var inputs = [];
    for(var ipCt = 0; ipCt < getNetworkSizes()[0]; ipCt++){
        inputs.push($('#input'+ipCt));
    }
    return inputs;
}
function editObject(object){
    $('.editor').show();
    if (selection != null)
        selection.deselect();


    $('#reference').html("<p>${0}$</p>".format(object.repr()));
    selection = object;
    selection.select();
    var fieldVal = $('#field-val');
    fieldVal.val(object.value());
    fieldVal.focus();
    fieldVal.select();
    fieldVal.off();
    fieldVal.on({
        keyup: function(event){
            if(event.keyCode == 13){
                updateValue();
            }
        }
    });
}
function updateValue(){
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
function andGateNetwork(){
    var parameters = ['[{"mathjs":"DenseMatrix","data":[["1","1"]],"size":[1,2]}]', '[["-1"]]'];
    generateNetwork([2,1], parameters[0], parameters[1])
}
function isPerceptron(){
    /*
    Description:
        Returns whether the network is a perceptron or not.
    */
    if (parseInt($('#network-type').val()) == 0)
        return true;
    else
        return false;
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

function createNetwork()
{
    $('#outputBox').hide();
    var layerSizes = getLayerSizes();
    generateNetwork(layerSizes);
}
function paramsAligned(layerSizes, newWeights, newBiases){
    /*
    Description: Checks whether the layerSizes match up with the sizes within newWeights and
    newBiases. Errors if the params are not aligned.

    Returns:
        Nothing if there is an error
        true if there is no error

    */
    if(newBiases.length != newWeights.length){
        console.log("Layers are not aligned in the input parameters.");
        return false;
    }
    if(newBiases.length != layerSizes.length-1){
        console.log("Expected {0} bias layers but got {1}".format(layerSizes.length-1, newBiases.length));
        return false;
    }
    for(var layerCt = 1; layerCt < layerSizes.length; layerCt++){
        var curBiases = newBiases[layerCt-1];
        var curWeights = newWeights[layerCt-1];
        var weightsLen = curWeights.length;

        if (weightsLen == undefined){
            if(curWeights._data != undefined){
            curWeights = curWeights._data;
            }
            else{
                curWeights = curWeights.data;
            }
            weightsLen = curWeights.length;
        }

        if(curBiases.length != weightsLen){
            console.log("Bias and weight layers are not aligned{0} vs {1}".format(curBiases.length, weightsLen));
            return false;
        }
        if(curBiases.length != layerSizes[layerCt]){
            console.log("Expected bias sizes {0}. Got {1}".format(layerSizes[layerCt], curBiases.length));
            return false;
        }
        for(var nodeCt = 0; nodeCt < layerSizes[layerCt]; nodeCt++){
            if(curWeights[nodeCt].length != layerSizes[layerCt-1]){
                console.log("Expected {0} weights, got {1}".format(curWeights[nodeCt].length, layerSizes[layerCt-1]));
                return false;
            }
        }
    }
    return true;
}
function getNetworkJSON(){
    var weightJson = JSON.stringify(weightMats);
    var biasJson = JSON.stringify(biases);
    return [weightJson, biasJson];
}
function saveNetwork(){

}
function generateNetwork(layerSizes, newWeights, newBiases){
    /*
    Description:
        Regenerates the new network based on the values in layer parameters
    */
    $('.editor').hide();
    var createVals = true;
    if(newWeights != undefined && newBiases !=- undefined){
        if (typeof newWeights == 'string'){
            newWeights= JSON.parse(newWeights);
        }
        if (typeof newBiases == 'string'){
            newBiases = JSON.parse(newBiases);
        }
        if(paramsAligned(layerSizes, newWeights, newBiases)){
            createVals = false;
            console.log(createVals);

        }
    }
    $('#outputBox').hide();
    var newNet = getBlankNet();
    var numLayers = layerSizes.length;
    nodes = [], weights = [];
    var x = 60; // TODO make this x based on the number of layers - center the network in the viewport
    weightMats = [], biases = [];
    var minY = displayHeight;
    var x_vals = [];
    for(var layer = 0; layer < numLayers; layer++){
        var layerSize = layerSizes[layer];
        var nodeLayer = [], biasLayer = []; // the layers for this current iteration
        // set the height in the display
        var y = displayHeight/2 - ((nodeRad+separation/2)*(layerSize-1));
        minY = Math.min(y, minY);
        for(var nodeCt = 0; nodeCt < layerSize; nodeCt++){
            var curNode = new Node(layer, nodeCt);
            curNode.x = x;
            curNode.y = y;
            newNet.addChild(curNode.getSprite());
            nodeLayer.push(curNode);
            if(layer != 0){
                if(createVals) {
                    var bias = guassianRandom();
                }
                else {
                    var bias = newBiases[layer-1][nodeCt];
                }
                biasLayer.push(bias);
                curNode.setValue(bias, true);
            }
            y += 2*nodeRad + separation; // update the y value for the next circle
        }
        x += 2*nodeRad + 2*separation; // update the x value for the next layer

        //////////////////////////////////////////////////
        ///////////// generate the weights ///////////////
        //////////////////////////////////////////////////
        if (layer != 0){ // We don't generate weights for the first layer
            prevLayer = nodes[nodes.length-1];
            var weightLayer = []
            var layerVals = [];

            for(var nct = 0; nct < nodeLayer.length; nct++){
                var node = nodeLayer[nct];
                var nodeWeights = [];
                var weightVals = [];
                for(var pct = 0; pct < prevLayer.length; pct++){
                    var prevNode = prevLayer[pct];
                    var weight = new Weight(prevNode, node, layer);
                    weight.right = node.inputCd(prevLayer.length, pct);
                    weight.left = prevNode.outputCd();
                    if(createVals){
                        var weightVal = guassianRandom();
                    }
                    else if( newWeights[layer-1].length  == undefined ){
                        if(newWeights[layer-1]._data != undefined){
                            var weightVal = newWeights[layer-1]._data[nct][pct];
                        }
                        else{
                            // this accounts for object manipulation after it has been stringified
                            var weightVal = newWeights[layer-1].data[nct][pct];
                        }
                    }
                    else{
                        var weightVal = newWeights[layer-1][nct][pct];
                    }
                    weight.setValue(weightVal, true);
                    weightVals.push(weightVal);
                    nodeWeights.push(weight);
                    newNet.addChild(weight.getSprite());
                }
                weightLayer.push(nodeWeights);
                layerVals.push(weightVals);
            }
            weights.push(weightLayer);
            weightMats.push(math.matrix(layerVals));
            biases.push(biasLayer);
        }
        nodes.push(nodeLayer);

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
    newWeightMats = newMats;
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
