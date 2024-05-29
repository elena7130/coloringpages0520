// pages/sign-in/[[...index]].tsx
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/generate" />
    </div>
  );
};

export default SignInPage;
