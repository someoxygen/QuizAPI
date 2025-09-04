using System.ComponentModel.DataAnnotations;

namespace QuizApi.Models;

public class Quiz
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = default!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    /// <summary> Saniye cinsinden süre sınırı (opsiyonel). </summary>
    public int? TimeLimitSeconds { get; set; }

    public bool IsPublished { get; set; } = false;

    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = default!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    [Timestamp] public byte[]? RowVersion { get; set; }

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
