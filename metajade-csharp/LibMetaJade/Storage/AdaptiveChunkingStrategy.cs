using System;

namespace LibMetaJade.Storage
{
    /// <summary>
    /// IPFS 自适应分块策略
    /// 根据文件大小动态调整分块尺寸，优化存储效率和传输性能
    /// </summary>
    public class AdaptiveChunkingStrategy
    {
    /// <summary>最小分块大小（64KB）</summary>
        private const int MinChunkSize = 64 * 1024;
   
        /// <summary>默认分块大小（256KB）</summary>
        private const int DefaultChunkSize = 256 * 1024;
        
        /// <summary>大文件分块大小（2MB）</summary>
        private const int LargeChunkSize = 2 * 1024 * 1024;
        
/// <summary>小文件阈值（1MB）</summary>
        private const long SmallFileThreshold = 1 * 1024 * 1024;
        
        /// <summary>中文件阈值（100MB）</summary>
        private const long MediumFileThreshold = 100 * 1024 * 1024;

     /// <summary>
     /// 根据文件大小计算最优分块大小
  /// </summary>
        /// <param name="fileSize">文件大小（字节）</param>
  /// <returns>推荐的分块大小（字节）</returns>
     public int CalculateOptimalChunkSize(long fileSize)
        {
            return fileSize switch
            {
    // 小于1MB：不分块，直接存储
    < SmallFileThreshold => (int)fileSize,

     // 1MB-100MB：使用256KB分块
         < MediumFileThreshold => DefaultChunkSize,
  
        // 100MB-1GB：使用2MB分块
          < 1024L * 1024 * 1024 => LargeChunkSize,
           
       // 超大文件：使用4MB分块
      _ => 4 * 1024 * 1024
       };
        }

        /// <summary>
        /// 计算文件的分块数量
        /// </summary>
        public int CalculateChunkCount(long fileSize)
        {
    if (fileSize < SmallFileThreshold)
     return 1; // 小文件不分块

   var chunkSize = CalculateOptimalChunkSize(fileSize);
   return (int)Math.Ceiling((double)fileSize / chunkSize);
        }

        /// <summary>
      /// 获取分块策略描述
   /// </summary>
  public string GetStrategyDescription(long fileSize)
        {
   var chunkSize = CalculateOptimalChunkSize(fileSize);
     var chunkCount = CalculateChunkCount(fileSize);
   
      return $"FileSize: {FormatBytes(fileSize)}, " +
         $"ChunkSize: {FormatBytes(chunkSize)}, " +
         $"ChunkCount: {chunkCount}";
     }

        private static string FormatBytes(long bytes)
    {
   string[] sizes = { "B", "KB", "MB", "GB", "TB" };
   double len = bytes;
            int order = 0;
         while (len >= 1024 && order < sizes.Length - 1)
   {
 order++;
    len /= 1024;
   }
  return $"{len:0.##} {sizes[order]}";
        }
    }

    /// <summary>
    /// 分块元数据
    /// </summary>
    public class ChunkMetadata
    {
        /// <summary>分块索引</summary>
  public int Index { get; set; }
        
        /// <summary>分块CID</summary>
        public string CID { get; set; } = string.Empty;
        
     /// <summary>分块大小</summary>
 public int Size { get; set; }
   
        /// <summary>分块哈希</summary>
        public byte[] Hash { get; set; } = Array.Empty<byte>();
 
        /// <summary>在原始文件中的偏移量</summary>
      public long Offset { get; set; }
    }
}
