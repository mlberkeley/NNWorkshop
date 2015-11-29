import re


class Trainer:
    """A trainer class for the neural framework."""

    def __init__(self, network):
        """Initalizes a trainer with a network."""
        self.network = network

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


test = Trainer(1)
test.load_data("sample.data", True)
