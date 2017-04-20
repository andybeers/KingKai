from pprint import pprint

from flask import Flask, abort, request
app = Flask(__name__)


handshake_secret = "john_wuz_here"
all_servers = {}

@app.route("/stats", methods=['POST'])
def stats():
    data = request.json
    if data:
        pprint(data)
    else:
        print("there was no data!")
        print(request)
    return "OK"

@app.route("/handshake", methods=['POST'])
def handshake():
    data = request.json
    if data:
        pprint(data)
    else:
        print("there was no data!")
        print(request)
    print(data)
    if data.get('HandshakeSecret') and data['HandshakeSecret'] == handshake_secret:
        return "OK"
    else:
        return "BAD", 500

if __name__ == "__main__":
    app.run(host="localhost", port=9091, debug=True)

