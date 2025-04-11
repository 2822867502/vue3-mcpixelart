from utils.db import query, exec
from utils.net import get_ip, get_uid_from_uuid, new_art, get_unique_filename
from flask import Flask, request, jsonify
import time
import uuid

app = Flask(__name__)

def generate_user_id():
  timestamp = int(time.time() * 1000)
  uuid_part = str(uuid.uuid4()).replace('-', '')
  user_id = f"{timestamp}{uuid_part}"
  return user_id
# 生成新用户
@app.route('/genid', methods=['GET'])
def get_unique_user_id():
    try:
        userid = generate_user_id()
        uname = '用户' + userid[9:15]
        uip = get_ip(request)
        bk = exec('insert into user (uuid,uname,uip) values (%s,%s,%s)', (userid,uname,uip))
        if bk['ok']:
            return {'uuid': userid, 'uname': uname}, 200
        else:
            return {'error': '生成用户标识失败'}, 500
    except Exception as e:
        return {'error': '生成用户标识失败'}, 500
  
# 改名
@app.route('/cname', methods=['POST'])
def post_change_user_name():
    try:
        x_ident = request.headers.get('X-IDENT')
        data = request.get_json()
        if not 'name' in data: return {'error': '非法请求'}, 403
        uname = data['name'].strip()
        if (len(uname) == 0 or len(uname) >= 20): return {'error': '非法请求'}, 403
        if x_ident:
            bk = exec('update user set uname = %s where uuid = %s', (uname,x_ident))
            if bk['ok']:
                return {'uuid': x_ident, 'uname': uname}, 200
            else:
                return {'error': '更改失败'}, 401
        else:
            return {'error': '未登录用户'}, 401
    except Exception as e:
        return {'error': '更改失败'}, 500
  
# feed
@app.route('/feed', methods=['GET'])
def get_feed():
    try:
        # 查询返回的最大数量 = 30 pages
        MAX_FEED = 12 * 30
        filter = request.args.get('filter', default=None)
        sort = request.args.get('sort', default=None)
        allow_filter = ['all', 'art', 'enhance', 'sculpture', 'music']
        allow_sort = ['hot', 'new', 'random']
        if (not filter in allow_filter) or (not sort in allow_sort):
            return {'error': '错误的参数'}, 400

        statement_sort = ''
        if sort == 'new':
            statement_sort = 'ORDER BY atime DESC'
        elif sort == 'hot':
            statement_sort = 'ORDER BY alike DESC'
        else:
            statement_sort = 'ORDER BY RAND()'
        
        statement_filter = ''
        if filter == 'all':
            statement_filter = f'1=%s'
            filter = 1
        else:
            statement_filter = f'atype=%s'
        cmd = f'SELECT adesc AS desciption,aid AS id,afname AS fname,alike AS hot,aname AS name,atype AS type,atime AS time,auid AS uid FROM art WHERE avisiable=1 AND ashare=1 AND {statement_filter} {statement_sort} LIMIT %s'
        bk = query(cmd,(filter,MAX_FEED))
        if bk['ok']:
            result = bk['result']
            return result, 200
        else:
            reason = bk['reason']
            return {'error': '读取数据库失败'}, 500
        
    except Exception as e:
        return {'error': '获取内容列表失败'}, 500

# 历史作品
@app.route('/history', methods=['GET'])
def get_history():
    try:
        x_ident = request.headers.get('X-IDENT')
        cmd = f'SELECT adesc AS desciption,aid AS id,afname AS fname,aname AS name,atype AS type,ashare AS share,atime AS time,alike AS hot FROM art WHERE avisiable=1 AND auuid=%s'
        bk = query(cmd,(x_ident,))
        if bk['ok']:
            result = bk['result']
            return result, 200
        else:
            reason = bk['reason']
            return {'error': '读取数据库失败'}, 500
        
    except Exception as e:
        return {'error': '获取内容列表失败'}, 500

