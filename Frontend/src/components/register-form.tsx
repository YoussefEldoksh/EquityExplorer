import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import dollarImg from '../assets/Dollar.jpg';
import { Link } from 'react-router-dom';
import { toast } from "sonner"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    firstname: '',
    lastname: '',
    usermail: '',
    userpass: '',

  });
  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchPromise = fetch(
      `/api/auth/registration.php`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(form),
      }
    ).then(async (response: Response) => {
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    });

    toast.promise(fetchPromise, {
      loading: 'Signing Up...',
      success: 'Welcome, equity finder!',
      error: 'Something went wrong',
    });

    try {
      await fetchPromise;
      window.dispatchEvent(new Event('auth'));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className={cn('w-5/6 flex flex-col gap-6', className)} {...props}>
      <Card className="rounded-lg overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">Join Equity Explorer</p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="username"
                  name="username"
                  autoComplete="username"
                  onChange={handleChange}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstname"
                    autoComplete="given-name"
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastname"
                    autoComplete="family-name"
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  name="usermail"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  name="userpass"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{' '}
                <Link to="/signin" className="underline hover:text-black">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={dollarImg}
              alt="Register"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
