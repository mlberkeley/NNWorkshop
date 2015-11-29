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
        for layer in enumerate(layers):
            self.neurons.append(list())
            for i in range(0, layers[layer]):
                # Input neurons shouldn't activate their input.
                if layer is 0:
                    self.neurons[layer].append(Neuron(sigmoid.LinearSigmoid))
                else:
                    self.neurons[layer].append(Neuron(activation))

        self.connections = []




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

