#!/usr/bin/env python

import re


print("Create tic tac toe data.")

data = []
'''
# load data
f = open("tictactoe.data", "r")


# lex the file according to the stanbdard in sample.data
lex = re.sub(r'(\s+|\n+|(#.*\n))', '', f.read())

for datapoint in filter(None, lex.split(';')):
    inoutpair = datapoint.split("->")
    print(inoutpair)
    inp = inoutpair[0].replace('{', '').replace('}', '').split(',')
    oup = inoutpair[1].replace('{', '').replace('}', '').split(',')

    data.append((list(map(int, inp)), list(map(int, oup))))
'''

i = 0
inp = [0]*9*2
while True:
    line = input(str(i) + ":")
    if line is "q":
        break

    i += 1
    if i == 4:
        desired = int(line)
        data.append((inp, desired))
        inp = [0]*9*2
        i = 0
    else:
        for j, c in enumerate(line):
            if c == 'x':
                inp[i*3+j] = 1
            elif c == 'o':
                inp[9*1 +(i-1)*3+j] = 1
# write this to a file

f = open("tictactoe.data", "w")

fileout = ""
for dp in data:
    fileout += "{"
    fileout += ",".join(map(str, dp[0]))
    fileout += "}->{"
    fileout += str(dp[1])
    fileout += "};\n"

f.write(fileout)