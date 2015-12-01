
print("Create poker hand data.")

input_data = open("poker-hand-training-true.data", "r")
f = open("pokerhand.data", "w")
fileout = ""
for line in input_data:
    data = list(map(int, line.split(',')))
    dp = (data[:-1],data[-1])
    fileout += "{"
    fileout += ",".join(map(str, dp[0]))
    fileout += "}->{"
    fileout += str(dp[1])
    fileout += "};\n"
f.write(fileout)
