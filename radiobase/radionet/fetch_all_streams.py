#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量获取所有电台的音频流URL
"""

import json
import time
from radio_scraper import RadioNetScraper
from datetime import datetime


def fetch_all_streams(output_file='stations_with_streams.json', delay=2):
    """
    批量获取所有新闻电台的音频流

    Args:
        output_file: 输出文件名
        delay: 每次请求之间的延迟(秒)，避免被封禁
    """
    scraper = RadioNetScraper()

    print("=" * 70)
    print("批量获取 Radio.net 新闻电台音频流")
    print("=" * 70)

    # 获取所有电台列表
    print("\n[1/3] 正在获取电台列表...")
    stations = scraper.get_news_stations()
    total = len(stations)
    print(f"✓ 找到 {total} 个电台\n")

    # 批量获取音频流
    print(f"[2/3] 正在批量获取音频流 (延迟: {delay}秒)...")
    print("-" * 70)

    success_count = 0
    fail_count = 0
    results = []

    for i, station in enumerate(stations, 1):
        station_id = station['id']
        station_name = station['name']

        print(f"[{i}/{total}] {station_name} ({station_id})...", end=' ')

        try:
            # 获取音频流URL
            stream_url = scraper.get_stream_url(station_id)

            if stream_url:
                station['stream_url'] = stream_url
                success_count += 1
                print(f"✓")
                print(f"        流: {stream_url}")
            else:
                station['stream_url'] = None
                fail_count += 1
                print(f"✗ 未找到")

            results.append(station)

            # 延迟，避免请求过快
            if i < total:
                time.sleep(delay)

        except Exception as e:
            station['stream_url'] = None
            station['error'] = str(e)
            fail_count += 1
            results.append(station)
            print(f"✗ 错误: {e}")

    print("-" * 70)
    print(f"\n统计: 成功 {success_count} 个, 失败 {fail_count} 个")

    # 保存结果
    print(f"\n[3/3] 正在保存结果到 {output_file}...")

    output_data = {
        'timestamp': datetime.now().isoformat(),
        'total': total,
        'success': success_count,
        'failed': fail_count,
        'stations': results
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✓ 结果已保存到: {output_file}")

    # 同时保存一个简化版本（只包含成功的）
    success_file = 'stations_streams_only.json'
    success_stations = [s for s in results if s.get('stream_url')]

    with open(success_file, 'w', encoding='utf-8') as f:
        json.dump(success_stations, f, ensure_ascii=False, indent=2)

    print(f"✓ 成功的电台已保存到: {success_file}")

    # 生成M3U播放列表
    m3u_file = 'stations.m3u'
    print(f"\n[额外] 生成M3U播放列表: {m3u_file}")

    with open(m3u_file, 'w', encoding='utf-8') as f:
        f.write('#EXTM3U\n')
        for station in success_stations:
            if station.get('stream_url'):
                f.write(f'#EXTINF:-1,{station["name"]}\n')
                f.write(f'{station["stream_url"]}\n')

    print(f"✓ M3U播放列表已生成: {m3u_file}")

    print("\n" + "=" * 70)
    print("完成!")
    print("=" * 70)
    print(f"\n生成的文件:")
    print(f"  1. {output_file} - 完整数据(包含失败的)")
    print(f"  2. {success_file} - 仅成功的电台")
    print(f"  3. {m3u_file} - M3U播放列表")

    return results


if __name__ == '__main__':
    import sys

    # 可以通过命令行参数指定延迟时间
    delay = 2
    if len(sys.argv) > 1:
        try:
            delay = float(sys.argv[1])
            print(f"使用自定义延迟: {delay}秒")
        except:
            print(f"无效的延迟参数，使用默认值: {delay}秒")

    fetch_all_streams(delay=delay)
