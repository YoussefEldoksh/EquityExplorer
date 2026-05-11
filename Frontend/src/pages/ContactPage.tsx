import { ContactForm } from "@/components/contact-form"

function ContactPage() {
  return (
    <div className="w-full bg-gray-50">
      <div className="flex w-full h-screen items-center justify-center pt-20">
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactPage;
