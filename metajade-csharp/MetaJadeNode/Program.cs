using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// 从命令行参数获取端口号
int port = 5000;
if (args.Length > 0 && args[0].StartsWith("--port="))
{
    var portArg = args[0].Substring(7);
    if (int.TryParse(portArg, out int parsedPort))
    {
        port = parsedPort;
        Console.WriteLine($"使用命令行指定的端口: {port}");
    }
}

// 配置Kestrel服务器，允许通过命令行指定端口
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(port, listenOptions =>
    {
        // 在开发环境中允许HTTP/1.1和HTTP/2
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2;
    });
});

// 添加控制器服务
builder.Services.AddControllers();

// 添加日志服务
builder.Logging.AddDebug();

// 添加Cors支持
builder.Services.AddCors(o => o.AddPolicy("AllowAll", builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
}));

var app = builder.Build();

// 启用路由
app.UseRouting();

// 启用Cors
app.UseCors();

// 映射控制器端点
app.MapControllers();

// 映射健康检查端点
app.MapGet("/", async context =>
{
    await context.Response.WriteAsync("玄玉区块链核心库 RESTful 服务正在运行中");
});

app.Run();
