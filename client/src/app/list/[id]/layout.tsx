import { ListProvider } from '@/context/ListContext';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListProvider>{children}</ListProvider>;
}