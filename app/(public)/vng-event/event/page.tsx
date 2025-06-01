'use client';
import { useState, useEffect } from 'react';
import { format as formatDateFns } from 'date-fns';
import { ChevronsDown, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { formatNumber, formatDate as formatVNDate } from '@/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EditIcon } from '@/components/icons';
import { AddEventModal } from '@/components/modal/AddEventModal';
import { useGetEventList } from '@/features/vng-event/hooks/useGetEventList';
import { Event } from '@/features/vng-event/types/event';

const EventPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastestID, setLastestID] = useState<string>('');
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const { eventList: elData, pagination } = useGetEventList({
    limit: 5,
    lastestID,
  });

  useEffect(() => {
    if (elData && elData.length > 0) {
      if (lastestID === '') {
        setAllEvents(elData);
      } else {
        setAllEvents(prev => [...prev, ...elData]);
      }

      if (pagination?.nextCursor) {
        setHasMore(true);
      } else if (elData.length < 3) {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    } else if (elData && elData.length === 0) {
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [elData, lastestID]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    if (pagination?.nextCursor) {
      setLastestID(pagination.nextCursor);
    } else if (elData.length > 0) {
      setLastestID(elData[elData.length - 1]._id);
    }
  };

  return (
    <section className="container py-6 bg-white rounded-2xl px-0">
      <div className="flex justify-between items-center gap-2 px-4">
        <div className="text-heading-sm font-semibold text-primary">
          Danh Sách Sự Kiện
        </div>
        <div className="text-white">
          <Button className="rounded-lg" onClick={() => setIsModalOpen(true)}>
            Tạo sự kiện
          </Button>
        </div>
      </div>
      <Separator className="my-4" />

      {allEvents?.map((event, index) => (
        <div key={event._id}>
          <div className="px-4">
            <Link
              className="decoration-transparent"
              href={`/vng-event/event/${event._id}`}>
              <div
                className="grid grid-cols-[auto_1fr_auto] gap-4 cursor-pointer"
                role="button"
                tabIndex={0}>
                <div className="rounded-full bg-[#E6F8FF] border-[#00BBF2] border-[1px] text-[#00BBF2] text-xs font-medium px-2 py-1 h-max">
                  {formatDateFns(event.date, 'dd/MM/yyyy')}
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <h3 className="text-base font-bold uppercase">
                      {event.name}
                    </h3>
                  </div>

                  <div className="mt-3 text-sm text-grayscale-50 space-y-2 ml-4">
                    <p>Địa điểm: {event.address}</p>
                    <p>
                      Thời gian: {formatVNDate(event.date)} <span> | </span>{' '}
                      Thu: {formatNumber(event.income)} | Chi:{' '}
                      {formatNumber(event.expense)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center border border-grayscale-20 rounded-lg p-2 cursor-pointer hover:bg-grayscale-10 transition-colors h-max">
                  <EditIcon />
                </div>

                <div className="col-start-2 col-end-4 row-start-2 row-end-2">
                  <div
                    className="w-full px-6 py-7 rounded-2xl bg-[#F1F3F5] text-gray-700"
                    style={{ boxShadow: '6px 6px 0px 0px #DDE3E9' }}>
                    <h4 className="font-medium mb-2">Ghi chú sự kiện:</h4>
                    <p className="text-sm space-y-2">{event.note}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {index < allEvents.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
      {isLoadingMore && (
        <div className="flex justify-center my-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {allEvents?.length > 0 && hasMore && !isLoadingMore && (
        <div className="text-center mt-4 mb-4">
          <button
            className="flex items-center justify-center mx-auto gap-2 text-black font-medium text-sm hover:text-primary"
            onClick={handleLoadMore}>
            <ChevronsDown height={20} width={20} />
            <span>Xem thêm</span>
          </button>
        </div>
      )}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default EventPage;
