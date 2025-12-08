using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ipfs.Engine;
using Ipfs.CoreApi;

namespace LibMetaJade.P2P.Implementations
{
    /// <summary>
    /// P2P implementation backed by libp2p using Ipfs.Engine (in-process node).
    /// </summary>
    public sealed class Libp2pP2pService : IP2pService
    {
        private IpfsEngine? _engine;
        private Process? _sidecar;
        private bool _started;

        public async Task StartAsync(string? sidecarExePath = null, CancellationToken ct = default)
        {
            if (_started)
                return;

            _engine = new IpfsEngine();
            // Try to set a private repository path if supported.
            try
            {
                var repoPath = GetDefaultRepoPath();
                // In newer Ipfs.Engine versions, this controls the repository location
                _engine.Options.Repository.Folder = repoPath;
            }
            catch
            {
                // If the engine/options layout differs, just use defaults.
            }

            await _engine.StartAsync().ConfigureAwait(false);
            _started = true;
        }

        public async Task StopAsync()
        {
            _started = false;
            if (_engine is not null)
            {
                await _engine.StopAsync().ConfigureAwait(false);
                _engine = null;
            }

            if (_sidecar is not null && !_sidecar.HasExited)
            {
                try { _sidecar.Kill(true); } catch { /* ignore */ }
                _sidecar.Dispose();
                _sidecar = null;
            }
        }

        public async Task<string> ShareFileAsync(string localPath, CancellationToken ct = default)
        {
            if (_engine is null) throw new InvalidOperationException("P2P service not started.");
            if (string.IsNullOrWhiteSpace(localPath)) throw new ArgumentException("Value cannot be null or empty.", nameof(localPath));
            if (!File.Exists(localPath)) throw new FileNotFoundException("File to share not found.", localPath);

            var node = await _engine.FileSystem.AddFileAsync(localPath, new AddFileOptions(), ct).ConfigureAwait(false);
            // node.Id is Cid; return string representation
            return node.Id.ToString();
        }

        public async Task DownloadAsync(string cid, Stream destination, IProgress<double>? progress = null, CancellationToken ct = default)
        {
            if (_engine is null) throw new InvalidOperationException("P2P service not started.");
            if (string.IsNullOrWhiteSpace(cid)) throw new ArgumentException("Value cannot be null or empty.", nameof(cid));
            if (destination is null) throw new ArgumentNullException(nameof(destination));

            await using var source = await _engine.FileSystem.ReadFileAsync(cid, ct).ConfigureAwait(false);

            var buffer = new byte[64 * 1024];
            long totalRead = 0;
            int read;
            while ((read = await source.ReadAsync(buffer.AsMemory(0, buffer.Length), ct).ConfigureAwait(false)) > 0)
            {
                await destination.WriteAsync(buffer.AsMemory(0, read), ct).ConfigureAwait(false);
                totalRead += read;
                progress?.Report(totalRead);
            }
        }

        public async Task<IEnumerable<string>> GetPeersAsync(CancellationToken ct = default)
        {
            if (_engine is null) throw new InvalidOperationException("P2P service not started.");
            var peers = await _engine.Swarm.PeersAsync(ct).ConfigureAwait(false);

            var result = new List<string>();
            foreach (var p in peers)
            {
                // Try common properties exposed by Ipfs.Core Peer
                var addresses = new List<string>();
                try
                {
                    var addrsProp = p.GetType().GetProperty("Addresses");
                    if (addrsProp?.GetValue(p) is System.Collections.IEnumerable addrEnum)
                    {
                        foreach (var a in addrEnum)
                        {
                            addresses.Add(a?.ToString() ?? string.Empty);
                        }
                    }
                }
                catch { }

                if (addresses.Count == 0)
                {
                    result.Add(p.ToString());
                }
                else
                {
                    result.AddRange(addresses);
                }
            }
            return result;
        }

        private static string GetDefaultRepoPath()
        {
            var basePath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var path = Path.Combine(basePath, "MetaJade", "ipfs-repo");
            Directory.CreateDirectory(path);
            return path;
        }

        public async ValueTask DisposeAsync()
        {
            await StopAsync().ConfigureAwait(false);
        }
    }
}
