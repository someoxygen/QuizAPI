using System.ComponentModel.DataAnnotations;
using QuizApi.Models;

namespace QuizApi.DTOs;

public class OptionDto
{
    public int Id { get; set; }

    [Required, MaxLength(1000)]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }

    public int Order { get; set; } = 0;
}

public class QuestionDto
{
    public int Id { get; set; }

    [Required, MaxLength(2000)]
    public string Text { get; set; } = string.Empty;

    public QuestionType Type { get; set; } = QuestionType.SingleChoice;

    public int Points { get; set; } = 1;

    public int Order { get; set; } = 0;

    public List<OptionDto> Options { get; set; } = new();
}

public class QuizCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    public int? TimeLimitSeconds { get; set; }

    public bool IsPublished { get; set; }

    [MinLength(1)]
    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuizResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public int? TimeLimitSeconds { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CreatedByUserId { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
}
