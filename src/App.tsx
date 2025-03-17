import { useState } from 'react'
import axios from 'axios'

interface Video {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const YOUTUBE_API_KEY = 'AIzaSyDW6ZkURikVNR3Om3LuxbnQNsg_vXoc_os'

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 5,
          key: YOUTUBE_API_KEY,
          q: searchTerm,
          type: 'video'
        }
      })
      setVideos(response.data.items)
    } catch (err) {
      setError('Failed to fetch videos. Please try again.')
      console.error('Error fetching videos:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          YouTube Video Search
        </h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for videos..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 mb-4 text-center">{error}</div>
        )}

        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                </div>
                <div className="p-4">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-gray-900 hover:text-red-600"
                  >
                    {video.snippet.title}
                  </a>
                  <p className="mt-2 text-gray-600">
                    {video.snippet.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App 