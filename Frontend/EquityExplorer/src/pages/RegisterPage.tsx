import Navbar from "@/components/Navbar"
import { RegisterForm } from "@/components/register-form"

function RegisterPage() {
  return (
    <div className="bg-gray-50">
      <Navbar isOtherPage={true} />

      <div className="flex justify-center items-center h-screen">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage