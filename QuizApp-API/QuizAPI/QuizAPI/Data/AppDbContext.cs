using Microsoft.EntityFrameworkCore;
using QuizApi.Models;
using System.Reflection;

namespace QuizApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Option> Options => Set<Option>();
    public DbSet<Attempt> Attempts => Set<Attempt>();
    public DbSet<AttemptAnswer> AttemptAnswers => Set<AttemptAnswer>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        base.OnModelCreating(model);

        // ---------- User ----------
        model.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(200);
            e.Property(u => u.PasswordHash).HasMaxLength(500);
            e.Property(u => u.FullName).HasMaxLength(120);
            e.Property(u => u.CreatedAt);
                //.HasDefaultValueSql("GETUTCDATE()"); // Azure SQL için
            e.Property(u => u.RowVersion).IsRowVersion();
        });

        // ---------- Quiz ----------
        model.Entity<Quiz>(e =>
        {
            e.Property(q => q.Title).HasMaxLength(200).IsRequired();
            e.Property(q => q.Description).HasMaxLength(2000);
            e.Property(q => q.CreatedAt);
                //.HasDefaultValueSql("GETUTCDATE()");
            e.Property(q => q.RowVersion).IsRowVersion();

            e.HasOne(q => q.CreatedByUser)
                .WithMany(u => u.Quizzes!)
                .HasForeignKey(q => q.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Sık gelen sorgular için faydalı indexler
            e.HasIndex(q => new { q.IsPublished, q.CreatedAt });
        });

        // ---------- Question ----------
        model.Entity<Question>(e =>
        {
            e.Property(q => q.Text).HasMaxLength(2000).IsRequired();
            e.Property(q => q.Points);
            //.HasDefaultValue(1);
            e.Property(q => q.Order);
            //.HasDefaultValue(0);

            e.HasOne(q => q.Quiz)
                .WithMany(z => z.Questions)
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(q => new { q.QuizId, q.Order });
        });

        // ---------- Option ----------
        model.Entity<Option>(e =>
        {
            e.Property(o => o.Text).HasMaxLength(1000).IsRequired();
            e.Property(o => o.Order);
            //.HasDefaultValue(0);

            e.HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(o => new { o.QuestionId, o.Order });
        });

        // ---------- Attempt ----------
        model.Entity<Attempt>(e =>
        {
            e.Property(a => a.StartedAt);
                //.HasDefaultValueSql("GETUTCDATE()");
            e.Property(a => a.RowVersion).IsRowVersion();

            e.HasOne(a => a.Quiz)
                .WithMany()
                .HasForeignKey(a => a.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(a => a.User)
                .WithMany(u => u.Attempts!)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Raporlama/sorgu performansı için kullanışlı index
            e.HasIndex(a => new { a.UserId, a.QuizId, a.StartedAt });
        });

        // ---------- AttemptAnswer ----------
        model.Entity<AttemptAnswer>(e =>
        {
            e.Property(x => x.SelectedOptionIds)
                .HasMaxLength(400); // "1,3,5" gibi değerler için yeterli

            e.HasOne(x => x.Attempt)
                .WithMany(a => a.Answers)
                .HasForeignKey(x => x.AttemptId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Question)
                .WithMany()
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => new { x.AttemptId, x.QuestionId }).IsUnique(false);
        });
    }

    // UpdatedAt otomatik yönetimi (User ve Quiz için)
    public override int SaveChanges()
    {
        TouchUpdatedAt();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        TouchUpdatedAt();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void TouchUpdatedAt()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State != EntityState.Modified) continue;

            var entityType = entry.Entity.GetType();
            var prop = entityType.GetProperty("UpdatedAt", BindingFlags.Public | BindingFlags.Instance);
            if (prop is not null && prop.PropertyType == typeof(DateTime?))
            {
                entry.CurrentValues["UpdatedAt"] = utcNow;
            }
        }
    }
}
