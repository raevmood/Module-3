'use client';

import { useState, useEffect, FormEvent } from 'react';

interface ProfileLink {
  title: string;
  url: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  links: ProfileLink[];
}

export default function LinktreeClonePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const handleAddLink = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl }),
    });
    const result = await response.json();

    if (profile && response.ok) {
      setProfile({ ...profile, links: result.links });
      setNewLinkTitle('');
      setNewLinkUrl('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Error loading profile.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <main className="w-full max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md mb-8">
          <img src={profile.avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full mb-4" />
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600 mt-2">{profile.bio}</p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-4 mb-8">
          {profile.links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-md text-center font-semibold text-lg hover:bg-gray-50 transition-colors">
              {link.title}
            </a>
          ))}
        </div>

        {/* Add Link Form Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Add a New Link</h2>
          <form onSubmit={handleAddLink} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Link Title"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              className="p-2 border rounded" required
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="p-2 border rounded" required
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600">
              Add Link
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}