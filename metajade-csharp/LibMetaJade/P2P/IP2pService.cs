using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LibMetaJade.P2P
{
    public interface IP2pService : IAsyncDisposable
    {
        /// <summary>
        /// Start the P2P service. If <paramref name="sidecarExePath"/> is provided the service may start a sidecar process.
        /// </summary>
        Task StartAsync(string? sidecarExePath = null, CancellationToken ct = default);

        /// <summary>
        /// Stop the P2P service and any started sidecar.
        /// </summary>
        Task StopAsync();

        /// <summary>
        /// Share a local file and return the resource identifier (CID or similar).
        /// </summary>
        Task<string> ShareFileAsync(string localPath, CancellationToken ct = default);

        /// <summary>
        /// Download a resource identified by cid and write to the destination stream.
        /// </summary>
        Task DownloadAsync(string cid, Stream destination, IProgress<double>? progress = null, CancellationToken ct = default);

        /// <summary>
        /// Get a list of connected peers or addresses.
        /// </summary>
        Task<IEnumerable<string>> GetPeersAsync(CancellationToken ct = default);
    }
}
