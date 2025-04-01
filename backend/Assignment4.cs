using System;

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
    public Cat(string name, int speed) : base(name, speed) { }

    public override void Move()
    {
        Console.WriteLine($"Cat named {name} runs at speed {speed}");
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
        Animal genericAnimal = new Animal("", 0);
        Cat cat = new Cat("Frisky", 10);
        Fish fish = new Fish("Blob", 5);

        genericAnimal.Move();
        cat.Move();
        fish.Move();
    }
}
