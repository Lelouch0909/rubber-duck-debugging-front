import "../globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Chat from "@/components/Chat";
import Header from "@/components/Header";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en" className={""}>
      <div
        className={` antialiased text-primary`}
      >
        <div className={"flex h-screen w-screen bg-background   "}>
          <LeftSidebar className={"border-r-[1px] border-muted "} />

          <div className={"w-full h-full flex flex-col"} >
            <Header className={" border-muted border-b-[1px]  w-full "} />
            <Chat className={"w-full h-full bg-secondary relative "} >
              {children}

            </Chat>

          </div>
          <RightSidebar className={" border-l-[1px] border-muted"}/>

        </div>
      </div>
    </div>
  );
}
