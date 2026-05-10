using API_Debugger.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<AIService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "https://YOUR-FRONTEND.vercel.app"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
 //   app.UseSwagger();
 //   app.UseSwaggerUI();
//}
app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();
