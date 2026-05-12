import VehicleDetailPage from '@/components/VehicleDetailPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  return <VehicleDetailPage type="cars" id={id} />;
}