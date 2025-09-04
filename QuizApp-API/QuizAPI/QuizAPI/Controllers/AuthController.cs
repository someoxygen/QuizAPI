using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using QuizApi.Data;
using QuizApi.DTOs;
using QuizApi.Models;
using QuizApi.Services;
using QuizApi.Utils;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokens;

    public AuthController(AppDbContext db, ITokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var exists = await _db.Users.AnyAsync(u => u.Email == req.Email);
        if (exists) return Conflict("Email zaten kayıtlı.");

        var user = new User
        {
            Email = req.Email.Trim().ToLowerInvariant(),
            FullName = req.FullName,
            PasswordHash = PasswordHasher.Hash(req.Password),
            Role = req.Role
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Email, user.Role));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null) return Unauthorized("Geçersiz kimlik bilgileri.");

        if (!PasswordHasher.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Geçersiz kimlik bilgileri.");

        var token = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Email, user.Role));
    }
}
