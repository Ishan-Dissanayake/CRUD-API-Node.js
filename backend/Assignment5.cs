using System;
using System.Collections.Generic;

class Animal
{
    protected string name;
    protected int speed;

    public Animal(string name, int speed)
    {
        this.name = name;
        this.speed = speed;
    }

    public virtual void Move()
    {
        Console.WriteLine("No movement");
    }
}

class Cat : Animal
{
    private int height; // New field for jump height

    public Cat(string name, int speed, int height) : base(name, speed)
    {
        this.height = height;
    }

    public override void Move()
    {
        Console.WriteLine($"Cat named {name} runs at speed {speed}");
    }

    public void Jump()
    {
        Console.WriteLine($"Cat jumps at height {height}");
    }
}

class Fish : Animal
{
    public Fish(string name, int speed) : base(name, speed) { }

    public override void Move()
    {
        Console.WriteLine($"Fish named {name} swims at speed {speed}");
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal("", 0),
            new Cat("Frisky", 10, 5),
            new Fish("Blob", 5)
        };

        foreach (Animal animal in animals)
        {
            animal.Move();
            if (animal is Cat cat)
            {
                cat.Jump();
            }
        }
    }
}
