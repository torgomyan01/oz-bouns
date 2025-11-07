"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { Link, Tab, Tabs, Tooltip } from "@heroui/react";
import { useSession } from "next-auth/react";
import { SITE_URL } from "@/utils/consts";
import PandingItems from "./components/panding-items";
import CompletedItems from "./components/complated-items";

function Page() {
  const { data: session }: any = useSession();

  return (
    <MainTemplate>
      <div className="pb-[100px]">
        <div className=" bg-white rounded-[20px] p-[16px]">
          <h1 className="text-[#79838B] text-[32px] font-normal pt-[15px]">
            {session?.user?.name}
          </h1>
          <div className="mt-[10px]">
            <p className="text0[10px] text-[#B8C5D0] font-normal">
              Հեռախսահամար
            </p>
            <p className="text-[14px] text-[#79838B] font-normal">
              {session?.user?.phone_number ?? "099-381-099"}
            </p>
          </div>
          <div className="mt-[10px]">
            <p className="text0[10px] text-[#B8C5D0] font-normal">
              Քարտի համար
            </p>
            <p className="text-[14px] text-[#79838B] font-normal">
              {`**********${session?.user?.card_number?.slice(-4)}`}
            </p>
          </div>
        </div>

        <div className=" flex-je-c mb-[-60px] mt-[50px]">
          <Tooltip
            content="Ավելացնել նոր պատվեր"
            color="secondary"
            placement="top"
          >
            <Link href={SITE_URL.CREATE_ORDER}>
              <i className="fa-solid fa-plus text-[#4BC9FE] text-[24px] mt-6 pr-[10px]"></i>
            </Link>
          </Tooltip>
        </div>

        <Tabs
          aria-label="Options"
          color="secondary"
          className="mt-6"
          classNames={{
            tabList: "bg-white rounded-[30px]",
            tab: "!rounded-[30px] !text-white",
            cursor: "rounded-[30px] text-white",
            tabContent: "data-[disabled=true]:text-white!",
          }}
        >
          <Tab key="pending" title="Ակտիվ">
            <PandingItems />
          </Tab>
          <Tab key="completed" title="Ավարտած">
            <CompletedItems />
          </Tab>
        </Tabs>
      </div>
    </MainTemplate>
  );
}

export default Page;
