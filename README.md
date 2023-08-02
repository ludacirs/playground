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