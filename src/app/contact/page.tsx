import Contact from '@/pages/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contact - Cesar Nsingi',
	description: 'Cesar Nsingi',
};

export default function ContactPage() {
	return <Contact />;
}

