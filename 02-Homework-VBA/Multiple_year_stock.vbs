Sub Multiple_year_stock()

 'Loop through all sheets
  For Each Ws In Worksheets


   ' Set an initial variable for holding the ticker
   Dim ticker As String

   ' Set an initial variable for holding the volume per ticker
   Dim ticker_volume As Double
   ticker_volume = 0

   ' Keep track of the location for each ticker in the summary table
   Dim Summary_Table_Row As Integer
   Summary_Table_Row = 2
  
   ' Determine the Last Row
   LastRow = Ws.Cells(Rows.Count, 1).End(xlUp).Row

   ' Loop through all ticker
   For i = 2 To LastRow

      ' Check if we are still within the same ticker name, if it is not...
      If Ws.Cells(i + 1, 1).Value <> Ws.Cells(i, 1).Value Then

      ' Set the ticker
      ticker = Ws.Cells(i, 1).Value

      ' Add to the ticker_volume
      ticker_volume = ticker_volume + Ws.Cells(i, 7).Value

      ' Print the ticker name in the Summary Table
      Ws.Range("i" & Summary_Table_Row).Value = ticker

      ' Print the ticker_volume to the Summary Table
      Ws.Range("j" & Summary_Table_Row).Value = ticker_volume

      ' Add one to the summary table row
      Summary_Table_Row = Summary_Table_Row + 1
      
      ' Reset the ticker_volume
      ticker_volume = 0

     ' If the cell immediately following a row is the same brand...
      Else

     ' Add to the ticker_volume
      ticker_volume = ticker_volume + Cells(i, 7).Value

      End If

   Next i

  Next Ws

  MsgBox ("Complete")

End Sub
