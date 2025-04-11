from utils.db import query, exec
from utils.net import get_ip, get_uid_from_uuid, new_art
from flask import Flask, request, jsonify,Response
from litemapy import Region, BlockState
# from flask_cors import CORS
import pickle
import time
import uuid
import gzip
import os
import mysql.connector
from mysql.connector import Error
app = Flask(__name__)
# CORS(app)
# def is_iterable(obj):
#   try:
#     iter(obj)
#     return True
#   except TypeError:
#     return False
    
def get_unique_filename():
    extension = '.litematic'
    timestamp = str(int(time.time() * 1000))  # 获取当前时间戳（毫秒级）  
    unique_filename = f"{timestamp}{uuid.uuid4()}{extension}"
    return unique_filename

@app.route('/pixelartEnhance', methods=['POST'])
def scu_post():
  try:
    data = request.get_json()
    if 'size' in data and 'pipe' in data:
      l = data['size']['length']
      w = data['size']['width']
      h = data['size']['height']
      reg = Region(0,0,0,w,h,l)
      pipe = data['pipe']
      if len(pipe) > 128 * 3 * 128 * 2:
        return jsonify({'error': f'尺寸太大了!!无效请求'}), 400
      for item in pipe:
        reg[tuple(item[0])] = BlockState(item[1])
      schem = reg.as_schematic(name="Unnamed art", author="mcpixelart.com", description="Create your art of mc online.")
      fname = get_unique_filename()
      schem.save(os.path.join('/mcpixelart/enhance',fname))

      x_ident = request.headers.get('X-IDENT')
      if not x_ident:
          x_ident = ''
      new_art('enhance', fname,x_ident)
      #备份
      with gzip.open(os.path.join('/mcpixelart/enhance_backup',fname), 'wb') as f:
        pickle.dump(data, f)
      return jsonify({'url': fname}), 200
    else:
      return jsonify({'error': f'无效请求'}), 400
  except Exception as e:
    return jsonify({'error': str(e)}), 400

# app.run(port=9979, debug=False)