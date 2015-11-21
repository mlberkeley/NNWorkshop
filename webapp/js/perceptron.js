var nodes = [], // nodes organized by layer
    weights = []; // weights organized by layer
var weightMats = [];
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
        this.sprite.texture = this.getDrawing(0xFF0000).generateTexture();
    };
    //TODO make this change the sprite color to black
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
    }
    this.value = 0;
}
function Node(){
    this.x = 0;
    this.y = 0;
    this.rad = nodeRad;
    this.getDrawing = function(){
        var nodeDrawing = new PIXI.Graphics();
        nodeDrawing.lineStyle(1,0,1);
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
function newNetwork(sizes){
    //sizes list of the sizes of the network

}
function feedForward(inputs){
    var num_inputs = getLayerSizes()[0];
    assert(num_inputs == inputs.length,
        'Improper input length. Got {0} expected {1}', inputs.length, num_inputs);
    if (nodes == [] || weights == []){
        throw new Error('No Network to run');
    }
    var output = inputs
    for(layer in weightMats){
        var matrix = weightMats[layer];
        output = math.multiply(matrix, output);
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
// // function randomMatrix(m, n){
// //     // returns a matrix of m rows and n columns that has guassian random
// //     // elements
// //     if (n == 1){
// //         col = []
// //         for (j = 0; j < n; j++){
// //             col.push(guassianRandom());
// //         }
// //         return col;
// //     }
// //     matrix = []
// //     for (i = 0; i < m; i++){
// //         row = []
// //         for (j = 0; j < n; j++){
// //             row.push(guassianRandom());
// //         }
// //         matrix.push(row);
// //     }
// //     return matrix;
// // }
// // function newNetwork(sizes){
// //     var network =
// //     {
// //         layerSize: sizes,
// //         weights : [],
// //         biases : [],
// //         feedForward : function(val){
// //             // confirm that length of input fits the length desired
// //             assert(val.length == this.weights[0].length, 'Length input mismatch');
// //             this.weights.forEach(function(weight_matrix){
// //                 temp = Array.apply(null, Array(weight_matrix.length)).map(function () { return 0; });
// //                 for(i = 0; i < weight_matrix.length; i++)// column selector
// //                 {
// //                     row = weight_matrix[i]
// //                     for(j = 0; j < row.length; j++){
// //                         temp[i] += row[j] * val[j]
// //                     }
// //                     temp[i] += this.biases[i];
// //                 }
// //                 val = temp;
// //             });
// //             return val;
// //         }
// //     };
// //     network.weights = [randomMatrix(2,2)];
// //     network.biases = randomMatrix(2,1);
// //     // weights = [];
// //     // biases = [];
// //     // for(i = 1; i < sizes.length; i++){
// //     //     // TODO query the server for this, otherwise it will break
// //     //     weights.push(randomMatrix(sizes[i-1], sizes[i]));
// //     //     biases.push(randomMatrix(1,sizes[i]));
// //     // }
// //     return network
// // }
