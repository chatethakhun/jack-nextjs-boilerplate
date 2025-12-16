import { ContactForm } from '@/components/forms/contact-form';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-dvh bg-zinc-50 font-sans dark:bg-black">
      <ThemeToggle />
    </div>
  );
}
