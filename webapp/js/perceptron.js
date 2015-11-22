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
    this.left = [0,0];
    this.right = [0,0];
    this.j = outputNode;
    this.k = inputNode;
    this.l = layer;
    // this.id = id;
    this.type = 'Weight';
    this.sprite = null;
    // id+=1;
    this._weight = 0;
    this.updateDetails = function(weight){
        return function(){
            editWeight(weight);
            // console.log(weight.repr());
        }
    };
    this.setValue = function(newWeight, init){
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
    };

    this.deselect = function(){
        this.sprite.texture = this.getDrawing().generateTexture();
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
            return this._bias;
    };
    this.value = function(){
        return this.bias();
    }
    this.setValue = function(newBias, init){
        this._bias = newBias;
        if (init == undefined || !init)
            biases[this.layer][this.index] = this._bias;
    }
    this.getDrawing = function(color){
        if(color == undefined)
            color = 0;
        var nodeDrawing = new PIXI.Graphics();
        nodeDrawing.lineStyle(1,color,1);
        nodeDrawing.beginFill(0xFFFFFF);
        nodeDrawing.drawCircle(this.x, this.y, this.rad);
        return nodeDrawing;
    };
    this.updateDetails =function(node){
        return function(){
            editBias(node);
        }
    }
    this.getSprite = function(){
        if(this.sprite!=null){  // return the existing sprite
            return this.sprite;
        }
        // else make a new sprite
        var sprite = new PIXI.Sprite(this.getDrawing().generateTexture());
        sprite.interactive = true;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = this.x;
        sprite.y = this.y;
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
        return "b={0}".format(this.bias());
    };
    this.select = function(){
        this.sprite.texture = this.getDrawing(0xFF0000).generateTexture();
    };
    this.deselect = function(){
        this.sprite.texture = this.getDrawing().generateTexture();
    };
}
function feedForward(inputs, perceptron){
    if(perceptron == undefined)
        perceptron = true; // TODO this should be false and should be dependent on a checkbox

    var num_inputs = getLayerSizes()[0];
    assert(num_inputs == inputs.length,
        'Improper input length. Got {0} expected {1}', inputs.length, num_inputs);
    if (nodes == [] || weights == []){
        throw new Error('No Network to run');
    }
    var output = inputs
    for(layer in weightMats){
        var matrix = weightMats[layer];
        output = math.multiply(math.transpose(matrix), output);
        output = math.add(output, biases[layer]);
        if(perceptron){
            output = output.map(function(val, idx, matrix){
                if (val > 0){
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
    }

    $('#outputLines').empty();
    for(elm in output._data){
        var line= $('<p></p>')
        line.html(output._data[elm]);
        $('#outputLines').append(line);
    }$('#outputBox').show();
    return output


}
function guassianRandom(){
    // TODO Make this actually guassian
    return Math.random();
}
