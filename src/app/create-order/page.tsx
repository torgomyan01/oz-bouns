"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { addToast, Button, Input } from "@heroui/react";
import { useState } from "react";
import { ActionCreateOrder } from "../actions/order/create";
import { SITE_URL } from "@/utils/consts";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      addToast({
        title: "Խնդրում ենք լրացնել բոլոր դաշտերը",
        color: "danger",
      });
      return;
    }
    setLoading(true);

    ActionCreateOrder(orderNumber.trim())
      .then((response: any) => {
        if (response.status === "ok") {
          addToast({
            title: response.message,
            color: "success",
          });

          router.push(SITE_URL.USER_PROFILE);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <MainTemplate>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[20px] p-[16px] pb-10 text-center h-[600px]"
      >
        <h1 className="text-black text-[22px] font-medium pt-[15px] text-start mb-6">
          Ավելացնել նոր պատվեր
        </h1>
        <div className="mt-[10px]">
          <p className="text-[14px] text-black font-medium pb-2  text-start">
            Պատվերի համար
          </p>
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            type="text"
            variant="bordered"
            color="secondary"
          />
        </div>
        <Button
          color="secondary"
          type="submit"
          className="rounded-[50px]  mt-[40px] px-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!orderNumber.trim()}
          isLoading={loading}
        >
          Ավելացնել
        </Button>
      </form>
    </MainTemplate>
  );
}

export default Page;
