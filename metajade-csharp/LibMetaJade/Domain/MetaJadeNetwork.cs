using System.IO;
using System.Threading.Tasks;
using Ipfs.Engine;

namespace LibMetaJade.Domain
{
    public class MetaJadeNetwork
    {
        private static readonly IpfsEngine engine = new();

        public static async Task<MetaJadeBlock> GetBlock(string cid)
        {
            await engine.StartAsync();
            await using var contentStream = await engine.FileSystem.ReadFileAsync(cid);
            using var ms = new MemoryStream();
            await contentStream.CopyToAsync(ms);
            return MetaJadeBlock.FromBytes(ms.ToArray());
        }
    }
}
