import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";

function Page() {
  return (
    <AdminMainTemplate pathname={SITE_URL.ADMIN_AND}>
      <h1>test</h1>
    </AdminMainTemplate>
  );
}

export default Page;
