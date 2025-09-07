using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApi.Data;
using QuizApi.DTOs;
using QuizApi.Models;
using System.Security.Claims;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    private readonly AppDbContext _db;

    public QuizzesController(AppDbContext db) => _db = db;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<QuizResponseDto>>> GetAll([FromQuery] bool includeUnpublished = false)
    {
        var q = _db.Quizzes
            .Include(x => x.Questions).ThenInclude(x => x.Options)
            .AsQueryable();

        if (!includeUnpublished) q = q.Where(x => x.IsPublished);

        var list = await q.OrderByDescending(x => x.CreatedAt)
            .Select(x => new QuizResponseDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                IsPublished = x.IsPublished,
                CreatedAt = x.CreatedAt,
                CreatedByUserId = x.CreatedByUserId,
                TimeLimitSeconds = x.TimeLimitSeconds,
                Questions = x.Questions
                    .OrderBy(qq => qq.Order)
                    .Select(qq => new QuestionDto
                    {
                        Id = qq.Id,
                        Text = qq.Text,
                        Type = qq.Type,
                        Points = qq.Points,
                        Order = qq.Order,
                        Options = qq.Options
                            .OrderBy(o => o.Order)
                            .Select(o => new OptionDto { Id = o.Id, Text = o.Text, IsCorrect = o.IsCorrect, Order = o.Order })
                            .ToList()
                    }).ToList()
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<QuizResponseDto>> Get(int id)
    {
        var x = await _db.Quizzes
            .Include(q => q.Questions).ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (x is null) return NotFound();

        var dto = new QuizResponseDto
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            IsPublished = x.IsPublished,
            CreatedAt = x.CreatedAt,
            CreatedByUserId = x.CreatedByUserId,
            TimeLimitSeconds = x.TimeLimitSeconds,
            Questions = x.Questions
                .OrderBy(qq => qq.Order)
                .Select(qq => new QuestionDto
                {
                    Id = qq.Id,
                    Text = qq.Text,
                    Type = qq.Type,
                    Points = qq.Points,
                    Order = qq.Order,
                    Options = qq.Options
                        .OrderBy(o => o.Order)
                        .Select(o => new OptionDto { Id = o.Id, Text = o.Text, IsCorrect = o.IsCorrect, Order = o.Order })
                        .ToList()
                }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    //[Authorize(Roles = "Admin,Instructor")]
    [AllowAnonymous]
    public async Task<ActionResult> Create([FromBody] QuizCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdStr)) return Unauthorized();
        var userId = int.Parse(userIdStr);

        var quiz = new Quiz
        {
            Title = dto.Title,
            Description = dto.Description,
            IsPublished = dto.IsPublished,
            TimeLimitSeconds = dto.TimeLimitSeconds,
            CreatedByUserId = userId,
            Questions = dto.Questions.Select(q => new Question
            {
                Text = q.Text,
                Type = q.Type,
                Points = q.Points,
                Order = q.Order,
                Options = q.Options.Select(o => new Option
                {
                    Text = o.Text,
                    IsCorrect = o.IsCorrect,
                    Order = o.Order
                }).ToList()
            }).ToList()
        };

        _db.Quizzes.Add(quiz);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = quiz.Id }, new { quiz.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizCreateDto dto)
    {
        var quiz = await _db.Quizzes
            .Include(q => q.Questions).ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz is null) return NotFound();

        quiz.Title = dto.Title;
        quiz.Description = dto.Description;
        quiz.IsPublished = dto.IsPublished;
        quiz.TimeLimitSeconds = dto.TimeLimitSeconds;

        // Basit yaklaşım: soruları/şıkları komple yenile
        _db.Options.RemoveRange(quiz.Questions.SelectMany(q => q.Options));
        _db.Questions.RemoveRange(quiz.Questions);

        quiz.Questions = dto.Questions.Select(q => new Question
        {
            Text = q.Text,
            Type = q.Type,
            Points = q.Points,
            Order = q.Order,
            Options = q.Options.Select(o => new Option
            {
                Text = o.Text,
                IsCorrect = o.IsCorrect,
                Order = o.Order
            }).ToList()
        }).ToList();

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<IActionResult> Delete(int id)
    {
        var quiz = await _db.Quizzes.FindAsync(id);
        if (quiz is null) return NotFound();

        _db.Quizzes.Remove(quiz);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
