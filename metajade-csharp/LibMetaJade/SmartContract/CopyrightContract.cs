using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Domain;

namespace LibMetaJade.SmartContract
{
    /// <summary>
    /// 版权信息
    /// </summary>
    public class CopyrightInfo
    {
        /// <summary>作品标题</summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>作品类型（游戏、音乐、视频等）</summary>
        public string ContentType { get; set; } = string.Empty;

        /// <summary>作者/创作者CID</summary>
        public string AuthorCid { get; set; } = string.Empty;

        /// <summary>作品描述</summary>
        public string Description { get; set; } = string.Empty;

      /// <summary>作品文件的IPFS CID</summary>
 public string ContentCid { get; set; } = string.Empty;

 /// <summary>作品哈希（用于验证）</summary>
        public byte[] ContentHash { get; set; } = Array.Empty<byte>();

 /// <summary>授权许可类型</summary>
     public string LicenseType { get; set; } = "All Rights Reserved";

        /// <summary>创作时间</summary>
      public DateTimeOffset CreationDate { get; set; } = DateTimeOffset.UtcNow;

        /// <summary>标签</summary>
public List<string> Tags { get; set; } = new();

        /// <summary>元数据（JSON格式的扩展信息）</summary>
        public Dictionary<string, string> Metadata { get; set; } = new();
    }

    /// <summary>
    /// 版权确权智能合约
    /// 用于游戏、音乐、视频等数字内容的版权登记与保护
    /// </summary>
    public class CopyrightContract : SmartContract
    {
   public CopyrightInfo Copyright { get; private set; } = new();

        /// <summary>版权所有者（可转让）</summary>
public string CurrentOwnerCid { get; private set; } = string.Empty;

     /// <summary>版权转移历史</summary>
        public List<CopyrightTransfer> TransferHistory { get; private set; } = new();

        /// <summary>授权记录</summary>
        public List<CopyrightLicense> Licenses { get; private set; } = new();

   private CopyrightContract() { }

        /// <summary>
        /// 创建版权确权合约
        /// </summary>
        public static CopyrightContract Create(CopyrightInfo copyright, string creatorCid)
        {
            var contract = new CopyrightContract
     {
   Type = ContractType.Copyright,
                CreatorCid = creatorCid,
            CurrentOwnerCid = creatorCid,
         Copyright = copyright
     };

      contract.Participants.Add(creatorCid);

   // 序列化合约数据
    contract.ContractData = System.Text.Json.JsonSerializer.Serialize(copyright);

       return contract;
    }

        public override Task<ValidationResult> ValidateAsync()
        {
            if (string.IsNullOrEmpty(Copyright.Title))
          return Task.FromResult(ValidationResult.Failure("作品标题不能为空"));

            if (string.IsNullOrEmpty(Copyright.AuthorCid))
            return Task.FromResult(ValidationResult.Failure("作者CID不能为空"));

            if (string.IsNullOrEmpty(Copyright.ContentCid))
  return Task.FromResult(ValidationResult.Failure("作品内容CID不能为空"));

  if (Copyright.ContentHash.Length == 0)
       return Task.FromResult(ValidationResult.Failure("作品哈希不能为空"));

        return Task.FromResult(ValidationResult.Success());
     }

   public override async Task<ExecutionResult> ExecuteAsync(Dictionary<string, object> parameters)
        {
         if (!parameters.TryGetValue("action", out var actionObj))
    return ExecutionResult.Failure("缺少action参数");

            var action = actionObj.ToString();

            return action switch
            {
         "transfer" => await TransferOwnershipAsync(parameters),
         "license" => await GrantLicenseAsync(parameters),
    "revoke" => await RevokeLicenseAsync(parameters),
  "verify" => await VerifyOwnershipAsync(parameters),
                _ => ExecutionResult.Failure($"不支持的操作: {action}")
        };
        }

 /// <summary>
        /// 转让版权所有权
        /// </summary>
  private async Task<ExecutionResult> TransferOwnershipAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("newOwner", out var newOwnerObj))
          return ExecutionResult.Failure("缺少newOwner参数");

if (!parameters.TryGetValue("fromOwner", out var fromOwnerObj))
       return ExecutionResult.Failure("缺少fromOwner参数");

var newOwner = newOwnerObj.ToString()!;
  var fromOwner = fromOwnerObj.ToString()!;

            // 验证当前所有者
    if (fromOwner != CurrentOwnerCid)
     return ExecutionResult.Failure("只有当前版权所有者才能转让版权");

 // 记录转移
            var transfer = new CopyrightTransfer
          {
 FromOwner = CurrentOwnerCid,
         ToOwner = newOwner,
        TransferDate = DateTimeOffset.UtcNow,
    Price = parameters.TryGetValue("price", out var priceObj) ? Convert.ToDecimal(priceObj) : 0
            };

