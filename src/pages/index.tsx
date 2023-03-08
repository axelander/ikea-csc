import useSWR from 'swr'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { GetSupportAgentsResponse } from './api/support-agents'

const inter = Inter({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Home() {
  const {data, error, isLoading} = useSWR<GetSupportAgentsResponse>('/api/support-agents', fetcher)

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error || !data) {
    return <h1>Error {error.message}</h1>
  }

  return (
    <div>Support agents {data.supportAgents.length}</div>
  )
}
