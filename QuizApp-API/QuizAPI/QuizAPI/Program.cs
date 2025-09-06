using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QuizApi.Data;
using QuizApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON (enum -> string, döngü kýr)
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Swagger + JWT + XML comments (opsiyonel ama önerilir)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Quiz API", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Bearer token"
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    // XML yorumlarýný Swagger'a ekle (Proje özelliklerinden "XML documentation file" açýk olmalý)
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
});

// EF Core — SQL Server (lokal)
var connStr = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(connStr, sql =>
    {
        // Migrasyonlarý bu assembly'e yaz (data katmaný ayrýyse ona iþaret et)
        sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
        // Geçici hatalarda yeniden dene
        sql.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });

#if DEBUG
    opt.EnableSensitiveDataLogging();
    opt.EnableDetailedErrors();
#endif
});

// HealthChecks (basit)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("db");

// JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.FromSeconds(30) // token süresi toleransý
    };
});

builder.Services.AddAuthorization();

// DI
builder.Services.AddScoped<ITokenService, TokenService>();

// CORS: lokal frontend'ler için
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("local", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:4200", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

// DB migrate (+ isteðe baðlý seed) – dev kolaylýðý
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();

        // Ýstersen burada seed çaðýr:
        // await SeedData.RunAsync(db);
    }
    catch (Exception ex)
    {
        // Ýlk çalýþtýrmada migration yoksa veya baðlantý sorununda logla
        app.Logger.LogError(ex, "DB migrate sýrasýnda hata oluþtu");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("local");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health endpoints
app.MapHealthChecks("/health");

app.Run();
