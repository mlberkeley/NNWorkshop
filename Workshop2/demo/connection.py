__author__ = "Phillip Kuznetsov"

import random
import math


class Connection:
    """ Represents a connection between the neuron
     components of each layer. """

    def __init__(self, anterior, posterior, weight=math.gauss(0, 1)):
        """ Creates a weight that connects the
         anterior neuron to the posterior neuron."""
        self.anterior = anterior
        self.posterior = posterior
        self.weight = weight

    def feedforward(self):
        """ Feeds the weighted output of the anterior
         neuron into the posterior neuron"""
        self.posterior.feed(self.weight * self.anterior.output)
