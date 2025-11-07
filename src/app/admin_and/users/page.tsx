"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal as HeroModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
} from "@heroui/react";
import { getUsersAction, type User } from "@/app/actions/user/list";
import { updateUserAction } from "@/app/actions/user/update";
import { deleteUserAction } from "@/app/actions/user/delete";
import { resetPasswordAction } from "@/app/actions/user/reset-password";

function Page() {
  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_AND_USERS}`}>
      <UsersTablePage />
    </AdminMainTemplate>
  );
}

export default Page;

function UsersTablePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetResultPassword, setResetResultPassword] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsersAction();
      if (!result.ok) {
        setError(result.message || "Չհաջողվեց բեռնել օգտատերերին");
        return;
      }
      setUsers(result.data || []);
    } catch (e: any) {
      setError("Չհաջողվեց բեռնել օգտատերերին");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(u: User) {
    setEditing({ ...u });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editing) return;
    setEditSaving(true);
    try {
      const result = await updateUserAction({
        id: editing.id,
        name: editing.name,
        phone_number: editing.phone_number,
        card_number: editing.card_number,
        bank_name: editing.bank_name,
      });
      if (!result.ok) {
        setError(result.message || "Չհաջողվեց պահպանել փոփոխությունները");
        return;
      }
      setEditOpen(false);
      await loadUsers();
    } catch (e) {
      setError("Չհաջողվեց պահպանել փոփոխությունները");
    } finally {
      setEditSaving(false);
    }
  }

  async function deleteUser(id: number) {
    const confirmed = window.confirm(
      "Վստա՞հ եք, որ ցանկանում եք ջնջել օգտատիրոջը",
    );
    if (!confirmed) return;
    try {
      const result = await deleteUserAction(id);
      if (!result.ok) {
        setError(result.message || "Չհաջողվեց ջնջել օգտատիրոջը");
        return;
      }
      await loadUsers();
    } catch (e) {
      setError("Չհաջողվեց ջնջել օգտատիրոջը");
    }
  }

  async function resetPassword(id: number) {
    try {
      const result = await resetPasswordAction(id);
      if (result.ok && result.passwordPlain) {
        setResetResultPassword(result.passwordPlain);
        setResetModalOpen(true);
      } else {
        setError(result.message || "Չհաջողվեց վերականգնել գաղտնաբառը");
      }
    } catch (e) {
      setError("Չհաջողվեց վերականգնել գաղտնաբառը");
    }
  }

  const rows = useMemo(() => users, [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Մասնակիցներ</h2>
        <div className="flex-je-c gap-2">
          <Button size="sm" onPress={() => loadUsers()} isDisabled={loading}>
            Թարմացնել
          </Button>
          <Link href={`/${SITE_URL.ADMIN_AND_CREATE_USER}`}>
            <Button size="sm" color="primary">
              <i className="fa-solid fa-user-plus"></i>
              Ստեղծել օգտատատեր
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      <Table aria-label="Users table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Անուն</TableColumn>
          <TableColumn>Հեռախոսահամար</TableColumn>
          <TableColumn>Քարտ</TableColumn>
          <TableColumn>Բանկ</TableColumn>
          <TableColumn>Գործողություններ</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          emptyContent={loading ? "" : "Տվյալներ չկան"}
          items={rows}
        >
          {(item: User) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <Link href={`/${SITE_URL.ADMIN_AND_USER_PROFILE(item.id)}`}>
                  {item.name}
                </Link>
              </TableCell>
              <TableCell>{item.phone_number}</TableCell>
              <TableCell>{item.card_number}</TableCell>
              <TableCell>{item.bank_name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onPress={() => openEdit(item)}>
                    Փոփոխել
                  </Button>
                  <Button
                    size="sm"
                    color="warning"
                    onPress={() => resetPassword(item.id)}
                  >
                    Գաղտնաբառ
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => deleteUser(item.id)}
                  >
                    Ջնջել
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <HeroModal isOpen={editOpen} onOpenChange={setEditOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Խմբագրել օգտատիրոջը
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Անուն"
                    value={editing?.name || ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, name: e.target.value } : p,
                      )
                    }
                  />
                  <Input
                    label="Հեռախոսահամար"
                    value={editing?.phone_number || ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, phone_number: e.target.value } : p,
                      )
                    }
                  />
                  <Input
                    label="Քարտի համար"
                    value={editing?.card_number || ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, card_number: e.target.value } : p,
                      )
                    }
                  />
                  <Input
                    label="Բանկի անուն"
                    value={editing?.bank_name || ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, bank_name: e.target.value } : p,
                      )
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  isDisabled={editSaving}
                >
                  Փակել
                </Button>
                <Button
                  color="primary"
                  onPress={saveEdit}
                  isLoading={editSaving}
                >
                  Պահպանել
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>

      {/* Reset Password Result */}
      <HeroModal isOpen={resetModalOpen} onOpenChange={setResetModalOpen}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Գաղտնաբառը վերականգնվեց
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  Նոր գաղտնաբառը՝{" "}
                  <span className="font-mono">{resetResultPassword}</span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => setResetModalOpen(false)}
                >
                  Լավ
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>
    </div>
  );
}
