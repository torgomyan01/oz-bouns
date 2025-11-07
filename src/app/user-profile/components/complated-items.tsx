import { useEffect, useState } from "react";
import OrderBlockItem from "./order-block-item";
import { ActionGetUserOrders } from "@/app/actions/order/get";
import { Spinner } from "@heroui/react";

function CompletedItems() {
  const [orders, setOrders] = useState<IOrder[] | null>(null);

  useEffect(() => {
    ActionGetUserOrders("completed").then((response: any) => {
      if (response.status === "ok") {
        setOrders(response.data);
      }
    });
  }, []);

  return (
    <div className="pt-4">
      {orders ? (
        <>
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderBlockItem key={order.id} order={order} />
            ))
          ) : (
            <div className="flex-jc-c h-[400px]">
              <p className="text-gray-500">
                Այստեղ դուք կարող եք տեսնել ձեր ավարտած պատվերները, Առայժմ չկան
                ավարտած պատվերներ
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex-jc-c h-[400px]">
          <Spinner color="secondary" />
        </div>
      )}
    </div>
  );
}

export default CompletedItems;
