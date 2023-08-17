# 이것저것 해보는 저장소

1. monorepo
2. Server Sent Event (SSE)


## monorepo

- root의 package.json에서 workspace를 지정해줘야함
  ```
    "workspaces": [
    "packages/*",
    "libs/*"
  ],
  ```
- 다른 저장소의 코드를 가져오려면 사용하려는 저장소의 package.json에 `"@libs/ui": "workspace:*",` 와 같이 선언
- 다른 저장소로 코드를 내보내려면 해당 저장소의 package.json에 `"exports": {".": "./src/index.ts" }` 와 같이 선언
- peerDependencies를 설정해준다고 해야하는데 아직 별 문제 없음


## Server Sent Event (SSE)

- SSE는 header 세팅을 지원하지 않아서 pollyfill 패키지를 받아서 사용해야함 `event-source-polyfill`
- SSE는 HTTP 1.1에서는 하나의 브라우저에 총 6개만 연결할 수 있음 => 실제 서비스에서는 대부분 2.0을 사용하고 있어서 100개까지 가능
  - HTTP 1.1에서도 service worker를 [리버스 프록시 처럼 사용해서](https://github.com/shoom3301/ssegwsw.git) 극복가능
  - 여러 탭에서 각각 EventSource를 생성하지 않고 하나의 EventSource로 통신 가능

---

### todo

- [ ] 헤더를 넘겨주기, app에서는 `event-source-polyfill`를 사용할 수 있지만 service worker에선 안됨