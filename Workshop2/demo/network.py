#!/usr/bin/env python
"""network.py. A neural network module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import sigmoid
from neuron import Neuron
from connection import Connection

class Network:
    """
    Represents a neural network using sigmoidal activations.

    """

    def __init__(self, layerCounts, activation=sigmoid.Logistic):
        """Constructs a neural network with a set of layers."""
        self.bias = Neuron(sigmoid.Constant)

        self.neurons = []
        self.connections = []

        for layer in enumerate(layerCounts):
            self.neurons.append(list())
            self.connections.append(list())
            for i in range(layerCounts[layer]):
                # Input neurons shouldn't activate their input.
                cur_neuron = None
                if layer is 0:
                    cur_neuron = Neuron(sigmoid.LinearSigmoid)
                else:
                    cur_neuron = Neuron(activation)

                    for anterior in self.neurons[layer-1]:
                        self.connections[layer].append(
                            Connection(anterior, cur_neuron))
                    self.connections[layer].append(
                        Connection(self.bias, cur_neuron))

                self.neurons[layer].append(cur_neuron)

    def train(self, datapair, rate):
        """Trains the network with a certain learning rate on a datapair.
        Returns the net error across ouytput neurons.
        Assunmes input matches network size."""
        inp = datapair[0]
        desired = datapair[1]

        self.feedforward(inp)
        error = self.backpropagate(desired, rate)

        return error


    def feedforward(self, inputs):
        """ Passes the input data through 
        the network and creates the output """

        assert len(inputs) == len(self.neurons[0]), \
            "Input vector does not match the network intut layer"
        for i in enumerate(inputs):
            self.neurons[0][i] = inputs[i]
        for connection_layer in self.connections:
            for connection in connection_layer:
                connection.feedforward()

    def backpropagate(self):
        pass
