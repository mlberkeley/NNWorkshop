var nodes = [], // nodes organized by layer
    weights = []; // weights organized by layer
var weightMats = [], biases = []; // the barebones structure of the network, separated for faster computation.
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
    this.input = inputNode;
    this.output = outputNode;
    this.left = [0,0];
    this.right = [0,0];
    this.j = outputNode.index;
    this.k = inputNode.index;
    this.l = layer;
    // this.id = id;
    this.type = 'Weight';
    this.sprite = null;
    // id+=1;
    this._weight = 0;
    this.updateDetails = function(weight){
        return function(){
            editObject(weight);
            // console.log(weight.repr());
        }
    };
    this.setValue = function(newWeight, init){
        newWeight = parseFloat(Math.round(newWeight * 1000) / 1000).toFixed(3);
        this._weight = newWeight;
        if (init == undefined || !init)
            weightMats[this.l-1]._data[this.j][this.k] = newWeight;
    };
    this.value = function(){
        return this.weight();
    };
    this.weight = function(){
        return this._weight;
    }
    this.select = function(){
        this.sprite.texture = this.getDrawing(0xFF0000).generateTexture();
        this.input.select();
        this.output.select();
    };

    this.deselect = function(){
        this.sprite.texture = this.getDrawing().generateTexture();
        this.input.deselect();
        this.output.deselect();
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
    this.getDrawing = function(color){
        if (color == undefined){
            var arrow = drawArrow(this.left, this.right, 0x000000);
        }
        else{
            var arrow = drawArrow(this.left, this.right, color);
        }
        return arrow;
    };
    this.repr = function(){
        return "w^{0}_[{1},{2}]".format(this.l,this.j,this.k);
    };
}
function getNodeValue(layer, index){
    return biases[layer][index];
}
function Node(layer, index){
    /*
    Description:
        The node abstraction that contains the location, the indexing of the
        node, drawing method, and coordinate handlers.
    Args:
        layer (integer) : the zero-based index of the layer within the network
        index (integer) : the zero-based index within the layer
    */
    this.type = 'Node';
    this.layer = layer;     // the zero-based layer that this node belongs to
    this.index = index;     // the zero-based index that this node belongs to;
    this.x = 0;
    this.y = 0;
    this.rad = nodeRad;
    this._bias = 0;
    this.sprite = null;
    this.bias = function(){
        if(this.layer == 0)
            return 0;
        else
            return biases[this.layer-1][this.index];
    };
    this.value = function(){
        if(this.layer !=0){
            return this.bias();
        }
        else{
            return getInputDom()[this.index].val();
        }
    }
    this.setValue = function(newBias, init){
        newBias = parseFloat(Math.round(newBias * 1000) / 1000).toFixed(3);
        this._bias = newBias;
        if (init == undefined || !init)
        {

            if(this.layer == 0){
                var iptField = getInputDom()[this.index];
                iptField.val(newBias);
            }
            else{
                biases[this.layer-1][this.index] = newBias;
            }
        }
    }
    this.getDrawing = function(color){
        if(color == undefined)
            color = 0;
        var nodeDrawing = new PIXI.Graphics();
        nodeDrawing.lineStyle(2,color,1);
        nodeDrawing.beginFill(0xFFFFFF);
        nodeDrawing.drawCircle(0, 0, this.rad);
        if(!displayLabels()){
            var container = new PIXI.Container();
            // getNodeValue(this.layer-1, this.index)
            var nodeText = new PIXI.Text(this._bias, {font:"20px Arial", fill:"blue"});
            nodeText.x -= 27;
            nodeText.y -= 13;
            // nodeDrawing.addChild(nodeText);
            container.addChild(nodeDrawing);
            container.addChild(nodeText);
            return container.generateTexture(renderer);
            // return nodeDrawing.generateTexture(renderer);
        }
        else{

            return nodeDrawing.generateTexture(renderer);
        }
    };
    this.updateDetails =function(node){
        return function(){
            editObject(node);
        }
    }
    this.updateDrawing = function(){
        /*
        Description: Used in conjunction with
        */
    }
    this.getSprite = function(){
        if(this.sprite!=null){  // return the existing sprite
            return this.sprite;
        }
        // else make a new sprite
        var sprite = new PIXI.Sprite(this.getDrawing());
        sprite.interactive = true;
        // sprite.anchor.x = 0.5;
        // sprite.anchor.y = 0.5;
        sprite.x = this.x-this.rad;
        sprite.y = this.y-this.rad;
        sprite.click = this.updateDetails(this);
        this.sprite = sprite;
        return sprite;
    }
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
    this.repr = function(){
        if(this.layer != 0){
            return "bias^{0}_{1}".format(this.layer, this.index);
        }
        else{
            return "input^{0}".format(this.index);
        }
    };
    this.select = function(){
        this.sprite.texture = this.getDrawing(0xFF0000);
    };
    this.deselect = function(){
        this.sprite.texture = this.getDrawing();
    };
}
function feedForward(inputs, perceptron){
    if(perceptron == undefined)
        perceptron = isPerceptron();

    var num_inputs = getNetworkSizes()[0];
    assert(num_inputs == inputs.length,
        'Improper input length. Got {0} expected {1}', inputs.length, num_inputs);
    if (nodes == [] || weights == []){
        throw new Error('No Network to run');
    }
    var output = inputs
    for(var layer=0; layer < weightMats.length; layer++){
        var matrix = weightMats[layer];
        var biasLayer =biases[layer];
        output = math.multiply(matrix, output);
        output = math.add(output, biasLayer);
        console.log(output._data, output);
        if(perceptron){
            output = output.map(perceptronActivation);
            console.log(output);
        }
    }

    $('#outputLines').empty();
    if (output.length == 1){
        var line = $("<p></p>");
        line.html(output[0])
        $('#outputLines').append(line);
    }
    else{
        for(elm in output._data){
            var line= $('<p></p>');
            line.html(output._data[elm]);
            $('#outputLines').append(line);
        }
    }
    $('#outputBox').show();
    return output


}
function perceptronActivation(val, idx, matrix){
    if (val >= 0){
        return 1;
    }
    else {
        return 0;
    }
}
function guassianRandom(){
    return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3)/3;
}
