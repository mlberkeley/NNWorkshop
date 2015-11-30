#!/usr/bin/env python
"""sigmoid.py. A sigmoidal activation module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import math


class Sigmoid:
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

Tanh = Sigmoid(math.tanh, lambda x: 1 - math.tanh(x) ** 2)
Logistic = Sigmoid(logistic, lambda x: logistic(x)*(1 - logistic(x)))
Linear = Sigmoid(lambda x: x, lambda x: 1)
Constant = Sigmoid(lambda x: 1, lambda x: 0)
