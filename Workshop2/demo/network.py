#!/usr/bin/env python
"""network.py. A neural network module for
the neural network workshop by Robotics @ Berkeley."""

__author__ = "William Guss"

import math

class Network:
    """Represents a neural network using sigmoidal activations."""

    def __init__(self, layers, acitvation)