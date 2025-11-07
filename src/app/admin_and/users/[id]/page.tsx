"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Spinner,
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
} from "@heroui/react";
import { getUserByIdAction } from "@/app/actions/user/get";
import { type User } from "@/app/actions/user/list";
import { getOrdersByUserIdAction } from "@/app/actions/order/get-by-user";
import { updateOrderStatusAction } from "@/app/actions/order/update-status";
import { deleteOrderAction } from "@/app/actions/order/delete";
import { updateAllOrdersStatusAction } from "@/app/actions/order/update-all-status";

function Page() {
  const { id } = useParams();
  const userId = id ? parseInt(id as string) : null;

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_AND_USERS}`}>
      {userId ? (
        <UserDetailPage userId={userId} />
      ) : (
        <div>Օգտատերը չի գտնվել</div>
      )}
    </AdminMainTemplate>
  );
}

function UserDetailPage({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [updatingAll, setUpdatingAll] = useState(false);

  useEffect(() => {
    void loadData();
  }, [userId]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [userResult, ordersResult] = await Promise.all([
        getUserByIdAction(userId),
        getOrdersByUserIdAction(userId),
      ]);

      if (!userResult.ok) {
        setError(userResult.message || "Չհաջողվեց բեռնել օգտատիրոջը");
        return;
      }
      setUser(userResult.data || null);

      if (!ordersResult.ok) {
        setError(ordersResult.message || "Չհաջողվեց բեռնել պատվերները");
        return;
      }
      setOrders(ordersResult.data || []);
    } catch (e: any) {
      setError("Չհաջողվեց բեռնել տվյալները");
    } finally {
      setLoading(false);
    }
  }

  async function toggleOrderStatus(order: IOrder) {
    setUpdatingOrderId(order.id);
    try {
      const newStatus = order.status === "pending" ? "completed" : "pending";
      const result = await updateOrderStatusAction(order.id, newStatus);
      if (result.ok) {
        await loadData();
      } else {
        setError(result.message || "Չհաջողվեց փոփոխել ստատուսը");
      }
    } catch (e) {
      setError("Չհաջողվեց փոփոխել ստատուսը");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function updateAllOrdersStatus(status: "pending" | "completed") {
    setUpdatingAll(true);
    try {
      const result = await updateAllOrdersStatusAction(userId, status);
      if (result.ok) {
        await loadData();
      } else {
        setError(
          result.message || "Չհաջողվեց փոփոխել բոլոր պատվերների ստատուսը",
        );
      }
    } catch (e) {
      setError("Չհաջողվեց փոփոխել բոլոր պատվերների ստատուսը");
    } finally {
      setUpdatingAll(false);
    }
  }

  function openDeleteModal(orderId: number) {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!orderToDelete) return;
    try {
      const result = await deleteOrderAction(orderToDelete);
      if (result.ok) {
        await loadData();
        setDeleteModalOpen(false);
        setOrderToDelete(null);
      } else {
        setError(result.message || "Չհաջողվեց ջնջել պատվերը");
      }
    } catch (e) {
      setError("Չհաջողվեց ջնջել պատվերը");
    }
  }

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.id.toString().includes(query),
      );
    }

    return filtered;
  }, [orders, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !user) {
    return <div className="p-4 rounded-md bg-red-50 text-red-800">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* User Information */}
      {user && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Օգտատիրոջ ինֆորմացիա</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID</p>
              <p className="text-lg font-semibold">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Անուն</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Հեռախոսահամար</p>
              <p className="text-lg font-semibold">{user.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Քարտի համար</p>
              <p className="text-lg font-semibold">{user.card_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Բանկի անուն</p>
              <p className="text-lg font-semibold">{user.bank_name || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Orders Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Պատվերներ ({orders.length})</h2>
          <Button size="sm" onPress={() => loadData()} isDisabled={loading}>
            Թարմացնել
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "solid" : "flat"}
              color={statusFilter === "all" ? "primary" : "default"}
              onPress={() => setStatusFilter("all")}
            >
              Բոլորը ({orders.length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "pending" ? "solid" : "flat"}
              color={statusFilter === "pending" ? "warning" : "default"}
              onPress={() => setStatusFilter("pending")}
            >
              Pending ({orders.filter((o) => o.status === "pending").length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "completed" ? "solid" : "flat"}
              color={statusFilter === "completed" ? "success" : "default"}
              onPress={() => setStatusFilter("completed")}
            >
              Completed ({orders.filter((o) => o.status === "completed").length}
              )
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Որոնել պատվերի համարով..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              startContent={<i className="fa-solid fa-search"></i>}
            />
            {orders.length > 0 && (
              <>
                <Button
                  size="sm"
                  color="success"
                  onPress={() => updateAllOrdersStatus("completed")}
                  isLoading={updatingAll}
                >
                  Բոլորը Completed
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => updateAllOrdersStatus("pending")}
                  isLoading={updatingAll}
                >
                  Բոլորը Pending
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <Table aria-label="Orders table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Պատվերի համար</TableColumn>
            <TableColumn>Ստատուս</TableColumn>
            <TableColumn>Ստեղծման ամսաթիվ</TableColumn>
            <TableColumn>Գործողություններ</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            emptyContent={
              filteredOrders.length === 0
                ? "Պատվերներ չկան"
                : "Որոնման արդյունքներ չկան"
            }
            items={filteredOrders}
          >
            {(order: IOrder) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Link
                    href={`https://turbo-pvz.ozon.ru/search?filter={"search":"${order.order_number}"}`}
                    target="_blank"
                  >
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>
                  <Chip
                    color={order.status === "completed" ? "success" : "warning"}
                    variant="flat"
                  >
                    {order.status === "completed" ? "Completed" : "Pending"}
                  </Chip>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString("hy-AM")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color={order.status === "pending" ? "success" : "warning"}
                      onPress={() => toggleOrderStatus(order)}
                      isLoading={updatingOrderId === order.id}
                    >
                      {order.status === "pending" ? "Completed" : "Pending"}
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onPress={() => openDeleteModal(order.id)}
                    >
                      Ջնջել
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <HeroModal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Հաստատել ջնջումը
              </ModalHeader>
              <ModalBody>
                <p>Վստա՞հ եք, որ ցանկանում եք ջնջել այս պատվերը:</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Չեղարկել
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Ջնջել
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>
    </div>
  );
}

export default Page;
