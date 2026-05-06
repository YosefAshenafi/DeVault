import { useUser } from '@clerk/clerk-expo';

export function useAuthUser() {
  const { user, isLoaded } = useUser();
  return {
    isLoaded,
    userId: user?.id ?? null,
    email:
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      null,
    imageUrl: user?.imageUrl ?? null,
    displayName: user?.fullName ?? user?.username ?? null,
  };
}
