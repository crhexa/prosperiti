
import { Label, TextInput, Textarea } from "flowbite-react";

export default function Contact() {
  return (
    <div className="bg-gray-100">
        <form className="flex max-w-md flex-col gap-4 max-w-screen-lg mx-auto px-6">
            <div className="flex gap-4 mt-10">
                <div className="w-1/2">
                    <Label htmlFor="first-name" className="text-lg mb-2 ml-1">First Name</Label>
                    <TextInput id="first-name" type="text" sizing="lg" placeholder="John" />
                </div>
                <div className="w-1/2">
                    <Label htmlFor="last-name" className="text-lg mb-2 ml-1">Last Name</Label>
                    <TextInput id="last-name" type="text" sizing="lg" placeholder="Doe" />
                </div>
            </div>
            <div className="block">
                <Label htmlFor="email" className="text-lg mb-2 ml-1">Email</Label>
                <TextInput id="email" type="text" sizing="lg" placeholder="johndoe@email.com"/>
            </div>
            <div className="mb-5 block">
                <Label htmlFor="message" className="text-lg mb-2 ml-1">Message</Label>
                <Textarea id="message" placeholder="Leave a comment..." required rows={6} className="text-base" />
            </div>
            <button type="submit" class="text-white text-lg max-w-min bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-80 mb-15">Submit</button>
        </form>
    </div>
  );
}
