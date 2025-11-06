"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { Button, Input } from "@heroui/react";

function Page() {
  return (
    <MainTemplate>
      <div className=" bg-white rounded-[20px]  ">
        <div className="px-[16px] pt-[60px] pb-[40px] text-center">
          <h1 className="text-[32px] font-medium text-start">Ozon Աշխատանք</h1>
          <h2 className="text-[16px] font-medium text-start">Մուտք գործելու համար գրեք ձեր տվյալները</h2>
          <div className="pt-[75px] flex-js-s gap-1 flex-col ">
            <p className="text-[14px] font-medium pl-0.5">Հեռախոսահամար</p>
            <Input label="000 - 00 - 00 - 00" type="text" variant="bordered" className="h-6" />
          </div>
          <div className="pt-[30px] flex-js-s gap-1 flex-col">
            <p className="text-[14px] font-medium pl-0.5">Գաղտնաբառ</p>
            <Input label="**********" type="text" variant="bordered" className="h-6" />
          </div>

          <Button color="secondary" className="rounded-[50px]  mt-[40px] px-[30px] ">Մուտք </Button>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
