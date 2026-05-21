import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from './ui/field';
import { Input } from './ui/input';
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchPromise = fetch(
      `/api/auth/login.php`,
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
      success: 'Welcome back, Equity Explorer!',
    });

    try {
      await fetchPromise;
      window.dispatchEvent(new Event('auth'));
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  // 1. Handle GitHub Redirect Login
  const handleDiscordLogin = () => {
    localStorage.setItem('oauth_provider', 'discord');
    const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = window.location.origin + '/signin';
    const rootUrl = 'https://discord.com/api/oauth2/authorize';
    const options = {
      client_id: discordClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email',
      state: Math.random().toString(36).substring(7),
    };
    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`;
  };

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

  // 2. Check for GitHub or Meta 'code' on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get('code'); // Note: GitHub and Meta might both use 'code'
    // Meta also uses 'code' in its redirect.
    // If we have a code, we need to know if it's for GitHub or Meta.
    // Usually we can check the 'state' or just try one then the other, 
    // but better to check if we are on signin/register and if we have other indicators.
    
    // For now, let's assume if it's 'code', we check if it came from Meta or Github.
    // Meta usually doesn't have other URL params besides code and state.
    
    const code = githubCode;

    if (code && !hasExchanged.current) {
      hasExchanged.current = true;
      // Immediately clear the URL to prevent re-use
      window.history.replaceState({}, document.title, window.location.pathname);

      // We need to know if it's GitHub or Meta.
      // Since both use 'code', I'll check if the previous click was Meta.
      // Or I can just try both (not ideal).
      // Let's use a simple heuristic: if it has 'code' but no other GitHub-specific stuff.
      // Actually, Meta's redirect usually includes 'code' and 'state'.
      
      const isDiscord = localStorage.getItem('oauth_provider') === 'discord';

      const exchangeCode = async () => {
        const endpoint = isDiscord 
          ? `/api/auth/login_w_discord.php`
          : `/api/auth/login_w_github.php`;

        const providerName = isDiscord ? 'Discord' : 'GitHub';

        const fetchPromise = fetch(endpoint, {
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
          loading: `Signing in with ${providerName}...`,
          success: 'Welcome back, Equity Explorer!',
          error: 'Something went wrong',
        });

        try {
          await fetchPromise;
          localStorage.removeItem('oauth_provider');
          window.dispatchEvent(new Event('auth'));
          navigate('/');
        } catch (error) {
          toast.error(`${providerName} login failed`);
        }
      };
      exchangeCode();
    }
  }, [navigate]);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      const fetchPromise = fetch(`/api/auth/login_w_google.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeResponse.code,
          redirect_uri: 'postmessage'
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data;
      });

      toast.promise(fetchPromise, {
        loading: 'Signing in with Google...',
        success: 'Welcome back, Equity Explorer!',
        error: 'Something went wrong',
      });

      try {
        await fetchPromise;
        window.dispatchEvent(new Event('auth'));
        navigate('/');
      } catch (error) {
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
                <Button variant="outline" type="button" onClick={handleDiscordLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037a19.736 19.736 0 0 0-4.885 1.515a.07.07 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Discord</span>
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
