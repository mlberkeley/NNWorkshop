
print("Create poker hand data.")
def data_to_vector(datapoint):
    output = []
    for i in range(len(datapoint)):
        if i%2 == 0:
            temp = [0]*4
            temp[datapoint[i]-1] =1
        else:
            temp = [0]*13
            temp[datapoint[i]-1] = 1
        output.extend(temp)
    return output
input_data = open("poker-training.data", "r")
f = open("pokerhand.data", "w")
fileout = ""
for line in input_data:
    data = list(map(int, line.split(',')))
    dp2 = [0]*10
    dp2[data[-1]] = 1
    dp = (data_to_vector(data[:-1]),dp2)
    fileout += "{"
    fileout += ",".join(map(str, dp[0]))
    fileout += "}->{"
    fileout += ",".join(map(str, dp[1]))
    fileout += "};\n"
f.write(fileout)
