'use client'

import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  genres: string[]
  large_cover_image: string
}

interface YTSResponse {
  data: {
    movies: Movie[]
  }
}

const API_URL = 'https://yts.mx/api/v2/list_movies.json?sort_by=rating'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch movies')
  }
  return res.json()
}

export default function MovieList({
  initialData,
}: {
  initialData: YTSResponse
}) {
  const { data, error } = useSWR<YTSResponse>(API_URL, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true,
  })

  const movies = data?.data.movies

  if (error) return <div>Error: {error.message}</div>
  if (!movies) return <div>Loading...</div>

  return (
    <div>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link href={`/movie-ssr-swr/${movie.id}`}>
              <Image
                src={movie.large_cover_image}
                alt={movie.title}
                width={200}
                height={300}
                className="hover:opacity-80"
              />
              <h2 className="hover:opacity-80">{movie.title}</h2>
            </Link>
            <p>Rating: {movie.rating}</p>
            <p>Year: {movie.year}</p>
            <p>Genres: {movie.genres.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
