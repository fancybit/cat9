using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// 添加gRPC服务
builder.Services.AddGrpc();

// 添加日志服务
builder.Logging.AddDebug();

// 添加Cors支持（如果需要）
builder.Services.AddCors(o => o.AddPolicy("AllowAll", builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader()
           .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
}));

var app = builder.Build();

// 启用HTTP/2支持（对于gRPC）
app.UseRouting();

// 启用Cors
app.UseCors();

app.UseEndpoints(endpoints => {
    // 映射gRPC服务
    endpoints.MapGrpcService<MetaJadeBridge.Services.MetaJadeServiceImpl>();

    // 映射健康检查端点（可选）
    endpoints.MapGet("/", async context => {
        await context.Response.WriteAsync("玄玉区块链核心库 gRPC 服务正在运行中");
    });
});

// 配置Kestrel支持HTTP/2
if (app.Environment.IsDevelopment())
{
    // 在开发环境中，允许HTTP上的HTTP/2
    app.Urls.Add("http://localhost:5001");
}

app.Run();
