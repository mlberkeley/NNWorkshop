// parameter handler

var maxLayers = 5;
var maxNodes = 5;
var nodeRad = 30;
var separation = 40;

var nodes = [], // nodes organized by layer
    weights = []; // weights organized by layer

var currentWeight = null;
var layerSelector = $('#num-layers');
$('.editor').hide();
for(i = 1; i <= maxLayers; i++){
    var option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    layerSelector.append(option);
}
// layerSelector.val(Math.ceil(maxLayers/2));
layerSelector.val(3);
newLayerCount(layerSelector.val());




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
function editWeight(weight){
    $('.editor').show();
    $('#reference').html(weight.repr());

    if (currentWeight != null)
        currentWeight.deselect();

    currentWeight = weight;
    weight.setSelect();

    $('#field-val').val(weight.value);
}
function updateWeight(){
    newVal = $('#field-val').val();
    newVal = parseInt(newVal)
    if (newVal != NaN){
        currentWeight.value = newVal;

    }
    else{
        console.log('Could not update value to none number')
    }
    closeEditor();
}
function closeEditor(){
    $('.editor').hide();
    currentWeight.deselect();
    currentWeight = null;
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
        return [this.x-this.rad*Math.cos(centerOffSet),this.y-this.rad*Math.sin(centerOffSet)];
        // return [this.x-this.rad, this.y]
    };
    this.outputCd = function(){

        return [this.x+this.rad, this.y];
    };
}
function drawArrow(start, end, color){
    /*
    returns a graphics object that has a directed graph
    */
    if (color == null){
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
    line.beginFill(0x010101);
    line.lineTo(length - arrowSL*Math.cos(Math.PI/6),  -arrowSL*Math.sin(Math.PI/6));
    line.lineTo(length- 3/4*arrowSL*Math.cos(Math.PI/6), 0);
    line.lineTo(length-arrowSL*Math.cos(Math.PI/6), arrowSL*Math.sin(Math.PI/6));
    line.lineTo(length, 0);
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
function Weight(inputNode, outputNode, layer){
    /*
    Description:
        The weight object genreator that represents that contains clicking logic, information
        on the nodes that it is connected to etc.
        This weight is w^l_{jk} s.t. It connects the kth node in the l-1 layer to
        the jth node in the lth layer. All indexes are zero-based.
    Args:
        inputNode: the zero-based kth node of the (l-1)th layer.
        outputNode: the zero-based jth node of the lth layer.
        layer: layer number l.
    */
    this.left = [0,0];
    this.right = [0,0];
    this.j = outputNode;
    this.k = inputNode;
    this.l = layer;
    this.id = id;
    id+=1;
    this.updateDetails = function(weight){
        return function(){
            editWeight(weight);
            console.log(weight.repr());
        }


    };
    this.sprite = null;
    // TODO make this change hte sprite color to red
    this.setSelect = function(){
        this.getDrawing();
    };
    //TODO make this change the sprite color to black
    this.deselect = function(){

    };
    this.getSprite = function(){
        if(this.sprite!=null){

            return this.sprite;
        }
        // console.log(this)
        var sprite = new PIXI.Sprite(this.getDrawing().generateTexture());
        sprite.interactive = true;
        sprite.anchor.y = 0.5;
        sprite.x = this.left[0];
        sprite.y = this.left[1];
        sprite.rotation = getAngle(this.right, this.left);
        sprite.click = this.updateDetails(this);
        this.sprite = sprite;
        return this.sprite;
    }
    this.getDrawing = function(){
        // if(selected != null)
        //     var arrow = drawArrow(this.left, this.right, 0xFF0000);
        // else
        var arrow = drawArrow(this.left, this.right, 0x000000);

        return arrow;
        // var sprite = new PIXI.Sprite(arrow.generateTexture());
        // sprite.interactive = true;
        // sprite.anchor.y = 0.5;
        // sprite.x = this.left[0];
        // sprite.y = this.left[1];
        // sprite.rotation = getAngle(this.right, this.left);
        // // sprite.rotation = Math.PI*Math.random();
        // // details = [this.l, this.j, this.k, this.id]
        // sprite.click = this.updateDetails(this);//function(){
        // //     // console.log(details);
        // //     console.log("w^{0}_[{1},{2}], id: {3}".format(details[0], details[1], details[2], details[3]));
        // // };
        // this.sprite = sprite;
        // return sprite;
    };
    this.repr = function(){
        return "w^{0}_[{1},{2}]".format(this.l,this.j,this.k);
    }
    this.value = 0;
}
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
        // generate the weights

        if (layer != 0){ // We don't generate weights for the first layer
            prevLayer = nodes[nodes.length-1];
            var weightLayer = []
            for(var nct = 0; nct < nodeLayer.length; nct++){

                var node = nodeLayer[nct];
                var n = prevLayer.length;
                for(var pct = 0; pct < n; pct++){
                    var prevNode = prevLayer[pct];
                    var weight = new Weight(nct, pct, layer);
                    weight.right = node.inputCd(n, pct);
                    weight.left = prevNode.outputCd();
                    weightLayer.push(weight);
                    newNet.addChild(weight.getSprite());
                }

            }
            weights.push(weightLayer);
        }
        nodes.push(nodeLayer);
    }
    addDrawnNet(newNet);
}

function newWeightVals(weightVals){
    // run a check to make sure the sizes are correct
    assert(weightVals.length == weights.length, "Mismatched number of layers.");
    for(var lIdx = 0; lIdx < weightVals.length; lIdx ++){
        assert(weightVals[lIdx].length == weights[lIdx].length,
            "Mismatched number of weights ({0} vs {1} in layer {2}."
            .format(weightVals[lIdx].length, weights[lIdx].length, lIdx));
    }
    var l = 0;
    for(layerct in weights){
        var layer = weights[layerct];
        // console.log(layer);
        var j = 0;
        for (weightct in layer){
            weight = layer[weightct];
            // console.log(weight);
            weight.value = weightVals[l][j];
            j++;
        }
        l++;
    }


}
function animate() {
    requestAnimationFrame(animate);
    // for(layer in weights){
    //     for(weight in layer){
    //         weight
    //     }
    // }
    // render the container
    renderer.render(stage);
}
