# server

## Development Environment
```bash
$ npm run dev
```

## Run

```bash
$ npm run build
$ npm run start
```

## How to run DB

- Docker 설치 필요
- `db_scheme/main.sql` 파일이 main db로 생성됨.  

### DB 실행

```bash
$ npm run db
```
MySQL 실행(기존에 실행중인 컨테이너가 있으면 제거 후 실행됨) 백그라운드에서 실행되므로 중지하고 싶을 땐 `npm run db-stop` 을 사용할 것.

### DB 중지

```bash
$ npm run db-stop
```
실행 중인 MySQL 컨테이너 제거됨. 기존에 DB에 넣었던 데이터들 모두 사라짐.

### DB 접속

```bash
$ npm run db-exec
$ mysql -u root -p
$ Y0ungAndR1chThatsUs
$ use main;
```
실행 후 DB 접속 후 root 비밀번호 입력 후 `main` 데이터베이스 접속

### DB 로그

```bash
$ npm run db-log
```

현재 실행중인 DB 컨테이너의 로그를 볼 수 있음. `npm run db` 시 자동 실행