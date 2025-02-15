using BLL.Services.Implements.ProductServices;
using BLL.Services.Interfaces.IProductServices;
using DAL.Context;
using DAL.Repositories.Implements.ProductRepos;
using DAL.Repositories.Interfaces.IProductRepos;
using PRN231.ResolveDependencies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.ResolveConnectionString(connectionString);
builder.Services.ResolveBussinessLogicInstance();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
    AppDbContext.SeedData(context);
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
