#!/usr/bin/env python
"""network.py. A neural network module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import sigmoid
from neuron import Neuron
from connection import Connection

class Network:
    """Represents a neural network using sigmoidal activations."""

    def __init__(self, layers, activation=sigmoid.Logistic):
        """Constructs a neural network with a set of layers."""
        self.bias = Neuron(sigmoid.Constant)

        self.neurons = []
        self.connections = []

        for layer in enumerate(layers):
            self.neurons.append(list())
            self.connections.append(list())
            for i in range(0, layers[layer]):
                # Input neurons shouldn't activate their input.
                curNeuron = None
                if layer is 0:
                    curNeuron = Neuron(sigmoid.LinearSigmoid)
                else:
                    curNeuron = Neuron(activation)

                    #Now connect all neurons in the previous layer to this layer
                    for anterior_neuron in neurons[layer-1]:
                        connections[layer]

                self.neurons[layer].append(curNeuron)



    def train(self, datapair, rate):
        """Trains the network with a certain learning rate on a datapair.
        Returns the net error across ouytput neurons.
        Assunmes input matches network size."""
        inp = datapair[0]
        out = datapair[1]

        self.feedforward(inp)
        error = self.backpropagate(out, rate)

        return error

    def feedforward(self, input):
        """ Passes the input data through the network and creates the output """
        assert(len(input) == len(self.neurons[0]), "Input vector does not match the network intut layer")
        for i in enumerate(input):
            self.neurons[0][i] = input[i]
        for connection_layer in self.connections:
            for connection in connection_layer:
                connection.feedforward()
