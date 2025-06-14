"use client"

import { useEffect, useState } from "react"

import Loader from "@/components/custom ui/Loader"
import CollectionForm from "@/components/collections/CollectionForm"

const CollectionDetails = ({ params }: { params: { collectionId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true  // Prevent state update after unmount

    const getCollectionDetails = async () => {
      try { 
        const res = await fetch(`/api/collections/${params.collectionId}`)

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

        const data = await res.json()
        if (isMounted) {
          setCollectionDetails(data)
          setLoading(false)
        }
      } catch (err) {
        console.error("[collectionId_GET]", err)
        if (isMounted) {
          setError("Failed to load collection details.")
          setLoading(false)
        }
      }
    }

    getCollectionDetails()

    return () => {
      isMounted = false
    }
  }, [params.collectionId]) // Dependency added for better reactivity

  if (loading) return <Loader />
  if (error) return <p className="text-red-500">{error}</p>

  return <CollectionForm initialData={collectionDetails} />
}

export default CollectionDetails
