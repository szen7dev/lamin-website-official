'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTabContext } from '@/contexts';
import TabContent from '@/features/seller/components/tab-content';

export default function SellerPage() {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab } =
    useTabContext();

  const handleAddTab = () => {
    const newCustomerId = (tabs.length + 1).toString();

    addTab(newCustomerId, `Customer ${newCustomerId}`);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Headers */}
      <div className="flex items-center border-b bg-muted/30 px-4 py-3 shrink-0">
        <div className="flex items-center space-x-2 max-w-full overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={cn(
                'flex items-center rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-200',
                activeTabId === tab.id
                  ? 'bg-white text-foreground shadow-sm'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground',
              )}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTab(tab.id);
                }
              }}>
              <button className="flex-1 text-left">{tab.title}</button>
              {tabs.length > 1 && (
                <button
                  className="ml-2 hover:bg-destructive/20 rounded-full p-1 transition-colors"
                  onClick={() => removeTab(tab.id)}>
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <Button
            className="h-8 w-8 p-0 rounded-md"
            size="sm"
            variant="outline"
            onClick={handleAddTab}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab ? (
          <TabContent data={activeTab.customerData} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Chưa có khách hàng nào được chọn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
