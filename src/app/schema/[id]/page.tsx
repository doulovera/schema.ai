import PageContent from "./page-content";

export default async function Schema({ params }: { params: { id: string } }) {
  const { id } = params;
  // get from DB
  return (
    <PageContent />
  );
}
