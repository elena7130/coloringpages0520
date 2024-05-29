// components/UserInfo.tsx
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';

const UserInfo = () => {
  const { user } = useUser();
  const [remainingGenerations, setRemainingGenerations] = useState(0);

  useEffect(() => {
    const fetchRemainingGenerations = async () => {
      try {
        const response = await axios.get('/api/get-user-info');
        setRemainingGenerations(response.data.remaining_generations);
      } catch (error) {
        console.error('Error fetching remaining generations:', error);
      }
    };

    fetchRemainingGenerations();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <span>{user.fullName}</span>
      <span>Remaining generations: {remainingGenerations}</span>
      <button
        onClick={() => {
          location.href = '/sign-out';
        }}
        className="bg-pink-500 text-white px-3 py-1 rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default UserInfo;
