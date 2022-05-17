# ALPACA

> ALgorithm Powerup Along with Coding study Assistance

소개 - 알고리즘 실력 향상을 위한 스터디 서비스. 상세 내용 추후 작성 예정



1. solved.ac (https://solvedac.github.io/unofficial-documentation/#/) 비공식 문서 api 사용
2. JDOODLE (https://www.jdoodle.com/ ) 코드 컴파일러 사용
3. yjs docs (https://docs.yjs.dev/ ) 공유 문서 편집기 사용
4. OpenVidu (https://openvidu.io/ ) WebRTC 오픈소스

### 주요 기능

- 코드리뷰
- 화상스터디 & 화면공유

- 코드 컴파일

### 세부기능

- 그룹별 스터디 관리
- 스터디 일정 및 문제 관리
- 적절한 문제 추천
- 채팅
- 스터디 멤버의 코드확인

### 아키텍쳐

- 주요 기술스택 & 

  ![Spring](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=SpringBoot&logoColor=ffffff)![mysql](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=ffffff)![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=flat&logo=Gradle&logoColor=white)![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white&style=flat-square)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white&style=flat-square)![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=typescript&logoColor=ffffff)![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=ffffff)![redux](https://img.shields.io/badge/redux-764ABC?style=flat&logo=react&logoColor=ffffff)![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=flat&logo=jenkins&logoColor=white)

- 아키텍처

### 설치

#### 개발 환경

- MySQL 8.0.28

  ```mysql
  CREATE DATABASE alpaca default CHARACTER SET UTF8;
  CREATE user `alpaca`@`%` IDENTIFIED BY 'didaudrbs';
  GRANT ALL PRIVILEGES ON `alpaca`.* TO `alpaca`@`%`
  FLUSH PRIVILEGES
  ```

- MongoDB 5.0.7

  ```mongo
  
  ```

- [Redis](https://github.com/microsoftarchive/redis/releases) 3.0.504 설치

- frontend

  ```bash
  # root/frontend
  npm install
  npm start
  ```

- backend

  ```
  build by gradle
  ```

#### 배포 환경

- exec 참조

### 사용 예시

### 팀원

- [박준영]([JUNYOUNG31 · GitHub](https://github.com/JUNYOUNG31)) :crown: Frontend

- [강동옥]([okdongdong (Dongok Kang) · GitHub](https://github.com/okdongdong)) Frontend
- [성아영]([Sungayoung · GitHub](https://github.com/Sungayoung)) Frontend
- [양지훈]([Sungayoung · GitHub](https://github.com/Sungayoung)) Backend
- [이승훈]([SeungHunL (LEE) · GitHub](https://github.com/SeungHunL)) Backend
- [정성우]([jsw3788 · GitHub](https://github.com/jsw3788)) Backend
