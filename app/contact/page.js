import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <p className="font-mono text-xs tracking-widest uppercase text-clay mb-2">Get in Touch</p>
      <h1 className="font-display font-semibold text-4xl md:text-5xl text-pine-deep mb-10">Contact</h1>
      <p className="text-[#4B4A42] mb-10 max-w-lg">
        Questions about a trek, a collaboration idea, or just want to say hi — send a message and I'll reply by email.
      </p>
      <ContactForm />
      <div className="mt-10 font-mono text-sm text-[#4B4A42] space-y-2">
        <p>Email: hello@thehimalayanguy.com</p>
        <p>Based in Kathmandu, Nepal</p>
      </div>
    </div>
  );
}
