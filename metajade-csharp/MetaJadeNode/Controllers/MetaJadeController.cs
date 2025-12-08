using Microsoft.AspNetCore.Mvc;
using LibMetaJade.P2P;
using LibMetaJade.P2P.Implementations;
using LibMetaJade.Domain;

namespace MetaJadeNode.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaJadeController : ControllerBase
    {
        // 存储当前运行的节点实例
        private static LibMetaJade.Domain.MetaJadeNode? _metaJadeNode;
        private static IP2pService? _p2pService;
        private static string _userCid = "default-user-cid"; // 默认用户CID

        // 初始化并启动DHT服务器
        [HttpPost("initialize")]
        public async Task<IActionResult> Initialize([FromBody] InitializeRequest request)
        {
            try
            {
                // 如果已经初始化，返回成功
                if (_metaJadeNode != null)
                {
                    return Ok(new { success = true });
                }

                // 创建并初始化P2P服务
                _p2pService = new Libp2pP2pService();
                await _p2pService.StartAsync();

                // 创建MetaJade节点
                _metaJadeNode = new LibMetaJade.Domain.MetaJadeNode(_userCid, _p2pService);

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }

        // 停止DHT服务器
        [HttpPost("shutdown")]
        public async Task<IActionResult> Shutdown()
        {
            try
            {
                // 如果已经关闭，返回成功
                if (_metaJadeNode == null)
                {
                    return Ok(new { success = true });
                }

                // 停止服务
                if (_p2pService != null)
                {
                    await _p2pService.StopAsync();
                }

                // 清理资源
                _metaJadeNode = null;
                _p2pService = null;

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }

        // 获取DHT服务器状态
        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            try
            {
                // 如果未初始化，返回默认状态
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new {
                        status = "stopped",
                        initialized = false,
                        peerId = string.Empty,
                        multiaddrs = new List<string>(),
                        connectionCount = 0,
                        routingTableSize = 0
                    });
                }

                // 获取节点状态
                return Ok(new {
                    status = "running",
                    initialized = true,
                    peerId = _metaJadeNode.UserCid,
                    multiaddrs = new List<string> { "/ip4/127.0.0.1/tcp/4001" },
                    connectionCount = 0,
                    routingTableSize = 0
                });
            }
            catch (Exception ex)
            {
                // 如果出错，返回错误状态
                return Ok(new {
                    status = "error",
                    initialized = false,
                    peerId = string.Empty,
                    multiaddrs = new List<string>(),
                    connectionCount = 0,
                    routingTableSize = 0
                });
            }
        }

        // 存储数据到DHT
        [HttpPost("store")]
        public async Task<IActionResult> StoreData([FromBody] StoreDataRequest request)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new { success = false, error = "服务未初始化" });
                }

                // 当前API不支持直接存储数据到DHT，返回模拟成功
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }

        // 从DHT检索数据
        [HttpGet("retrieve/{key}")]
        public async Task<IActionResult> RetrieveData(string key)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new { success = false, error = "服务未初始化" });
                }

                // 当前API不支持直接从DHT检索数据，返回模拟数据
                return Ok(new { success = true, value = "模拟数据" });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }

        // 查找提供特定键的节点
        [HttpGet("find-providers/{key}")]
        public async Task<IActionResult> FindProviders(string key)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new { providers = new List<string>(), error = "服务未初始化" });
                }

                // 获取连接的节点列表
                var peers = await _p2pService.GetPeersAsync(HttpContext.RequestAborted);

                return Ok(new { providers = peers, error = string.Empty });
            }
            catch (Exception ex)
            {
                return Ok(new { providers = new List<string>(), error = ex.Message });
            }
        }

        // 查找特定ID的节点
        [HttpGet("find-peer/{peerId}")]
        public async Task<IActionResult> FindPeer(string peerId)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new { peerId = string.Empty, addresses = new List<string>(), error = "服务未初始化" });
                }

                // 当前API不支持直接查找特定ID的节点，返回模拟数据
                return Ok(new {
                    peerId = peerId,
                    addresses = new List<string> { "/ip4/127.0.0.1/tcp/4001" },
                    error = string.Empty
                });
            }
            catch (Exception ex)
            {
                return Ok(new { peerId = string.Empty, addresses = new List<string>(), error = ex.Message });
            }
        }

        // 提供当前节点作为指定键的数据提供者
        [HttpPost("provide/{key}")]
        public async Task<IActionResult> Provide(string key)
        {
            try
            {
                // 检查服务是否已初始化
                if (_metaJadeNode == null || _p2pService == null)
                {
                    return Ok(new { success = false, error = "服务未初始化" });
                }

                // 当前API不支持直接提供数据，返回模拟成功
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }
    }

    // 请求和响应模型
    public class InitializeRequest
    {
        public int Port { get; set; } = 6666;
        public bool EnableRelay { get; set; } = false;
    }

    public class StoreDataRequest
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}