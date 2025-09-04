using System.ComponentModel.DataAnnotations;

namespace QuizApi.Models;

public class Attempt
{
    public int Id { get; set; }

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public int UserId { get; set; }
    public User User { get; set; } = default!;

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    /// <summary> Toplam puan (finish sırasında hesaplanır). </summary>
    public int? Score { get; set; }

    [Timestamp] public byte[]? RowVersion { get; set; }

    public ICollection<AttemptAnswer> Answers { get; set; } = new List<AttemptAnswer>();
}
