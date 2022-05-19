# 배포 환경

#### 계정 정보

> Jenkins
>
> username : alpaca
>
> password : didaudrbs

> MySQL
>
> username : alpaca
>
> password : didaudrbs

> MongoDB
>
> username : alpaca
>
> password : didaudrbs1

### Docker

##### docker

```sh
$ sudo apt-get remove docker docker-engine docker.io containerd runc

$ sudo apt-get update
$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

##### (docker compose)

```sh
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ sudo apt install apt-transport-https ca-certificates curl soxftware-properties-common
```



### Jenkins

##### version : latest

```sh
$ docker pull jenkins/jenkins:lts
$ docker volume create jenkins-volume

$ docker run 
	-u 0
	-d --name jenkins-with-docker \
	-p 9090:8080 -p 50000:50000 \
	-v /home/jenkins:/var/jenkins_home \
	-v /home/ubuntu/docker-volume/jenkins:/var/jenkins_home
	-v /var/run/docker.sock:/var/run/docker.sock
	jenkins/jenkins:lts

$ docker exec -it jenkins(컨테이너 이름) bash
```

##### jenkins docker-compose 설치



### MySQL

##### version : 8.0.28

```dockerfile
$ docker pull mysql:8.0.28
$ docker run -d \
	-p 6033:3306 \
	-v /home/mysql:/var/lib/mysql \
	--env MYSQL_ROOT_PASSWORD="{$ROOT_PASSWORD}" \
	--env MYSQL_DATABASE="mysql" \
	--env TZ=Asia/Seoul \
	--name mysql-docker \
	mysql:8.0.28 \
	--character-set-server=utf8mb4 \
	--collation-server=utf8mb4_unicode_ci

# docker mysql 접속
$ docker exec -it mysql-docker bash
>> mysql -u root -p
>> password : {$ROOT_PASSWORD}
```

```mysql
CREATE DATABASE alpaca default CHARACTER SET UTF8;
CREATE user `alpaca`@`%` IDENTIFIED BY 'didaudrbs';
GRANT ALL PRIVILEGES ON `alpaca`.* TO `alpaca`@`%`
FLUSH PRIVILEGES
```

### MongoDB

##### version : 5.0.7



### Redis

##### version : alpine

```sh
$ docker pull redis:alpine
$ docker network ls
$ docker network create redis-net
$ docker run -d --name redis-docker \
	-p 6001:6379 \
	--network redis-net \
	-v /home/redis:/data \
	redis:alpine --appendonly yes
```

### Openvidu

```sh
$ sudo su
$ cd /opt
# install openvidu platform
$ curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
$ cd openvidu
$ nano .env

# DOMAIN_OR_PUBLIC_IP : k6e106.p.ssafy.io
# OPENVIDU_SECRET : alpaca
# CERTIFICATE_TYPE : letsencrypt
# LETSENCRYPT_EMAIL : paka34332@gmail.com
# HTTP_PORT : 8442
# HTTPS_PORT : 8443
# openvidu 실행

$ ./openvidu start

# 인증서 발급 확인
$ cd /opt/openvidu/certificates/live/도메인
$ ls

```



### Crontab

```sh
crontab -l
crontab -e
systemctl status cron
0 3 * * * python3 /home/ubuntu/updated_boj.py
```

