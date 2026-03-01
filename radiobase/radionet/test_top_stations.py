#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试抓取 top-stations 页面
"""

from radio_scraper import RadioNetScraper

if __name__ == '__main__':
    scraper = RadioNetScraper()

    print("=" * 60)
    print("开始抓取 https://www.radio.net/top-stations")
    print("=" * 60)

    stations = scraper.get_top_stations()

    print(f"\n找到 {len(stations)} 个热门电台:\n")

    for i, station in enumerate(stations[:10], 1):
        print(f"{i}. {station['name']}")
        print(f"   ID: {station['id']}")
        print(f"   URL: {station['url']}")
        if station.get('location'):
            print(f"   位置: {station['location']}")
        if station.get('logo'):
            print(f"   Logo: {station['logo'][:60]}...")
        print()

    # 测试获取音频流
    if stations:
        print(f"\n测试获取第一个电台的音频流...")
        stream_url = scraper.get_stream_url(stations[0]['id'])
        if stream_url:
            print(f"✓ 音频流URL: {stream_url}")
        else:
            print("✗ 未能获取音频流URL")
