import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import dollarImg from '../assets/Dollar.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import { toast } from "sonner"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usermail: '',
    userpass: '',
  });

  const handleChange = (e: ChangeEvent) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchPromise = fetch(
      `http://${window.location.hostname}/EquityExplorer/Backend/PHP/login.php`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form),
      }
    ).then(async (response) => {
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    });

    toast.promise(fetchPromise, {
      loading: 'Signing in...',
      success: 'Welcome back Equity Explorer!',
      error: () => "Something Went Wrong !",
    });

    try {
      await fetchPromise;
      window.dispatchEvent(new Event('auth'));
      navigate('/');
    } catch (error) {
      // toast.promise already shows the error; nothing extra needed here
    }
  };
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  // 1. Handle GitHub Redirect Login
  const handleGithubLogin = () => {
    const rootUrl = 'https://github.com/login/oauth/authorize';
    const options = {
      client_id: githubClientId,
      redirect_uri: window.location.origin + '/signin', // Redirect back to this page
      scope: 'user:email',
      state: Math.random().toString(36).substring(7),
      prompt: 'login'
    };
    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`;
  };

  const hasExchanged = useRef(false);

  // 2. Check for GitHub 'code' on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !hasExchanged.current) {
      hasExchanged.current = true;
      // Immediately clear the URL to prevent re-use
      window.history.replaceState({}, document.title, window.location.pathname);

      // Send code to backend
      const exchangeCode = async () => {
        const fetchPromise = fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/login_w_github.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirect_uri: window.location.origin + '/signin'
          }),
        }).then(async (response: Response) => {
          const data = await response.json();
          if (!data.success) throw new Error(data.message);
          return data;
        });

        toast.promise(fetchPromise, {
          loading: 'Signing in with github...',
          success: 'Welcome back Equity Explorer!',
        });


        try {
          await fetchPromise;
          window.dispatchEvent(new Event('auth'));
          navigate('/');

        } catch (error) {
          toast.error('GitHub login failed');
        }
      };
      exchangeCode();
    }
  }, [navigate]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      // 1. Get user info from Google
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${response.access_token}` },
      }).then(res => res.json())

      // 2. Send to your backend
      const fetchresponse = fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/login_w_google.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          googleId: userInfo.sub
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data;
      });

      toast.promise(fetchresponse, {
        loading: 'Signing in with google...',
        success: 'Welcome back Equity Explorer!',
      });

      try {

        await fetchresponse;
        window.dispatchEvent(new Event('auth'))
        navigate('/')
      }
      catch (error) {
        toast.error('Google login failed');
      }
    },
    // onError: () => console.log('Google Login Failed'),
  });
  return (
    <div className={cn('w-5/6 flex flex-col gap-6', className)} {...props}>
      <Card className="rounded-lg overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Equity Explorer account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  name="usermail"
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  name="userpass"
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                {clientId && (
                  <Button variant="outline" type="button" onClick={() => login()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                )}
                <Button variant="outline" type="button" onClick={handleGithubLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with GitHub</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account?
                <Link to="/register" className="underline hover:text-black">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={dollarImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
