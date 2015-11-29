import re
from getch import getch


class Trainer:
    """A trainer class for the neural framework."""

    def __init__(self, network, preload=list()):
        """Initalizes a trainer with a network."""
        self.network = network
        self.data = preload

    def load_data(self, filename, verbose=False):
        """Loads data into the trainer for
        the supervised learning task."""
        self.data = list()
        f = open(filename, 'r')

        # lex the file according to the stanbdard in sample.data
        lex = re.sub(r'(\s+|\n+|(#.*\n))', '', f.read())

        for datapoint in filter(None, lex.split(';')):
            if verbose:
                print(datapoint)

            inoutpair = datapoint.split("->")

            inp = inoutpair[0].replace('{', '').replace('}', '').split(',')
            oup = inoutpair[1].replace('{', '').replace('}', '').split(',')

            self.data.append((list(map(int, inp)), list(map(int, oup))))

    def step(self, rate, verbose=False):
        """Steps through an iteration of training
        the network on a loaded dataset"""
        netloss = 0
        for datapair in self.data:
            error = self.network.train(datapair, rate)
            if verbose:
                print(datapair, "--", error)
            netloss += error

        return netloss

    def interactive_step(self, rate, verbose=False):
        """Performs an interactive step procedure using
        the key `a` to learn and `q` to quit."""
        print("Training with learning rate =", rate)
        print("Press any key to step and `q` to quit.")
        epoch = 0

        while getch() is not 'q':
            error = self.step(rate, verbose)
            epoch += 1
            print("Epoch", epoch, " -- training error is", error)

# A good test case.
test = Trainer(1)
test.load_data("sample.data", True)
test.interactive_step(1)
