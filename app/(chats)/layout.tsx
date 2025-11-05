"use client";
import "../globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import ChatsBloc from "@/components/ChatsBloc";
import Header from "@/components/Header";
import { useChatSendRedux } from "@/hooks/useChatSendRedux";

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleSend = useChatSendRedux();

  return (
    <div lang="en" className={""}>
      <div className={` antialiased text-primary`}>
        <div className={"flex h-screen w-screen bg-background   "}>
          <LeftSidebar className={"border-r-[1px] border-muted "} />

          <div className={"w-full h-full flex flex-col"}>
            <Header className={" border-muted border-b-[1px]  w-full "} />
            <ChatsBloc
              className={"w-full h-full bg-secondary relative "}
              onSend={handleSend}
            >
              {children}
            </ChatsBloc>
          </div>
          <RightSidebar className={" border-l-[1px] border-muted"} />
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContent>{children}</LayoutContent>;
}
