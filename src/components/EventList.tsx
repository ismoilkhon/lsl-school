const EventList = ({ dateParam }: { dateParam?: string }) => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Events</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="p-4 border border-gray-200 rounded-md border-t-4 border-t-lamaSky">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-600">Sample Event</h2>
            <span className="text-gray-300 text-xs">12:00 PM - 2:00 PM</span>
          </div>
          <p className="mt-2 text-gray-400 text-sm">Sample event description</p>
        </div>
      </div>
    </div>
  );
};

export default EventList;