        TransferHistory.Add(transfer);
   CurrentOwnerCid = newOwner;

  if (!Participants.Contains(newOwner))
    Participants.Add(newOwner);

     LogExecution("Transfer", $"版权从 {fromOwner[..8]}... 转移至 {newOwner[..8]}...");

            await Task.CompletedTask;
         return ExecutionResult.Success("版权转移成功", new Dictionary<string, object>
  {
    { "newOwner", newOwner },
   { "transferDate", transfer.TransferDate }
     });
        }

        /// <summary>
        /// 授予使用许可
        /// </summary>
     private async Task<ExecutionResult> GrantLicenseAsync(Dictionary<string, object> parameters)
{
        if (!parameters.TryGetValue("licenseeTo", out var licenseeObj))
             return ExecutionResult.Failure("缺少licenseeTo参数");

            if (!parameters.TryGetValue("licenseType", out var typeObj))
        return ExecutionResult.Failure("缺少licenseType参数");

            var licenseeTo = licenseeObj.ToString()!;
 var licenseType = typeObj.ToString()!;

            var license = new CopyrightLicense
    {
      LicenseId = Guid.NewGuid().ToString("N"),
    LicenseeTo = licenseeTo,
 LicenseType = licenseType,
       GrantDate = DateTimeOffset.UtcNow,
     IsActive = true
 };

    if (parameters.TryGetValue("expiryDate", out var expiryObj) && expiryObj is DateTimeOffset expiry)
      license.ExpiryDate = expiry;

 if (parameters.TryGetValue("fee", out var feeObj))
    license.LicenseFee = Convert.ToDecimal(feeObj);

    Licenses.Add(license);

       if (!Participants.Contains(licenseeTo))
           Participants.Add(licenseeTo);

       LogExecution("License", $"授权 {licenseType} 许可给 {licenseeTo[..8]}...");

            await Task.CompletedTask;
 return ExecutionResult.Success("许可授予成功", new Dictionary<string, object>
      {
       { "licenseId", license.LicenseId },
            { "licenseeTo", licenseeTo }
  });
        }

  /// <summary>
        /// 撤销许可
        /// </summary>
 private async Task<ExecutionResult> RevokeLicenseAsync(Dictionary<string, object> parameters)
      {
            if (!parameters.TryGetValue("licenseId", out var licenseIdObj))
    return ExecutionResult.Failure("缺少licenseId参数");

    var licenseId = licenseIdObj.ToString()!;

         var license = Licenses.FirstOrDefault(l => l.LicenseId == licenseId);
        if (license == null)
                return ExecutionResult.Failure("许可不存在");

          license.IsActive = false;
       license.RevokedDate = DateTimeOffset.UtcNow;

         LogExecution("Revoke", $"撤销许可 {licenseId}");

       await Task.CompletedTask;
            return ExecutionResult.Success("许可已撤销");
  }

 /// <summary>
        /// 验证版权所有权
        /// </summary>
        private async Task<ExecutionResult> VerifyOwnershipAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("claimant", out var claimantObj))
      return ExecutionResult.Failure("缺少claimant参数");

      var claimant = claimantObj.ToString()!;
            var isOwner = claimant == CurrentOwnerCid;

            await Task.CompletedTask;
    return ExecutionResult.Success(
           isOwner ? "验证通过：该用户是当前版权所有者" : "验证失败：该用户不是版权所有者",
    new Dictionary<string, object>
       {
                    { "isOwner", isOwner },
        { "currentOwner", CurrentOwnerCid },
  { "claimant", claimant }
    });
        }

        public override string GetSummary()
        {
            return $"版权合约 [{Copyright.Title}] 作者:{Copyright.AuthorCid[..8]}... 当前所有者:{CurrentOwnerCid[..8]}... 转移次数:{TransferHistory.Count} 授权数:{Licenses.Count(l => l.IsActive)}";
      }
    }

    /// <summary>
    /// 版权转移记录
    /// </summary>
    public class CopyrightTransfer
    {
        public string FromOwner { get; set; } = string.Empty;
        public string ToOwner { get; set; } = string.Empty;
     public DateTimeOffset TransferDate { get; set; }
        public decimal Price { get; set; }
  }

    /// <summary>
  /// 版权许可记录
    /// </summary>
    public class CopyrightLicense
    {
        public string LicenseId { get; set; } = string.Empty;
        public string LicenseeTo { get; set; } = string.Empty;
        public string LicenseType { get; set; } = string.Empty;
        public DateTimeOffset GrantDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool IsActive { get; set; }
 public DateTimeOffset? RevokedDate { get; set; }
    public decimal LicenseFee { get; set; }
    }
}
