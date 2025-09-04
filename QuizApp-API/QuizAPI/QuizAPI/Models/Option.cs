using System.ComponentModel.DataAnnotations;

namespace QuizApi.Models;

public class Option
{
    public int Id { get; set; }

    public int QuestionId { get; set; }
    public Question Question { get; set; } = default!;

    [Required, MaxLength(1000)]
    public string Text { get; set; } = default!;

    public bool IsCorrect { get; set; }

    /// <summary> Soru içindeki sıralama. </summary>
    public int Order { get; set; } = 0;
}
