"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading/Heading";
import ListingCard from "../components/Listings/ListingCard";
import { SafeReservation, SafeUser } from "../types";
import { differenceInCalendarDays } from "date-fns";

interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser: SafeUser;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          router.refresh();
        })
        .catch((error) => error?.response?.data?.error)
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <Container>
      {reservations.filter((reservation) => {
        const today = new Date();
        const reservationDate = new Date(reservation.startDate);

        return reservationDate >= today;
      }).length !== 0 && (
        <>
          <Heading title="Upcoming Trips" subtitle="Where you're going" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {reservations
              .filter((reservation) => {
                const today = new Date();
                const reservationDate = new Date(reservation.startDate);

                return reservationDate >= today;
              })
              .sort((reservation) => {
                const today = new Date();
                const reservationDate = new Date(reservation.startDate);

                return -differenceInCalendarDays(reservationDate, today);
              })
              .map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  actionLabel="Cancel reservation"
                  currentUser={currentUser}
                />
              ))}
          </div>
        </>
      )}

      {reservations.filter((reservation) => {
        const today = new Date();
        const reservationDate = new Date(reservation.startDate);

        return reservationDate < today;
      }).length !== 0 && (
        <div className="mt-10">
          <Heading title="Past Trips" subtitle="Where you've been" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {reservations
              .filter((reservation) => {
                const today = new Date();
                const reservationDate = new Date(reservation.startDate);

                return reservationDate < today;
              })
              .map((reservation) => {
                return (
                  <ListingCard
                    key={reservation.id}
                    data={reservation.listing}
                    reservation={reservation}
                    currentUser={currentUser}
                    actionId={reservation.id}
                    actionLabel="Visit listing"
                    onAction={() =>
                      router.push(`/listings/${reservation.listing.id}`)
                    }
                  />
                );
              })}
          </div>
        </div>
      )}
    </Container>
  );
};

export default TripsClient;
