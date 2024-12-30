
using Task = WebApplication1.Task;


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

var app = builder.Build();

var tasks = new List<Task>();


app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.MapPost("/add", (Task task) =>
{
    Console.WriteLine($"Name: {task.Name}, Description: {task.Description}, id: {task.id}, finished: {task.Finished} timeCreated: {task.timeCreated}");
    tasks.Add(task);
    return Results.Created($"{task.Name}", task);
});

app.MapGet("/tasks", () =>
{
    return Results.Ok(tasks);
});

app.MapGet("/task/{id}", (string id) =>
{
    var task = tasks.FirstOrDefault(t => t.id == id);
    if (task != null)
    {
        return Results.Json(task);
    }
    return Results.NotFound("Task not found");
});

app.MapDelete("/delete/{id}", (string id) =>
{
    Console.WriteLine($"Will delete Id: {id}");
    var task = tasks.FirstOrDefault(t => t.id == id);
    if (task != null)
    {
        tasks.Remove(task);
        return Results.Ok(tasks);
    }
    return Results.NotFound("Task not found");
});

app.MapPatch("/update/{id}", (string id) =>
{
    var task = tasks.FirstOrDefault(t => t.id == id);
    if (task != null)
    {
        task.Finished = !task.Finished;
        return Results.Ok(task);
    }
    return Results.NotFound("Task not found");
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.Run();
