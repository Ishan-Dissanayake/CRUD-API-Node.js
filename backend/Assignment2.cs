using System;

class Rectangle
{
    public int Length { get; set; }
    public int Width { get; set; }

    // Default constructor
    public Rectangle()
    {
        Length = 1;
        Width = 1;
    }

    public int GetArea()
    {
        return Length * Width;
    }

    public override string ToString()
    {
        return $"Width: {Width}, Length: {Length}, Area: {GetArea()}";
    }
}

class Program
{
    static void Main()
    {
        Random rand = new Random();
        Rectangle[] rectangles = new Rectangle[5];

        for (int i = 0; i < rectangles.Length; i++)
        {
            rectangles[i] = new Rectangle
            {
                Width = rand.Next(1, 11),
                Length = rand.Next(1, 11)
            };

            Console.WriteLine($"Rectangle {i + 1} has width {rectangles[i].Width} and length {rectangles[i].Length}");
        }

        Console.WriteLine("\nAreas of the rectangles:");
        foreach (Rectangle rect in rectangles)
        {
            Console.WriteLine(rect.GetArea());
        }
    }
}
