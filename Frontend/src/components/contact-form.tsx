import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
// import dollarImg from '../assets/Dollar.jpg';
import { useState, type ChangeEvent } from 'react';
import Iridescence from './Iridescence';

export function ContactForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Normally you'd POST this to a backend endpoint.
    // For now, we'll just show an alert.
    alert('Thank you for reaching out! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
    <div className={cn('w-5/6 flex flex-col gap-6 font-general-sans', className)} {...props}>
      <Card className="rounded-lg overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold ">Contact Us</h1>
                <p className="text-balance text-muted-foreground ">
                  We'd love to hear from you. Please fill out this form.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  required
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <textarea
                  id="message"
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your message here..."
                />
              </Field>
              <Field>
                <Button type="submit" >Send Message</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
              <div className='absolute inset-0 w-full h-full'>
                <Iridescence
                  color={[0.5137254901960784, 0.5215686274509804, 1]}
                  mouseReact
                  amplitude={0.1}
                  speed={1}
                />
              </div>
              <div className='relative z-10  h-full flex flex-col text-center items-center justify-center font-instrument-serif py-10'>
                <p className='text-[60px] font-bold text-white leading-[1]'>We're here to provide all the help you need.</p>
              </div>

          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
