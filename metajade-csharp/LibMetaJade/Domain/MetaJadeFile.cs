using System.Collections.Generic;

namespace LibMetaJade.Domain
{
    public class MetaJadeFile
    {
        public List<Info> Blocks = new();
        public class Info
        {
            public string? BlockCID;
            public long Version;
        }

        public virtual void Modify(byte[] data, string[] newRelations)
        {
            var block = MetaJadeBlock.Create(data, newRelations);
            Blocks.Add(new Info { BlockCID = block.CID, Version = Blocks.Count + 1 });
        }
    }
}
