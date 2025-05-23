'use client'

import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

interface Movie {
  id: number
  url: string
  imdb_code: string
  title: string
  title_english: string
  title_long: string
  slug: string
  year: number
  rating: number
  runtime: number
  genres: string[]
  summary: string
  description_full: string
  synopsis: string
  yt_trailer_code: string
  language: string
  mpa_rating: string
  background_image: string
  background_image_original: string
  small_cover_image: string
  medium_cover_image: string
  large_cover_image: string
  state: string
  torrents: string[]
  date_uploaded: string
  date_uploaded_unix: number
}

interface YTSResponse {
  status: string
  status_message: string
  data: {
    movie_count: number
    limit: number
    page_number: number
    movies: Movie[]
  }
}

interface SwrResponse {
  data: YTSResponse
  error: string | undefined
  isLoading: boolean
}

export default function Movie() {
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    return res.json()
  }

  const {
    data,
    error,
    isLoading: loading,
  }: SwrResponse = useSWR(
    `https://yts.mx/api/v2/list_movies.json?sort_by=rating`,
    fetcher
  )
  const movies = data?.data.movies

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link href={`/movie-csr-swr/${movie.id}`}>
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
