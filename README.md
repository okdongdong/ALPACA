# ALPACA

> ALgorithm Powerup Along with Coding study Assistance

소개 - 알고리즘 실력 향상을 위한 스터디 서비스. 상세 내용 추후 작성 예정



1. solved.ac (https://solvedac.github.io/unofficial-documentation/#/) 비공식 문서 api 사용
2. JDOODLE (https://www.jdoodle.com/ ) 코드 컴파일러 사용
3. yjs docs (https://docs.yjs.dev/ ) 공유 문서 편집기 사용
4. OpenVidu (https://openvidu.io/ ) WebRTC 오픈소스

### 주요 기능

- 코드리뷰 및 동시 편집

  ![코드리뷰](https://lab.ssafy.com/s06-final/S06P31E106/uploads/d8e82c1b2b78f7a0c0d26ec31a01ea06/코드리뷰.gif)

  

- 화상스터디 & 화면공유 & 타이머

  ![스터디_라이브](https://lab.ssafy.com/s06-final/S06P31E106/uploads/61454321500b63df2e564e6201f85e65/스터디_라이브.gif)

- 코드 컴파일

  ![컴파일](https://lab.ssafy.com/s06-final/S06P31E106/uploads/d0aff504437dd5c0f4022a78b31d5593/컴파일.gif)

### 세부기능

- 전체 스터디 주 단위 관리

  ![전체_스터디_주_단위_관리](https://lab.ssafy.com/s06-final/S06P31E106/uploads/c70892357bf25184296d982613063f7c/전체_스터디_주_단위_관리.gif)



- 스터디 일정 관리

  ![월별_스터디_일정_관리](https://lab.ssafy.com/s06-final/S06P31E106/uploads/b00e03589bffffdc3b8b60bda84cca36/월별_스터디_일정_관리.gif)

  

- 오늘의 문제 추천

  ![데일리_문제추천](https://lab.ssafy.com/s06-final/S06P31E106/uploads/ec97ba9e3629a211c971a2d2f6e75985/데일리_문제추천.gif)

- 채팅

  ![채팅](https://lab.ssafy.com/s06-final/S06P31E106/uploads/8b79d21b8104aac2710a9b7b3c35972f/채팅.gif)

- 문제 관리 및 스터디 멤버의 코드확인

  ![문제관리](https://lab.ssafy.com/s06-final/S06P31E106/uploads/23a7149f43c5e063dee5d81a0ad39403/문제관리.gif)

### 아키텍쳐

- 주요 기술스택 & 

  ![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=typescript&logoColor=ffffff) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=ffffff) ![redux](https://img.shields.io/badge/redux-764ABC?style=flat&logo=react&logoColor=ffffff) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=flat&logo=mui&logoColor=white) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=flat&logo=figma&logoColor=white)

  ![Spring](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=SpringBoot&logoColor=ffffff) ![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=flat&logo=Gradle&logoColor=white) ![mysql](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=ffffff) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white&style=flat-square) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white&style=flat-square) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=flat&logo=jenkins&logoColor=white)

- 아키텍처

  ![image-20220520090734383](C:\Users\SSAFY\AppData\Roaming\Typora\typora-user-images\image-20220520090734383.png)

### 코드 정적분석 결과

![image-20220520091426534](C:\Users\SSAFY\AppData\Roaming\Typora\typora-user-images\image-20220520091426534.png)

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

  -  config setting

  ```ini
  # C:\Program Files\MongoDB\Server\5.0\bin\mongod.conf 
  ```

  - auth

  ```sh
  mongo
  use admin
  db.createUser({
      user: '****',
      pwd: '****',
      roles: ['userAdminAnyDatabase']
  })
  use admin
  db.auth('****','****')
  use alpaca
  db.createUser({user: "alpaca",
  pwd: "didaudrbs1", 
  roles:["readWrite"],
  mechanisms:["SCRAM-SHA-1"]})
  })
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
