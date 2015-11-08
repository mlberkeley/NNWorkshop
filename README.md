# NNWorkshop
Repository built for a Neural Networks  Robotics@Berkeley Workshop
## Documentation
### Perceptron
Description: A simple implementation of a single Perceptron Network that takes in a number of inputs, has weights, and has a threshold value that allows the user to make a decision.

- `__init__(num_inputs, weights, threshold)`

  - Creates a perceptron that takes `num_inputs`, has the weight values that are in the list `weights` and a decision `threshold`

### Decision
Description: A wrapper class of Perceptron that allows a user to evaluate Perceptron capabilities through a more natural decision flow.

- `Decision.new_decision(evaluate=True)`: starts a prompt set that sets up a Decision. Allows the user to make to a Decision object and test on it without the need for additional methods. The optional argument `evaluate` marks whether we should run inputs through the perceptron or just return the Decision object.

- `__init__(decision, num_factors, weights, factors)`: Inherits from Perceptron and adds the decision and factors strings to mimic natural decision flow.

- `eval_factors()`: A prompt based evaluation of the factors where a user must enter yes or no to each factor. Then returns the output of the Perceptron as a decision `You should <Decision>` or `You should not <Decision>`
- `test_factors(factor_input)`: Takes in a binary valued list as the factor_input then returns what Decision they should make
