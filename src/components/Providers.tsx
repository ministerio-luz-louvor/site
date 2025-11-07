// Providers.tsx was used previously to wrap ChakraProvider.
// Removed because this Chakra version caused server-side runtime/type errors when used in the layout.
// If you want to re-add a client-side provider later, create a new client component here.

export default function Providers(_: { children?: React.ReactNode }) {
  return <>{_.children}</>;
}
