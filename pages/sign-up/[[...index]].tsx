// pages/sign-up/[[...index]].tsx
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;
