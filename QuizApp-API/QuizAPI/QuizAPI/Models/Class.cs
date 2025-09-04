using System.ComponentModel.DataAnnotations;

namespace QuizApi.Models;

public enum QuestionType { SingleChoice = 1, MultipleChoice = 2, TrueFalse = 3 }

public class Question
{
    public int Id { get; set; }

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    [Required, MaxLength(2000)]
    public string Text { get; set; } = default!;

    public QuestionType Type { get; set; } = QuestionType.SingleChoice;

    /// <summary> Sorunun puanı (tam isabet halinde verilir). </summary>
    public int Points { get; set; } = 1;

    /// <summary> Quiz içi görsel sıralama. </summary>
    public int Order { get; set; } = 0;

    public ICollection<Option> Options { get; set; } = new List<Option>();
}
