#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Radio.net 电台音频流抓取程序
抓取 https://www.radio.net/topic/news 的新闻类电台音频流
"""

from flask import Flask, render_template, jsonify, request, send_from_directory
from radio_scraper import RadioNetScraper
import json
import os

app = Flask(__name__)
scraper = RadioNetScraper()


@app.route('/')
def index():
    """主页 - 显示电台播放器"""
    return render_template('player.html')


@app.route('/scraper')
def scraper_page():
    """爬虫页面 - 抓取新电台"""
    return render_template('index.html')


@app.route('/api/stations')
def get_stations():
    """获取电台列表API"""
    try:
        stations = scraper.get_news_stations()
        return jsonify({
            'success': True,
            'count': len(stations),
            'data': stations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/top-stations')
def get_top_stations():
    """获取热门电台列表API"""
    try:
        stations = scraper.get_top_stations()
        return jsonify({
            'success': True,
            'count': len(stations),
            'data': stations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/stream/<station_id>')
def get_stream(station_id):
    """获取指定电台的音频流URL"""
    try:
        stream_url = scraper.get_stream_url(station_id)
        if stream_url:
            return jsonify({
                'success': True,
                'stream_url': stream_url
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Stream URL not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/search')
def search_stations():
    """搜索电台"""
    query = request.args.get('q', '')
    try:
        stations = scraper.search_stations(query)
        return jsonify({
            'success': True,
            'count': len(stations),
            'data': stations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/refresh')
def refresh_data():
    """刷新电台数据"""
    try:
        scraper.clear_cache()
        stations = scraper.get_news_stations()
        return jsonify({
            'success': True,
            'message': 'Data refreshed successfully',
            'count': len(stations)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/stations/streams')
def get_stations_with_streams():
    """获取已抓取的电台音频流列表（新闻类）"""
    try:
        json_file = 'stations_streams_only.json'

        # 检查文件是否存在
        if not os.path.exists(json_file):
            return jsonify({
                'success': False,
                'error': '音频流数据文件不存在，请先运行 fetch_all_streams.py 抓取数据',
                'stations': []
            }), 404

        # 读取JSON文件
        with open(json_file, 'r', encoding='utf-8') as f:
            stations = json.load(f)

        return jsonify({
            'success': True,
            'count': len(stations),
            'stations': stations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'stations': []
        }), 500


@app.route('/api/top-stations/streams')
def get_top_stations_with_streams():
    """获取已抓取的热门电台音频流列表"""
    try:
        json_file = 'top_stations_with_streams.json'

        # 检查文件是否存在
        if not os.path.exists(json_file):
            return jsonify({
                'success': False,
                'error': '音频流数据文件不存在，请先运行 get_all_top_streams.py 抓取数据',
                'stations': []
            }), 404

        # 读取JSON文件
        with open(json_file, 'r', encoding='utf-8') as f:
            stations = json.load(f)

        return jsonify({
            'success': True,
            'count': len(stations),
            'stations': stations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'stations': []
        }), 500


@app.route('/stations.m3u')
def get_m3u_playlist():
    """下载M3U播放列表"""
    try:
        return send_from_directory('.', 'stations.m3u', as_attachment=True)
    except Exception as e:
        return f"Error: {e}", 404


@app.route('/analyzer')
def analyzer_page():
    """URL 分析器页面"""
    return render_template('analyzer.html')


@app.route('/api/analyze-url', methods=['POST'])
def analyze_url():
    """分析给定的 radio.net URL，提取电台列表"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()

        if not url:
            return jsonify({
                'success': False,
                'error': '请提供URL'
            }), 400

        # 验证URL是否来自 radio.net
        if 'radio.net' not in url:
            return jsonify({
                'success': False,
                'error': 'URL必须来自 radio.net 网站'
            }), 400

        # 分析URL
        result = scraper.analyze_url(url)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/batch-streams', methods=['POST'])
def batch_get_streams():
    """批量获取电台的流媒体链接"""
    try:
        data = request.get_json()
        station_ids = data.get('station_ids', [])
        delay = float(data.get('delay', 1.0))

        if not station_ids:
            return jsonify({
                'success': False,
                'error': '请提供电台ID列表'
            }), 400

        # 批量获取流媒体链接
        results = scraper.batch_get_streams(station_ids, delay)

        return jsonify({
            'success': True,
            'streams': results
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    import os

    # 从环境变量获取配置
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 8405))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    print("=" * 60)
    print("启动 Radio.net 电台音频流抓取服务")
    print("=" * 60)
    print(f"服务地址: http://{host}:{port}")
    print(f"本地访问: http://localhost:{port}")
    print(f"调试模式: {'开启' if debug else '关闭'}")
    print(f"\n提示: 远程客户端可以通过服务器IP地址访问")
    print(f"      例如: http://YOUR_SERVER_IP:{port}")
    print("=" * 60)

    app.run(host=host, port=port, debug=debug, threaded=True)
