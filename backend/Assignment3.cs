using System;
using System.Collections.Generic;

class Animal
{
    public virtual void Move()
    {
        Console.WriteLine("No movement");
    }
}

class Cat : Animal
{
    public override void Move()
    {
        Console.WriteLine("Run");
    }
}

class Fish : Animal
{
    public override void Move()
    {
        Console.WriteLine("Swim");
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal(),
            new Cat(),
            new Fish()
        };

        foreach (Animal animal in animals)
        {
            animal.Move();
        }
    }
}
