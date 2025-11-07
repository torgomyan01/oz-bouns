"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import {
  createUserAction,
  type CreateUserState,
} from "@/app/actions/user/create";
import { useActionState, useEffect, useState } from "react";
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

const initialState: CreateUserState = { ok: false };

function Page() {
  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_AND_CREATE_USER}`}>
      <CreateUserForm />
    </AdminMainTemplate>
  );
}

export default Page;

function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-red-600 text-sm mt-1">{text}</p>;
}

function SuccessModal({
  open,
  onClose,
  phone,
  password,
}: {
  open: boolean;
  onClose: () => void;
  phone?: string;
  password?: string;
}) {
  return (
    <HeroModal
      isOpen={open}
      onOpenChange={(o) => !o && onClose()}
      onClose={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Օգտատերը ստեղծվեց
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-700">Հեռախոսահամար:</strong>{" "}
                  <span className="text-gray-900">{phone}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Գաղտնաբառ:</strong>{" "}
                  <span className="text-gray-900 font-mono">{password}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Փակել
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
}

function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialState,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      setOpen(true);
    }
  }, [state?.ok]);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Ստեղծել նոր օգտատեր</h2>
      <form action={formAction} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Անուն <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Մուտքագրեք անունը"
          />
          <ErrorText text={state?.fieldErrors?.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Հեռախոսահամար <span className="text-red-500">*</span>
          </label>
          <input
            name="phone_number"
            type="tel"
            pattern="0\d{8}"
            placeholder="077769668"
            required
            maxLength={9}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ֆորմատ: 0XXXXXXXX (օր. 077769668)
          </p>
          <ErrorText text={state?.fieldErrors?.phone_number} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Քարտի համար <span className="text-red-500">*</span>
          </label>
          <input
            name="card_number"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Մուտքագրեք քարտի համարը"
          />
          <ErrorText text={state?.fieldErrors?.card_number} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Բանկի անուն <span className="text-red-500">*</span>
          </label>
          <input
            name="bank_name"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Մուտքագրեք բանկի անունը"
          />
          <ErrorText text={state?.fieldErrors?.bank_name} />
        </div>

        {state?.message && (
          <div
            className={`p-3 rounded-md ${
              state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Պահպանվում է..." : "Ստեղծել"}
        </button>
      </form>

      <SuccessModal
        open={open}
        onClose={() => setOpen(false)}
        phone={state?.phone}
        password={state?.passwordPlain}
      />
    </div>
  );
}
