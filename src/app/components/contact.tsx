import ContactButtons from "./contactButtons";
import ContactForm from "./contactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-secondary text-secondary-contrast recognition py-8 my-0"
    >
      <div className="container m-auto ">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <h2>Want to talk about it some more? So&nbsp;do&nbsp;I.</h2>
            <ContactButtons />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-primary rounded-lg p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
