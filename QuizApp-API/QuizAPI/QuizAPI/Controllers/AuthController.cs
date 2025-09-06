using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using QuizApi.Data;
using QuizApi.DTOs;
using QuizApi.Models;
using QuizApi.Services;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _hasher;
    private readonly ITokenService _token;

    public AuthController(AppDbContext db, IPasswordHasher<User> hasher, ITokenService token)
    {
        _db = db;
        _hasher = hasher;
        _token = token;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });

        var email = req.Email.Trim().ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(x => x.Email == email);
        if (exists) return Conflict(new { message = "Email already exists." });

        var user = new User
        {
            Email = email,
            FullName = req.FullName?.Trim(),
            Role = UserRole.Student, // default
            IsActive = true
        };

        user.PasswordHash = _hasher.HashPassword(user, req.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _token.CreateToken(user); // User bilgisi ile claim üret
        return Ok(new AuthResponse { Token = token, Email = user.Email, FullName = user.FullName, Role = (int)user.Role });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email && x.IsActive);
        if (user is null) return Unauthorized(new { message = "Invalid credentials." });

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            // (opsiyonel) daha iyi algoritma sürümüne rehash
            user.PasswordHash = _hasher.HashPassword(user, req.Password);
            await _db.SaveChangesAsync();
        }
        else if (result != PasswordVerificationResult.Success)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var token = _token.CreateToken(user);
        return Ok(new AuthResponse { Token = token, Email = user.Email, FullName = user.FullName, Role = (int)user.Role });
    }
}
