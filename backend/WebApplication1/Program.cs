
using System.Text;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Task = WebApplication1.Task;
using Microsoft.Extensions.Configuration;
using WebApplication1;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific Origin", policy =>
    {
        policy.WithOrigins("http://localhost:5173");
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowCredentials();
    });
});


var connectionString = builder.Configuration.GetConnectionString("AzureSqlConnection")
                       ?? throw new InvalidOperationException("Connection string 'AzureSqlConnection' not found.");;

builder.Services.AddDbContext<TaskContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<AuthDbContext>();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Lockout.AllowedForNewUsers = false;  // Standardmäßig auf true gesetzt
    options.Lockout.MaxFailedAccessAttempts = 10;  // Maximale Anzahl der Versuche
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5); // Sperrdauer
});





var app = builder.Build();

app.UseAuthorization();

app.UseCors("AllowSpecific Origin");
app.UseHttpsRedirection();




app.MapPost("/add", async (Task task, TaskContext context, HttpContext httpContext) =>
{

    var name = httpContext.User.Identity?.Name;
    Console.WriteLine($"Name: {task.Name}, Description: {task.Description}, id: {task.id}, finished: {task.Finished} timeCreated: {task.timeCreated}");
    if (name != null)
    {
        task.userId = name;
    }
    else
    {
        task.userId = "user";
    }
    context.Tasks.Add(task);
    await context.SaveChangesAsync();
    
    return Results.Created($"{task.Name}", task);
});

app.MapGet("/tasks", async (TaskContext context, HttpContext httpContext) =>
{
    
    var name = httpContext.User.Identity?.Name;
    Console.WriteLine($"Name: {name}");
    try
    {
      if (name == null)
        {
            name = "user";
            var defaultTaskList = await context.Tasks.Where(t => t.userId == name).ToListAsync();
            return Results.Ok(defaultTaskList);
        
        }
        var taskList = await context.Tasks.Where(t => t.userId == name).ToListAsync();
        return Results.Ok(taskList);

    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        return Results.StatusCode(500);
    }
    
});


app.MapGet("/task/{id}", async (string id, TaskContext context, HttpContext httpContext) =>
{
    var name = httpContext.User.Identity?.Name;
    if (name == null)
    {
        name = "user";
    }
    var task = await context.Tasks.Where(t => t.id == id && t.userId == name).FirstOrDefaultAsync();

    if (task == null)
    {
        return Results.NotFound();
    }
    
    return Results.Ok(task);
});

app.MapDelete("/delete/{id}", async (string id, TaskContext context, HttpContext httpContext) =>
{
    var name = httpContext.User.Identity?.Name;
    if (name == null)
    {
        name = "user";
    }
    var task = await context.Tasks.Where(t => t.id == id && t.userId == name).FirstOrDefaultAsync();

    if (task == null)
    {
        return Results.NotFound();
    }
    context.Tasks.Remove(task);
    await context.SaveChangesAsync();
    return Results.NoContent();
});


app.MapPatch("/update/{id}", async (string id, TaskContext context, HttpContext httpContext) =>
{
    var name = httpContext.User.Identity.Name;
    if (name == null)
    {
        name = "user";
    }
    var task = await context.Tasks.Where(t => t.id == id && t.userId == name).FirstOrDefaultAsync();

    if (task == null)
    {
        return Results.NotFound("Task not found");
    }
    task.Finished = !task.Finished;
    context.Tasks.Update(task);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

app.MapPost("/logout", async (SignInManager<IdentityUser> signInManager,
        [FromBody] object empty) =>
    {
        if (empty != null)
        {
            await signInManager.SignOutAsync();
            return Results.Ok();
        }
        return Results.Unauthorized();
    })
    .WithOpenApi()
    .RequireAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapIdentityApi<IdentityUser>();

app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.Run();
