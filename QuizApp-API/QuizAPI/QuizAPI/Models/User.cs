using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace QuizApi.Models;

public enum UserRole { Admin = 1, Instructor = 2, Student = 3 }

[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = default!;

    [Required, MaxLength(500)]
    public string PasswordHash { get; set; } = default!;

    [MaxLength(120)]
    public string? FullName { get; set; }

    public UserRole Role { get; set; } = UserRole.Student;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    [Timestamp] public byte[]? RowVersion { get; set; }

    public ICollection<Quiz>? Quizzes { get; set; }
    public ICollection<Attempt>? Attempts { get; set; }
}
