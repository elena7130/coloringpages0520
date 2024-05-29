// pages/generate.tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import GenerateImagePage from '../components/GenerateImagePage'; // 请确保这个路径正确

const GeneratePage = () => (
  <>
    <SignedIn>
      <GenerateImagePage />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default GeneratePage;
