using System;

class Program
{
    static void Main()
    {
        string name = "Umanda"; 
        int order = 3; 

        
        string ordinalSuffix = GetOrdinalSuffix(order);

   
        string completeName = $"{name} the {order}{ordinalSuffix}";

        Console.WriteLine(completeName);
    }

    static string GetOrdinalSuffix(int number)
    {
        if (number % 100 >= 11 && number % 100 <= 13) 
        {
            return "th";
        }

        return (number % 10) switch
        {
            1 => "st",
            2 => "nd",
            3 => "rd",
            _ => "th"
        };
    }
}
