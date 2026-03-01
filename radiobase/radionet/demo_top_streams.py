#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
演示获取 top-stations 的流媒体链接（只获取前10个）
"""

from radio_scraper import RadioNetScraper
import time

if __name__ == '__main__':
    scraper = RadioNetScraper()

    print("=" * 80)
    print("演示：获取 Top Stations 的流媒体链接")
    print("=" * 80)

    # 第一步：获取电台列表
    print("\n📋 第一步：获取电台列表...")
    stations = scraper.get_top_stations()
    print(f"✓ 找到 {len(stations)} 个热门电台\n")

    # 第二步：获取前10个电台的流媒体链接
    print("🎵 第二步：获取流媒体链接（前10个示例）\n")

    for i, station in enumerate(stations[:10], 1):
        print(f"[{i}/10] {station['name'][:60]}")
        print(f"       电台 ID: {station['id']}")
        print(f"       详情页: {station['url']}")

        # 获取流媒体链接
        stream_url = scraper.get_stream_url(station['id'])

        if stream_url:
            print(f"       ✅ 流媒体: {stream_url}")
        else:
            print(f"       ❌ 未找到流媒体链接")

        print()
        time.sleep(0.3)

    print("=" * 80)
    print("说明：")
    print("- 电台列表来自: https://www.radio.net/top-stations")
    print("- 流媒体链接需要访问每个电台的详情页提取")
    print("- 完整的 98 个电台可运行: python3 get_all_top_streams.py")
    print("=" * 80)
