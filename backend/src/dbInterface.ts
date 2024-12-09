import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { Calendar, CalendarList, User } from './types.ts'

dotenv.config({ path: "src/.env.local" });

// get mongo db uri string from enviroment file
const uri: string | undefined = process.env.MONGODB_URI;
const client = new MongoClient(uri!);
const database = client.db('cotangles');
const usersCollection = database.collection<User>('users');

// fetch or create google Id if not found
export async function fetchOrCreateByGoogleId(googleId: string, email: string): Promise<User> {
  try {
      await client.connect();
      // tries to find user by googleId
      let user = await usersCollection.findOne({ googleId });

      // if no user create a new user
      if (!user) {
          const newUser: User = { 
            _id: new ObjectId(),
            googleId: googleId,
            email: email,
            name: "",
            ical: "",
            calendars: [],
            invites: []
            // add more fields if needed
          }; 

          const result = await usersCollection.insertOne(newUser);
          user = await usersCollection.findOne({ _id: result.insertedId });
      }
      return user!;
  } catch (error) {
      console.error("no id", error);
      throw error;
  } finally {
      await client.close();
  }
}

// update a user's calendar list
export async function updateUserCalendarList(calendarId: string, userId: string) {
  try {
    await client.connect();
    const existingCalendar: any[] = await getData('calendars', { calendarId: calendarId });
    const currentCalendar: Calendar = existingCalendar[0];

    const calendarObject: CalendarList = {
      calendarName: currentCalendar.name,
      calendarId: currentCalendar.calendarId
    }

    const exisitingUser: any[] = await getData('users', { userId: userId });
    const currentUser: User = exisitingUser[0];

    const filter = { userId: currentUser._id };
    const options = {
      upsert: true,
    };

    // push calendar object to user's calendar list
    await usersCollection.updateOne(
      filter,
      { $push: { calendars: calendarObject } },
      options
    );
  } catch (error) {
    console.error("failed update data", error);
  }
}

// insert new document to a collection (calendars or users)
export async function setData(collectionName: string, data: User | Calendar) {
  try {
    await client.connect();
    const collection = database.collection(collectionName);
    return await collection.insertOne(data);  // insert data in collection
  } catch (error) {
    console.error("failed set data", error);
  }
}

// query a document from a collection (calendars or users)
export async function getData(collectionName: string, query = {}) {
  try {
    await client.connect();
    const collection = database.collection(collectionName);
    return await collection.find(query).toArray(); // finds data in collection
  } catch (error) {
    console.error("failed fetching data", error);
  }
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});