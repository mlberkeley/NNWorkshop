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
                    cur_neuron = Neuron(sigmoid.Linear)
                else:
                    cur_neuron = Neuron(activation)

                    for anterior in self.neurons[layer-1]:
                        connection_layer.append(
                            Connection(anterior, cur_neuron))

                    connection_layer.append(
                        Connection(self.bias, cur_neuron))

                neuron_layer.append(cur_neuron)

            if layer != 0:
                self.connections.append(connection_layer)

            self.neurons.append(neuron_layer)

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

        for layer in range(len(self.neurons)):
            for neuron in self.neurons[layer]:
                neuron.activate()
            if layer != len(self.neurons)-1:
                for connection in self.connections:
                    connection.feedforward()

    def backpropagate(self):
        pass
