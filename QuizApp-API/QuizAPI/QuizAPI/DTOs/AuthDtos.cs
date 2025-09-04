using System.ComponentModel.DataAnnotations;
using QuizApi.Models;

namespace QuizApi.DTOs;

public record RegisterRequest(
    [property: Required, EmailAddress, MaxLength(200)] string Email,
    [property: Required, MinLength(6), MaxLength(100)] string Password,
    [property: Required] UserRole Role,
    [property: MaxLength(120)] string? FullName = null
);

public record LoginRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password
);

public record AuthResponse(string Token, int UserId, string Email, UserRole Role);
