# Import the os csv module
import os
import csv

# Create file path across operating systems
csvpath = os.path.join('..', 'Resources', "budget_data.csv")

# Open and reading csv file
with open(csvpath, newline='') as csvfile:
    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first
    csv_header = next(csvreader)

    # Lists and variables to store data
    Date = []
    Revenue = []
    Max_profits = 0
    Min_profits = 0

    # Read each row of data after the header
    for row in csvreader:
        # Add Date
        Date.append(row[0])

        # Add Revenue
        Revenue.append(int(row[1]))

        # Determine the Total_Months of Date
        Total_Months = len(Date)

        # Determine the Total amount of Revenue
        Total_revenue = sum(Revenue)

        # Determine the Average of Revenue
        Average = round(sum(Revenue) / len(Revenue), 2)

    # For loop to determine the Maximal Revenue
    for i in range(0, len(Revenue)):
        if Revenue[i] > Max_profits:
            Max_profits = Revenue[i]
    else:
        Max_profits

    # For loop to determine the Mininal Revenue
    for n in range(0, len(Revenue)):
        if Revenue[n] < Min_profits:
            Min_profits = Revenue[n]
    else:
        Min_profits

    # Show the analyzed results
    print("Financial Analysis")
    print("---------------------------")
    print("Total Months: " + str(Total_Months))
    print("Total: $" + str(Total_revenue))
    print("Average Change: $"+str(Average))
    print("Greatest Increase in Profits: "+Date[Revenue.index(Max_profits)]+ ' ' "("+"$"+str(Max_profits)+")")
    print("Greatest Decrease in Profits: "+Date[Revenue.index(Min_profits)]+ ' ' "("+"$"+str(Min_profits)+")")