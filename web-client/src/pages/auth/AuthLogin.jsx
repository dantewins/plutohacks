import { SignIn } from '@clerk/clerk-react'

const AuthLogin = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn signUpUrl="/auth/signup" />
        </div>
    )
}

export default AuthLogin