# 分享作品 / 取消分享作品
@app.route('/share', methods=['POST'])
def post_share():
    try:
        x_ident = request.headers.get('X-IDENT')
        if x_ident:
            data = request.get_json()
            if 'fname' in data and 'name' in data and 'desc' in data:
                name = data['name']
                desc = data['desc']
                if len(name) >= 20 or len(desc) >= 100:
                    return {'error': '非法请求'}, 403
                fname = data['fname']
                cmd_query = 'SELECT * FROM art WHERE afname=%s AND auuid=%s'
                bk_query = query(cmd_query, (fname, x_ident))
                if bk_query['ok'] and len(bk_query['result']) > 0:
                    if 'share' in data and data['share'] == False:
                        cmd_share = 'UPDATE art SET ashare=%s WHERE afname=%s AND auuid=%s'
                        bk_share = exec(cmd_share, (0, fname, x_ident))
                    else:
                        cmd_share = 'UPDATE art SET ashare=%s,aname=%s,adesc=%s WHERE afname=%s AND auuid=%s'
                        bk_share = exec(cmd_share, (1, name, desc,fname, x_ident))
                    if bk_share['ok']:
                        return '分享成功', 200
                    else:
                        return {'error': '数据库操作失败;分享失败'}, 400
                else:
                    return {'error': '作品不存在/不是您制作的'}, 400
            else:
                return {'error': '非法请求'}, 403
        else:
            return {'error': '用户未登录'}, 401
    except Exception as e:
        return {'error': '分享失败'}, 500

# 从uid获得uname
@app.route('/uname', methods=['GET'])
def get_uname_from_uid():
    try:
        uid = request.args.get('uid', default=None)
        cmd = 'SELECT uname FROM user WHERE uid=%s'
        bk = query(cmd, (uid,))
        if bk['ok']:
            uname = bk['result']
            return uname, 200
        else:
            return {'error': '未找到'}, 400
    except Exception as e:
        return {'error': '查询出错'}, 500
    
# 从uuid登录
@app.route('/login', methods=['GET'])
def get_login():
    try:
        x_ident = request.headers.get('X-IDENT')
        cmd = 'SELECT uid,uname FROM user WHERE uuid=%s'
        bk = query(cmd, (x_ident,))
        if bk['ok']:
            userinfo = bk['result']
            return userinfo, 200
        else:
            return {'error': '未找到'}, 400
    except Exception as e:
        return {'error': '查询出错'}, 500
    
# 点赞
@app.route('/like', methods=['POST'])
def post_plg_like():
    try:
        x_ident = request.headers.get('X-IDENT')
        if x_ident:
            gufu = get_uid_from_uuid(x_ident)
            if gufu['ok']:
                uid = gufu['result']
                data = request.get_json()
                if not 'id' in data: return {'error': '非法请求'}, 403
                bk1 = query('SELECT * FROM conduct WHERE coper=%s AND ctar=%s AND clike=1', (uid,data['id']))
                if bk1['ok']:
                    if len(bk1['result']) > 0:
                        return "您已经点过赞了", 200
                    else:
                        bk2 = exec('INSERT INTO conduct (coper,ctar,clike) VALUES (%s,%s,1)', (uid,data['id']))
                        if bk2['ok']:
                            return '点赞成功', 200
                        else:
                            return {'error': '点赞失败'}, 400
                else:
                    return {'error': '服务器查询失败'}, 400
            else:
                return {'error': '非法用户'}, 401
        else:
            return {'error': '未登录用户'}, 401
    except Exception as e:
        return {'error': '服务器出错了'}, 500

# 踩
@app.route('/dislike', methods=['POST'])
def post_plg_dislike():
    try:
        x_ident = request.headers.get('X-IDENT')
        if x_ident:
            gufu = get_uid_from_uuid(x_ident)
            if gufu['ok']:
                uid = gufu['result']
                data = request.get_json()
                if not 'id' in data: return {'error': '非法请求'}, 403
                bk = exec('INSERT INTO conduct (coper,ctar,cdislike) VALUES (%s,%s,%s)', (uid,data['id'],1))
                if bk['ok']:
                    return '已点踩', 200
                else:
                    return {'error': '点踩失败'}, 400
            else:
                return {'error': '非法用户'}, 401
        else:
            return {'error': '未登录用户'}, 401
    except Exception as e:
        return {'error': '服务器出错了'}, 500

# 通过uid获取用户名
@app.route('/unamelist', methods=['POST'])
def post_get_uname_list():
    try:
        x_ident = request.headers.get('X-IDENT')
        if x_ident:
            data = request.get_json()
            if len(data) > 12 * 30: return {'error': '非法请求'}, 403 # 一次最多查询的数目等于页面展示的最多作品数
            queryStatement = f"SELECT uid, uname FROM user WHERE uid IN ({','.join(['%s'] * len(data))})"
            bk = query(queryStatement, data)
            if bk['ok']:
                
                return bk['result'], 200
            else:
                return {'error': '查询用户名失败'}, 400
        else:
            return {'error': '未登录用户'}, 401
    except Exception as e:
        return {'error': '服务器查询出错'}, 500

# if __name__ == '__main__':
#   app.run(debug=False, port=9999)