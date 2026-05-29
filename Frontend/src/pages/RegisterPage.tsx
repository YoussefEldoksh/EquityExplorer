import { RegisterForm } from "@/components/register-form"

function RegisterPage() {
  return (
    <div className="bg-gray-50">

      <div className="flex justify-center items-center min-h-screen py-6 sm:py-8 md:py-10">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage