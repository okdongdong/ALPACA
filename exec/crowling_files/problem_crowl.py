# 각 레벨 > 레벨에 있는 각 페이지 > 개별 문제 크롤링
import requests
from bs4 import BeautifulSoup
import time
from bson import Int64
from pymongo import MongoClient

def sorting_title():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    problem_list = {} # 번호별 문제 모음 (레벨, 문제번호, 제목, 입력, 출력)
    for i in range(1): # 레벨 0: unrated, 1~5: bronze, ...
        page_url="https://solved.ac/problems/level/"+f'{i}'
        data = requests.get(page_url, headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')
        # 페이지 수
        pagination = soup.select('div.Paginationstyles__PaginationWrapper-sc-bdna5c-2.gFzrWw > a')
        if pagination:
            page_len = int(pagination[-1].text) 
        else:
            page_len = 1

        # 각 페이지
        for j in range(1,int(page_len)+1):
            time.sleep(0.5) # 서버에서 공격으로 감지하지 않게 sleep 넣기
            data = requests.get(page_url+f'?page={j}', headers=headers)
            soup = BeautifulSoup(data.text, 'html.parser')
            trs = soup.select('div.StickyTable__Table-sc-45ty5n-0.jdNKqQ.sticky-table-table > div')
            for k in range(1,len(trs)): # 문제 개별페이지에서 긁기
                time.sleep(0.5)
                idx = trs[k].select_one('a.hover_underline > a > span').text
                title = trs[k].select_one('span.__Latex__').text
                data = requests.get('https://www.acmicpc.net/problem/'+f'{idx}', headers=headers)
                soup = BeautifulSoup(data.text, 'html.parser')
                sampledata = soup.select('pre.sampledata')
                sampledata = list(map(lambda x: x.text, sampledata))
                # 문제번호, 레벨, 제목, 인풋, 아웃풋
                problem_list[int(idx)]=[idx, i, title]
                for sample in sampledata:
                    problem_list[int(idx)].append(sample)
                # print(problem_list)

    problem = MongoClient(
        host='k6E106.p.ssafy.io', 
        port=7107,
        username='alpaca',
        password='didaudrbs1',
        authSource='alpaca',
        authMechanism='SCRAM-SHA-1'
        )['alpaca'].problem

    for key,value in problem_list.items():
        boj_problem = {
            "problemNumber": Int64(value[0]),
            "level": Int64(value[1]),
            "title": value[2]
        }
        inputs=[]
        outputs=[]
        for j in range(1,(len(value)-3)//2+1):
            inputs.append(str([value[j*2+1]])[2:-2])
            outputs.append(value[j*2+2])
        boj_problem["inputs"]=inputs
        boj_problem["outputs"]=outputs
        problem.insert_one(boj_problem).inserted_id

### 실행하기
sorting_title()