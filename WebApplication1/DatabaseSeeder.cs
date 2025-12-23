using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1
{
    public class DatabaseSeeder
    {
        public static async Task SeedDatabaseAsync(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            try
            {
                // Apply pending migrations
                await context.Database.MigrateAsync();
                
                // Log success
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseSeeder>>();
                logger.LogInformation("Database migration completed successfully");
            }
            catch (Exception ex)
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseSeeder>>();
                logger.LogError(ex, "An error occurred while migrating the database.");
                throw;
            }
        }
    }
}