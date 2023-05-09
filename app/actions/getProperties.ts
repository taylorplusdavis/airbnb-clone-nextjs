import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getProperties() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const properties = await prisma.listing.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    const safeProperties = properties.map((property) => ({
      ...property,
      createdAt: property.createdAt.toISOString(),
    }));

    return safeProperties;
  } catch (e: any) {
    throw new Error(e);
  }
}
