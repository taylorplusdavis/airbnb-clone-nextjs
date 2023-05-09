"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading/Heading";
import ListingCard from "../components/Listings/ListingCard";
import { SafeListing, SafeUser } from "../types";

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Property removed");
          router.refresh();
        })
        .then(() => setDeletingId(""))
        .catch(() => toast.error("Something went wrong"));
    },
    [router]
  );
  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="Properties you're currently hosting"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
            actionId={listing.id}
            actionLabel="Remove property"
            onAction={onCancel}
            disabled={deletingId === listing.id}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
