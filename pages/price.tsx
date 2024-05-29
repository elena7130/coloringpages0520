import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingCard from '../components/PricingCard';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const PricePage = () => {
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  const [loadingOneTime, setLoadingOneTime] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePurchase = async (plan: 'subscribe' | 'one-time') => {
    if (plan === 'subscribe') {
      setLoadingSubscribe(true);
    } else if (plan === 'one-time') {
      setLoadingOneTime(true);
    }
    setError('');

    try {
      const response = await axios.get('/api/get-user-info');
      if (response.status === 200) {
        // User is logged in, proceed to purchase.
        const purchaseResponse = await axios.post('/api/purchase', { plan });
        window.location.href = purchaseResponse.data.url;
      } else {
        router.push('/sign-in');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // User is not authenticated or session has expired, redirect to the sign-in page.
        router.push('/sign-in');
      } else {
        setError(`Purchase failed: ${error.response?.data?.message || 'Please try again.'}`);
      }
    } finally {
      if (plan === 'subscribe') {
        setLoadingSubscribe(false);
      } else if (plan === 'one-time') {
        setLoadingOneTime(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-bold my-6 text-pink-400">AI Coloring Pages Pricing</h1>
        <p className="text-center mb-8">Choose a plan to buy credits, unleash your creativity with AI Coloring Pages.</p>
        <div className="flex justify-center space-x-8">
          <PricingCard
            title="Subscribe"
            price="9.9/m"
            features={["100 credits for image generation", "Valid for 1 month", "High quality image", "Fast generation speed", "Unlimited number of downloads"]}
            onPurchase={() => handlePurchase('subscribe')}
            loading={loadingSubscribe}
          />
          <PricingCard
            title="One-time Payment"
            price="12.9"
            features={["80 credits for image generation", "Valid for 1 month", "Standard quality image", "Normal generation speed", "Limited number of downloads"]}
            onPurchase={() => handlePurchase('one-time')}
            loading={loadingOneTime}
          />
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </main>
      <Footer />
    </div>
  );
};

export default PricePage;
