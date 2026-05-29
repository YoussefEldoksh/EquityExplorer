import { LoginForm } from "@/components/login-form"

function SignInPage() {
  return (
    <div className="w-full bg-gray-50">
      <div className="flex w-full min-h-screen items-center justify-center py-6 sm:py-8 md:py-10">
        <LoginForm />
      </div>
    </div>
  );
}

export default SignInPage;