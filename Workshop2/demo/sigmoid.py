#!/usr/bin/env python
"""sigmoid.py. A sigmoidal activation module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import math
from jsontools import Object


class Sigmoid(Object):
    """ Represents a sigmoid activation function with derivative."""

    def __init__(self, f, fprime):
        """Constructs a sigmoid activation function with
        unary functions representing its action and its derivatives."""
        self.map = f
        self.derivative = fprime

    def __add__(self, other):
        """Performs a pointwise addition on sigmoid functions."""

        def f(x):
            self.map(x) + other.map(x)

        def fprime(x):
            self.derivative(x) + other.derivative(x)

        return Sigmoid(f, fprime)


def logistic(x):
    """Yields a logistic mapping."""
    return 1.0/(1 + math.exp(-x))

def logistic_prime(x):
    return logistic(x)*(1 - logistic(x))

def tanh_prime(x):
    return 1 - math.tanh(x) ** 2

def linear(x):
    return x

def linear_prime(x):
    return 1

def const(x):
    return 1


Tanh = Sigmoid(math.tanh, tanh_prime )
Logistic = Sigmoid(logistic, logistic_prime )
Linear = Sigmoid(linear, linear_prime)
Constant = Sigmoid(const, const)
