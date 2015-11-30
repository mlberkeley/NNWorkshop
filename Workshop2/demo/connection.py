__author__ = "Phillip Kuznetsov"

import random


class Connection:
    """ Represents a connection between the neuron
     components of each layer. """

    def __init__(self, anterior, posterior, weight=None):
        """ Creates a weight that connects the
         anterior neuron to the posterior neuron."""
        self.anterior = anterior
        self.posterior = posterior
        if not weight:
            weight = random.gauss(0, 1)
        self.weight = weight  

    def feedforward(self):
        """ Feeds the weighted output of the anterior
         neuron into the posterior neuron"""
        self.posterior.feed(self.weight * self.anterior.output)

    def update_weight(self, rate):
        grad = self.posterior.error * self.anterior.output

       # perform bprop
        self.weight += -(grad * rate)

    def __repr__(self):
        return str(self.weight)
