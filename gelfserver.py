import asyncio


CHUNKED_SIG_POS = slice(0, 2)
CHUNKED_SIG = b'\x1e\x0f'
MSG_ID_POS = slice(2, 10)
SEQ_NUM = 10
SEQ_COUNT = 11
CHUNKED_PAYLOAD = slice(12, None)


class GELFUdpProtocol:

    in_flight = {}

    def connection_made(self, transport):
        self.transport = transport
        print('Connection %r' % transport)

    def datagram_received(self, data, addr):
        print('Received %r bytes from %s' % (len(data), addr))
        chunked = data[CHUNKED_SIG_POS] == CHUNKED_SIG
        print('Chunked %r' % (chunked))
        if chunked:
            self.parse_chunked(data)
        else:
            self.process_compressed(data)

    def parse_chunked(self, data):
        from binascii import hexlify
        msg_id = data[MSG_ID_POS]
        seq_num = (data[SEQ_NUM])
        seq_count = (data[SEQ_COUNT])
        print('Message id %r' % hexlify(msg_id).decode())
        print('Chunk %d of %d' % (seq_num, seq_count))
        chunks, chunk_counter = self.in_flight.get(
            msg_id,
            ([None] * seq_count, set(range(seq_count)))
        )
        # print('in_flight: %r' % (self.in_flight))
        print('chunks: %r, seq_num: %r' % (chunks, seq_num))
        chunks[seq_num] = data[CHUNKED_PAYLOAD]
        chunk_counter -= {seq_num}
        self.in_flight[msg_id] = chunks, chunk_counter
        if not chunk_counter:
            print('Got all %r chunks of %r' % (seq_count, msg_id))
            del self.in_flight[msg_id]
            self.process_compressed(b''.join(chunks))

    def process_compressed(self, data):
        import zlib
        try:
            decompressed = zlib.decompress(data)
        except zlib.error:
            decompressed = data
        import json
        unmarshalled = json.loads(decompressed.decode())

        print('Recieved json:\n%r' % unmarshalled)


loop = asyncio.new_event_loop()
print("Starting UDP server")
# One protocol instance will be created to serve all client requests
listen = loop.create_datagram_endpoint(
    GELFUdpProtocol, local_addr=('127.0.0.1', 12201))
transport, protocol = loop.run_until_complete(listen)

try:
    loop.run_forever()
except KeyboardInterrupt:
    pass

transport.close()
loop.close()
