# Import modules
import os
import csv
import decimal
import operator


# Create file path across operating systems
csvpath = os.path.join('..', 'Resources', "election_data.csv")

# Open and reading csv file
with open(csvpath, newline='') as csvfile:
    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first
    csv_header = next(csvreader)

    # Lists and variables to store data
    Votes = []
    Candidates = []

    # Read each row of data after the header
    for row in csvreader:
        # Add Votes
        Votes.append(row[0])

        # Add Candidates
        Candidates.append(row[2])

        # Calculate the Total_Votes
        Total_Votes = len(Votes)

    print("Election Results")
    print("----------------------------")
    print("Total Votes: "+str(Total_Votes))
    print("----------------------------")

    # Find the list of candidates and store in dictionary
    Candidates_set = set(Candidates)
    Candidates_dict = {}
    for i in Candidates_set:
        Candidates_dict[i] =Candidates.count(i)

    # Sort candidates dictionary by votes
    sorted_Candidates_dict = sorted(Candidates_dict.items(), key=operator.itemgetter(1), reverse=True)
    Candidates_dict = dict(sorted_Candidates_dict)

    # Store candidates'name and votes in lists
    Candidates_name = list(Candidates_dict.keys())
    Candidates_votes = list(Candidates_dict.values())
    Votes_percent = []

    for i in range(0, len(Candidates_votes)):
        percent = decimal.Decimal(Candidates_votes[i]/sum(Candidates_votes)*100)
        percent_chopped = percent.quantize(decimal.Decimal("0.001"), decimal.ROUND_DOWN)
        Votes_percent.append(percent_chopped)

        print(Candidates_name[i] + ": " + str(Votes_percent[i]) + "% " + "(" + str(Candidates_votes[i]) + ")")

    print("----------------------------")

    # Find the Winner Candidate
    Winner = max(Candidates_dict, key=Candidates_dict.get)
    print("Winner: "+Winner)

    print("----------------------------")