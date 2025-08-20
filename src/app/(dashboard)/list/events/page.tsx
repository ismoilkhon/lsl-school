import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { getAppwriteFilePreviewUrl } from "@/lib/utils";
import { headers } from "next/headers";

const EventsListPage = async () => {
  let data: any[] = [];
  
  try {
    const res = await adminListDocuments(COLLECTIONS.EVENTS, [Query.limit(50), Query.offset(0), Query.orderDesc('$createdAt')]);
    data = res.documents as any[];
  } catch (error) {
    console.warn('Failed to fetch events:', error);
    data = [];
  }

  const role = headers().get('x-user-role') || 'student';

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Events</h1>
        {role === 'admin' && (
          <FormContainer table="event" type="create" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((event: any) => (
            <div key={event.$id} className="border rounded-lg p-4 relative">
              {event.img && (
                <div className="mb-3">
                  <Image src={getAppwriteFilePreviewUrl(event.img, 480, 240)} alt={event.title} width={480} height={240} className="w-full h-40 object-cover rounded" />
                </div>
              )}
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              {event.startTime && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(event.startTime).toLocaleDateString()}
                </p>
              )}
              {role === 'admin' && (
                <div className="absolute top-2 right-2">
                  <FormContainer table="event" type="delete" id={event.$id} />
                </div>
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
