import { getDocuments, COLLECTIONS } from "@/lib/appwrite";

const EventsListPage = async () => {
  let data: any[] = [];
  
  try {
    const eventsRes = await getDocuments(COLLECTIONS.EVENTS);
    data = eventsRes.documents;
  } catch (error) {
    console.warn('Failed to fetch events:', error);
    data = [];
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((event: any) => (
            <div key={event.$id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              {event.startTime && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(event.startTime).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No events found. Create your first event!</p>
        )}
      </div>
    </div>
  );
};

export default EventsListPage;
