"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { Button, Input, addToast } from "@heroui/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SITE_URL } from "@/utils/consts";

function Page() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !password) {
      addToast({
        title: "Խնդրում ենք լրացնել բոլոր դաշտերը",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone_number: phoneNumber.trim(),
        password,
      });

      if (res?.ok) {
        addToast({
          title: "Դուք հաջողությամբ մուտք գործեցիք",
          color: "success",
        });
        router.push(`${SITE_URL.USER_PROFILE}`);
      } else {
        addToast({
          title: "Սխալ հեռախոսահամար կամ գաղտնաբառ",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Սխալ է տեղի ունեցել. Խնդրում ենք փորձել կրկին",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <div className=" bg-white rounded-[20px]  ">
        <div className="px-[16px] pt-4 pb-[40px] text-center">
          <h1 className="text-[32px] font-medium text-start">Ozon Աշխատանք</h1>
          <h2 className="text-[16px] font-medium text-start">
            Մուտք գործելու համար գրեք ձեր տվյալները
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="pt-[40px] flex-js-s gap-1 flex-col ">
              <p className="text-[14px] font-medium pl-0.5">Հեռախոսահամար</p>
              <Input
                type="tel"
                name="phone_number"
                pattern="0\d{8}"
                maxLength={9}
                autoComplete="off"
                variant="bordered"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="pt-[30px] flex-js-s gap-1 flex-col">
              <p className="text-[14px] font-medium pl-0.5">Գաղտնաբառ</p>
              <Input
                type="password"
                autoComplete="off"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              color="secondary"
              className="rounded-[50px]  mt-[40px] px-[30px] "
              isLoading={loading}
              disabled={loading}
            >
              Մուտք
            </Button>
          </form>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
