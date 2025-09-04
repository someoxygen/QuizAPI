namespace QuizApi.Models;

/// <summary>
/// Basitlik için seçilen şıklar virgülle ayrılmış ID string'i olarak saklanır (örn: "3,4").
/// İleride normalize etmek istersen AttemptAnswerOption gibi bir join tabloya ayırabiliriz.
/// </summary>
public class AttemptAnswer
{
    public int Id { get; set; }

    public int AttemptId { get; set; }
    public Attempt Attempt { get; set; } = default!;

    public int QuestionId { get; set; }
    public Question Question { get; set; } = default!;

    public string SelectedOptionIds { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
    public int PointsAwarded { get; set; }
}
