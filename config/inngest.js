import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/modals/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });
// Inngest function to save user data to database 
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },
    async({event}) => {
      const {id, first_name, last_name, email_addresses, image_url} = event.data
      const userData = {
        _id: id,
        email: email_addresses[0].email_addresses,
        name: first_name + " " + last_name,
        imageUrl: image_url
      }
      await connectDB()
      await User.create(userData)
    }
)
// Innegest function to update user data to database 
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated',
    },
     async({event}) => {
      const {id, first_name, last_name, email_addresses, image_url} = event.data
      const userData = {
        _id: id,
        email: email_addresses[0].email_addresses,
        name: first_name + " " + last_name,
        imageUrl: image_url
      }
      await connectDB()
      await User.findByIdAndUpdate(id,userData)
    }
)
// inngest function for delete user from database 
export const syncUserDelete = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async({event}) => {
        const {id} = event.data;
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)