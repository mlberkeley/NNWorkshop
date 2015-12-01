#!/usr/bin/env python
"""network.py. A neural network module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import sigmoid
from neuron import Neuron
from connection import Connection
import pickle

class Network:
    """
    Represents a neural network using sigmoidal activations.

    """

    def __init__(self, layerCounts, activation=sigmoid.Tanh):
        """Constructs a neural network with a set of layers.
        >>> n = Network([2,3,2])
        >>> len(n.neurons)
        3
        >>> len(n.neurons[0])
        2
        >>> len(n.neurons[1])
        3
        >>> len(n.neurons[2])
        2
        >>> len(n.connections)
        2
        >>> len(n.connections[0])
        9
        >>> len(n.connections[1])
        8
        """
        self.bias = Neuron(sigmoid.Constant)

        self.neurons = []
        self.connections = []

        for layer in range(len(layerCounts)):
            neuron_layer = []
            connection_layer = []
            for i in range(layerCounts[layer]):
                # Input neurons shouldn't activate their input.

                cur_neuron = None
                if layer is 0:
                    # input neurons do not activate.
                    cur_neuron = Neuron(sigmoid.Linear)
                else:
                    # hidden and output neurons use normal sigmoids
                    cur_neuron = Neuron(activation)

                    # for every neuron to the left
                    for anterior in self.neurons[layer-1]:

                        #create an anterior connection to CUR_NEURON
                        connection = Connection(anterior, cur_neuron)
                        connection_layer.append(connection)

                        # add this connection to the posterior connections
                        # of ANTERIOR.
                        anterior.posteriors.append(connection)
                        cur_neuron.anteriors.append(connection)

                    # do the same for the BIAS connection.
                    bias_connection = Connection(self.bias, cur_neuron)
                    connection_layer.append(bias_connection)
                    self.bias.posteriors.append(bias_connection)

                # add the current neuron.
                neuron_layer.append(cur_neuron)

            #if connections were made
            if layer != 0:
                self.connections.append(connection_layer)

            # append the neural layer.
            self.neurons.append(neuron_layer)

    def train(self, datapair, rate):
        """Trains the network with a certain learning rate on a datapair.
        Returns the net error across ouytput neurons.
        Assunmes input matches network size."""

        ipt = datapair[0]
        desired = datapair[1]

        # feedforward the input
        """ YOUR CODE HERE """

        # backprop and calculate the error
        error = """ YOUR CODE HERE """

        return error
    def feedforward(self, inputs):
        """ Passes the input data through
        the network and creates the output
        Feeds data into the neuron """

        assert len(inputs) == len(self.neurons[0]), \
            "Input vector dimeonsion does not match the network input layer dimesion"

        """ YOUR CODE HERE """

        # Feed the inputs into the first layer of neurons
        """ YOUR CODE HERE """
        # activate the bias
        """ YOUR CODE HERE """
        # activate the reset of the neurons
        """ YOUR CODE HERE """
        return [x.output for x in self.neurons[-1]]

    def backpropagate(self, desired, learning_rate):
        """ Updates the weights based on the desired output and
        the learning rate using error backpropagation."""
        outputs = [n.output for n in self.neurons[-1]]
        losses = [x[0] - x[1] for x in zip(outputs, desired)]
        error = sum(map(lambda x: x ** 2, losses))

        # manually set the error coefficients for the output error.
        for output_neuron, loss in zip(self.neurons[-1], losses):
            output_neuron.set_error(loss)
        # start at the end of the layer chain and propogate the data backwards
        for n_layer in self.neurons[:-1][::-1]:
            # go through the neurons in each layer and each connection in the neurons
            for neuron in n_layer:
                error_coef = 0
                for con in neuron.posteriors:
                    error_coef += con.posterior.error * con.weight

                    con.update_weight(learning_rate)

                neuron.set_error(error_coef)

        # update the bias error
        for con in self.bias.posteriors:
            con.update_weight(learning_rate)

        return error

    def set_weight(self, layer, left, right, value):
        """Sets a weight from a neuron indexed LEFT in
        LAYER to a neuron indexed RIGHT on the posterior neuron
        with a new weight VALUE."""
        self.neurons[layer][left].posteriors[right].weight = value
        return value

    def get_weight(self, layer, left, right):
        """Gets a weight from a neuron indexed LEFT in
        LAYER to a neuron indexed RIGHT on the posterior neuron"""
        return self.neurons[layer][left].posteriors[right].weight

    def save(self, filename):
        """Requires json pickle."""
        f = open(filename, "wb")

        pickle.dump(self, f)

    def load(filename):
        """Requires json pickle."""
        f = open(filename, "rb")

        return pickle.load(f)
