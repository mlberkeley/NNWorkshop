import numpy as np

class Perceptron:
    """ A perceptron model.

    >>> p = Perceptron(3, [1,2,3], 4)
    >>> p.input([0,1,0])
    0
    >>> p.input([1,0,1])
    0
    >>> p.input([0,1,1])
    1
    """
    def __init__(self, num_inputs, weights, threshold):
        self.ninputs = num_inputs
        self.weights = weights
        self.threshold = threshold
    def input(self, input_list):
        weighted_sum = np.dot(self.weights, input_list)
        if weighted_sum > self.threshold:
            return 1
        else:
            return 0
p = Perceptron(3, [1,2,3], 4)
print(p.input([0,1,1]))
