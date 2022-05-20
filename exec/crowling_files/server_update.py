# 추가된 문제 서버에서 crontab 으로 새벽 3시마다 실행해서 업데이트
from bson import Int64
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import time


def sorting_title():
    problem = MongoClient(
        host='k6E106.p.ssafy.io', 
        port=7107,
        username='alpaca',
        password='didaudrbs1',
        authSource='alpaca',
        authMechanism='SCRAM-SHA-1'
        )['alpaca'].problem

    maxProblemNumber =problem.find().sort("_id",-1).limit(1)[0]['problemNumber'] # 마지막에 추가된 문제 번호 찾기

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    problem_list = {} # 번호별 문제 모음 (레벨, 문제번호, 제목, 입력, 출력)
    page_url="https://www.acmicpc.net/problem/added"
    data = requests.get(page_url, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    trs = soup.select('div.table-responsive > table > tbody > tr')
    for k in range(len(trs)):
        time.sleep(0.5)
        idx = trs[k].select_one('tr > td.list_problem_id').text
        if int(idx) == maxProblemNumber: # 이 이후로는 저장된 문제이므로 break
            break
        title = trs[k].select_one('tr > td:nth-child(2) > a').text
        data = requests.get('https://www.acmicpc.net/problem/'+f'{idx}', headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')
        tier = requests.get('https://solved.ac/api/v3/problem/show',params={'problemId':idx}).json()["level"]
        sampledata = soup.select('pre.sampledata')
        sampledata = list(map(lambda x: x.text, sampledata))

        # 문제번호, 레벨, 제목, 인풋, 아웃풋
        problem_list[int(idx)]=[idx, tier, title]
        for sample in sampledata:
            problem_list[int(idx)].append(sample)

    # 몽고DB 에 문제 등록 
    for key in list(reversed(problem_list.keys())):
        value = problem_list[key]
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