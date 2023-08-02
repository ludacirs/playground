import { Inter } from "next/font/google";
import { Button } from "@libs/ui";
import { useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [id, setId] = useState<number | null>(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    const eventSource = new EventSourcePolyfill("http://localhost:3002/sse", {
      headers: {
        Authorization: `Bearer ${id}`,
      },
    });
    eventSource.onmessage = ({ data }) => {
      console.log("New message", JSON.parse(data));
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  const handleClickLoginButton = (id: number) => {
    console.log("login 성공");
    setId(id);
  };

  const handleClickNotiferButton = async (id: number) => {
    const body = JSON.stringify({ userId: id });

    try {
      await fetch("http://localhost:3002/", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      });
      console.log("메시지 post 성공");
    } catch (error) {
      console.log("실패");
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Button
        onClick={() => {
          handleClickLoginButton(1);
        }}
      >
        1번으로 로그인
      </Button>
      <Button
        onClick={() => {
          handleClickLoginButton(2);
        }}
      >
        2번으로 로그인
      </Button>
      <div className="w-full h-10 bg-slate-500" />
      <Button onClick={() => handleClickNotiferButton(1)}>
        1번으로 노티 보내기
      </Button>
      <Button onClick={() => handleClickNotiferButton(2)}>
        2번으로 노티 보내기
      </Button>
      <div className="w-40 h-50 bg-slate-100">TEST1</div>
    </main>
  );
};

export default Home;
