# 클래스에 소속된 문제에 클래스레벨 추가

import requests
from bs4 import BeautifulSoup
from bson import Int64
from pymongo import MongoClient

def sorting_title():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    for i in range(2,11):
        problem_list = []

        page_url="https://solved.ac/class/"+f'{i}'
        data = requests.get(page_url, headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')
        trs = soup.select('div.StickyTable__Row-sc-45ty5n-2.gnrMGL')

        for k in range(1,len(trs)):
            idx = trs[k].select_one('a.ProblemInline__ProblemStyle-sc-yu6g1r-0').text[1:]
            problem_list.append(idx)

        problem = MongoClient(
            host='k6E106.p.ssafy.io', 
            port=7107,
            username='alpaca',
            password='didaudrbs1',
            authSource='alpaca',
            authMechanism='SCRAM-SHA-1'
            )['alpaca'].problem

        for j in range(len(problem_list)):
            problem.update_one({"problemNumber":Int64(problem_list[j])},{"$set":{"classLevel":Int64(i)}})

### 실행하기
sorting_title()