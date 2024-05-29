// components/GenerateImagePage.tsx
import Header from './Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image'; // 引入 Image 组件
import { useUser } from '@clerk/nextjs'; // 引入 Clerk 的 useUser

// 定义图片数据的接口
interface ImageData {
  id: string;
  url: string;
  description: string;
  created_at: string;
}

const GenerateImagePage = () => {
  const { user } = useUser(); // 获取用户信息
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState({ timestamp: '', prompt: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [remainingGenerations, setRemainingGenerations] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/get-images');
        const data: ImageData[] = response.data;

        const validData = Array.isArray(data) && data.every(image =>
          image.url && image.description && image.created_at
        );

        if (!validData) {
          throw new Error('Invalid data format');
        }

        setImages(data);
      } catch (error) {
        console.error('Error fetching generated images:', error);
        setImages([]);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/get-user-info');
        setRemainingGenerations(response.data.remaining_generations);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (remainingGenerations <= 0) {
      setError('You have no remaining generations. Please recharge.');
      return;
    }
    setLoading(true);
    setError('');
    const timestamp = new Date().toLocaleString();

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, negativePrompt: '' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.url);
      setImageData({ timestamp, prompt });

      const updatedResponse = await axios.get('/api/get-images');
      const updatedData: ImageData[] = updatedResponse.data;

      const validData = Array.isArray(updatedData) && updatedData.every(image =>
        image.url && image.description && image.created_at
      );

      if (!validData) {
        throw new Error('Invalid data format');
      }

      setImages(updatedData);

      // 更新剩余生成次数
      const userInfoResponse = await axios.get('/api/get-user-info');
      setRemainingGenerations(userInfoResponse.data.remaining_generations);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = () => {
    if (remainingGenerations <= 0) {
      setError('You have no remaining generations. Please recharge.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold my-6">AI Coloring Pages Generator</h1>
        <div className="text-center mb-4">
          <p className="text-lg">Welcome, {user?.fullName}</p>
          <p className="text-lg">Remaining generations: {remainingGenerations}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Coloring pages description"
            className="flex h-10 w-80 rounded-md border border-input bg-background px-3 py-2 
            text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
            file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-pink-400 px-6 py-2 font-semibold text-white disabled:bg-gray-300"
            disabled={loading}
            onClick={handleGenerateClick}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}
        {loading && <div className="text-center"><div className="loader">Loading...</div></div>}
        {imageUrl && (
          <div className="card bg-base-100 shadow-xl mx-auto">
            <figure><Image src={imageUrl} alt="Generated" width={300} height={300} /></figure>
            <div className="card-body">
              <h2 className="card-title text-xl ">{imageData.prompt}</h2>
              <p className="card-time text-lg ">{imageData.timestamp}</p>
              <a href={imageUrl} download className="btn bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
                Download Image
              </a>
            </div>
          </div>
        )}

        <h2 className="text-center text-3xl font-bold my-6">Generated History</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border p-2 rounded">
              <Image src={image.url} alt={image.description} width={100} height={100} className="w-full h-auto" />
              <p>{image.description}</p>
              <p>{new Date(image.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GenerateImagePage;
