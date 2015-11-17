function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message;
    }
}
function newNetwork(sizes){
    //sizes list of the sizes of the network

}
// function guassianRandom(){
//     // TODO Make this actually guassian
//     return Math.random();
// }
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
