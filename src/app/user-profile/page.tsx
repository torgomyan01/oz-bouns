"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { Button, Card, CardBody, Input, Link, Tab, Tabs } from "@heroui/react";
import OrderBlockItem from "./components/order-block-item";

function Page() {
  return (
    <MainTemplate>
      <div className="pb-[100px]">
        <div className=" bg-white rounded-[20px] p-[16px]">
          <h1 className="text-[#79838B] text-[32px] font-normal pt-[15px]">Armen Muradian</h1>
          <div className="mt-[10px]">
            <p className="text0[10px] text-[#B8C5D0] font-normal">Հեռախսահամար</p>
            <p className="text-[14px] text-[#79838B] font-normal">099-381-099</p>
          </div>
          <div className="mt-[10px]">
            <p className="text0[10px] text-[#B8C5D0] font-normal">Քարտի համար</p>
            <p className="text-[14px] text-[#79838B] font-normal">***********6985</p>
          </div>

        </div>

        <div className=" flex-je-c mb-[-30px]">
          <Link href="/user-profile/add-card">
            <i className="fa-solid fa-plus text-blue text-[24px] mt-6 transform translate-y-[25px] pr-[10px]"></i>
          </Link>
        </div>




        <Tabs aria-label="Options" color="secondary" className="mt-6"
          classNames={{
            tabList: "bg-white rounded-[30px]",
            tab: "!rounded-[30px] !text-white",
            cursor: "rounded-[30px] text-white",
          }}>
          <Tab key="photos" title="Ակտիվ" >
            <div className="pt-4">
              {
                Array.from({ length: 10 }).map((_, index) => (
                  <OrderBlockItem key={`order-block-item-${index}`} />
                ))
              }
            </div>
          </Tab>
          <Tab key="music" title="Ավարտած">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </Tab>
        </Tabs>


      </div>
    </MainTemplate>
  );
}

export default Page;
