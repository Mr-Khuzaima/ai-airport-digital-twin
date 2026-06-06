import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically redirect the user to the dashboard when they open http://localhost:3000
  redirect('/dashboard');
}
