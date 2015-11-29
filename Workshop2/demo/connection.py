__author__ = "Phillip Kuznetsov"

import random

class Connection:
    ''' Represents a connection between the neuron components of each layer. '''
    def __init__(self, anterior_neuron, posterior_neuron, weight= math.gauss(0,1)):
        ''' Creates a weight that connects the anterior neuron to the posterior neuron.'''
        self.anterior = anterior_neuron
        self.posterior = posterior_neuron
        self.weight = weight
    def feedforward(self):
        ''' Feeds the weighted output of the anterior neuron into the posterior neuron'''
        self.posterior.feed(self.weight * self.anterior.output)
