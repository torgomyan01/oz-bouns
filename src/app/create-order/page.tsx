"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { Button, Input } from "@heroui/react";

function Page() {

    return (
        <MainTemplate>
            <div className="bg-white rounded-[20px] p-[16px] pb-10 text-center h-[600px]">
                <h1 className="text-black text-[22px] font-medium pt-[15px] text-start mb-6">Ավելացնել նոր պատվեր</h1>
                <div className="mt-[10px]">
                    <p className="text-[14px] text-black font-medium pb-2  text-start">Պատվերի համար</p>
                    <Input label="0158456585-003" type="number" variant="bordered" color="secondary" />
                </div>
                <Button color="secondary" className="rounded-[50px]  mt-[40px] px-[30px] ">Ավելացնել</Button>
            </div>
        </MainTemplate>
    );
}

export default Page;