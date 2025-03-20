import MovieList from './MovieList/page'

const API_URL = 'https://yts.mx/api/v2/list_movies.json?sort_by=rating'

const fetchMovies = async () => {
  const res = await fetch(API_URL, { cache: 'no-store' }) // SSR을 위해 `no-store` 설정
  if (!res.ok) {
    throw new Error('Failed to fetch movies')
  }
  return res.json()
}

export default async function Page() {
  const initialData = await fetchMovies()

  return <MovieList initialData={initialData} />
}
