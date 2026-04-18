// Standalone layout for test pages — bypasses GlobalAuthGate.
// Only active when NEXT_PUBLIC_ENABLE_TEST_LOGIN=true.
export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
