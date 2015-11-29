class Trainer:
	"""A trainer class for the neural framework."""

	def __init__(self, network):
		"""Initalizes a trainer with a network."""
		self.network = network


	def load_data(self, filename):
		"""Loads data into the trainer for
		 the supervised learning task."""
