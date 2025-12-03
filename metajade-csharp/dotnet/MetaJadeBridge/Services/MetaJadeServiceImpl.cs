using Grpc.Core;
using LibMetaJade.P2P;
using LibMetaJade.P2P.Implementations;
using LibMetaJade.Domain;
using MetaJadeBridge.Protos;

namespace MetaJadeBridge.Services
{
    public class MetaJadeServiceImpl : MetaJadeService.MetaJadeServiceBase
    {
        // 存储当前运行的节点实例
        private MetaJadeNode? _metaJadeNode;
        private IP2pService? _p2pService;
        private string _userCid = "default-user-cid"; // 默认用户CID

        // 初始化并启动DHT服务器
        public override async Task<InitializeResponse> Initialize(InitializeRequest request, ServerCallContext context)
        {
            try
            {
                // 如果已经初始化，返回成功
                if (_metaJadeNode != null)
                {
                    return new InitializeResponse { Success = true };
                }

                // 创建并初始化P2P服务
                _p2pService = new Libp2pP2pService();
                await _p2pService.StartAsync();

                // 创建MetaJade节点
                _metaJadeNode = new MetaJadeNode(_userCid, _p2pService);

                return new InitializeResponse { Success = true };
            }
            catch (Exception ex)
            {
                return new InitializeResponse { Success = false, Error = ex.Message };
            }
        }

        // 停止DHT服务器
        public override async Task<ShutdownResponse> Shutdown(ShutdownRequest request, ServerCallContext context)
        {
            try
            {
                // 如果已经关闭，返回成功
                if (_metaJadeNode == null)
                {
                    return new ShutdownResponse { Success = true };
                }

                // 停止服务
                if (_p2pService != null)
                {
                    await _p2pService.StopAsync();
                }

                // 清理资源
                _metaJadeNode = null;
                _p2pService = null;

                return new ShutdownResponse { Success = true };
            }
            catch (Exception ex)
            {
                return new ShutdownResponse { Success = false, Error = ex.Message };
            }
        }

        // 获取DHT服务器状态
        public override Task<GetStatusResponse> GetStatus(GetStatusRequest request, ServerCallContext context)
        {
            try
            {
                // 如果未初始化，返回默认状态
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Task.FromResult(new GetStatusResponse
                    {
                        Status = "stopped",
                        Initialized = false,
                        PeerId = string.Empty,
                        Multiaddrs = { },
                        ConnectionCount = 0,
                        RoutingTableSize = 0
                    });
                }

                // 获取节点状态
                var status = new GetStatusResponse
                {
                    Status = "running",
                    Initialized = true,
                    PeerId = _metaJadeNode.UserCid, // 使用MetaJadeNode的UserCid作为PeerId
                    Multiaddrs = { "/ip4/127.0.0.1/tcp/4001" }, // 模拟地址
                    ConnectionCount = 0, // 当前API不支持
                    RoutingTableSize = 0 // 当前API不支持
                };

                return Task.FromResult(status);
            }
            catch (Exception ex)
            {
                // 如果出错，返回错误状态
                return Task.FromResult(new GetStatusResponse
                {
                    Status = "error",
                    Initialized = false,
                    PeerId = string.Empty,
                    Multiaddrs = { },
                    ConnectionCount = 0,
                    RoutingTableSize = 0
                });
            }
        }

        // 存储数据到DHT
        public override async Task<StoreDataResponse> StoreData(StoreDataRequest request, ServerCallContext context)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return new StoreDataResponse { Success = false, Error = "服务未初始化" };
                }

                // 当前API不支持直接存储数据到DHT，返回模拟成功
                // 实际应用中，需要根据C#核心库的实际API调整
                return new StoreDataResponse { Success = true };
            }
            catch (Exception ex)
            {
                return new StoreDataResponse { Success = false, Error = ex.Message };
            }
        }

        // 从DHT检索数据
        public override async Task<RetrieveDataResponse> RetrieveData(RetrieveDataRequest request, ServerCallContext context)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return new RetrieveDataResponse { Success = false, Error = "服务未初始化" };
                }

                // 当前API不支持直接从DHT检索数据，返回模拟数据
                // 实际应用中，需要根据C#核心库的实际API调整
                return new RetrieveDataResponse { Success = true, Value = "模拟数据" };
            }
            catch (Exception ex)
            {
                return new RetrieveDataResponse { Success = false, Error = ex.Message };
            }
        }

        // 查找提供特定键的节点
        public override async Task<FindProvidersResponse> FindProviders(FindProvidersRequest request, ServerCallContext context)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return new FindProvidersResponse { Providers = { }, Error = "服务未初始化" };
                }

                // 获取连接的节点列表
                var peers = await _p2pService.GetPeersAsync(context.CancellationToken);

                return new FindProvidersResponse { Providers = { peers }, Error = string.Empty };
            }
            catch (Exception ex)
            {
                return new FindProvidersResponse { Providers = { }, Error = ex.Message };
            }
        }

        // 查找特定ID的节点
        public override async Task<FindPeerResponse> FindPeer(FindPeerRequest request, ServerCallContext context)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return new FindPeerResponse { PeerId = string.Empty, Addresses = { }, Error = "服务未初始化" };
                }

                // 当前API不支持直接查找特定ID的节点，返回模拟数据
                // 实际应用中，需要根据C#核心库的实际API调整
                return new FindPeerResponse 
                {
                    PeerId = request.PeerId, 
                    Addresses = { "/ip4/127.0.0.1/tcp/4001" },
                    Error = string.Empty
                };
            }
            catch (Exception ex)
            {
                return new FindPeerResponse { PeerId = string.Empty, Addresses = { }, Error = ex.Message };
            }
        }

        // 提供当前节点作为指定键的数据提供者
        public override async Task<ProvideResponse> Provide(ProvideRequest request, ServerCallContext context)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return new ProvideResponse { Success = false, Error = "服务未初始化" };
                }

                // 当前API不支持直接提供数据，返回模拟成功
                // 实际应用中，需要根据C#核心库的实际API调整
                return new ProvideResponse { Success = true };
            }
            catch (Exception ex)
            {
                return new ProvideResponse { Success = false, Error = ex.Message };
            }
        }
    }
}
