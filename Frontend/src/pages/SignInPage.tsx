import { LoginForm } from "@/components/login-form"

function SignInPage() {
  return (
    <div className="w-full  bg-gray-50">
      <div className="flex w-full h-screen items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default SignInPage;