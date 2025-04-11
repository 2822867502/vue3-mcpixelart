from flask import Flask, request, jsonify
import requests
import gzip
import io

app = Flask(__name__)

# 目标服务器
TARGET_URL = 'http://localhost:9002'

@app.before_request
def before_request():
    # 检查请求头 X-Encode 是否为 gzip
    new_headers = dict(request.headers)
    data_to_forward = request.get_data()
    if request.headers.get('X-Encode') == 'gzip':
        if data_to_forward:
            # 解压数据
            buffer = io.BytesIO(data_to_forward)
            with gzip.GzipFile(fileobj=buffer, mode='rb') as f:
                data_to_forward = f.read()
            new_headers['Content-Length'] = str(len(data_to_forward))
        
        new_headers['Content-Type'] = 'application/json'

    # 转发请求
    resp = requests.request(
        method=request.method,
        url=TARGET_URL + request.path,
        headers=new_headers,
        data=data_to_forward,
        params=request.args,
        cookies=request.cookies,
        allow_redirects=False
    )

    # 返回响应
    return (resp.content, resp.status_code, resp.headers.items())

# if __name__ == '__main__':
#     app.run(port=9001)