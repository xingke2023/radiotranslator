#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Radio.net 爬虫模块
用于抓取 radio.net 网站的电台信息和音频流
"""

import requests
from bs4 import BeautifulSoup
import re
import json
from urllib.parse import urljoin
import time
from typing import List, Dict, Optional


class RadioNetScraper:
    """Radio.net 电台信息爬虫"""

    def __init__(self):
        self.base_url = "https://www.radio.net"
        self.news_topic_url = "https://www.radio.net/topic/news"
        self.top_stations_url = "https://www.radio.net/top-stations"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Referer': 'https://www.radio.net/',
        })
        self._cache = {}
        self._cache_time = 0
        self._cache_duration = 300  # 缓存5分钟
        self._top_cache = {}
        self._top_cache_time = 0

    def get_top_stations(self) -> List[Dict]:
        """
        获取热门电台列表

        Returns:
            List[Dict]: 电台信息列表，每个元素包含电台的基本信息
        """
        # 检查缓存
        if self._top_cache and (time.time() - self._top_cache_time) < self._cache_duration:
            return self._top_cache.get('stations', [])

        try:
            print(f"正在抓取: {self.top_stations_url}")
            response = self.session.get(self.top_stations_url, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'

            soup = BeautifulSoup(response.text, 'html.parser')
            stations = []

            # 方法1: 查找电台卡片元素
            station_cards = soup.find_all('div', class_=re.compile(r'station.*card|card.*station', re.I))

            # 方法2: 查找包含电台链接的元素
            if not station_cards:
                station_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                station_cards = [link.parent for link in station_links]

            # 方法3: 尝试从JSON数据中提取
            if not station_cards:
                scripts = soup.find_all('script', type='application/ld+json')
                for script in scripts:
                    try:
                        data = json.loads(script.string)
                        if isinstance(data, dict) and 'itemListElement' in data:
                            for item in data['itemListElement']:
                                if 'item' in item:
                                    station_info = self._parse_json_station_generic(item['item'])
                                    if station_info:
                                        stations.append(station_info)
                    except:
                        pass

            # 方法4: 查找所有电台链接并解析
            if not stations:
                all_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                processed_ids = set()

                for link in all_links:
                    station_id = self._extract_station_id(link.get('href', ''))
                    if station_id and station_id not in processed_ids:
                        station_info = self._parse_station_element(link, soup)
                        if station_info:
                            # 移除 genre 字段或设置为 'top'
                            station_info['genre'] = 'top'
                            stations.append(station_info)
                            processed_ids.add(station_id)
            else:
                # 解析找到的电台卡片
                for card in station_cards:
                    station_info = self._parse_station_card_generic(card)
                    if station_info:
                        stations.append(station_info)

            # 更新缓存
            self._top_cache['stations'] = stations
            self._top_cache_time = time.time()

            print(f"成功抓取 {len(stations)} 个热门电台")
            return stations

        except requests.RequestException as e:
            print(f"网络请求错误: {e}")
            return self._top_cache.get('stations', [])
        except Exception as e:
            print(f"解析错误: {e}")
            return self._top_cache.get('stations', [])

    def get_news_stations(self) -> List[Dict]:
        """
        获取新闻类电台列表

        Returns:
            List[Dict]: 电台信息列表，每个元素包含电台的基本信息
        """
        # 检查缓存
        if self._cache and (time.time() - self._cache_time) < self._cache_duration:
            return self._cache.get('stations', [])

        try:
            print(f"正在抓取: {self.news_topic_url}")
            response = self.session.get(self.news_topic_url, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'

            soup = BeautifulSoup(response.text, 'html.parser')
            stations = []

            # 方法1: 查找电台卡片元素
            station_cards = soup.find_all('div', class_=re.compile(r'station.*card|card.*station', re.I))

            # 方法2: 查找包含电台链接的元素
            if not station_cards:
                station_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                station_cards = [link.parent for link in station_links]

            # 方法3: 尝试从JSON数据中提取
            if not station_cards:
                scripts = soup.find_all('script', type='application/ld+json')
                for script in scripts:
                    try:
                        data = json.loads(script.string)
                        if isinstance(data, dict) and 'itemListElement' in data:
                            for item in data['itemListElement']:
                                if 'item' in item:
                                    station_info = self._parse_json_station(item['item'])
                                    if station_info:
                                        stations.append(station_info)
                    except:
                        pass

            # 方法4: 查找所有电台链接并解析
            if not stations:
                all_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                processed_ids = set()

                for link in all_links:
                    station_id = self._extract_station_id(link.get('href', ''))
                    if station_id and station_id not in processed_ids:
                        station_info = self._parse_station_element(link, soup)
                        if station_info:
                            stations.append(station_info)
                            processed_ids.add(station_id)
            else:
                # 解析找到的电台卡片
                for card in station_cards:
                    station_info = self._parse_station_card(card)
                    if station_info:
                        stations.append(station_info)

            # 更新缓存
            self._cache['stations'] = stations
            self._cache_time = time.time()

            print(f"成功抓取 {len(stations)} 个电台")
            return stations

        except requests.RequestException as e:
            print(f"网络请求错误: {e}")
            return self._cache.get('stations', [])
        except Exception as e:
            print(f"解析错误: {e}")
            return self._cache.get('stations', [])

    def _parse_station_card(self, card) -> Optional[Dict]:
        """解析电台卡片元素"""
        try:
            link = card.find('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
            if not link:
                return None

            station_url = urljoin(self.base_url, link.get('href', ''))
            station_id = self._extract_station_id(link.get('href', ''))

            # 提取电台名称
            name = link.get('title') or link.get_text(strip=True)
            if not name:
                name_elem = card.find(['h2', 'h3', 'h4', 'span'], class_=re.compile(r'name|title', re.I))
                name = name_elem.get_text(strip=True) if name_elem else station_id

            # 提取图片
            img = card.find('img')
            logo = img.get('src') or img.get('data-src') if img else None

            # 提取描述
            desc_elem = card.find(['p', 'div'], class_=re.compile(r'desc|info', re.I))
            description = desc_elem.get_text(strip=True) if desc_elem else ''

            # 提取位置信息
            location_elem = card.find(['span', 'div'], class_=re.compile(r'location|country|city', re.I))
            location = location_elem.get_text(strip=True) if location_elem else ''

            return {
                'id': station_id,
                'name': name,
                'url': station_url,
                'logo': logo,
                'description': description,
                'location': location,
                'genre': 'news'
            }
        except Exception as e:
            print(f"解析电台卡片失败: {e}")
            return None

    def _parse_station_element(self, link, soup) -> Optional[Dict]:
        """解析简单的电台链接元素"""
        try:
            station_url = urljoin(self.base_url, link.get('href', ''))
            station_id = self._extract_station_id(link.get('href', ''))
            name = link.get('title') or link.get_text(strip=True) or station_id

            # 尝试找相关的图片
            parent = link.parent
            img = parent.find('img') if parent else None
            logo = img.get('src') or img.get('data-src') if img else None

            return {
                'id': station_id,
                'name': name,
                'url': station_url,
                'logo': logo,
                'description': '',
                'location': '',
                'genre': 'news'
            }
        except Exception as e:
            print(f"解析电台元素失败: {e}")
            return None

    def _parse_json_station(self, item: dict) -> Optional[Dict]:
        """从JSON数据中解析电台信息"""
        try:
            url = item.get('url', '')
            station_id = self._extract_station_id(url)

            return {
                'id': station_id,
                'name': item.get('name', station_id),
                'url': urljoin(self.base_url, url),
                'logo': item.get('image', ''),
                'description': item.get('description', ''),
                'location': '',
                'genre': 'news'
            }
        except Exception as e:
            print(f"解析JSON电台失败: {e}")
            return None

    def _parse_json_station_generic(self, item: dict) -> Optional[Dict]:
        """从JSON数据中解析电台信息（通用版本）"""
        try:
            url = item.get('url', '')
            station_id = self._extract_station_id(url)

            return {
                'id': station_id,
                'name': item.get('name', station_id),
                'url': urljoin(self.base_url, url),
                'logo': item.get('image', ''),
                'description': item.get('description', ''),
                'location': '',
                'genre': 'top'
            }
        except Exception as e:
            print(f"解析JSON电台失败: {e}")
            return None

    def _parse_station_card_generic(self, card) -> Optional[Dict]:
        """解析电台卡片元素（通用版本）"""
        try:
            link = card.find('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
            if not link:
                return None

            station_url = urljoin(self.base_url, link.get('href', ''))
            station_id = self._extract_station_id(link.get('href', ''))

            # 提取电台名称
            name = link.get('title') or link.get_text(strip=True)
            if not name:
                name_elem = card.find(['h2', 'h3', 'h4', 'span'], class_=re.compile(r'name|title', re.I))
                name = name_elem.get_text(strip=True) if name_elem else station_id

            # 提取图片
            img = card.find('img')
            logo = img.get('src') or img.get('data-src') if img else None

            # 提取描述
            desc_elem = card.find(['p', 'div'], class_=re.compile(r'desc|info', re.I))
            description = desc_elem.get_text(strip=True) if desc_elem else ''

            # 提取位置信息
            location_elem = card.find(['span', 'div'], class_=re.compile(r'location|country|city', re.I))
            location = location_elem.get_text(strip=True) if location_elem else ''

            return {
                'id': station_id,
                'name': name,
                'url': station_url,
                'logo': logo,
                'description': description,
                'location': location,
                'genre': 'top'
            }
        except Exception as e:
            print(f"解析电台卡片失败: {e}")
            return None

    def _extract_station_id(self, url: str) -> str:
        """从URL中提取电台ID"""
        match = re.search(r'/s/([a-zA-Z0-9-]+)', url)
        return match.group(1) if match else ''

    def get_stream_url(self, station_id: str) -> Optional[str]:
        """
        获取电台的音频流URL

        Args:
            station_id: 电台ID

        Returns:
            Optional[str]: 音频流URL，如果获取失败返回None
        """
        try:
            station_url = f"{self.base_url}/s/{station_id}"
            print(f"正在获取电台流: {station_url}")

            response = self.session.get(station_url, timeout=15)
            response.raise_for_status()

            # 方法1: 直接在HTML中查找音频流URL (m3u8/mp3/aac/pls)
            audio_url_pattern = r'https?://[^\s"\'<>\\]+\.(?:m3u8|mp3|aac|pls)(?:/[^\s"\'<>\\]*)?'
            audio_urls = re.findall(audio_url_pattern, response.text)

            if audio_urls:
                # 返回第一个找到的音频流URL
                stream_url = audio_urls[0].rstrip('\\')
                print(f"找到音频流: {stream_url}")
                return stream_url

            # 方法2: 从HTML中查找播放器数据
            soup = BeautifulSoup(response.text, 'html.parser')

            # 查找JavaScript中的流URL
            scripts = soup.find_all('script')
            for script in scripts:
                if script.string:
                    # 查找常见的流URL模式
                    stream_patterns = [
                        r'streamUrl["\']?\s*[:=]\s*["\']([^"\']+)["\']',
                        r'stream["\']?\s*[:=]\s*["\']([^"\']+)["\']',
                        r'playUrl["\']?\s*[:=]\s*["\']([^"\']+)["\']',
                        r'src["\']?\s*[:=]\s*["\']([^"\']+\.(?:mp3|aac|m3u8))["\']',
                    ]

                    for pattern in stream_patterns:
                        match = re.search(pattern, script.string, re.I)
                        if match:
                            stream_url = match.group(1)
                            if stream_url.startswith('http'):
                                return stream_url

            # 方法3: 查找JSON配置
            json_scripts = soup.find_all('script', type='application/json')
            for script in json_scripts:
                try:
                    data = json.loads(script.string)
                    stream_url = self._extract_stream_from_json(data)
                    if stream_url:
                        return stream_url
                except:
                    pass

            # 方法4: 尝试API端点
            api_url = f"{self.base_url}/api/stations/{station_id}/stream"
            api_response = self.session.get(api_url, timeout=10)
            if api_response.status_code == 200:
                api_data = api_response.json()
                stream_url = self._extract_stream_from_json(api_data)
                if stream_url:
                    return stream_url

            print(f"未能找到电台 {station_id} 的音频流")
            return None

        except Exception as e:
            print(f"获取音频流失败: {e}")
            return None

    def _extract_stream_from_json(self, data) -> Optional[str]:
        """从JSON数据中递归提取流URL"""
        if isinstance(data, dict):
            for key in ['streamUrl', 'stream', 'url', 'playUrl', 'src']:
                if key in data and isinstance(data[key], str) and data[key].startswith('http'):
                    return data[key]
            for value in data.values():
                result = self._extract_stream_from_json(value)
                if result:
                    return result
        elif isinstance(data, list):
            for item in data:
                result = self._extract_stream_from_json(item)
                if result:
                    return result
        return None

    def search_stations(self, query: str) -> List[Dict]:
        """
        搜索电台

        Args:
            query: 搜索关键词

        Returns:
            List[Dict]: 匹配的电台列表
        """
        all_stations = self.get_news_stations()
        query_lower = query.lower()

        return [
            station for station in all_stations
            if query_lower in station['name'].lower() or
               query_lower in station.get('description', '').lower() or
               query_lower in station.get('location', '').lower()
        ]

    def clear_cache(self):
        """清除缓存"""
        self._cache = {}
        self._cache_time = 0
        print("缓存已清除")

    def analyze_url(self, url: str) -> Dict:
        """
        分析任意 radio.net URL，提取电台列表和流媒体链接

        Args:
            url: radio.net 网站的任意页面URL

        Returns:
            Dict: 包含电台列表和元数据的字典
        """
        try:
            print(f"正在分析URL: {url}")
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'

            soup = BeautifulSoup(response.text, 'html.parser')
            stations = []

            # 获取页面标题
            page_title = soup.find('title')
            title = page_title.get_text(strip=True) if page_title else 'Unknown Page'

            # 方法0: 对于搜索页面和Next.js页面，尝试从内嵌JSON中提取
            if '/search' in url or 'self.__next_f' in response.text:
                stations = self._extract_from_nextjs_data(response.text)
                if stations:
                    print(f"从Next.js数据中提取到 {len(stations)} 个电台")
                    return {
                        'success': True,
                        'url': url,
                        'page_title': title,
                        'station_count': len(stations),
                        'stations': stations
                    }

            # 方法1: 查找电台卡片元素
            station_cards = soup.find_all('div', class_=re.compile(r'station.*card|card.*station', re.I))

            # 方法2: 查找包含电台链接的元素
            if not station_cards:
                station_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                station_cards = [link.parent for link in station_links]

            # 方法3: 尝试从JSON数据中提取
            if not station_cards:
                scripts = soup.find_all('script', type='application/ld+json')
                for script in scripts:
                    try:
                        data = json.loads(script.string)
                        if isinstance(data, dict) and 'itemListElement' in data:
                            for item in data['itemListElement']:
                                if 'item' in item:
                                    station_info = self._parse_json_station_generic(item['item'])
                                    if station_info:
                                        stations.append(station_info)
                    except:
                        pass

            # 方法4: 查找所有电台链接并解析
            if not stations:
                all_links = soup.find_all('a', href=re.compile(r'/s/[a-zA-Z0-9-]+'))
                processed_ids = set()

                for link in all_links:
                    station_id = self._extract_station_id(link.get('href', ''))
                    if station_id and station_id not in processed_ids:
                        station_info = self._parse_station_element_generic(link, soup)
                        if station_info:
                            stations.append(station_info)
                            processed_ids.add(station_id)
            else:
                # 解析找到的电台卡片
                for card in station_cards:
                    station_info = self._parse_station_card_generic(card)
                    if station_info:
                        stations.append(station_info)

            print(f"成功从URL中提取 {len(stations)} 个电台")

            return {
                'success': True,
                'url': url,
                'page_title': title,
                'station_count': len(stations),
                'stations': stations
            }

        except requests.RequestException as e:
            print(f"网络请求错误: {e}")
            return {
                'success': False,
                'error': f'网络请求错误: {str(e)}',
                'url': url,
                'stations': []
            }
        except Exception as e:
            print(f"分析错误: {e}")
            return {
                'success': False,
                'error': f'解析错误: {str(e)}',
                'url': url,
                'stations': []
            }

    def _extract_from_nextjs_data(self, html_content: str) -> List[Dict]:
        """
        从Next.js页面的内嵌JSON数据中提取电台信息
        适用于搜索页面等使用React Server Components的页面
        """
        stations = []
        processed_ids = set()

        try:
            # 正则匹配电台JSON对象
            # Next.js 在HTML中使用转义的JSON，格式如: \"id\":\"wfan\"
            # 完整格式示例: {\"city\":\"New York City\",\"genres\":[\"Talk\"],\"id\":\"wfan\",\"logo100x100\":\"...\"}
            pattern = r'\\"id\\":\\"([a-z0-9-]+)\\"[^}]*?\\"logo100x100\\":\\"([^"\\]*)'

            matches = re.finditer(pattern, html_content)

            for match in matches:
                station_id = match.group(1)
                logo_url = match.group(2).replace('\\/', '/')

                # 过滤重复和无效的ID
                if station_id and len(station_id) > 2 and station_id not in processed_ids:
                    # 向后查找name和city
                    # 查找这个电台ID附近的完整信息
                    context_start = max(0, match.start() - 200)
                    context_end = min(len(html_content), match.end() + 200)
                    context = html_content[context_start:context_end]

                    name = station_id  # 默认使用ID
                    city = ''

                    # 尝试提取name (可能在id前面或后面)
                    name_match = re.search(r'\\"name\\":\\"([^"\\]+)\\"', context)
                    if name_match:
                        name = name_match.group(1)

                    # 尝试提取city
                    city_match = re.search(r'\\"city\\":\\"([^"\\]*)\\"', context)
                    if city_match:
                        city = city_match.group(1)

                    station_info = {
                        'id': station_id,
                        'name': name,
                        'url': f"{self.base_url}/s/{station_id}",
                        'logo': logo_url if logo_url else None,
                        'description': '',
                        'location': city,
                        'genre': 'search'
                    }

                    stations.append(station_info)
                    processed_ids.add(station_id)

        except Exception as e:
            print(f"从Next.js数据提取失败: {e}")

        return stations

    def _parse_station_element_generic(self, link, soup) -> Optional[Dict]:
        """解析简单的电台链接元素（通用版本）"""
        try:
            station_url = urljoin(self.base_url, link.get('href', ''))
            station_id = self._extract_station_id(link.get('href', ''))
            name = link.get('title') or link.get_text(strip=True) or station_id

            # 尝试找相关的图片
            parent = link.parent
            img = parent.find('img') if parent else None
            logo = img.get('src') or img.get('data-src') if img else None

            return {
                'id': station_id,
                'name': name,
                'url': station_url,
                'logo': logo,
                'description': '',
                'location': '',
                'genre': 'unknown'
            }
        except Exception as e:
            print(f"解析电台元素失败: {e}")
            return None

    def batch_get_streams(self, station_ids: List[str], delay: float = 1.0) -> Dict[str, Optional[str]]:
        """
        批量获取多个电台的流媒体链接

        Args:
            station_ids: 电台ID列表
            delay: 每次请求间隔（秒）

        Returns:
            Dict[str, Optional[str]]: 电台ID到流媒体URL的映射
        """
        results = {}
        total = len(station_ids)

        for i, station_id in enumerate(station_ids, 1):
            print(f"[{i}/{total}] 获取 {station_id} 的流媒体链接...")
            stream_url = self.get_stream_url(station_id)
            results[station_id] = stream_url

            if i < total:
                time.sleep(delay)

        return results


if __name__ == '__main__':
    # 测试代码
    scraper = RadioNetScraper()
    stations = scraper.get_news_stations()

    print(f"\n找到 {len(stations)} 个新闻电台:\n")
    for i, station in enumerate(stations[:10], 1):
        print(f"{i}. {station['name']}")
        print(f"   ID: {station['id']}")
        print(f"   URL: {station['url']}")
        if station.get('location'):
            print(f"   位置: {station['location']}")
        print()

    # 测试获取音频流
    if stations:
        print(f"\n测试获取第一个电台的音频流...")
        stream_url = scraper.get_stream_url(stations[0]['id'])
        if stream_url:
            print(f"音频流URL: {stream_url}")
        else:
            print("未能获取音频流URL")
