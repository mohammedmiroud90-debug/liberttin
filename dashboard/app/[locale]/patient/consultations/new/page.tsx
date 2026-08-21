import { redirect } from 'next/navigation';

export default async function LegacyNewConsultation({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/patient/consultation/new`);
}
