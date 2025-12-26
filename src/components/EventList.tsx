"use client";

import { useEvents } from "@/lib/hooks/useQueries";

const EventList = ({ dateParam }: { dateParam?: string }) => {
  const { data: events = [], isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Events</h1>
          <span className="text-xs text-gray-400">View All</span>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Events</h1>
          <span className="text-xs text-gray-400">View All</span>
        </div>
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">Failed to load events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Events</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {events.length === 0 ? (
          <div className="p-4 border border-gray-200 rounded-md">
            <p className="text-gray-400 text-sm">No events found</p>
          </div>
        ) : (
          events.slice(0, 3).map((event) => (
            <div key={event.$id} className="p-4 border border-gray-200 rounded-md border-t-4 border-t-lamaSky">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-600">{event.title}</h2>
                <span className="text-gray-300 text-xs">
                  {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
