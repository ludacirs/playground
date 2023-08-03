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
    } catch (e) {
      console.log(e);
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
        1번 채널 접속
      </Button>
      <Button
        onClick={() => {
          handleClickLoginButton(2);
        }}
      >
        2번 채널 접속
      </Button>

      <div className="w-full h-0.5 bg-slate-400" />

      <Button onClick={() => handleClickNotiferButton(1)}>
        1번 채널 알림 보내기
      </Button>
      <Button onClick={() => handleClickNotiferButton(2)}>
        2번 채널 알림 보내기
      </Button>
    </main>
  );
};

export default Home;
