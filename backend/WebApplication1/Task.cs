using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options) : base(options)
        {
            
        }
        
        public DbSet<Task> Tasks { get; set; }
    }
    
    
    public class Task
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string id { get; set; }
        
        public bool Finished { get; set; }
        
        public string timeCreated { get; set; }
    }
}