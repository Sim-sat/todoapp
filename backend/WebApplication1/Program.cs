
using Microsoft.EntityFrameworkCore;
using Task = WebApplication1.Task;
using Microsoft.Extensions.Configuration;
using WebApplication1;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Erlaube allen Ursprüngen
            .AllowAnyMethod() // Erlaube alle HTTP-Methoden
            .AllowAnyHeader(); // Erlaube alle Header
    });
});


var connectionString = builder.Configuration.GetConnectionString("AzureSqlConnection")
    ?? throw new InvalidOperationException("Connection string 'AzureSqlConnection' not found.");;

builder.Services.AddDbContext<TaskContext>(options => options.UseSqlServer(connectionString));


var app = builder.Build();

var tasks = new List<Task>();


app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.MapPost("/add", async (Task task, TaskContext context) =>
{
    Console.WriteLine($"Name: {task.Name}, Description: {task.Description}, id: {task.id}, finished: {task.Finished} timeCreated: {task.timeCreated}");
    tasks.Add(task);
    context.Tasks.Add(task);
    await context.SaveChangesAsync();
    
    return Results.Created($"{task.Name}", task);
});

app.MapGet("/tasks", async (TaskContext context) =>
{
    var taskList = await context.Tasks.ToListAsync();
    return Results.Ok(taskList);
});

app.MapGet("/task/{id}", async (string id, TaskContext context) =>
{
    var task = await context.Tasks.FindAsync(id);

    if (task == null)
    {
        return Results.NotFound();
    }
    
    return Results.Ok(task);
});

app.MapDelete("/delete/{id}", async (string id, TaskContext context) =>
{
    var task = context.Tasks.Find(id);
    if (task == null)
    {
        return Results.NotFound("Task not found");
    }
    context.Tasks.Remove(task);
    await context.SaveChangesAsync();
    return Results.NoContent();
});


app.MapPatch("/update/{id}", async (string id, TaskContext context) =>
{
    var task = context.Tasks.Find(id);
    if (task == null)
    {
        return Results.NotFound("Task not found");
    }
    task.Finished = !task.Finished;
    context.Tasks.Update(task);
    await context.SaveChangesAsync();
    return Results.NoContent();
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.Run();
