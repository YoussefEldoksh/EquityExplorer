import { LoginForm } from "@/components/login-form"
import Navbar from "@/components/Navbar"

function SignInPage() {
  return (
    <div className="w-full  bg-gray-50">
      <Navbar isOtherPage={true} />
      <div className="flex w-full h-screen items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default SignInPage;