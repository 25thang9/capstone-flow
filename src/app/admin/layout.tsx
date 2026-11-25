
import { SectionTabs } from "@/components/layout/section-tabs";

export default function AdminLayout({
    children,
}: LayoutProps<"/admin">) {
    return (
        <>
            <SectionTabs
                label="Khu quản trị"
                tabs={[
                    { href: "/admin", label: "Tổng quan", exact: true },
                    { href: "/admin/users", label: "Người dùng" },
                    { href: "/admin/catalog", label: "Danh mục" },
                ]}
            />

            <div className="container-page py-8">
                {children}
            </div>
        </>
    );
}
