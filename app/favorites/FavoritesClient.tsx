"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading/Heading";
import ListingCard from "../components/Listings/ListingCard";
import { SafeListing, SafeUser } from "../types";

interface FavoritesClientProps {
  favorites: SafeListing[];
  currentUser: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  favorites,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/favorites/${id}`)
        .then(() => {
          toast.success("Removed from favorites");
          router.refresh();
        })
        .then(() => setDeletingId(""))
        .catch(() => toast.error("Something went wrong"));
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Favorites" subtitle="Currently favorited trips" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favorites.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
            actionId={listing.id}
            actionLabel="Remove from favorites"
            onAction={onCancel}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
