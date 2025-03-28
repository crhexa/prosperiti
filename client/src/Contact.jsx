
import { Label, TextInput, Textarea } from "flowbite-react";

export function Contact() {
  return (
    <div className="flex max-w-md flex-col gap-4 max-w-screen-md mx-auto px-6">
        <div>
            <div className="flex gap-4">
                <div className="w-1/2">
                    <Label htmlFor="first-name">First Name</Label>
                    <TextInput id="first-name" type="text" sizing="md" placeholder="John" />
                </div>
                <div className="w-1/2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <TextInput id="last-name" type="text" sizing="md" placeholder="Doe" />
                </div>
            </div>
            <div className="mb-2 block mt-2">
            <Label htmlFor="base">Email</Label>
            </div>
            <TextInput id="base" type="text" sizing="md" placeholder="johndoe@email.com"/>
        </div>
        <div>
        <div className="mb-2 block">
            <Label htmlFor="comment">Message</Label>
        </div>
        <Textarea id="comment" placeholder="Leave a comment..." required rows={4} />
        </div>
    </div>
  );
}
