#!/usr/bin/env python
from network import Network
from trainer import Trainer

net = Network((2,3,2))
teacher = Trainer(net)
teacher.load_data("sample.data")
teacher.interactive_step(0.5, True)
