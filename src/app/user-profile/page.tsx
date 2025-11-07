"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import {
  Link,
  Tab,
  Tabs,
  Tooltip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { SITE_URL } from "@/utils/consts";
import PandingItems from "./components/panding-items";
import CompletedItems from "./components/complated-items";
import { useState } from "react";
import { changePasswordAction } from "@/app/actions/user/change-password";

function Page() {
  const { data: session }: any = useSession();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
          <div className="mt-[20px]">
            <Button
              color="secondary"
              variant="flat"
              onPress={() => {
                setIsPasswordModalOpen(true);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError(null);
                setFieldErrors(undefined);
                setSuccessMessage(null);
              }}
              className="w-full"
            >
              Փոփոխել գաղտնաբառը
            </Button>
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

        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Փոփոխել գաղտնաբառը
                </ModalHeader>
                <ModalBody>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {successMessage && (
                    <div className="text-green-500 text-sm">
                      {successMessage}
                    </div>
                  )}
                  <Input
                    type="password"
                    label="Հին գաղտնաբառ"
                    placeholder="Մուտքագրեք հին գաղտնաբառը"
                    value={oldPassword}
                    onValueChange={setOldPassword}
                    isInvalid={!!fieldErrors?.oldPassword}
                    errorMessage={fieldErrors?.oldPassword}
                    variant="bordered"
                  />
                  <Input
                    type="password"
                    label="Նոր գաղտնաբառ"
                    placeholder="Մուտքագրեք նոր գաղտնաբառը"
                    value={newPassword}
                    onValueChange={setNewPassword}
                    isInvalid={!!fieldErrors?.newPassword}
                    errorMessage={fieldErrors?.newPassword}
                    variant="bordered"
                  />
                  <Input
                    type="password"
                    label="Հաստատել նոր գաղտնաբառը"
                    placeholder="Կրկին մուտքագրեք նոր գաղտնաբառը"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    isInvalid={
                      confirmPassword !== "" && confirmPassword !== newPassword
                    }
                    errorMessage={
                      confirmPassword !== "" && confirmPassword !== newPassword
                        ? "Գաղտնաբառերը չեն համընկնում"
                        : undefined
                    }
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    isDisabled={isLoading}
                  >
                    Չեղարկել
                  </Button>
                  <Button
                    color="secondary"
                    onPress={async () => {
                      if (!session?.user?.id) {
                        setError("Օգտատիրոջ ID-ն չի գտնվել");
                        return;
                      }

                      if (newPassword !== confirmPassword) {
                        setError("Գաղտնաբառերը չեն համընկնում");
                        return;
                      }

                      setIsLoading(true);
                      setError(null);
                      setFieldErrors(undefined);
                      setSuccessMessage(null);

                      try {
                        const result = await changePasswordAction({
                          id: parseInt(session.user.id),
                          oldPassword,
                          newPassword,
                        });

                        if (result.ok) {
                          setSuccessMessage(
                            result.message ||
                              "Գաղտնաբառը հաջողությամբ փոփոխվեց",
                          );
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setTimeout(() => {
                            onClose();
                            setSuccessMessage(null);
                          }, 2000);
                        } else {
                          setError(
                            result.message || "Չհաջողվեց փոփոխել գաղտնաբառը",
                          );
                          setFieldErrors(result.fieldErrors);
                        }
                      } catch (err: any) {
                        setError("Չհաջողվեց փոփոխել գաղտնաբառը");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    isLoading={isLoading}
                  >
                    Պահպանել
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </MainTemplate>
  );
}

export default Page;
