#!/usr/bin/env python
from network import Network
from trainer import Trainer

net = Network((18,20,8,4,2))
teacher = Trainer(net)
teacher.load_data("datasets/tictactoe.data")
teacher.interactive_step(0.2, True)