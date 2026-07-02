import { ContactForm } from "@/components/contact-form"

function ContactPage() {
  return (


      <div className="w-full bg-gray-50"
        style={{
          background: `linear-gradient(#898bff 0%, #a2a4ff 20%, #d6d7ff 65%, transparent 90%)`,
        }}
      >
        <div className="flex w-full h-screen items-center justify-center pt-20">
          <ContactForm />
        </div>
      </div>
  );
}

export default ContactPage;
