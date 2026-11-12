import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }) {
  return <><PublicHeader /><main>{children}</main><PublicFooter /></>;
}
