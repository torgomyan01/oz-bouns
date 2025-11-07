import { ActionChangeOrderStatus } from "@/app/actions/order/change";
import { addToast, Button, Spinner } from "@heroui/react";
import clsx from "clsx";
import { useState } from "react";

function OrderBlockItem({ order }: { order: IOrder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(order.order_number);

  const [loading, setLoading] = useState(false);

  function saveChanges(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    ActionChangeOrderStatus(orderNumber, order.id)
      .then((response: any) => {
        if (response.status === "ok") {
          setIsEditing(false);
          addToast({
            title: "Պատվերի համարը հաջողությամբ փոփոխվել է",
            color: "success",
          });
        } else {
          addToast({
            title: "Սխալ է տեղի ունեցել",
            description: response.message,
            color: "danger",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form
      onSubmit={saveChanges}
      className="flex-jsb-c bg-white rounded-[16px] p-[16px] mb-2 gap-4"
    >
      <input
        defaultValue={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        disabled={!isEditing}
        className={clsx("text-[15px] text-[#79838B] font-normal w-full", {
          "border border-gray-300 rounded-[8px] p-[8px]": isEditing,
        })}
      />
      {isEditing ? (
        <>
          {loading ? (
            <Spinner color="secondary" size="sm" />
          ) : (
            <button
              type="submit"
              className="fa-solid fa-check text-green-500 text-[18px] cursor-pointer"
            />
          )}
        </>
      ) : (
        <i
          className="fa-solid fa-pen text-black/50! text-[16px] cursor-pointer"
          onClick={() => setIsEditing(true)}
        ></i>
      )}
    </form>
  );
}

export default OrderBlockItem;
