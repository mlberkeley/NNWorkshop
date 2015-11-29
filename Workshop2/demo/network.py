#!/usr/bin/env python
"""network.py. A neural network module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import sigmoid


class Network:
    """Represents a neural network using sigmoidal activations."""

    def __init__(self, layers, activation=sigmoid.LogisticSigmoid):
        """Constructs a neural network with a set of layers."""
        self.activation = activation

    def train(datapair, rate):
        """Trains the network with a certain learning rate on a datapair.
        Returns the net error across ouytput neurons.
        Assunmes input matches network size."""