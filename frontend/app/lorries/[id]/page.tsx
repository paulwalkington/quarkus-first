import VehicleDetailPage from '@/components/VehicleDetailPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LorryDetailPage({ params }: Props) {
  const { id } = await params;
  return <VehicleDetailPage type="lorries" id={id} />;
}