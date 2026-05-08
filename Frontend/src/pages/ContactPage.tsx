import { ContactForm } from "@/components/contact-form"
import Navbar from "@/components/Navbar"

function ContactPage() {
  return (
    <div className="w-full bg-gray-50">
      <Navbar isOtherPage={true} />
      <div className="flex w-full h-screen items-center justify-center pt-20">
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactPage;
