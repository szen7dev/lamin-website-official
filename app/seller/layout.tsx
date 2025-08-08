import SellerHeader from '@/components/layout/SellerHeader';
import { AppSidebar } from '@/features/seller/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AsidePanel } from '@/features/seller/components/aside-pannel';
import { TabProvider } from '@/contexts';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout = ({ children }: SellerLayoutProps) => {
  return (
    <TabProvider>
      <div className="flex flex-col h-screen">
        <SellerHeader />

        <div className="flex-1 overflow-hidden flex max-w-[100vw]">
          <SidebarProvider defaultOpen={false}>
            <div className="flex h-full w-full">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
          <AsidePanel />
        </div>
      </div>
    </TabProvider>
  );
};

export default SellerLayout;
