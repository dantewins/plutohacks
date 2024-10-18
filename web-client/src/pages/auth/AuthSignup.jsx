import { SignUp } from '@clerk/clerk-react'

const AuthSignup = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignUp signInUrl="/auth/login" />
        </div>
    )
}

export default AuthSignup
