import Header from './Header';
import { getSession } from '@/lib/auth-utils';

export default async function MainHeader() {
  const session = await getSession();
  return <Header user={session?.user} />;
}
