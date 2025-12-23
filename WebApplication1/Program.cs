using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using WebApplication1.Data;
using WebApplication1.Middleware;
using WebApplication1.Services;
using WebApplication1.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT Secret is not configured")))
        };
    });

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register custom services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Build the app without running migrations yet
var app = builder.Build();

// Run database initialization and schema creation with retry logic
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        // Attempt to create database schema with retry logic
        for (int attempt = 1; attempt <= 3; attempt++)
        {
            try
            {
                // Wait a bit to ensure database connection is ready
                if (attempt > 1)
                {
                    Task.Delay(TimeSpan.FromSeconds(attempt)).Wait(); // Increase delay with each attempt
                }

                // Ensure database and schema exist
                context.Database.EnsureCreated();

                // Test the connection by checking if we can access the database
                var testQuery = context.Database.ExecuteSqlRaw("SELECT 1");

                logger.LogInformation($"Database schema created successfully on attempt {attempt}");
                break; // Success, exit retry loop
            }
            catch (Exception ex)
            {
                if (attempt == 3) // Last attempt
                {
                    logger.LogError(ex, "Failed to create database schema after {Attempts} attempts", attempt);
                    throw;
                }
                else
                {
                    logger.LogWarning(ex, "Attempt {Attempt} to create database schema failed, retrying...", attempt);
                }
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while creating the database schema.");
        throw; // Re-throw to prevent the app from starting if database creation fails
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();

// Serve static files (React build)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

// Use CORS (using default policy configured above)
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Map controllers first
app.MapControllers();

// Serve React SPA, API routes take precedence
app.MapFallbackToFile("index.html"); // Fallback everything else to index.html

app.Run();