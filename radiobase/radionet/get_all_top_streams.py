#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
获取所有 top-stations 的流媒体链接
"""

from radio_scraper import RadioNetScraper
import json
import time

if __name__ == '__main__':
    scraper = RadioNetScraper()

    print("=" * 60)
    print("开始获取所有热门电台的流媒体链接")
    print("=" * 60)

    # 第一步：获取电台列表
    print("\n[1/2] 获取电台列表...")
    stations = scraper.get_top_stations()
    print(f"找到 {len(stations)} 个热门电台")

    # 第二步：逐个获取流媒体链接
    print("\n[2/2] 获取流媒体链接...")
    stations_with_streams = []

    for i, station in enumerate(stations, 1):
        print(f"[{i}/{len(stations)}] 获取 {station['name'][:50]}...")

        stream_url = scraper.get_stream_url(station['id'])

        if stream_url:
            station['stream_url'] = stream_url
            stations_with_streams.append(station)
            print(f"  ✓ {stream_url}")
        else:
            print(f"  ✗ 未找到流媒体链接")

        # 避免请求过快
        time.sleep(0.5)

    # 保存结果
    output_file = 'top_stations_with_streams.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(stations_with_streams, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print(f"完成! 成功获取 {len(stations_with_streams)}/{len(stations)} 个电台的流媒体链接")
    print(f"结果已保存到: {output_file}")
    print("=" * 60)

    # 显示前 5 个结果
    print("\n前 5 个电台的流媒体链接:")
    for station in stations_with_streams[:5]:
        print(f"\n📻 {station['name'][:60]}")
        print(f"   ID: {station['id']}")
        print(f"   流: {station['stream_url']}")
