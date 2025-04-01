using System;

class Player
{
    private static int nextId = 0; // Static field for unique ID assignment
    public int Id { get; }
    public string Nickname { get; }
    public int Score { get; private set; }

    public Player(string nickname)
    {
        Id = nextId++; // Assign and increment static ID
        Nickname = nickname;
        Score = 0; // Initial score
    }

    public void SetScore(int score)
    {
        Score = score;
    }

    public override string ToString()
    {
        return $"Player with nickname {Nickname} and Id {Id} has score {Score}";
    }
}

class Program
{
    static void Main()
    {
        Random rand = new Random();
        Player player = new Player("JEff");
        player.SetScore(rand.Next(1, 101)); // Random score between 1 and 100

        Console.WriteLine(player);
    }
}
