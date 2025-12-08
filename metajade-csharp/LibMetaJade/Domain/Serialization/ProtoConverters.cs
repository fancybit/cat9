using System;
using Google.Protobuf;
using LibMetaJade.Domain;
using LibMetaJade.Protos;

namespace LibMetaJade.Domain.Serialization
{
    public static class ProtoConverters
    {
        public static byte[] ToBytes<T>(this T message)
            where T : IMessage<T>
        {
            return message.ToByteArray();
        }

        public static T FromBytes<T>(this byte[] data)
            where T : IMessage<T>, new()
        {
            var parser = new MessageParser<T>(() => new T());
            return parser.ParseFrom(data);
        }
    }
}
